// ============================================================================
//  src/features/wordle/solver.js: candidate filtering + the ranking heuristic
// ============================================================================
//
//  A line-by-line JavaScript port of  projects/wordle-assistant/wordle/solver.py .
//  Same functions, same order of operations, same error messages:
//
//    fetch_words  -> parseWords   (the browser hands us the file's text)
//    search_words -> searchWords
//    rank_words   -> rankWords
//    WordleSolver -> WordleSolver (suggest / addFeedback / undo)
//    solve        -> solve
// ============================================================================

import { ValueError, feedbackGyb, validateWord, validateFeedback } from './rules.js';

// Python: fetch_words(path)
// The Python version reads the file itself. A web page cannot open files by
// path, so the caller fetches the text and passes it in with a display name.
// The bundled list is public/wordle_words_texts/words.txt.
export function parseWords(text, name) {
  const words = new Set();
  for (let line of text.split(/\r\n|\r|\n/)) {
    line = line.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    try {
      words.add(validateWord(line));
    } catch {
      throw new ValueError(`Invalid word in ${name}: '${line}'`);
    }
  }
  if (words.size === 0) {
    throw new ValueError('The word list is empty.');
  }
  return [...words].sort();
}

// Python: search_words(pattern, words)
// Filter known positions, e.g. '__e__'. Retained from the original idea.
export function searchWords(pattern, words) {
  pattern = pattern.trim().toLowerCase();
  if (!/^[a-z_]{5}$/.test(pattern)) {
    throw new ValueError('Pattern must be five letters or underscores.');
  }
  return words.filter((word) =>
    [...pattern].every((p, i) => p === '_' || p === word[i]),
  );
}

// Python: rank_words(words)
// Prioritise coverage of common letters, then common letter positions.
//
// Count each letter once per word to avoid rewarding repeated letters as
// if they tested extra letters. This is a heuristic, not an optimal solver.
export function rankWords(words) {
  // letters[c]      = how many words contain the letter c at least once
  // positions[i][c] = how many words have the letter c at position i
  const letters = {};
  const positions = [{}, {}, {}, {}, {}];
  for (const word of words) {
    for (const letter of new Set(word)) {
      letters[letter] = (letters[letter] || 0) + 1;
    }
    for (let i = 0; i < 5; i++) {
      positions[i][word[i]] = (positions[i][word[i]] || 0) + 1;
    }
  }

  // Work out each word's score once, then sort by it.
  const scored = words.map((word) => {
    let coverage = 0;
    for (const letter of new Set(word)) {
      coverage += letters[letter];
    }
    let positional = 0;
    for (let i = 0; i < 5; i++) {
      positional += positions[i][word[i]];
    }
    return { word, coverage, positional };
  });

  // Python sorts by the tuple (-coverage, -positional, word): highest
  // coverage first, then highest positional score, then alphabetical.
  scored.sort((a, b) => {
    if (a.coverage !== b.coverage) return b.coverage - a.coverage;
    if (a.positional !== b.positional) return b.positional - a.positional;
    if (a.word < b.word) return -1;
    if (a.word > b.word) return 1;
    return 0;
  });

  return scored.map((item) => item.word);
}

export class WordleSolver {
  constructor(words) {
    this.words = [...new Set(words.map(validateWord))].sort();
    if (this.words.length === 0) {
      throw new ValueError('The word list is empty.');
    }
    this.history = []; // a list of [guess, feedback] pairs
    this.candidates = [...this.words];
  }

  suggest(limit = 5) {
    if (limit < 1) {
      throw new ValueError('Limit must be positive.');
    }
    return rankWords(this.candidates).slice(0, limit);
  }

  // Python: add_feedback(guess, feedback)
  addFeedback(guess, feedback) {
    guess = validateWord(guess);
    feedback = validateFeedback(feedback);
    // Replaying the feedback function handles positions AND letter counts.
    const remaining = this.candidates.filter(
      (word) => feedbackGyb(guess, word) === feedback,
    );
    if (remaining.length === 0) {
      throw new ValueError('No candidates match. Check feedback or use a larger word list.');
    }
    // Only commit a valid update; a typo must not destroy the session.
    this.history.push([guess, feedback]);
    this.candidates = remaining;
    return remaining.length;
  }

  undo() {
    if (this.history.length === 0) {
      throw new ValueError('There is no feedback to undo.');
    }
    const history = this.history.slice(0, -1);
    this.history = [];
    this.candidates = [...this.words];
    for (const [guess, feedback] of history) {
      this.addFeedback(guess, feedback);
    }
  }
}

// Python: solve(answer, words, max_guesses=6)
// Simulate a game for evaluation, without exposing the answer to ranking.
export function solve(answer, words, maxGuesses = 6) {
  answer = validateWord(answer);
  const solver = new WordleSolver(words);
  if (!solver.words.includes(answer)) {
    throw new ValueError('Answer must be present in the supplied word list.');
  }
  if (maxGuesses < 1) {
    throw new ValueError('max_guesses must be positive.');
  }
  for (let i = 0; i < maxGuesses; i++) {
    const guess = solver.suggest(1)[0];
    const feedback = feedbackGyb(guess, answer);
    solver.addFeedback(guess, feedback);
    if (feedback === 'ggggg') {
      break;
    }
  }
  return solver.history;
}
