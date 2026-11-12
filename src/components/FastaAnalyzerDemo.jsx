// ============================================================================
//  FastaAnalyzerDemo.jsx  —  try the FASTA analyzer in the browser
// ============================================================================
//
//  WHAT IT IS: a text box, an "Analyze" button and an output panel. It is the
//  web version of the Python program's
//      fasta_input = input("Enter your FASTA sequence: ")
//  followed by its print() lines.
//
//  HOW IT WORKS IN REACT: two pieces of state.
//    - `text`   what is currently in the text box (a "controlled input").
//    - `output` the lines to show, or null before the first run.
//  Pressing Analyze calls analyzeFasta(text) from src/lib/fasta.js (my Python
//  functions, translated line by line) and stores what it returns.
// ============================================================================

import { useState } from 'react';
import { analyzeFasta } from '../lib/fasta';

// Two short made-up records, just for trying the tool out.
const SAMPLE = `>sample_1 Example sequence one
ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG
>sample_2 Example sequence two
ATGAAATTTGGGCCCATGCGCGCTAA`;

function FastaAnalyzerDemo() {
  const [text, setText] = useState(SAMPLE);
  const [output, setOutput] = useState(null);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };
  const handleAnalyze = () => {
    setOutput(analyzeFasta(text));
  };
  const handleLoadSample = () => {
    setText(SAMPLE);
    setOutput(null);
  };

  return (
    <div className="my-6">
      <label htmlFor="fasta-input" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        Enter your FASTA sequence:
      </label>
      <textarea
        id="fasta-input"
        value={text}
        onChange={handleTextChange}
        rows={6}
        spellCheck="false"
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleAnalyze}
          className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500"
        >
          Analyze
        </button>
        <button
          type="button"
          onClick={handleLoadSample}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-accent-500 dark:border-slate-700 dark:text-slate-200"
        >
          Load sample
        </button>
      </div>

      {output && (
        <pre aria-live="polite">
          <code>{output.join('\n')}</code>
        </pre>
      )}
    </div>
  );
}

export default FastaAnalyzerDemo;
