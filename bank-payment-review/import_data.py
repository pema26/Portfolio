import argparse
import csv
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path
from zipfile import BadZipFile

import psycopg
from openpyxl import load_workbook
from openpyxl.utils.exceptions import InvalidFileException

from db import connect, read_sql


COLUMNS = (
    "Transaction Number", "Transaction Date", "Transaction Type",
    "Transaction Description", "Debit Amount", "Credit Amount", "Balance", "Category",
)
MONEYDATA_SHEET = "Anonymized Original with Catego"
PENNY = Decimal("0.01")


def read_date(value, moneydata):
    if moneydata:
        if isinstance(value, (date, datetime)):
            # The publisher's Excel date cells have the day and month reversed.
            # Text cells already use UK order. Never apply this swap to a CSV.
            return date(value.year, value.day, value.month)
        return datetime.strptime(str(value).strip(), "%d/%m/%Y").date()
    return datetime.strptime(str(value).strip(), "%Y-%m-%d").date()


def read_money(value):
    if value is None or str(value).strip() == "":
        return None
    amount = Decimal(str(value).strip())
    if not amount.is_finite() or abs(amount) >= Decimal("1000000000000"):
        raise ValueError("amount is outside the supported range")
    rounded = amount.quantize(PENNY)
    if amount != rounded:
        raise ValueError("amount has more than two decimal places")
    return rounded


def parse_rows(rows, moneydata=False):
    header = next(rows, ())
    if tuple(header[:len(COLUMNS)]) != COLUMNS:
        raise ValueError("The first eight column headers must match data/sample.csv.")

    transactions = {}
    previous_date = None
    for row_number, row in enumerate(rows, start=2):
        if all(value is None or str(value).strip() == "" for value in row):
            continue
        try:
            number, raw_date, kind, description, debit, credit, balance, category = row[:8]
            number = int(str(number))
            if number <= 0 or number > 2_147_483_647 or number in transactions:
                raise ValueError("transaction number must be positive and unique")
            booked_on = read_date(raw_date, moneydata)
            if moneydata and previous_date is not None and booked_on > previous_date:
                raise ValueError("MoneyData dates should be newest first after correction")
            previous_date = booked_on

            description = "" if description is None else str(description).strip()
            if not description:
                raise ValueError("missing transaction description")
            debit = read_money(debit) or Decimal("0.00")
            credit = read_money(credit) or Decimal("0.00")
            if min(debit, credit) < 0 or (debit > 0) == (credit > 0):
                raise ValueError("enter one positive debit or credit amount")
            kind = str(kind or "").strip().upper() or "UNKNOWN"
            category = str(category or "").strip() or "Uncategorised"
            transactions[number] = (
                booked_on, kind, description, debit, credit, read_money(balance), category,
            )
        except (ValueError, InvalidOperation) as error:
            raise ValueError(f"Row {row_number}: {error}") from error

    if not transactions:
        raise ValueError("No transactions found.")
    return transactions


def load_transactions(path):
    if path.suffix.lower() == ".csv":
        with path.open(encoding="utf-8-sig", newline="") as file:
            return parse_rows(csv.reader(file))
    if path.suffix.lower() == ".xlsx":
        workbook = load_workbook(path, read_only=True, data_only=True)
        try:
            if MONEYDATA_SHEET not in workbook.sheetnames:
                raise ValueError("Excel import expects the original MoneyData worksheet. Use CSV for other sources.")
            return parse_rows(iter(workbook[MONEYDATA_SHEET].values), moneydata=True)
        finally:
            workbook.close()
    raise ValueError("Choose an .xlsx MoneyData workbook or a .csv file.")


def import_transactions(name, transactions):
    with connect() as connection:
        connection.execute(
            "INSERT INTO datasets (name) VALUES (%s) ON CONFLICT (name) DO NOTHING", (name,)
        )
        # Serialize imports for this dataset so two simultaneous imports can't race.
        dataset = connection.execute(
            "SELECT id FROM datasets WHERE name = %s FOR UPDATE", (name,)
        ).fetchone()
        dataset_id = dataset["id"]

        existing_rows = connection.execute("""
            SELECT transaction_number, booked_on, kind, description, debit, credit, balance, category
            FROM transactions WHERE dataset_id = %s
        """, (dataset_id,)).fetchall()
        existing = {}
        for row in existing_rows:
            number = row.pop("transaction_number")
            existing[number] = tuple(row.values())

        new_rows = []
        for number, values in transactions.items():
            if number in existing:
                if existing[number] != values:
                    raise ValueError(f"Transaction {number} already exists with different values.")
            else:
                new_rows.append((dataset_id, number, *values))

        if new_rows:
            with connection.cursor() as cursor:
                cursor.executemany("""
                    INSERT INTO transactions (
                        dataset_id, transaction_number, booked_on, kind, description,
                        debit, credit, balance, category
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, new_rows)
        # The connection commits here. An exception above rolls back the import.
    return len(new_rows)


def main():
    parser = argparse.ArgumentParser(description="Import bank transactions into PostgreSQL.")
    parser.add_argument("file", type=Path)
    parser.add_argument("--dataset", required=True, help="Name of the account or demo dataset")
    args = parser.parse_args()

    try:
        name = args.dataset.strip()
        if not 1 <= len(name) <= 80:
            raise ValueError("Dataset name must be between 1 and 80 characters.")
        transactions = load_transactions(args.file)
        with connect() as connection:
            connection.execute(read_sql("schema.sql"))
        inserted = import_transactions(name, transactions)
    except (OSError, ValueError, csv.Error, BadZipFile, InvalidFileException, psycopg.Error) as error:
        parser.exit(1, f"Import failed: {error}\n")

    print(f"{name}: {inserted:,} added, {len(transactions) - inserted:,} already present.")


if __name__ == "__main__":
    main()
