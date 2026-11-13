// ============================================================================
//  FastaAnalyzerDemo.jsx: try the FASTA analyzer in the browser
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
//  Pressing Analyze calls analyzeFasta(text) from src/features/fasta/fasta.js (my Python
//  functions, translated line by line) and stores what it returns.
// ============================================================================

import { useState } from 'react';
import { analyzeFasta, fastaCheck, fastaText, fastaNumCheck, sequenceCheck, greaterThanCheck } from './fasta';

// Two short made-up records, just for trying the tool out.
const SAMPLE = `>sample_1 Example sequence one
ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG
>sample_2 Example sequence two
ATGAAATTTGGGCCCATGCGCGCTAA`;

function FastaAnalyzerDemo() {
  const [text, setText] = useState(SAMPLE);
  const [output, setOutput] = useState(null);
  const [status, setStatus] = useState('');
  const [invalid, setInvalid] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
    setInvalid(false);
    setOutput(null);
    setStatus('');
  };
  const handleAnalyze = () => {
    const sequences = fastaCheck(text) ? fastaText(text)[0] : [];
    const hasError = sequences.length === 0 || sequences.length !== greaterThanCheck(text).length
      || sequences.some(sequence => fastaNumCheck(sequence) || !sequenceCheck(sequence));
    const result = analyzeFasta(text);
    setOutput(result.length ? result : ['No readable sequence records found. Check the FASTA format and sequence characters.']);
    setInvalid(hasError);
    setStatus(hasError
      ? 'Please check the sequence format and characters. Only readable records can be analysed; details are below.'
      : 'Analysis complete. Results are below the buttons.');
  };
  const handleLoadSample = () => {
    setText(SAMPLE);
    setOutput(null);
    setInvalid(false);
    setStatus('Sample sequences loaded.');
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
        aria-describedby="fasta-help fasta-status"
        aria-invalid={invalid}
        spellCheck="false"
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <p id="fasta-help" className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Begin each record with a &gt; header, followed by its DNA sequence on the next line.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleAnalyze}
          className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-700"
        >
          Analyze
        </button>
        <button
          type="button"
          onClick={handleLoadSample}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-link dark:border-slate-700 dark:text-slate-200"
        >
          Load sample
        </button>
      </div>

      <p id="fasta-status" role="status" aria-atomic="true" className="mt-3 text-sm text-slate-600 dark:text-slate-400">{status}</p>

      {output && (
        <pre tabIndex={0} role="region" aria-label="FASTA analysis results">
          <code>{output.join('\n')}</code>
        </pre>
      )}
    </div>
  );
}

export default FastaAnalyzerDemo;
