// ============================================================================
//  An AMBITIOUS project — Payment Review (the banking transactions dashboard).
//
//  The project itself is a Python + PostgreSQL app that lives in the
//  projects/payment-review/ folder in this repository. It needs a
//  database server, so it cannot run inside this website; this page explains
//  it and shows the real code.
//
//  The two SQL files are imported with "?raw" on the end. That tells Vite to
//  hand us the file's contents as plain text, so the code shown on the page is
//  always exactly the code in projects/payment-review/sql/. The Python excerpt is
//  copied into a template literal, like the other project pages.
// ============================================================================

import CodeBlock from '../../components/ui/CodeBlock';
import recurringSql from '../../../projects/payment-review/sql/recurring.sql?raw';
import schemaSql from '../../../projects/payment-review/sql/schema.sql?raw';

export const meta = {
  id: 'payment-review', // becomes the URL: /projects/payment-review
  title: 'Payment review: finding recurring payments in bank transactions',
  description:
    'A Flask and PostgreSQL dashboard that imports seven years of bank transactions, summarises cash flow by month and category, and uses SQL window functions to suggest recurring payments and flag when their amount changes.',
  category: 'big-unique', // big-unique | guided | mini-unique
  status: 'complete', // planned | in-progress | complete
  date: '2026-11-12', // YYYY-MM-DD — EDIT HERE: set to when you finished it
  tags: ['Python', 'Flask', 'PostgreSQL', 'SQL window functions', 'unittest'],
  githubUrl: 'https://github.com/pema26/Payment-review-finding-recurring-payments-in-bank-transactions',
  devlog: [],
  featured: true, // show on the home page?
};

// From projects/payment-review/import_data.py
const readMoneyCode = `PENNY = Decimal("0.01")


def read_money(value):
    if value is None or str(value).strip() == "":
        return None
    amount = Decimal(str(value).strip())
    if not amount.is_finite() or abs(amount) >= Decimal("1000000000000"):
        raise ValueError("amount is outside the supported range")
    rounded = amount.quantize(PENNY)
    if amount != rounded:
        raise ValueError("amount has more than two decimal places")
    return rounded`;

export default function PaymentReview() {
  return (
    <>
      <h2>The problem</h2>
      <p>
        A bank statement is a long list, and the payments that matter most are easy to miss in
        it: the subscriptions and bills that leave every month, and the ones that quietly go
        up. I wanted a tool that reads a statement, shows where the money went, and
        points out the regular payments and any change in their amount, with the evidence
        next to each suggestion so a person can check it.
      </p>

      <h2>What it does</h2>
      <ul>
        <li>
          <strong>Imports</strong> an Excel workbook or a CSV file into PostgreSQL. Every row is
          checked first, and the whole file goes in as one database transaction: if one row is
          wrong, nothing is added.
        </li>
        <li>
          <strong>Summarises cash flow</strong> for a chosen year: money in, money out, net, and
          totals by month and by category.
        </li>
        <li>
          <strong>Suggests recurring payments</strong> with one SQL query, and shows the three
          payments behind each suggestion.
        </li>
        <li>
          <strong>Records a review.</strong> Each suggestion can be confirmed, dismissed or reset,
          and that decision is saved in the database.
        </li>
      </ul>

      <img
        src="/projects_images/payment-review-cash-flow.png"
        alt="The dashboard's cash flow section for 2022: money in, money out, net cash flow and transaction count, with monthly totals and money out by category."
        width="1600"
        height="1067"
        loading="lazy"
        className="my-6 w-full max-w-4xl rounded-lg border border-slate-200 dark:border-slate-800"
      />

      <h2>How it is built</h2>
      <ul>
        <li><code>import_data.py</code> reads and checks the file, then inserts the new rows.</li>
        <li><code>sql/schema.sql</code> defines the three tables and their rules.</li>
        <li><code>sql/recurring.sql</code> is the query that finds recurring payments.</li>
        <li><code>app.py</code> is the Flask app: one route shows the dashboard, one saves a review.</li>
        <li><code>templates/dashboard.html</code> is the page, written with HTML forms and Jinja.</li>
        <li><code>tests/test_project.py</code> tests the importer, the queries and the review workflow against a real PostgreSQL database.</li>
      </ul>

      <h2>The recurring-payment rule</h2>
      <p>
        A payment is suggested as recurring when the same description and transaction type
        appear <strong>three times in a row, in three different months, with both gaps between 25
        and 35 days</strong>. The latest of the three must be within 75 days of the last
        transaction in the selected year, so the rule also works on old statements.
      </p>
      <p>
        The query does this in three steps. First it keeps only outgoing payments of the right
        types and tidies the description (lower case, single spaces) so
        that <code>Music Plan</code> and <code>MUSIC  PLAN</code> count as the same
        merchant. Then <code>LAG()</code>, a window function, puts the previous two payment dates
        and amounts on the same row as each payment, so the gaps can be compared without a
        loop. Finally it keeps the newest matching sequence per merchant and joins on the saved
        review status.
      </p>
      <CodeBlock language="sql" code={recurringSql} />

      <img
        src="/projects_images/payment-review-recurring.png"
        alt="The dashboard's recurring payments section showing eight suggestions, with one expanded to show its three payments and the confirm and dismiss buttons."
        width="1600"
        height="1091"
        loading="lazy"
        className="my-6 w-full max-w-4xl rounded-lg border border-slate-200 dark:border-slate-800"
      />

      <h2>Keeping the data correct</h2>
      <p>
        Money is never stored as a floating-point number, because values such as 0.1 cannot be
        held exactly and totals drift by pennies. Amounts are read as
        Python <code>Decimal</code> and stored as PostgreSQL <code>numeric</code>. An amount
        with more than two decimal places is rejected instead of being rounded silently.
      </p>
      <CodeBlock language="python" code={readMoneyCode} />
      <p>
        The database enforces the same rules, so bad data cannot get in by another route. Each
        transaction must have exactly one positive debit or credit, the primary key stops the
        same transaction number being stored twice in a dataset, and a review must belong to a
        dataset that exists.
      </p>
      <CodeBlock language="sql" code={schemaSql} />

      <h2>Checked against real data</h2>
      <p>
        I tested it on a published, anonymised bank history: 6,567 transactions from 27 July
        2015 to 25 July 2022.
      </p>
      <ul>
        <li>All 6,567 rows are in PostgreSQL after the first import, and importing the same file again adds 0.</li>
        <li>The debit total (£511,178.92) and credit total (£503,203.29) match the source workbook to the penny.</li>
        <li>At the end of the workbook the rule gives 8 recurring suggestions.</li>
        <li>
          One of them, Virgin Media, went £25.50, £56.25, £56.25. The dashboard reports the
          £30.75 increase even though the latest payment stayed at the higher amount.
        </li>
      </ul>
      <p>
        One problem only showed up in the real file. Some of its date cells had the day and
        month swapped, so a payment from 12 July 2022 was read as 7 December 2022. The workbook
        is ordered newest first, so I used that to check the fix: after swapping the affected
        cells back, no date is out of order. The importer applies the swap only to this
        workbook and never to a CSV.
      </p>
      <p>
        The automated tests run against a temporary PostgreSQL schema. They cover the real
        import and reimport, a bad CSV row (reported with its line number), a conflicting
        transaction number (nothing else from that file is added), and a full round trip of the
        dashboard and a saved review.
      </p>

      <h2>Limits</h2>
      <p>
        The rule matches on description, so separate purchases at the same shop a month apart
        can look recurring, and a bill whose description changes will be missed. A change in
        amount can be a price rise, different usage or a one-off charge. That is why the output
        is a list of suggestions to review, with the three payments shown, and not a verdict.
        The dataset has no verified subscription labels, so I have not claimed a detection
        accuracy.
      </p>

      <h2>Data</h2>
      <p>
        Robert Laramee (2026), <em>Bank Transactions Dataset</em>, Mendeley Data,
        V1, <a href="https://doi.org/10.17632/dnxtg6n4rv.1" target="_blank" rel="noopener noreferrer">doi:10.17632/dnxtg6n4rv.1</a>,
        used under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>.
        Described in Firat et al. (2023), <em>MoneyVis: Open Bank Transaction Data for
        Visualization and Beyond</em>, EuroVis Short Papers.
      </p>
    </>
  );
}
