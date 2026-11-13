// A CODING CHALLENGE entry. Copy this file to add another, then add it to the
// list in src/content/challenges/index.js.

import CodeBlock from '../../components/ui/CodeBlock';

export const meta = {
  id: 'codeforces-15k4jr3b-easy', // becomes the URL: /problems/codeforces-15k4jr3b-easy
  title: '15K4JR3B (Easy Version)',
  description:
    'Three points start together and get n unit moves between them: how big can the triangle get? A one-line formula. Solved in contest (Round 1132, Div. 2).',
  source: 'Codeforces', // where the problem came from
  codeforcesId: '2284A1', // contest number + problem letter; links it to my live profile
  problemUrl: 'https://codeforces.com/contest/2284/problem/A1', // optional
  // difficulty: '800', // Codeforces had not rated this problem yet when I wrote this up
  date: '2026-11-06', // YYYY-MM-DD (the day I solved it)
  tags: ['math', 'geometry', 'greedy'],
};

// The code samples, kept in template literals (backticks) so their line
// breaks and indentation are preserved exactly.
const mySolutionPython = `testcases = int(input())
for i in range(testcases):
    n = int(input())
    print((n // 2) * (n - (n // 2)))`;

const aiSolutionPython = `import sys

def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    out = []
    for i in range(1, t + 1):
        n = int(data[i])
        a = n // 2                    # steps spent on the base
        out.append(str(a * (n - a)))  # the rest go on the height
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
        int a = n / 2;                     // steps spent on the base
        cout << a * (n - a) << '\\n';       // at most 500 * 500, fits in int
    }
}`;

export default function Codeforces15k4jr3bEasy() {
  return (
    <>
      <h2>The problem</h2>

      <blockquote>
        <p>
          <strong>2284A1: 15K4JR3B (Easy Version).</strong> Three points A, B and C all start at
          the origin. You must make exactly <em>n</em> moves; each move shifts one point by 1
          along the x or the y axis. Print the largest possible value of twice the triangle’s
          area. There are up to 1000 tests, with <em>n</em> between 2 and 1000.
        </p>
      </blockquote>

      <h2>My solution (Python)</h2>

      <p>
        A triangle’s area is half of base × height, so twice the area is just base × height. I
        left A at the origin, spent some moves pushing B along the x axis to make the base, and
        the rest pushing C up the y axis to make the height. If the base gets <em>a</em> moves,
        the height gets n − a, and the answer is a × (n − a). Two numbers with a fixed sum have
        the largest product when they are as equal as possible, so I split the moves in half.
      </p>

      <CodeBlock language="python" code={mySolutionPython} />

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>

      <p>
        This is already the optimal solution: a closed-form formula with nothing to loop over.
        The version below uses the same calculation with the two halves named. The idea
        behind it is worth stating exactly: for a fixed sum a + b = n, the product a × b is
        largest when a and b differ by at most 1, because moving one unit from the bigger side
        to the smaller one changes the product by (bigger − smaller − 1), which is never
        negative.
      </p>

      <p>
        Worked example: n = 5 splits into 2 and 3, giving 2 × 3 = 6. Trying the other splits
        confirms it: 1 × 4 = 4 and 0 × 5 = 0 are both smaller. For n = 15 the split is 7 and 8,
        giving 56. Both match the sample output.
      </p>

      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>

      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>

      <p>
        Both are <strong>O(1)</strong> time and space per test: one division, one subtraction,
        one multiplication. With 1000 tests that is 3000 operations in total. There is no
        difference between the two versions to measure.
      </p>

      <p>
        A brute force that tries every possible sequence of moves for n = 2 to 5 gives the same
        answers as the formula, which also confirms that moving all three points, or moving
        backwards, never beats the simple base-and-height layout.
      </p>
    </>
  );
}
