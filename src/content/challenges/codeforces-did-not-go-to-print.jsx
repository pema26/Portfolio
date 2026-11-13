// A CODING CHALLENGE entry. Copy this file to add another, then add it to the
// list in src/content/challenges/index.js.

import CodeBlock from '../../components/ui/CodeBlock';

export const meta = {
  id: 'codeforces-did-not-go-to-print', // becomes the URL: /problems/codeforces-did-not-go-to-print
  title: 'Did Not Go to Print',
  description:
    'Replay a printer’s scan / print commands and report which documents never came out — a direct simulation with a stack. Solved in contest (Round 1125, Div. 3).',
  source: 'Codeforces', // where the problem came from
  codeforcesId: '2275B', // contest number + problem letter; links it to my live profile
  problemUrl: 'https://codeforces.com/contest/2275/problem/B', // optional
  difficulty: '800', // Codeforces rating; optional
  date: '2026-10-07', // YYYY-MM-DD (the day I solved it)
  tags: ['stack', 'simulation', 'implementation'],
};

// The code samples, kept in template literals (backticks) so their line
// breaks and indentation are preserved exactly.
const mySolutionPython = `# first input is integer input
testcases = int(input())

for _ in range(testcases):
    document_amount = int(input())
    document_command = input() # contains a list of string

    printer_memory = []
    printed_documents = set()

    count = 0
    for document in range(1, document_amount + 1):
        if count == document_amount:
            count = 0
        else:
            command = document_command[count]

        if command == '1':
            printer_memory.append(document)
        elif command == '2':
            if printer_memory:
                printed_documents.add(printer_memory[-1])
                printer_memory.pop()
            else:
                printed_documents.add(document)
        elif command == '3':
            printed_documents.add(document)
        count += 1

    not_printed = []
    for document in range(1, document_amount + 1):
        if document not in printed_documents:
            not_printed.append(document)

    print(len(not_printed))
    print(" ".join(map(str, not_printed)))`;

const aiSolutionPython = `import sys

def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    out = []
    pos = 1
    for _ in range(t):
        n = int(data[pos])
        commands = data[pos + 1]
        pos += 2

        printed = [False] * (n + 1)   # printed[d] is True once document d is printed
        memory = []                   # a stack: the last document scanned is on top

        for document, command in enumerate(commands, start=1):
            if command == '1':
                memory.append(document)
            elif command == '2' and memory:
                printed[memory.pop()] = True
            else:                     # '3', or '2' with empty memory
                printed[document] = True

        missing = [str(d) for d in range(1, n + 1) if not printed[d]]
        out.append(str(len(missing)))
        out.append(" ".join(missing))
    print("\\n".join(out))

main()`;

const aiSolutionCpp = `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);   // fast input: up to 2*10^5 characters
    cin.tie(nullptr);

    int t;
    cin >> t;
    while (t--) {
        int n;
        string commands;
        cin >> n >> commands;

        vector<bool> printed(n + 1, false);
        vector<int> memory;            // used as a stack: back() is the top

        for (int doc = 1; doc <= n; ++doc) {
            char c = commands[doc - 1];    // strings are 0-indexed, documents 1-indexed
            if (c == '1') {
                memory.push_back(doc);
            } else if (c == '2' && !memory.empty()) {
                printed[memory.back()] = true;
                memory.pop_back();
            } else {                       // '3', or '2' with empty memory
                printed[doc] = true;
            }
        }

        vector<int> missing;
        for (int doc = 1; doc <= n; ++doc)
            if (!printed[doc]) missing.push_back(doc);

        cout << missing.size() << '\\n';
        for (int doc : missing) cout << doc << ' ';
        cout << '\\n';
    }
}`;

export default function CodeforcesDidNotGoToPrint() {
  return (
    <>
      <h2>The problem</h2>

      <blockquote>
        <p>
          <strong>2275B — Did Not Go to Print.</strong> Documents are numbered 1 to <em>n</em>,
          and command <em>i</em> acts on document <em>i</em>. <code>1</code> scans it into the
          printer’s memory, on top of whatever is there. <code>2</code> prints the top document in
          memory and removes it — or, if memory is empty, prints document <em>i</em> itself. <code>3</code> prints
          document <em>i</em> straight away. List the documents that were never printed, in
          increasing order. The total length of all command strings is at most 2·10<sup>5</sup>.
        </p>
      </blockquote>

      <h2>My solution (Python)</h2>

      <p>
        “On top of everything already there” and “prints the topmost” describe a <strong>stack</strong>:
        last in, first out. A Python list does that with <code>append()</code> to push and <code>pop()</code> to
        take the top. I replayed the commands one by one, kept a set of everything printed, and
        at the end listed the documents missing from it.
      </p>

      <CodeBlock language="python" code={mySolutionPython} />

      <p>
        It was accepted. One leftover from writing it under time pressure: <code>count</code> is
        always exactly one less than <code>document</code>, so the <code>if count ==
        document_amount</code> branch can never run. Looping over the command string directly
        removes both the counter and that branch.
      </p>

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>

      <p>
        The algorithm is the same stack simulation — it is already the best possible, because
        every command has to be read at least once. The changes are tidying: <code>enumerate(commands,
        start=1)</code> pairs each command with its document number, a list of True/False flags
        replaces the set, and all the input is read in one go.
      </p>

      <p>
        Worked example with the commands <code>112332</code>. Document 1 is scanned (memory: 1).
        Document 2 is scanned (memory: 1, 2). Command 3 prints the top, document 2 (memory: 1).
        Command 4 prints document 4. Command 5 prints document 5. Command 6 prints the top,
        document 1 (memory empty). Printed: 1, 2, 4, 5 — so the answer is 3 and 6.
      </p>

      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>

      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>

      <p>
        Both versions are <strong>O(n)</strong> time and <strong>O(n)</strong> extra space: each
        document is pushed at most once, popped at most once, and checked once at the end. At
        the limit of 2·10<sup>5</sup> commands that is roughly 600,000 simple steps —
        milliseconds in either language.
      </p>

      <p>
        They are in the same complexity class, so there is no algorithmic difference to claim.
        The only measurable one is a constant factor: with up to 10<sup>4</sup> test cases,
        reading the whole input once is faster in Python than calling <code>input()</code> twenty
        thousand times.
      </p>
    </>
  );
}
