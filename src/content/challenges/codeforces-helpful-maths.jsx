// ============================================================================
//  A CODING CHALLENGE entry. Copy this file to add another, then add it to
//  the list in src/content/challenges/index.js. The write-up holds the
//  problem, your solution, the AI's solution (Python + C++), and a short
//  complexity note.
// ============================================================================

import CodeBlock from '../../components/ui/CodeBlock';

export const meta = {
  id: 'codeforces-helpful-maths', // becomes the URL: /problems/codeforces-helpful-maths
  title: 'Helpful Maths',
  description:
    'Rearrange a sum of 1s, 2s and 3s into non-decreasing order — a warm-up in counting and stable output.',
  source: 'Codeforces', // where the problem came from
  codeforcesId: '339A', // contest number + problem letter; links it to my live profile
  problemUrl: 'https://codeforces.com/problemset/problem/339/A', // optional
  difficulty: '800', // Codeforces rating; optional
  date: '2026-01-20', // YYYY-MM-DD
  tags: ['strings', 'sorting', 'counting'],
};

// The code samples. Each is kept in a template literal (backticks) so its
// line breaks and indentation are preserved exactly. Inside a template
// literal a backslash must be written twice (\\n shows as \n on the page).
const mySolutionPython = `question = input()
counts = [0, 0, 0]

for ch in question:
    if ch.isdigit():
        counts[int(ch) - 1] += 1

parts = []
for digit in range(1, 4):
    parts += [str(digit)] * counts[digit - 1]

print("+".join(parts))`;

const aiSolutionPython = `s = input()
print('+'.join(d for d in '123' for _ in range(s.count(d))))`;

const aiSolutionCpp = `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    getline(cin, s);

    string out;
    for (char d : {'1', '2', '3'})       // output 1s, then 2s, then 3s
        for (char c : s)
            if (c == d) {
                if (!out.empty()) out += '+';
                out += d;
            }

    cout << out << "\\n";
}`;

export default function CodeforcesHelpfulMaths() {
  return (
    <>
      <h2>The problem</h2>
      <blockquote>
        <p>
          <strong>339A — Helpful Maths.</strong> You are given a sum (a string of the
          digits <code>1</code>, <code>2</code>, <code>3</code> joined by <code>+</code>). Rearrange the summands so they
          appear in <strong>non-decreasing</strong> order, and print the new sum. For
          example, <code>3+2+1</code> becomes <code>1+2+3</code>.
        </p>
      </blockquote>

      <h2>My solution (Python)</h2>
      <p>
        Because the only operator is <code>+</code>, I can ignore the operator entirely: just count
        how many 1s, 2s and 3s there are, then print them back in order.
      </p>
      <CodeBlock language="python" code={mySolutionPython} />

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>
      <p>The same counting idea, expressed as a single comprehension:</p>
      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>
      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>
      <p>
        Both approaches are <strong>O(n)</strong> time, where <em>n</em> is the length of the input string:
        the counting versions make a constant number of passes over it. Extra space
        is <strong>O(1)</strong> beyond the output itself — the Python version keeps only a fixed array
        of three counts, and the C++ version a few characters of state. (The output
        string is unavoidably O(n).)
      </p>
      <p>
        The lesson: spotting that the <code>+</code> characters carry no information turns a
        “sorting” problem into a counting one, which is simpler and strictly linear.
      </p>
    </>
  );
}
