import os
import unittest
from datetime import date
from decimal import Decimal
from pathlib import Path
from uuid import uuid4

import psycopg
from psycopg import sql
from psycopg.conninfo import make_conninfo

from app import RECURRING_SQL, app
from db import connect, read_sql
from import_data import import_transactions, load_transactions, parse_rows


DATA = Path(__file__).resolve().parents[1] / "data"


class ProjectTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        url = os.environ["DATABASE_URL"]
        schema = "payment_review_test_" + uuid4().hex[:12]
        with psycopg.connect(url) as connection:
            connection.execute(sql.SQL("CREATE SCHEMA {}").format(sql.Identifier(schema)))
        cls.addClassCleanup(cls.remove_schema, url, schema)
        os.environ["DATABASE_URL"] = make_conninfo(url, options=f"-csearch_path={schema}")
        cls.addClassCleanup(os.environ.__setitem__, "DATABASE_URL", url)

        with connect() as connection:
            connection.execute(read_sql("schema.sql"))
        cls.demo = load_transactions(DATA / "sample.csv")
        cls.real = load_transactions(DATA / "laramee26openBankTransactionData.xlsx")

    @staticmethod
    def remove_schema(url, schema):
        with psycopg.connect(url) as connection:
            connection.execute(sql.SQL("DROP SCHEMA {} CASCADE").format(sql.Identifier(schema)))

    def test_workbook_import_matches_source(self):
        self.assertEqual(self.real[44][0], date(2022, 7, 12))
        self.assertEqual(self.real[6456][0], date(2015, 9, 1))
        self.assertEqual(import_transactions("MoneyData", self.real), 6567)
        self.assertEqual(import_transactions("MoneyData", self.real), 0)
        with connect() as connection:
            row = connection.execute("""
                SELECT count(*) AS rows, min(booked_on) AS first, max(booked_on) AS last,
                       sum(debit) AS debits, sum(credit) AS credits, dataset_id
                FROM transactions JOIN datasets ON datasets.id = transactions.dataset_id
                WHERE name = 'MoneyData' GROUP BY dataset_id
            """).fetchone()
            self.assertEqual(row["rows"], 6567)
            self.assertEqual(row["first"], date(2015, 7, 27))
            self.assertEqual(row["last"], date(2022, 7, 25))
            self.assertEqual(row["debits"], Decimal("511178.92"))
            self.assertEqual(row["credits"], Decimal("503203.29"))
            day = row["last"]
            dataset_id = row["dataset_id"]
            candidates = connection.execute(
                RECURRING_SQL, (dataset_id, day, dataset_id, day)
            ).fetchall()
        virgin = next(row for row in candidates if row["description"] == "VIRGIN MEDIA PYMTS")
        self.assertEqual(virgin["change"], Decimal("30.75"))
        self.assertEqual(virgin["change_date"], date(2022, 6, 17))

    def test_bad_csv_row_reports_line_number(self):
        with (DATA / "sample.csv").open() as file:
            header = file.readline().strip().split(",")
        row = ["1", "2024-01-01", "DD", "Example", "8.99", "1.50", "", "Bills"]
        with self.assertRaisesRegex(ValueError, "Row 2: enter one positive"):
            parse_rows(iter([header, row]))

    def test_conflicting_import_does_not_add_other_rows(self):
        import_transactions("Conflict test", self.demo)
        changed = list(self.demo[1])
        changed[2] = "Different description"
        with self.assertRaisesRegex(ValueError, "Transaction 1 already exists"):
            import_transactions("Conflict test", {8: self.demo[1], 1: tuple(changed)})
        with connect() as connection:
            result = connection.execute("""
                SELECT count(*) AS rows
                FROM transactions JOIN datasets ON datasets.id = transactions.dataset_id
                WHERE name = 'Conflict test'
            """).fetchone()
        self.assertEqual(result["rows"], 7)

    def test_dashboard_and_review_round_trip(self):
        import_transactions("Review A", self.demo)
        import_transactions("Review B", self.demo)
        with connect() as connection:
            datasets = connection.execute(
                "SELECT id FROM datasets WHERE name IN ('Review A', 'Review B') ORDER BY name"
            ).fetchall()
        first, second = [dataset["id"] for dataset in datasets]
        with app.test_client() as client:
            response = client.get(f"/?dataset={first}&year=2024")
            self.assertEqual(response.status_code, 200)
            self.assertIn("£155.97", response.text)
            self.assertIn("£12.50", response.text)
            self.assertIn("-£143.47", response.text)
            self.assertIn("Up £4.00 on 31 Mar", response.text)

            form = {"dataset": first, "year": 2024, "transaction_number": 7, "status": "confirmed"}
            self.assertEqual(client.post("/review", data=form).status_code, 400)
            with client.session_transaction() as browser_session:
                form["review_token"] = browser_session["review_token"]

            confirmed = client.post("/review", data=form, follow_redirects=True)
            self.assertEqual(confirmed.status_code, 200)
            self.assertIn(">Confirmed</span>", confirmed.text)
            self.assertIn(">Pending</span>", client.get(f"/?dataset={second}").text)

            form["status"] = "dismissed"
            dismissed = client.post("/review", data=form, follow_redirects=True)
            self.assertIn(">Dismissed</span>", dismissed.text)
            form["status"] = "pending"
            reset = client.post("/review", data=form, follow_redirects=True)
            self.assertIn(">Pending</span>", reset.text)


if __name__ == "__main__":
    unittest.main()
