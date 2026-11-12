CREATE TABLE IF NOT EXISTS datasets (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE CHECK (length(btrim(name)) BETWEEN 1 AND 80)
);

CREATE TABLE IF NOT EXISTS transactions (
    dataset_id integer NOT NULL REFERENCES datasets(id),
    transaction_number integer NOT NULL CHECK (transaction_number > 0),
    booked_on date NOT NULL,
    kind text NOT NULL,
    description text NOT NULL CHECK (btrim(description) <> ''),
    debit numeric(14, 2) NOT NULL CHECK (debit >= 0),
    credit numeric(14, 2) NOT NULL CHECK (credit >= 0),
    balance numeric(14, 2),
    category text NOT NULL,
    PRIMARY KEY (dataset_id, transaction_number),
    CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0))
);

CREATE INDEX IF NOT EXISTS transactions_by_date
    ON transactions (dataset_id, booked_on);

CREATE TABLE IF NOT EXISTS payment_reviews (
    dataset_id integer NOT NULL REFERENCES datasets(id),
    merchant_key text NOT NULL,
    kind text NOT NULL,
    status text NOT NULL CHECK (status IN ('confirmed', 'dismissed')),
    PRIMARY KEY (dataset_id, merchant_key, kind)
);
