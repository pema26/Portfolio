"""Candidate filtering and a simple, explainable frequency heuristic."""
from collections import Counter
from pathlib import Path
from .rules import feedback_gyb, validate_word, validate_feedback


def fetch_words(path: str | Path | None = None) -> list[str]:
    """Load local words once; no runtime network dependency.

    The bundled list is a small demonstration vocabulary, not the official
    Wordle answer list. Supply a one-word-per-line file for everyday use.
    """
    path = Path(path) if path else Path(__file__).with_name('words.txt')
    words = set()
    for line in path.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        try:
            words.add(validate_word(line))
        except ValueError as exc:
            raise ValueError(f'Invalid word in {path}: {line!r}') from exc
    if not words:
        raise ValueError('The word list is empty.')
    return sorted(words)


def search_words(pattern: str, words: list[str]) -> list[str]:
    """Filter known positions, e.g. '__e__'. Retained from the original idea."""
    pattern = pattern.strip().lower()
    if len(pattern) != 5 or any(c not in 'abcdefghijklmnopqrstuvwxyz_' for c in pattern):
        raise ValueError('Pattern must be five letters or underscores.')
    return [w for w in words if all(p == '_' or p == c for p, c in zip(pattern, w))]


def rank_words(words: list[str]) -> list[str]:
    """Prioritise coverage of common letters, then common letter positions.

    Count each letter once per word to avoid rewarding repeated letters as
    if they tested extra letters. This is a heuristic, not an optimal solver.
    """
    letters = Counter(letter for word in words for letter in set(word))
    positions = [Counter(word[i] for word in words) for i in range(5)]
    def score(word):
        coverage = sum(letters[c] for c in set(word))
        positional = sum(positions[i][c] for i, c in enumerate(word))
        return (-coverage, -positional, word)
    return sorted(words, key=score)


class WordleSolver:
    def __init__(self, words: list[str]):
        self.words = sorted({validate_word(word) for word in words})
        if not self.words:
            raise ValueError('The word list is empty.')
        self.history: list[tuple[str, str]] = []
        self.candidates = self.words.copy()

    def suggest(self, limit: int = 5) -> list[str]:
        if limit < 1:
            raise ValueError('Limit must be positive.')
        return rank_words(self.candidates)[:limit]

    def add_feedback(self, guess: str, feedback: str) -> int:
        guess, feedback = validate_word(guess), validate_feedback(feedback)
        # Replaying the feedback function handles positions AND letter counts.
        remaining = [word for word in self.candidates
                     if feedback_gyb(guess, word) == feedback]
        if not remaining:
            raise ValueError('No candidates match. Check feedback or use a larger word list.')
        # Only commit a valid update; a typo must not destroy the session.
        self.history.append((guess, feedback))
        self.candidates = remaining
        return len(remaining)

    def undo(self) -> None:
        if not self.history:
            raise ValueError('There is no feedback to undo.')
        history = self.history[:-1]
        self.history = []
        self.candidates = self.words.copy()
        for guess, feedback in history:
            self.add_feedback(guess, feedback)


def solve(answer: str, words: list[str], max_guesses: int = 6) -> list[tuple[str, str]]:
    """Simulate a game for evaluation, without exposing the answer to ranking."""
    answer = validate_word(answer)
    solver = WordleSolver(words)
    if answer not in solver.words:
        raise ValueError('Answer must be present in the supplied word list.')
    if max_guesses < 1:
        raise ValueError('max_guesses must be positive.')
    for _ in range(max_guesses):
        guess = solver.suggest(1)[0]
        feedback = feedback_gyb(guess, answer)
        solver.add_feedback(guess, feedback)
        if feedback == 'ggggg':
            break
    return solver.history
