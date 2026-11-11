// A CODING CHALLENGE entry. Copy this file to add another, then add it to the
// list in src/content/challenges/index.js.

import CodeBlock from '../../components/CodeBlock';

export const meta = {
  id: 'codeforces-niche-internet', // becomes the URL: /problems/codeforces-niche-internet
  title: 'Introduction to the Niche Internet',
  description:
    'Order a list of donations so that exactly k of them are at least the average of everything before. Sort, pick the right opener, climb, then fall. Solved in contest (Round 1132, Div. 2).',
  source: 'Codeforces', // where the problem came from
  codeforcesId: '2284B', // contest number + problem letter; links it to my live profile
  problemUrl: 'https://codeforces.com/contest/2284/problem/B', // optional
  // difficulty: '800', // Codeforces had not rated this problem yet when I wrote this up
  date: '2026-11-06', // YYYY-MM-DD (the day I solved it)
  tags: ['constructive', 'sorting', 'greedy'],
};

// The code samples, kept in template literals (backticks) so their line
// breaks and indentation are preserved exactly.
const mySolutionPython = `testcases = int(input())
for i in range(testcases):
    amount_of_donations, pleasant_donation_amount = map(int, input().split())
    donation_amounts = list(map(int, input().split()))

    sorted_donations = sorted(donation_amounts)

    mid = amount_of_donations - pleasant_donation_amount

    first = sorted_donations[mid]

    high = sorted_donations[mid+1:]
    low = sorted_donations[:mid]

    solution = [first] + high + low[::-1]

    total = 0
    count = 0

    for j, donation in enumerate(solution):
        if j == 0 or donation * j >= total:
            count+= 1

        total += donation

    if count == pleasant_donation_amount:
        print("YES")
        print(*solution)
    else:
        print("NO")`;

const aiSolutionPython = `import sys

def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    pos = 1
    out = []
    for _ in range(t):
        n, k = int(data[pos]), int(data[pos + 1])
        a = sorted(int(v) for v in data[pos + 2: pos + 2 + n])
        pos += 2 + n

        m = n - k                         # how many donations must NOT be pleasant
        # a[m] opens, the k-1 larger ones climb, the m smaller ones fall.
        order = [a[m]] + a[m + 1:] + a[:m][::-1]

        # Count the pleasant donations in that order.
        pleasant = 0
        total = 0
        for j, value in enumerate(order):
            if value * j >= total:        # j == 0 gives 0 >= 0: always pleasant
                pleasant += 1
            total += value

        if pleasant == k:
            out.append("YES")
            out.append(" ".join(map(str, order)))
        else:
            out.append("NO")
    print("\\n".join(out))

main()`;

const aiSolutionCpp = `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    cin >> t;
    while (t--) {
        int n, k;
        cin >> n >> k;
        vector<long long> a(n);
        for (auto& x : a) cin >> x;
        sort(a.begin(), a.end());

        int m = n - k;                     // donations that must NOT be pleasant

        // a[m] opens, the k-1 larger ones climb, the m smaller ones fall.
        vector<long long> order;
        order.reserve(n);                  // one allocation instead of several
        order.push_back(a[m]);
        for (int i = m + 1; i < n; ++i) order.push_back(a[i]);
        for (int i = m - 1; i >= 0; --i) order.push_back(a[i]);

        // long long on purpose: the running total can reach 2 * 10^14.
        long long total = 0;
        int pleasant = 0;
        for (int j = 0; j < n; ++j) {
            if (order[j] * j >= total) ++pleasant;   // j == 0: always pleasant
            total += order[j];
        }

        if (pleasant == k) {
            cout << "YES\\n";
            for (long long v : order) cout << v << ' ';
            cout << '\\n';
        } else {
            cout << "NO\\n";
        }
    }
}`;

export default function CodeforcesNicheInternet() {
  return (
    <>
      <h2>The problem</h2>

      <blockquote>
        <p>
          <strong>2284B — Introduction to the Niche Internet.</strong> A streamer receives <em>n</em> donations
          (some may be negative). A donation is “very pleasant” if it is at least the average of
          all the donations before it; the first one always is. Arrange the donations so that
          exactly <em>k</em> are very pleasant, or say that it cannot be done. The total of <em>n</em> over
          all tests is at most 2·10<sup>5</sup>, and each donation is between −10<sup>9</sup> and
          10<sup>9</sup>.
        </p>
      </blockquote>

      <h2>My solution (Python)</h2>

      <p>
        Two facts about averages made this manageable. A value that is at least as big as <em>every</em> earlier
        value is certainly at least their average. And a value that is no bigger than every
        earlier value is at most their average. So I can control what happens by controlling the
        order.
      </p>

      <p>
        I sorted the donations and needed n − k of them to be unpleasant. I opened with the
        value that has exactly n − k smaller ones below it, followed it with all the larger
        values in rising order (each one pleasant), and finished with the smaller values in
        falling order (each one meant to be unpleasant). Then I counted, and only printed the
        order if the count really was <em>k</em>.
      </p>

      <CodeBlock language="python" code={mySolutionPython} />

      <p>
        It was accepted. The final count is what handles equal values: a falling value that
        exactly <em>equals</em> the average still counts as pleasant, which happens when
        everything so far is the same number. Checking the result instead of assuming it catches
        that case.
      </p>

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>

      <p>
        This is a <strong>constructive</strong> problem — build one arrangement rather than
        search through them — and my construction is already the efficient one, so the version
        below keeps it. The differences are small: the whole input is read at once, and the <code>j
        == 0</code> special case is gone because for the first donation the test reads 0 ≥ 0,
        which is true anyway.
      </p>

      <p>
        Worked example: donations 0 0 10 −10 with k = 3. Sorted: −10, 0, 0, 10. One donation
        must be unpleasant, so the opener is the value with one smaller value below it: 0. Then
        the larger ones rising (0, 10), then the smaller ones falling (−10). Order: 0, 0, 10,
        −10. Checking: the first is pleasant; 0 ≥ average 0, pleasant; 10 ≥ average 0, pleasant;
        −10 is below the average of 10/3, not pleasant. Exactly 3.
      </p>

      <p>
        And a case with no answer: 5 5 5 with k = 1. Every donation equals the average of the
        ones before it, so all three are pleasant whatever the order. The count comes out as 3,
        not 1, and the program prints NO.
      </p>

      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>

      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>

      <p>
        Both are <strong>O(n log n)</strong> time, from the sort, and <strong>O(n)</strong> extra
        space for the new order. At the limit of 2·10<sup>5</sup> donations the sort is about
        3.5 million comparisons and the checking pass another 2·10<sup>5</sup> steps — well
        inside the 1.5 second limit. Same algorithm, same complexity class; I am not claiming a
        speed-up.
      </p>

      <p>
        Two details matter more than speed. The comparison is done as <code>value * j &gt;=
        total</code>, multiplying instead of dividing, so there are no fractions and no rounding
        errors. And the running total can reach 2·10<sup>14</sup>, which fits a Python integer
        automatically but needs <code>long long</code> in C++.
      </p>

      <p>
        Both versions were checked against a brute force that tries every ordering of 720 small
        random lists: they said YES exactly when some ordering works, and every order they
        printed was valid.
      </p>
    </>
  );
}
