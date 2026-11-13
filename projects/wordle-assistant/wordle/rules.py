"""Wordle feedback, including the tricky case of repeated letters."""
from collections import Counter


def validate_word(word: str) -> str:
    word = word.strip().lower()
    if len(word) != 5 or not word.isascii() or not word.isalpha():
        raise ValueError('Enter exactly five English letters.')
    return word


def feedback_gyb(guess: str, answer: str) -> str:
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
    return ''.join(result)


def validate_feedback(feedback: str) -> str:
    feedback = feedback.strip().lower()
    if len(feedback) != 5 or set(feedback) - set('gyb'):
        raise ValueError('Feedback must contain five g/y/b characters, e.g. bygbb.')
    return feedback
