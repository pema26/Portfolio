// A CODING CHALLENGE entry. Copy this file to add another, then add it to the
// list in src/content/challenges/index.js.

import CodeBlock from '../../components/ui/CodeBlock';

export const meta = {
  id: 'codeforces-maximize-one-mex', // becomes the URL: /problems/codeforces-maximize-one-mex
  title: 'Maximize One MEX',
  description:
    'Pick one swap in a permutation to make the k-th largest prefix-MEX as big as possible. The trick is seeing that only one prefix matters. Solved in contest (Round 1130, Div. 2).',
  source: 'Codeforces', // where the problem came from
  codeforcesId: '2272A', // contest number + problem letter; links it to my live profile
  problemUrl: 'https://codeforces.com/contest/2272/problem/A', // optional
  // difficulty: '800', // Codeforces had not rated this problem yet when I wrote this up
  date: '2026-10-26', // YYYY-MM-DD (the day I solved it)
  tags: ['greedy', 'constructive', 'MEX'],
};

// The code samples, kept in template literals (backticks) so their line
// breaks and indentation are preserved exactly.
const mySolutionPython = `testcases = int(input())

for case in range(testcases):
    # n is number of elements in array
    # k is rank of value to be maximised
    n, k = map(int, input().split())

    numbers = list(map(int, input().split()))

    # prefix for what MEX we want to maximise
    prefix_length = n - k + 1
    prefix = numbers[:prefix_length]

    # smallest missing non-negative number
    present = set(prefix)

    mex = 0
    while mex in present:
        mex += 1

    # edge case for when the prefix already has highest possible MEX
    if mex == prefix_length:
        print(-1)
        continue

    largest_number = max(prefix)

    first_position = numbers.index(largest_number)
    second_position = numbers.index(mex)

    print(first_position + 1, second_position + 1)`;

const aiSolutionPython = `import sys

def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    pos = 1
    out = []
    for _ in range(t):
        n, k = int(data[pos]), int(data[pos + 1])
        a = [int(v) for v in data[pos + 2: pos + 2 + n]]
        pos += 2 + n

        length = n - k + 1            # the k-th largest f is f[length]
        where = [0] * n               # where[v] = index of value v
        for i, v in enumerate(a):
            where[v] = i

        # mex of the prefix = smallest value that sits outside it
        mex = 0
        while mex < n and where[mex] < length:
            mex += 1

        if mex == length:             # prefix is already {0, ..., length-1}
            out.append("-1")
            continue

        # Swap the missing value in, and the prefix's largest value out.
        biggest = max(range(length), key=lambda i: a[i])
        out.append(f"{biggest + 1} {where[mex] + 1}")
    print("\\n".join(out))

main()`;

const aiSolutionCpp = `#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        int n, k;
        cin >> n >> k;
        vector<int> a(n), where(n);        // where[v] = index of value v
        for (int i = 0; i < n; ++i) {
            cin >> a[i];
            where[a[i]] = i;
        }

        int length = n - k + 1;            // the k-th largest f is f[length]

        int mex = 0;                       // smallest value outside the prefix
        while (mex < n && where[mex] < length) ++mex;

        if (mex == length) {               // prefix is already {0, ..., length-1}
            cout << -1 << '\\n';
            continue;
        }

        // max_element returns an iterator; subtracting begin() gives the index.
        int biggest = max_element(a.begin(), a.begin() + length) - a.begin();
        cout << biggest + 1 << ' ' << where[mex] + 1 << '\\n';
    }
}`;

export default function CodeforcesMaximizeOneMex() {
  return (
    <>
      <h2>The problem</h2>

      <blockquote>
        <p>
          <strong>2272A — Maximize One MEX.</strong> You get a permutation of 0, 1, …, n − 1 and
          may swap two of its elements at most once. Let f<sub>i</sub> be the MEX of the first <em>i</em> elements
          — the smallest non-negative whole number that is not among them. Choose the swap that
          makes the <em>k</em>-th largest of f<sub>1</sub>, …, f<sub>n</sub> as large as possible,
          or print −1 if no swap is needed. Here n is at most 100.
        </p>
      </blockquote>

      <h2>My solution (Python)</h2>

      <p>
        Two observations did the work. First, adding elements to a prefix can never lower its
        MEX, so f<sub>1</sub> ≤ f<sub>2</sub> ≤ … ≤ f<sub>n</sub>. The <em>k</em>-th largest is
        therefore simply the value at position n − k + 1, and only that one prefix matters.
        Second, a prefix of length L can have a MEX of at most L, and reaches it only when it
        holds exactly 0 to L − 1.
      </p>

      <p>
        So: find the MEX of that prefix. If it already equals the prefix length, print −1.
        Otherwise the missing value sits somewhere after the prefix — swap it in, and swap the
        prefix’s largest value out.
      </p>

      <CodeBlock language="python" code={mySolutionPython} />

      <p>
        It was accepted. Why throw out the <em>largest</em> value? The prefix holds L different
        values but is missing one that is smaller than L, so its largest value must be L or
        more. A MEX of at most L never needs a value that big, so removing it can never hurt.
      </p>

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>

      <p>
        This is a <strong>greedy</strong> argument, and my solution already is the optimal one —
        only one new value can enter the prefix, and it has to be the missing one. The version
        below keeps the idea and changes one detail: it first records where every value sits,
        which answers both “is this value inside the prefix?” and “where is the missing value?”
        without searching the list again.
      </p>

      <p>
        Worked example: n = 5, k = 2, array 0 2 1 4 3. The prefix that matters has length 5 − 2
        + 1 = 4, so it is 0 2 1 4. Values 0, 1 and 2 are inside it and 3 is not, so its MEX is 3
        — less than 4, so a swap helps. The largest value in the prefix is 4, at position 4; the
        missing 3 is at position 5. Swapping positions 4 and 5 gives 0 2 1 3, whose MEX is 4.
        Answer: <code>4 5</code>.
      </p>

      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>

      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>

      <p>
        Both are <strong>O(n)</strong> time and <strong>O(n)</strong> extra space per test: a
        pass to find the MEX, a pass to find the largest value, and a lookup for the missing one
        (mine builds a set and calls <code>index()</code> twice, which are single passes too).
        With n at most 100 that is a few hundred steps, so there is nothing to gain in speed.
      </p>

      <p>
        Both versions were also checked against a brute force that tries every possible swap on
        900 random small permutations, and they always reached the best achievable value.
      </p>
    </>
  );
}
