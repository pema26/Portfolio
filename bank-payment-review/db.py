import os
from pathlib import Path

import psycopg
from psycopg.rows import dict_row


PROJECT_DIR = Path(__file__).resolve().parent


def connect():
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise ValueError("Set DATABASE_URL first. See the setup steps in README.md.")
    return psycopg.connect(url, row_factory=dict_row, connect_timeout=5)


def read_sql(filename):
    return (PROJECT_DIR / "sql" / filename).read_text(encoding="utf-8")
