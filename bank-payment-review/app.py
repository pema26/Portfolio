import secrets

import psycopg
from flask import Flask, abort, redirect, render_template, request, session, url_for

from db import connect, read_sql


app = Flask(__name__)
app.secret_key = secrets.token_hex(32)
RECURRING_SQL = read_sql("recurring.sql")


@app.template_filter("gbp")
def format_money(amount):
    if amount < 0:
        return f"-£{-amount:,.2f}"
    return f"£{amount:,.2f}"


@app.get("/")
def dashboard():
    with connect() as connection:
        datasets = connection.execute(
            "SELECT id, name FROM datasets ORDER BY name"
        ).fetchall()
        if not datasets:
            return render_template("dashboard.html", datasets=[])

        dataset_id = request.args.get("dataset", datasets[0]["id"], type=int)
        if not any(dataset["id"] == dataset_id for dataset in datasets):
            abort(404)

        years = connection.execute("""
            SELECT DISTINCT extract(year FROM booked_on)::int AS year
            FROM transactions WHERE dataset_id = %s ORDER BY year DESC
        """, (dataset_id,)).fetchall()
        years = [row["year"] for row in years]
        year = request.args.get("year", years[0], type=int)
        if year not in years:
            year = years[0]

        # The upper bound is exclusive, so the date index can be used directly.
        start = f"{year}-01-01"
        end = f"{year + 1}-01-01"
        period = (dataset_id, start, end)

        months = connection.execute("""
            SELECT date_trunc('month', booked_on)::date AS month,
                   count(*) AS count, sum(debit) AS outgoing, sum(credit) AS incoming,
                   max(booked_on) AS last_date
            FROM transactions
            WHERE dataset_id = %s AND booked_on >= %s AND booked_on < %s
            GROUP BY month ORDER BY month
        """, period).fetchall()
        categories = connection.execute("""
            SELECT category, sum(debit) AS outgoing
            FROM transactions
            WHERE dataset_id = %s AND booked_on >= %s AND booked_on < %s AND debit > 0
            GROUP BY category ORDER BY outgoing DESC, category
        """, period).fetchall()
        as_of = months[-1]["last_date"]
        candidates = connection.execute(
            RECURRING_SQL, (dataset_id, as_of, dataset_id, as_of)
        ).fetchall()

    outgoing = sum(row["outgoing"] for row in months)
    incoming = sum(row["incoming"] for row in months)
    peak = max(outgoing_row["outgoing"] for outgoing_row in months)
    for month in months:
        month["bar_width"] = round(month["outgoing"] / peak * 100, 1) if peak else 0

    if "review_token" not in session:
        session["review_token"] = secrets.token_urlsafe(24)
    return render_template(
        "dashboard.html", datasets=datasets, dataset_id=dataset_id, year=year, years=years,
        months=months, categories=categories, candidates=candidates, as_of=as_of,
        outgoing=outgoing, incoming=incoming, count=sum(row["count"] for row in months),
        review_token=session["review_token"],
    )


@app.post("/review")
def review_payment():
    if not secrets.compare_digest(
        request.form.get("review_token", "").encode(), session.get("review_token", "").encode()
    ) or "review_token" not in session:
        abort(400)

    dataset_id = request.form.get("dataset", type=int)
    year = request.form.get("year", type=int)
    transaction_number = request.form.get("transaction_number", type=int)
    status = request.form.get("status")
    if not dataset_id or not year or not transaction_number or status not in (
        "confirmed", "dismissed", "pending",
    ):
        abort(400)

    with connect() as connection:
        row = connection.execute("""
            SELECT max(booked_on) AS last_date
            FROM transactions
            WHERE dataset_id = %s AND extract(year FROM booked_on) = %s
        """, (dataset_id, year)).fetchone()
        as_of = row["last_date"]
        if not as_of:
            abort(404)

        candidates = connection.execute(
            RECURRING_SQL, (dataset_id, as_of, dataset_id, as_of)
        ).fetchall()
        candidate = next(
            (row for row in candidates if row["transaction_number"] == transaction_number), None
        )
        if candidate is None:
            abort(404)
        key = (dataset_id, candidate["merchant_key"], candidate["kind"])
        if status == "pending":
            connection.execute("""
                DELETE FROM payment_reviews WHERE dataset_id = %s AND merchant_key = %s AND kind = %s
            """, key)
        else:
            connection.execute("""
                INSERT INTO payment_reviews (dataset_id, merchant_key, kind, status)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (dataset_id, merchant_key, kind)
                DO UPDATE SET status = EXCLUDED.status
            """, (*key, status))

    return redirect(url_for("dashboard", dataset=dataset_id, year=year, _anchor="recurring"), code=303)


@app.errorhandler(psycopg.Error)
@app.errorhandler(ValueError)
def database_error(error):
    app.logger.error("Dashboard could not load the database: %s", error)
    return render_template(
        "dashboard.html", datasets=[],
        error="Check DATABASE_URL, start PostgreSQL and run the importer. See README.md.",
    ), 503


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
