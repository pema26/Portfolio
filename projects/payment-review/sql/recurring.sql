-- Match the same description and transaction type, ignoring case and extra spaces.
WITH debits AS (
    SELECT transaction_number, booked_on, kind, description, debit,
           regexp_replace(lower(description), '[[:space:]]+', ' ', 'g') AS merchant_key
    FROM transactions
    WHERE dataset_id = %s AND booked_on <= %s AND debit > 0
      AND kind IN ('DD', 'D/D', 'SO', 'DEB', 'BP')
      AND lower(category) NOT IN ('savings', 'investment', 'account transfer', 'cash')
), with_history AS (
    SELECT *,
           lag(booked_on) OVER payment_order AS previous_date,
           lag(booked_on, 2) OVER payment_order AS first_date,
           lag(debit) OVER payment_order AS previous_amount,
           lag(debit, 2) OVER payment_order AS first_amount,
           max(booked_on) OVER (PARTITION BY merchant_key, kind) AS last_seen
    FROM debits
    WINDOW payment_order AS (
        PARTITION BY merchant_key, kind
        ORDER BY booked_on, transaction_number DESC
    )
), matched AS (
    SELECT *,
           row_number() OVER (
               PARTITION BY merchant_key, kind
               ORDER BY booked_on DESC, transaction_number
           ) AS newest_match
    FROM with_history
    -- Two consecutive gaps around a month give us three pieces of evidence.
    WHERE booked_on - previous_date BETWEEN 25 AND 35
      AND previous_date - first_date BETWEEN 25 AND 35
      AND date_trunc('month', booked_on) <> date_trunc('month', previous_date)
      AND date_trunc('month', previous_date) <> date_trunc('month', first_date)
)
SELECT matched.*,
       CASE WHEN debit <> previous_amount THEN debit - previous_amount
            ELSE previous_amount - first_amount END AS change,
       CASE WHEN debit <> previous_amount THEN booked_on
            ELSE previous_date END AS change_date,
       coalesce(payment_reviews.status, 'pending') AS status
FROM matched
LEFT JOIN payment_reviews
    ON payment_reviews.dataset_id = %s
    AND payment_reviews.merchant_key = matched.merchant_key
    AND payment_reviews.kind = matched.kind
-- Use the dataset's last date as the reference, even for a historical statement.
WHERE newest_match = 1 AND booked_on >= %s::date - 75
ORDER BY booked_on DESC, description;
