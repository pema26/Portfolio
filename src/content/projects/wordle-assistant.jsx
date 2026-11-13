// ============================================================================
//  A MINI project — the Wordle assistant.
//
//  The original is a Python command-line program; its source lives in
//  projects/wordle-assistant/wordle/ . Visitors cannot run Python in a web page, so the
//  <WordleTerminal /> below runs a JavaScript port of the same logic
//  (src/features/wordle/) behind a terminal-style interface.
// ============================================================================

import CodeBlock from '../../components/ui/CodeBlock';
import WordleTerminal from '../../features/wordle/WordleTerminal';

export const meta = {
  id: 'wordle-assistant', // becomes the URL: /projects/wordle-assistant
  title: 'Wordle assistant: a command-line solver',
  description:
    'A Python command-line tool that narrows down Wordle answers from green / yellow / grey feedback and suggests the next guess — with a live terminal on this page so you can try it.',
  category: 'mini-unique', // big-unique | guided | mini-unique
  status: 'complete', // planned | in-progress | complete
  date: '2026-11-11', // YYYY-MM-DD
  tags: ['Python', 'algorithms', 'command line'],
  // githubUrl: '[[GITHUB_URL]]', // optional — uncomment and set
  devlog: [],
  featured: true, // show on the home page?
};

// The heart of the Python program, shown on the page. It is kept in a
// template literal (backticks) so its line breaks and indentation are
// preserved exactly.
const feedbackCode = `def feedback_gyb(guess: str, answer: str) -> str:
    """Return g (green), y (yellow), or b (grey) for each position."""
    guess, answer = validate_word(guess), validate_word(answer)
    result = ['b'] * 5
    remaining = Counter()
    # Reserve exact matches first so a yellow cannot steal a green's letter.
    for i, (g, a) in enumerate(zip(guess, answer)):
        if g == a:
            result[i] = 'g'
        else:
            remaining[a] += 1
    for i, g in enumerate(guess):
        if result[i] != 'g' and remaining[g] > 0:
            result[i] = 'y'
            remaining[g] -= 1
    return ''.join(result)`;

export default function WordleAssistant() {
  return (
    <>
      <h2>Try it</h2>
      <p>
        This is the solver’s command line, running in your browser. Play a word in Wordle,
        then enter the word you played and five feedback characters: <code>g</code> for
        green, <code>y</code> for yellow, and <code>b</code> for grey. Guesses need not be in
        the answer dictionary. Type <code>undo</code> to correct a previous round,
        or <code>quit</code> to exit.
      </p>

      <WordleTerminal />

      <p>
        The original is a Python program that uses only the standard library. The terminal
        above runs a JavaScript port of the same logic, so the suggestions and messages match
        the Python version.
      </p>

      <h2>How it works</h2>
      <ol>
        <li>Give exact matches their green marks and count the unmatched answer letters.</li>
        <li>Assign yellows only while that letter still has an unused occurrence.</li>
        <li>
          For each candidate answer, calculate what feedback it would give the guess. Keep it
          only when that feedback exactly matches the player’s feedback.
        </li>
        <li>
          Rank remaining candidates by the number of common distinct letters they cover. Use
          positional frequency, then alphabetical order, to break ties.
        </li>
        <li>Repeat after each guess. Reject contradictory feedback without losing history.</li>
      </ol>
      <p>
        For example, <code>allee</code> against <code>apple</code> produces <code>gybbg</code>. There
        is only one <code>l</code> and the final green <code>e</code> already uses the
        only <code>e</code>, so extra copies are grey.
      </p>
      <CodeBlock language="python" code={feedbackCode} />
      <p>
        The original two-pass feedback idea is retained. Full feedback filtering replaces
        vowel-only guesses, which could ignore green positions and previous grey letters.
      </p>

      <h2>Limits and tradeoffs</h2>
      <p>
        The bundled word list is not the official Wordle answer list. An answer absent from
        it will not be solvable; use <code>--words</code> with a suitable one-word-per-line
        file. No official daily puzzle service is called. The heuristic is easy to inspect
        and fast, but does not guarantee a win within six turns. It only guesses remaining
        answers; an exploratory non-answer guess can sometimes be better. Filtering takes
        O(N) for fixed five-letter words; ranking uses O(N log N) sorting and O(N) memory.
      </p>
      <p>
        <code>--benchmark</code> simulates every word in the selected vocabulary. Any result
        refers only to that vocabulary, not performance against the official daily game.
      </p>
    </>
  );
}
