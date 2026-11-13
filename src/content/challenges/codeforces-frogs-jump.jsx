// A CODING CHALLENGE entry. Copy this file to add another, then add it to the
// list in src/content/challenges/index.js.

import CodeBlock from '../../components/ui/CodeBlock';

export const meta = {
  id: 'codeforces-frogs-jump', // becomes the URL: /problems/codeforces-frogs-jump
  title: 'Frogs Jump',
  description:
    'How many frogs must leave a 2×n grid so the rest can all jump once and leave every row and column count unchanged? It comes down to odd or even. Solved in contest (Round 1130, Div. 2).',
  source: 'Codeforces', // where the problem came from
  codeforcesId: '2272B', // contest number + problem letter; links it to my live profile
  problemUrl: 'https://codeforces.com/contest/2272/problem/B', // optional
  // difficulty: '800', // Codeforces had not rated this problem yet when I wrote this up
  date: '2026-10-26', // YYYY-MM-DD (the day I solved it)
  tags: ['math', 'parity', 'constructive'],
};

// The code samples, kept in template literals (backticks) so their line
// breaks and indentation are preserved exactly.
const mySolutionPython = `testcases = int(input())

for case in range(testcases):
    column = int(input())

    top_frogs = input().count("f")
    bottom_frogs = input().count("f")

    print((top_frogs + bottom_frogs) % 2)`;

const aiSolutionPython = `import sys

def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    out = []
    for i in range(t):
        top, bottom = data[2 + 3 * i], data[3 + 3 * i]
        frogs = top.count('f') + bottom.count('f')
        out.append(str(frogs % 2))    # odd number of frogs -> remove exactly one
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
        int n;
        string top, bottom;
        cin >> n >> top >> bottom;
        // count() scans the string once and returns how many 'f' it saw.
        auto frogs = count(top.begin(), top.end(), 'f')
                   + count(bottom.begin(), bottom.end(), 'f');
        cout << frogs % 2 << '\\n';         // odd number of frogs -> remove one
    }
}`;

export default function CodeforcesFrogsJump() {
  return (
    <>
      <h2>The problem</h2>

      <blockquote>
        <p>
          <strong>2272B: Frogs Jump.</strong> A grid has 2 rows and <em>n</em> columns; every
          cell is empty or holds one frog, and every column has at least one frog. You remove <em>k</em> frogs.
          Then every remaining frog jumps exactly one cell up, down, left or right, all at once
          (frogs may share a cell). Afterwards each row and each column must hold the same number
          of frogs as before the jump. Find the smallest <em>k</em>. The total of <em>n</em> over
          all tests is at most 2·10<sup>5</sup>.
        </p>
      </blockquote>

      <h2>My solution (Python)</h2>

      <p>
        Working through the samples by hand, two frogs can always trade places, and a lone frog
        can never stay balanced. That pointed at pairing: if the number of frogs is even nobody
        has to leave, and if it is odd exactly one does.
      </p>

      <CodeBlock language="python" code={mySolutionPython} />

      <p>
        It was accepted. During the contest this was a pattern I trusted from the examples
        rather than something I had proved.
      </p>

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>

      <p>
        The technique is a <strong>parity invariant</strong>: find a quantity whose
        odd/even-ness the rules force, and read the answer from it. Give every frog the number <em>row
        + column</em> of its cell. A jump moves a frog one cell, so it changes that frog’s
        number by exactly 1. If F frogs jump, the total of all the numbers changes its
        odd/even-ness F times.
      </p>

      <p>
        But the total can also be computed from the row and column counts alone (each frog adds
        its row number once and its column number once), and those counts must be the same after
        the jump. So the total is unchanged, which is only possible when F is even. An odd
        number of frogs can therefore never work, and at least one frog has to go.
      </p>

      <p>
        That proves “odd needs at least one removal”. A brute-force search over all 120 grids of up to four columns supports the other half:
        an even number of frogs can always manage it, and removing one frog from an odd total
        is enough. Every case agrees with the formula, as does the judge.
      </p>

      <p>
        Worked example: top row <code>fof</code>, bottom row <code>ofo</code>. That is 2 + 1 = 3
        frogs, an odd number, so the answer is 1. With <code>fo</code> over <code>of</code> there
        are 2 frogs: the left one jumps down, the right one jumps up, every row and column still
        holds one frog, and the answer is 0.
      </p>

      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>

      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>

      <p>
        Both take <strong>O(n)</strong> time because <code>count()</code> makes one pass over each row,
        and use <strong>O(1)</strong> extra space beyond the input. At the limit of 2·10<sup>5</sup> columns
        that is 400,000 character checks. The code is the same in both; what the second version
        adds is the reason it is correct.
      </p>
    </>
  );
}
