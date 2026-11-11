// ============================================================================
//  src/lib/wordle/rules.js  —  Wordle feedback, including repeated letters
// ============================================================================
//
//  This is a line-by-line JavaScript port of  python-projects/wordle/rules.py
//  so the solver can run in the visitor's browser. The function names match
//  the Python ones (feedback_gyb -> feedbackGyb, and so on), and the error
//  messages are identical.
//
//  Python raises ValueError for bad input; here we throw a ValueError class
//  of our own so the terminal can tell "bad input" apart from a real bug.
// ============================================================================

export class ValueError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

// Python: validate_word(word)
export function validateWord(word) {
  word = word.trim().toLowerCase();
  // Exactly five letters a–z (the Python version checks len, isascii, isalpha).
  if (!/^[a-z]{5}$/.test(word)) {
    throw new ValueError('Enter exactly five English letters.');
  }
  return word;
}

// Python: feedback_gyb(guess, answer)
// Return g (green), y (yellow), or b (grey) for each position.
export function feedbackGyb(guess, answer) {
  guess = validateWord(guess);
  answer = validateWord(answer);
  const result = ['b', 'b', 'b', 'b', 'b'];
  // Python uses a Counter here: letter -> how many are still unmatched.
  const remaining = {};
  // Reserve exact matches first so a yellow cannot steal a green's letter.
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'g';
    } else {
      remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
    }
  }
  for (let i = 0; i < 5; i++) {
    const g = guess[i];
    if (result[i] !== 'g' && remaining[g] > 0) {
      result[i] = 'y';
      remaining[g] -= 1;
    }
  }
  return result.join('');
}

// Python: validate_feedback(feedback)
export function validateFeedback(feedback) {
  feedback = feedback.trim().toLowerCase();
  if (!/^[gyb]{5}$/.test(feedback)) {
    throw new ValueError('Feedback must contain five g/y/b characters, e.g. bygbb.');
  }
  return feedback;
}
