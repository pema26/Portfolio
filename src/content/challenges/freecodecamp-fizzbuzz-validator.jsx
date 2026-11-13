// A CODING CHALLENGE entry. Copy this file to add another, then add it to the
// list in src/content/challenges/index.js.

import CodeBlock from '../../components/ui/CodeBlock';

export const meta = {
  id: 'freecodecamp-fizzbuzz-validator', // becomes the URL: /problems/freecodecamp-fizzbuzz-validator
  title: 'FizzBuzz Validator',
  description:
    "Given a slice of a FizzBuzz sequence with no starting number, decide whether it's valid by recovering the absolute positions from a single integer anchor.",
  source: 'freeCodeCamp', // where the problem came from
  date: '2026-02-05', // YYYY-MM-DD
  tags: ['arrays', 'simulation'],
};

// The code samples, kept in template literals (backticks) so their line
// breaks and indentation are preserved exactly.
const mySolutionPython = `def rebuild_seq_int(array):

    int_arr = []
    pos = 0
    val = 0
    for n in range(len(array)):
        if isinstance(array[n], int):
            pos = n
            val = array[n]
            break

    while pos > 0:
        val -= 1
        pos -=1

    for n in range(len(array)):
        int_arr.append(n + val)

    return int_arr

def is_fizz_buzz(arr):

    # the playmaker here is to create a new array containing a sequence of integers without Fizz or Buzz
    # then compare that position to the array containing the strings
    int_arr = rebuild_seq_int(arr)

    for actual, expected in zip(arr, int_arr):
        if (expected % 3 == 0 and expected % 5 == 0):
            if (actual != "FizzBuzz"):
                return False
        elif (expected % 5 == 0):
            if (actual != "Buzz"):
                return False
        elif (expected % 3 == 0):
            if (actual != "Fizz"):
                return False
        else:
            if actual != expected:
                return False
    return True`;

const aiSolutionPython = `def is_fizz_buzz(arr):
    # anchor: find any integer to fix absolute positions
    base = None
    for i, x in enumerate(arr):
        if isinstance(x, int) and not isinstance(x, bool):  # bool is a subclass of int
            base = x - i          # value index 0 would hold
            break
    if base is None:
        raise ValueError("no integer anchor; absolute positions undeterminable")

    for i, x in enumerate(arr):
        n = base + i
        if   n % 15 == 0: expected = "FizzBuzz"
        elif n % 3  == 0: expected = "Fizz"
        elif n % 5  == 0: expected = "Buzz"
        else:             expected = n
        if x != expected:
            return False
    return True`;

const aiSolutionCpp = `#include <bits/stdc++.h>
using namespace std;

bool isFizzBuzz(const vector<string>& arr) {
    // Anchor: find any numeric token to fix absolute positions.
    long long base = 0;
    bool found = false;
    for (size_t i = 0; i < arr.size(); ++i) {
        const string& x = arr[i];
        if (!x.empty() && (isdigit((unsigned char)x[0]) || x[0] == '-')) {
            base = stoll(x) - (long long)i;   // value index 0 would hold
            found = true;
            break;
        }
    }
    if (!found) throw runtime_error("no integer anchor");

    for (size_t i = 0; i < arr.size(); ++i) {
        long long n = base + (long long)i;
        string expected;
        if      (n % 15 == 0) expected = "FizzBuzz";
        else if (n % 3  == 0) expected = "Fizz";
        else if (n % 5  == 0) expected = "Buzz";
        else                  expected = to_string(n);
        if (arr[i] != expected) return false;
    }
    return true;
}`;

export default function FreecodecampFizzbuzzValidator() {
  return (
    <>
      <h2>The problem</h2>
      <blockquote>
        <p>
          <strong>FizzBuzz Validator.</strong> Given an array of sequential integers with multiples of
          3 and 5 replaced, decide whether it’s a valid FizzBuzz sequence. Multiples of 3
          become <code>"Fizz"</code>, multiples of 5 become <code>"Buzz"</code>, multiples of both
          become <code>"FizzBuzz"</code>, and every other number stays as an integer. The array can start
          partway through the sequence, so the first value isn’t necessarily 1.
        </p>
      </blockquote>
      <p>
        The catch: since some entries are words, you can’t read a position’s true number
        directly; you have to recover it.
      </p>

      <h2>My solution (Python)</h2>
      <p>
        My idea was to find any real integer in the array and use it to rebuild the run
        of true integers for every position, then compare that against the words.
      </p>
      <CodeBlock language="python" code={mySolutionPython} />

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>
      <p>
        This uses the same anchor idea without building a second array. It computes each
        position’s true number on the fly:
      </p>
      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>
      <p>
        C++ has no “array of mixed ints and strings”, so the inputs are taken as string
        tokens: numbers as their digit text (e.g. <code>"16"</code>), words
        as <code>"Fizz"</code> / <code>"Buzz"</code> / <code>"FizzBuzz"</code>. The logic is otherwise identical.
      </p>
      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>
      <p>
        All three run in <strong>O(n)</strong> time, with a single pass to find the anchor and a single
        pass to check every entry. On space, my version builds a second array of true
        integers, so it uses <strong>O(n)</strong> extra space; the AI versions compute each position’s
        number on the fly, so they use <strong>O(1)</strong> extra space. This uses the same time but less memory, a
        small but clear example of trading away an intermediate array once you spot you
        don’t actually need to store it.
      </p>
    </>
  );
}
