// A CODING CHALLENGE entry. Copy this file to add another, then add it to the
// list in src/content/challenges/index.js.

import CodeBlock from '../../components/ui/CodeBlock';

export const meta = {
  id: 'codeforces-in-search-of-convenience', // becomes the URL: /problems/codeforces-in-search-of-convenience
  title: 'In Search of Convenience',
  description:
    'Find any grid point exactly R away from a router. Solved in contest (Round 1125, Div. 3) by searching, then noticing the answer needs no search at all.',
  source: 'Codeforces', // where the problem came from
  codeforcesId: '2275A', // contest number + problem letter; links it to my live profile
  problemUrl: 'https://codeforces.com/contest/2275/problem/A', // optional
  difficulty: '800', // Codeforces rating; optional
  date: '2026-10-07', // YYYY-MM-DD (the day I solved it)
  tags: ['math', 'geometry', 'brute force'],
};

// The code samples, kept in template literals (backticks) so their line
// breaks and indentation are preserved exactly.
const mySolutionPython = `# first input is integer input
testcases = int(input())

for _ in range(testcases):
    x, y, r = map(int, input().split())

    # formula is (x- x1)^2 + (y - y1)^2 = r^2

    x1, y1 = 0, 0

    min_x = x - r
    max_x = x + r
    min_y = y - r
    max_y = y + r

    found = False

    for i in range(min_x, max_x): # x values
        for j in range(min_y, max_y): # y values
            if ((x - i) ** 2 + (y - j) ** 2) == r ** 2:
                x1, y1 = i, j
                found = True
                break
        if found:
            break

    print(x1, y1)`;

const aiSolutionPython = `import sys

def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    out = []
    for i in range(t):
        x0, y0, r = int(data[1 + 3 * i]), int(data[2 + 3 * i]), int(data[3 + 3 * i])
        # Walk r steps straight along the x axis: distance is exactly r.
        out.append(f"{x0 + r} {y0}")
    print("\\n".join(out))

main()`;

const aiSolutionCpp = `#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        int x0, y0, r;
        cin >> x0 >> y0 >> r;
        // r steps straight along the x axis is exactly r away.
        cout << x0 + r << ' ' << y0 << '\\n';   // '\\n' instead of endl: no flush per line
    }
}`;

export default function CodeforcesInSearchOfConvenience() {
  return (
    <>
      <h2>The problem</h2>

      <blockquote>
        <p>
          <strong>2275A: In Search of Convenience.</strong> A router sits at the grid point
          (x<sub>0</sub>, y<sub>0</sub>) and reaches exactly <em>R</em> metres. Print any point
          with whole-number coordinates that is exactly <em>R</em> away from the router. Up to
          10<sup>4</sup> test cases, with coordinates between −10 and 10 and <em>R</em> between 1
          and 25.
        </p>
      </blockquote>

      <h2>My solution (Python)</h2>

      <p>
        In the contest I took the statement literally. A point (x, y) is on the edge of the
        router’s range when (x<sub>0</sub> − x)² + (y<sub>0</sub> − y)² = R², so I walked over
        the square of points around the router and stopped at the first one that fits.
      </p>

      <CodeBlock language="python" code={mySolutionPython} />

      <p>
        It was accepted. Looking at it afterwards, the search never really searches: the outer
        loop starts at the column x<sub>0</sub> − R, and in that column the point level with the
        router is exactly R away. So it always stops in the very first column and always prints
        (x<sub>0</sub> − R, y<sub>0</sub>). That is also why <code>range(min_x, max_x)</code> leaving
        out the last column does no harm.
      </p>

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>

      <p>
        The technique is <strong>constructing the answer directly</strong> instead of looking
        for it. Any point reached by walking <em>R</em> steps in a straight line along one axis
        is exactly <em>R</em> away, and its coordinates are whole numbers because <em>R</em> is.
        So one valid answer is always (x<sub>0</sub> + R, y<sub>0</sub>).
      </p>

      <p>
        Worked example: the router at (5, 5) with R = 5 gives (10, 5). Check: (5 − 10)² + (5 −
        5)² = 25 = 5². For (10, 10) with R = 13 it gives (23, 10), and 13² + 0² = 13². The judge
        accepts any point on the circle, so it does not matter that the sample output shows
        different ones.
      </p>

      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>

      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>

      <p>
        My version does at most R + 1 checks per test before it stops, taking <strong>O(R)</strong> time,
        while the direct answer is <strong>O(1)</strong>. Both use <strong>O(1)</strong> extra
        space. At the largest input (10<sup>4</sup> tests, R = 25) that is about 260,000 checks
        against 10,000 additions: both finish in milliseconds, so the difference never matters
        for the time limit.
      </p>

      <p>
        The real gain is in the reasoning. Once you see that <em>any</em> point will do, you can
        pick the one that needs no calculation, and there is no loop left to get wrong.
      </p>
    </>
  );
}
