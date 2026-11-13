# Payment Review

A local dashboard for reviewing account cash flow, recurring payments and changes in payment amounts. Import the bundled MoneyData workbook or a CSV, then choose a dataset and year in the browser. Each suggestion shows the three payments behind it and can be confirmed, dismissed or reset.

## Run locally

You need Python 3.10+ and a running PostgreSQL server. The steps below use PowerShell on Windows. Start PostgreSQL through Windows Services if you installed it on Windows. If you use Ubuntu/WSL with a local Debian-style install, start it with `sudo service postgresql start`.

### 1. Create a database

Open PostgreSQL's **SQL Shell (psql)** and connect as your PostgreSQL administrator. For a new local database, run these commands and choose your own password. If you already have an empty database you can write to, use its connection details instead.

```sql
CREATE ROLE payment_app LOGIN PASSWORD 'replace_this_password';
CREATE DATABASE payment_review OWNER payment_app;
```

### 2. Install dependencies and import the data

Run these commands in the folder containing `app.py` and `requirements.txt`:
the root of this standalone repository, or `projects/payment-review/` in the
portfolio repository.

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
$env:DATABASE_URL = "postgresql://payment_app:replace_this_password@localhost:5432/payment_review"
.\.venv\Scripts\python.exe import_data.py data/laramee26openBankTransactionData.xlsx --dataset MoneyData
.\.venv\Scripts\python.exe import_data.py data/sample.csv --dataset Demo
.\.venv\Scripts\python.exe app.py
```

On Ubuntu/WSL:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export DATABASE_URL="postgresql://payment_app:replace_this_password@localhost:5432/payment_review"
python import_data.py data/laramee26openBankTransactionData.xlsx --dataset MoneyData
python import_data.py data/sample.csv --dataset Demo
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000). Choose **MoneyData** for the real workbook or **Demo** for the synthetic example. The importer creates the tables on its first run. Set `DATABASE_URL` again when you open a new terminal. URL-encode special characters in your database password if you use a connection URL.

### 3. Import another statement

Copy the header and format from `data/sample.csv`. Use UTF-8, dates in `YYYY-MM-DD` format, and GBP amounts without currency symbols. Each row needs a positive transaction number that stays stable across exports of the same account, a description, and exactly one positive debit or credit. Balance, type and category values can be empty. Types used by the recurring rule are `DD` or `D/D` for direct debit, `SO` for standing order, `DEB` for debit card and `BP` for bill payment.

```bash
python import_data.py my_statement.csv --dataset "Current account"
```

Use one dataset name per account or statement history. Reimporting identical rows skips them. An invalid row or a changed row with an existing transaction number stops the import and gives an error. Two legitimate payments with the same amount and date can both be stored under different transaction numbers.

## How the code works

| File | What to read it for |
|---|---|
| `import_data.py` | Parsing dates and money, checking input and importing a batch in one database transaction |
| `sql/schema.sql` | Primary keys, foreign keys and constraints on transaction amounts |
| `sql/recurring.sql` | `LAG()` to look back at earlier payments, and a join to retrieve the user's review |
| `app.py` | Flask routes, queries with parameters, and saving a review |
| `templates/dashboard.html` | Rendering a simple interface with HTML forms and Jinja |
| `tests/test_project.py` | Testing the importer, queries and review workflow against PostgreSQL |

Amounts use Python `Decimal` and PostgreSQL `numeric` so balances and totals use exact pennies. Monthly totals show gross credits and debits. This keeps the figures comparable to the source and avoids guessing which refunds or transfers should count as spending.

The recurring query groups eligible outgoing payments by description and transaction type after standardising case and spacing. The same group needs three consecutive payments in different months, with both gaps between 25 and 35 days. The latest matching sequence must end within 75 days of the selected year's last recorded transaction. That reference date lets the rule run on historical statements. The view shows the most recent amount change across those three payments. Reviews apply to the payment group across years in the same dataset.

Matching descriptions can group separate purchases. Changes in descriptions, longer gaps and intervening payments can also hide recurring bills. An amount change can have several causes, including usage or a one-off charge. Use the suggestions as candidates for review.

## Validation on the real workbook

The imported workbook contains **6,567 transactions** from **27 July 2015 to 25 July 2022**. Text date cells use day/month/year. In this release, Excel date cells need their day and month swapped. For example, transaction 44's cell is read as 7 December 2022 by the Excel reader. Interpreting it as 12 July 2022 puts it between its neighbouring entries. After the same correction for all Excel date cells, there are zero reversals in the workbook's newest-first order. The importer checks that order and applies this correction only to the original MoneyData sheet. It reads CSV dates separately.

| Check | Result |
|---|---|
| PostgreSQL count after first import | 6,567 |
| Rows added on identical reimport | 0 |
| Debit total, matched to source | £511,178.92 |
| Credit total, matched to source | £503,203.29 |
| End-of-workbook recurring suggestions | 8, as of 25 July 2022 |

In the end-of-workbook results, Audible had three payments of £7.99 between 24 May and 25 July. Virgin Media had payments of £25.50, £56.25 and £56.25 between 17 May and 18 July. The second example verifies that the dashboard can show a £30.75 increase even when the next payment stays at the higher amount. These are checks against one customer's recorded history. There are no verified subscription labels here to calculate detection accuracy.

To repeat the automated checks with PostgreSQL running and `DATABASE_URL` set, use the same Python interpreter you used for the app:

```bash
python -m unittest discover -s tests -v
```

The tests create a temporary schema, so the database role needs permission to create schemas. They check the real import and reimport, date correction and source totals. The synthetic tests cover an invalid row, a conflicting transaction number, a refund, repeated legitimate purchases, a transfer, a payment increase and saving reviews without leaking them across datasets.

## Data attribution

Robert Laramee (2026), *Bank Transactions Dataset*, Mendeley Data, V1, [doi:10.17632/dnxtg6n4rv.1](https://doi.org/10.17632/dnxtg6n4rv.1). The original anonymised workbook is included under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The importer standardises dates, amount fields and missing labels in PostgreSQL.

Elif E. Firat, Dharmateja Vytla, Navya Vasudeva Singh, Zhuoqun Jiang and Robert S. Laramee (2023), *MoneyVis: Open Bank Transaction Data for Visualization and Beyond*, EuroVis Short Papers, [doi:10.2312/evs.20231052](https://doi.org/10.2312/evs.20231052). The small demo CSV is synthetic.
