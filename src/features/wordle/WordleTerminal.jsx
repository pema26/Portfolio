// ============================================================================
//  WordleTerminal.jsx  —  the Wordle assistant's command line, in the browser
// ============================================================================
//
//  WHAT IT IS: a terminal-style panel that behaves like running
//  `python -m wordle` in a real terminal. It is a port of
//  projects/wordle-assistant/wordle/__main__.py : the same options (--words, --answer,
//  --benchmark), the same prompts ("Guess: ", "Feedback: "), and the same
//  printed messages. The solving logic itself lives in src/features/wordle/.
//
//  WHY IT LOOKS DIFFERENT FROM THE PYTHON FILE: in Python, input() pauses the
//  program until the user types something. A web page can never pause like
//  that. So instead of one long loop, this component remembers WHERE in the
//  conversation it is, in a piece of state called `mode`:
//
//      "loading"   the bundled word list is still downloading
//      "shell"     waiting for a command such as  python -m wordle
//      "guess"     the solver is running and waiting at the "Guess: " prompt
//      "feedback"  ...and now waiting at the "Feedback: " prompt
//      "busy"      a benchmark is running
//
//  Each time the visitor presses Enter, handleSubmit looks at `mode` to decide
//  what the typed text means.
//
//  STATE vs REFS:
//    - Anything shown on screen (the printed lines, the input box, the mode)
//      is state, so changing it re-renders the terminal.
//    - The WordleSolver object and a few flags are kept in refs: they must
//      survive between renders, but changing them should not cause a render.
//
//  Lines printed by the Python program are shown as-is. Lines that only exist
//  on this website (hints, progress) are shown dimmer and in italics.
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { ValueError } from './rules';
import { WordleSolver, parseWords, solve } from './solver';

// The vocabulary is shared with the Python CLI in public/wordle_words_texts/words.txt.
const WORDS_URL = '/wordle_words_texts/words.txt';

// What argparse prints for a usage error and for --help.
const USAGE = 'usage: __main__.py [-h] [--words WORDS] [--answer ANSWER] [--benchmark]';
const HELP_TEXT = `${USAGE}

Interactive Wordle assistant

options:
  -h, --help       show this help message and exit
  --words WORDS    Text file with one five-letter word per line
  --answer ANSWER  Simulate a game against a known answer
  --benchmark      Evaluate every word in the supplied list`;

// The text shown before the input box in each mode.
const PROMPTS = { shell: '$ ', guess: 'Guess: ', feedback: 'Feedback: ' };
const INPUT_LABELS = { shell: 'Terminal command', guess: 'Wordle guess', feedback: 'Wordle feedback' };

// One-click commands shown above the terminal.
const QUICK_COMMANDS = [
  'python -m wordle',
  'python -m wordle --answer apple',
  'python -m wordle --benchmark',
  'python -m wordle --help',
];

// Colours for the three kinds of line.
const LINE_STYLES = {
  out: 'text-[#e1e4e8]', // printed by the program
  cmd: 'text-white', // what the visitor typed
  note: 'italic text-slate-400', // website-only hints
};

// Wait a moment so the browser can redraw the page and react to key presses.
function pause() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Python's f'{value:.2f}'. JavaScript's toFixed() agrees with it except on an
// exact tie (for example 3.125), where Python rounds to the even digit.
function formatTwoDecimals(value) {
  const thousandths = value * 1000;
  if (Number.isInteger(thousandths) && thousandths % 10 === 5) {
    const hundredths = Math.floor(thousandths / 10);
    const rounded = hundredths % 2 === 0 ? hundredths : hundredths + 1;
    return (rounded / 100).toFixed(2);
  }
  return value.toFixed(2);
}

// Read the arguments the way argparse does. Returns either
// { args } on success, or { message } with the text argparse would print.
function parseArguments(tokens) {
  const args = { words: null, answer: null, benchmark: false };
  const unrecognized = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '-h' || token === '--help') {
      return { message: HELP_TEXT };
    }
    if (token === '--benchmark') {
      args.benchmark = true;
    } else if (token === '--words' || token === '--answer') {
      const value = tokens[i + 1];
      if (value === undefined || value.startsWith('-')) {
        return { message: `${USAGE}\n__main__.py: error: argument ${token}: expected one argument` };
      }
      args[token.slice(2)] = value;
      i++; // the value has been used, skip over it
    } else if (token.startsWith('--words=')) {
      args.words = token.slice('--words='.length);
    } else if (token.startsWith('--answer=')) {
      args.answer = token.slice('--answer='.length);
    } else {
      unrecognized.push(token);
    }
  }

  if (unrecognized.length > 0) {
    return { message: `${USAGE}\n__main__.py: error: unrecognized arguments: ${unrecognized.join(' ')}` };
  }
  return { args };
}

function WordleTerminal() {
  // ---- what is on screen ---------------------------------------------------
  const [lines, setLines] = useState([
    { id: 0, kind: 'note', text: 'Wordle assistant — a browser port of my Python command-line solver.' },
    { id: 1, kind: 'note', text: 'Type a command and press Enter, or use the buttons above. Type "help" for a list.' },
  ]);
  const [mode, setMode] = useState('loading');
  const [input, setInput] = useState('');
  const [progress, setProgress] = useState('');
  const [loadError, setLoadError] = useState(false);

  // ---- word lists ----------------------------------------------------------
  const [bundledText, setBundledText] = useState(null); // text of words.txt
  const [uploads, setUploads] = useState({}); // file name -> text of that file

  // ---- things that must survive re-renders without causing one -------------
  const solverRef = useRef(null); // the WordleSolver for the current session
  const pendingGuessRef = useRef(''); // the guess, while we wait for feedback
  const cancelRef = useRef(false); // set to true to stop a benchmark
  const nextIdRef = useRef(2); // gives every printed line a unique key
  const outputRef = useRef(null); // the scrolling output area
  const inputRef = useRef(null); // the text box
  const demoRef = useRef(null);
  const stopRef = useRef(null);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (!restoreFocusRef.current) return;
    // Return focus after a command/benchmark, unless the visitor moved away.
    const focusInsideDemo = demoRef.current?.contains(document.activeElement);
    if (focusInsideDemo || document.activeElement === document.body) {
      if (mode === 'busy') stopRef.current?.focus();
      else if (PROMPTS[mode]) inputRef.current?.focus();
    }
    if (mode !== 'busy') restoreFocusRef.current = false;
  }, [mode]);

  // Add text to the terminal. Text containing "\n" becomes several lines.
  const print = (text, kind = 'out') => {
    const newLines = text.split('\n').map((lineText) => {
      const id = nextIdRef.current;
      nextIdRef.current += 1;
      return { id, kind, text: lineText };
    });
    setLines((prevLines) => [...prevLines, ...newLines]);
  };

  // ---- side effect: download the bundled word list once ---------------------
  useEffect(() => {
    let ignore = false; // becomes true if the component goes away first

    const fetchWordList = async () => {
      try {
        const res = await fetch(WORDS_URL);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const text = await res.text();
        if (!ignore) {
          setBundledText(text);
          setMode('shell');
        }
      } catch (err) {
        if (!ignore) {
          setLoadError(true);
          setLines((prevLines) => [
            ...prevLines,
            { id: -1, kind: 'note', text: `Could not load the word list (${err.message}). Reload the page to try again.` },
          ]);
        }
      }
    };

    fetchWordList();

    return () => {
      ignore = true;
      cancelRef.current = true; // also stops a benchmark that is still running
    };
  }, []);

  // ---- side effect: keep the newest line in view -----------------------------
  useEffect(() => {
    const output = outputRef.current;
    if (output) {
      output.scrollTop = output.scrollHeight;
    }
  }, [lines, progress, mode]);

  // Python: fetch_words(args.words) — load the chosen word list.
  const fetchWords = (fileName) => {
    if (!fileName) {
      return parseWords(bundledText, 'words.txt');
    }
    if (uploads[fileName] === undefined) {
      // Python would raise OSError here; main() prints it the same way.
      throw new ValueError(`[Errno 2] No such file or directory: '${fileName}'`);
    }
    return parseWords(uploads[fileName], fileName);
  };

  // The top of the interactive loop:  while len(solver.history) < 6:
  const promptForGuess = () => {
    const solver = solverRef.current;
    if (solver.history.length >= 6) {
      print('Six guesses used.');
      setMode('shell');
      return;
    }
    print(`${solver.candidates.length} candidates. Suggestions: ${solver.suggest().join(', ')}`);
    setMode('guess');
  };

  // Python: the --benchmark branch. Every word takes a turn as the answer.
  // The work is identical to the Python version; the only difference is that
  // it stops for a moment now and then so the page does not freeze.
  const runBenchmark = async (words) => {
    setMode('busy');
    cancelRef.current = false;
    print('Solving every word in the list. A long list takes several minutes in a browser — use the Stop button to cancel.', 'note');

    const games = [];
    let lastPause = Date.now();
    for (let i = 0; i < words.length; i++) {
      games.push(solve(words[i], words));

      if (Date.now() - lastPause > 60) {
        setProgress(`${i + 1} / ${words.length} games played…`);
        await pause();
        lastPause = Date.now();
        if (cancelRef.current) {
          return; // whoever cancelled has already tidied up the screen
        }
      }
    }

    const wins = games.filter((game) => game[game.length - 1][1] === 'ggggg');
    print(`${wins.length}/${games.length} solved within six guesses`);
    if (wins.length > 0) {
      let totalGuesses = 0;
      for (const game of wins) {
        totalGuesses += game.length;
      }
      print(`Mean guesses among wins: ${formatTwoDecimals(totalGuesses / wins.length)}`);
    }
    setProgress('');
    setMode('shell');
  };

  // Python: main(), up to the point where it first waits for input.
  const runMain = (args) => {
    try {
      const words = fetchWords(args.words);
      if (args.benchmark) {
        runBenchmark(words);
        return;
      }
      if (args.answer) {
        const history = solve(args.answer, words);
        for (const [guess, feedback] of history) {
          print(`${guess} ${feedback}`);
        }
        const solved = history[history.length - 1][1] === 'ggggg';
        print(solved ? 'Solved.' : 'Not solved within six guesses.');
        return;
      }
      solverRef.current = new WordleSolver(words);
      print('Enter a guess and g/y/b feedback. Type undo or quit at the guess prompt.');
      if (!args.words) {
        print('Using the small demo vocabulary; use --words for a full dictionary.');
      }
      promptForGuess();
    } catch (err) {
      if (!(err instanceof ValueError)) {
        throw err; // a real bug, not bad input: let it surface
      }
      print(`Error: ${err.message}`);
      if (err.message.startsWith('[Errno 2]')) {
        print('On this page, use "Load a word list" above first, then pass that file\'s name to --words.', 'note');
      }
    }
  };

  // A line typed at the "$ " prompt.
  const runShellCommand = (commandText) => {
    const tokens = commandText.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
      return;
    }

    if (tokens[0] === 'clear') {
      setLines([]);
      return;
    }
    if (tokens[0] === 'help') {
      print('Commands you can run here:', 'note');
      print('  python -m wordle                  interactive assistant', 'note');
      print('  python -m wordle --answer WORD    watch it solve a known answer', 'note');
      print('  python -m wordle --benchmark      solve every word in the list', 'note');
      print('  python -m wordle --words FILE     use a word list you loaded above', 'note');
      print('  python -m wordle --help           the program\'s own help', 'note');
      print('  clear                             empty this window', 'note');
      return;
    }

    const isPython = tokens[0] === 'python' || tokens[0] === 'python3';
    if (isPython && tokens[1] === '-m' && tokens[2] === 'wordle') {
      const parsed = parseArguments(tokens.slice(3));
      if (parsed.message) {
        print(parsed.message);
      } else {
        runMain(parsed.args);
      }
      return;
    }

    print(`${tokens[0]}: command not found. Type "help" to see what this terminal can run.`, 'note');
  };

  // A line typed at the "Guess: " prompt.
  const handleGuess = (typedText) => {
    const guess = typedText.trim().toLowerCase();
    if (guess === 'quit') {
      setMode('shell');
      return;
    }
    if (guess === 'undo') {
      try {
        solverRef.current.undo();
      } catch (err) {
        if (!(err instanceof ValueError)) throw err;
        print(err.message);
      }
      promptForGuess();
      return;
    }
    // Like the Python version, the guess is only checked once the feedback
    // has been typed too.
    pendingGuessRef.current = guess;
    setMode('feedback');
  };

  // A line typed at the "Feedback: " prompt.
  const handleFeedback = (typedText) => {
    const feedback = typedText.trim().toLowerCase();
    try {
      solverRef.current.addFeedback(pendingGuessRef.current, feedback);
      if (feedback === 'ggggg') {
        print('Solved!');
        setMode('shell');
        return;
      }
    } catch (err) {
      if (!(err instanceof ValueError)) throw err;
      print(err.message);
    }
    promptForGuess();
  };

  // Send one line of text to whatever is currently waiting for input.
  const submitLine = (typedText) => {
    print(`${PROMPTS[mode]}${typedText}`, 'cmd');
    if (mode === 'shell') {
      runShellCommand(typedText);
    } else if (mode === 'guess') {
      handleGuess(typedText);
    } else if (mode === 'feedback') {
      handleFeedback(typedText);
    }
  };

  // ---- event handlers --------------------------------------------------------
  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    if (!PROMPTS[mode]) {
      return; // loading or busy: nothing is waiting for input
    }
    restoreFocusRef.current = true;
    submitLine(input);
    setInput('');
  };

  // Ctrl+C: the Python program catches KeyboardInterrupt and prints
  // "Session ended."
  const handleInterrupt = () => {
    if (mode === 'guess' || mode === 'feedback' || mode === 'busy') {
      restoreFocusRef.current = true;
      cancelRef.current = true;
      setProgress('');
      setInput('');
      print('^C', 'cmd');
      print('Session ended.');
      setMode('shell');
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      // Leave Ctrl+C alone if the visitor is copying selected text.
      const selectedText = window.getSelection().toString();
      if (!selectedText) {
        event.preventDefault();
        handleInterrupt();
      }
    }
  };

  const handleQuickCommand = (commandText) => {
    restoreFocusRef.current = true;
    submitLine(commandText);
    inputRef.current?.focus();
  };

  // "Load a word list": read the chosen file so --words can refer to it.
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    const fileName = file.name.replace(/\s+/g, '_'); // no spaces, so it is one argument
    setUploads((prevUploads) => ({ ...prevUploads, [fileName]: text }));
    print(`Loaded ${fileName}. Use it with:  python -m wordle --words ${fileName}`, 'note');
    event.target.value = ''; // allow choosing the same file again later
  };

  // Clicking anywhere in the terminal puts the cursor in the text box,
  // unless the visitor is selecting text to copy.
  const handleTerminalClick = () => {
    if (!window.getSelection().toString() && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const prompt = PROMPTS[mode];
  const sessionRunning = mode === 'guess' || mode === 'feedback' || mode === 'busy';

  return (
    <div ref={demoRef} className="my-6">
      {/* ---------- one-click commands ---------- */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {QUICK_COMMANDS.map((commandText) => (
          <button
            key={commandText}
            type="button"
            onClick={() => handleQuickCommand(commandText)}
            disabled={mode !== 'shell'}
            className="rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-xs text-slate-700 transition hover:border-accent-400 hover:text-link disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          >
            {commandText}
          </button>
        ))}

        <label className="file-upload inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-accent-400 hover:text-link focus-within:border-accent-400 dark:border-slate-700 dark:text-slate-200">
          Load a word list (.txt)
          <input type="file" accept=".txt,text/plain" onChange={handleFileChange} className="sr-only" />
        </label>

        {sessionRunning && (
          <button
            ref={stopRef}
            type="button"
            onClick={handleInterrupt}
            className="rounded-lg bg-accent-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-700"
          >
            Stop
          </button>
        )}
      </div>

      <p role="status" aria-atomic="true" className="sr-only">
        {loadError ? 'The word list could not be loaded. Reload the word list to try again.'
          : mode === 'loading' ? 'Loading the Wordle word list.'
          : mode === 'busy' ? 'Benchmark running. Use Stop to cancel.'
            : mode === 'shell' ? 'Terminal ready for commands.'
              : mode === 'guess' ? 'Enter your Wordle guess.' : 'Enter your Wordle feedback.'}
      </p>
      {loadError && <button type="button" onClick={() => window.location.reload()} className="mb-3 rounded-lg border border-slate-500 px-3 py-2 text-sm text-link">Reload the word list</button>}

      {/* ---------- the terminal window ---------- */}
      <div
        onClick={handleTerminalClick}
        className="terminal-window overflow-hidden rounded-lg bg-[#24292e] font-mono text-sm leading-relaxed shadow-lg focus-within:ring-2 focus-within:ring-accent-400"
      >
        <div className="border-b border-white/10 px-4 py-2 text-xs text-slate-400">
          wordle — Python CLI
        </div>

        <div ref={outputRef} tabIndex={0} role="region" aria-label="Scrollable Wordle terminal" className="h-96 overflow-y-auto px-4 py-3">
          {/* role="log" asks screen readers to announce new lines as they appear. */}
          <div role="log" aria-label="Wordle terminal output" aria-live="polite" aria-relevant="additions text">
            {lines.map((line) => (
              <div key={line.id} className={`min-h-[1.5em] whitespace-pre-wrap break-words ${LINE_STYLES[line.kind]}`}>
                {line.text}
              </div>
            ))}
          </div>

          {mode === 'loading' && <div className={LINE_STYLES.note}>Loading the word list…</div>}
          {progress && <div className={LINE_STYLES.note}>{progress}</div>}

          {/* The input line. It is hidden while nothing is waiting for input. */}
          {prompt && (
            <form onSubmit={handleSubmit} className="flex items-center">
              <span aria-hidden="true" className="whitespace-pre text-accent-300">
                {prompt}
              </span>
              <label htmlFor="wordle-input" className="sr-only">{INPUT_LABELS[mode]}</label>
              <input
                id="wordle-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-describedby="wordle-input-hint"
                className="min-w-0 flex-1 rounded border border-slate-400 bg-transparent px-2 py-1 text-white caret-accent-300 outline-none"
              />
              <button type="submit" className="ml-2 rounded border border-slate-400 px-3 text-slate-100">Send</button>
            </form>
          )}
        </div>
      </div>

      <div id="wordle-input-hint" className="mt-2 text-xs text-slate-600 dark:text-slate-400">
        Feedback letters: g = green, y = yellow, b = grey. At the Guess prompt, type undo to
        take back a round or quit to exit.
      </div>
    </div>
  );
}

export default WordleTerminal;
