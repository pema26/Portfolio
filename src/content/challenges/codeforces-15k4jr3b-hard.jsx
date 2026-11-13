// A CODING CHALLENGE entry. Copy this file to add another, then add it to the
// list in src/content/challenges/index.js.

import CodeBlock from '../../components/ui/CodeBlock';

export const meta = {
  id: 'codeforces-15k4jr3b-hard', // becomes the URL: /problems/codeforces-15k4jr3b-hard
  title: '15K4JR3B (Hard Version)',
  description:
    'The same triangle, but each move is now a power of two. Splitting the moves into two near-equal piles is easy when you hand them out largest first. Solved in contest (Round 1132, Div. 2).',
  source: 'Codeforces', // where the problem came from
  codeforcesId: '2284A2', // contest number + problem letter; links it to my live profile
  problemUrl: 'https://codeforces.com/contest/2284/problem/A2', // optional
  // difficulty: '800', // Codeforces had not rated this problem yet when I wrote this up
  date: '2026-11-06', // YYYY-MM-DD (the day I solved it)
  tags: ['greedy', 'sorting', 'math'],
};

// The code samples, kept in template literals (backticks) so their line
// breaks and indentation are preserved exactly.
const mySolutionPython = `testcases = int(input())
for i in range(testcases):
    n = int(input())
    values = list(map(int, input().split()))

    multiple = []
    for num in values:
        calculation = 2 ** num
        multiple.append(calculation)

    multiple.sort(reverse=True)

    x = 0
    y = 0

    for num in multiple:
        if x == y:
            x += num
        else:
            y += num

    print(x * y)`;

const aiSolutionPython = `import sys

def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    pos = 1
    out = []
    for _ in range(t):
        n = int(data[pos])
        exponents = sorted((int(v) for v in data[pos + 1: pos + 1 + n]), reverse=True)
        pos += 1 + n

        base = height = 0
        for e in exponents:           # largest step first
            step = 1 << e             # 2 ** e
            if base <= height:        # always feed the smaller side
                base += step
            else:
                height += step
        out.append(str(base * height))
    print("\\n".join(out))

main()`;

const aiSolutionCpp = `#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<int> e(n);
        for (int& x : e) cin >> x;
        sort(e.rbegin(), e.rend());        // reverse iterators: largest first

        // long long on purpose: each side can reach about 10^9 and the
        // product about 7 * 10^17, far past the ~2 * 10^9 limit of int.
        long long base = 0, height = 0;
        for (int x : e) {
            long long step = 1LL << x;     // 1LL so the shift is done in 64 bits
            if (base <= height) base += step;   // always feed the smaller side
            else                height += step;
        }
        cout << base * height << '\\n';
    }
}`;

export default function Codeforces15k4jr3bHard() {
  return (
    <>
      <h2>The problem</h2>

      <blockquote>
        <p>
          <strong>2284A2 — 15K4JR3B (Hard Version).</strong> As in the easy version, three points
          start at the origin and you make exactly <em>n</em> moves. This time move <em>i</em> shifts
          a point by 2<sup>a<sub>i</sub></sup> along one axis, for a given list of exponents (n is
          at most 100 and each exponent is between 0 and 24). Print the largest possible value of
          twice the triangle’s area.
        </p>
      </blockquote>

      <h2>My solution (Python)</h2>

      <p>
        The picture from the easy version still holds: some moves build the base, the rest build
        the height, and the answer is base × height. The total length of all the moves is fixed,
        so I want the two piles as close to equal as I can get them. I sorted the moves from
        largest to smallest and gave each one to whichever pile was behind.
      </p>

      <CodeBlock language="python" code={mySolutionPython} />

      <p>
        It was accepted. My test is <code>x == y</code> rather than “which is smaller”, and that
        is enough here: <code>y</code> only ever catches up with <code>x</code>, it never
        overtakes it. The reason is below.
      </p>

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>

      <p>
        This is a <strong>greedy</strong> algorithm, and my solution is already the optimal one.
        What makes it safe is a property of powers of two: every power of two is a multiple of
        every smaller one. Handing the moves out largest first, the gap between the two piles is
        therefore always a multiple of the move I am about to place. If the gap is not zero it
        is at least as big as that move, so adding the move to the smaller pile closes the gap
        without overshooting. The piles end up as close as the numbers allow.
      </p>

      <p>
        With ordinary numbers that greedy can fail — splitting a list into two equal halves is a
        famously hard problem in general. It is the powers of two that make it exact.
      </p>

      <p>
        Worked example: exponents 0 1 2 2 4 0 are the moves 1, 2, 4, 4, 16, 1. Largest first:
        16, 4, 4, 2, 1, 1. Base gets 16. Height then gets 4 (gap 12), 4 (gap 8), 2 (gap 6), 1
        (gap 5), 1 (gap 4). Base 16, height 12, answer 16 × 12 = 192, matching the sample.
      </p>

      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>

      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>

      <p>
        Both are <strong>O(n log n)</strong> time because of the sort (Python’s <code>sort()</code> is
        Timsort, C++’s is introsort) and <strong>O(n)</strong> extra space. With n at most 100
        that is about 700 comparisons per test, so speed is not a concern and the two versions
        are equivalent.
      </p>

      <p>
        The thing that does differ between languages is the size of the numbers. Each pile can
        reach roughly 10<sup>9</sup> and the product roughly 7·10<sup>17</sup>. Python’s
        integers grow as needed; in C++ a plain <code>int</code> stops near 2·10<sup>9</sup>, so
        the piles and the product must be <code>long long</code>.
      </p>
    </>
  );
}
