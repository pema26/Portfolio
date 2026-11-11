import itertools
import tempfile
import unittest
from collections import Counter
from pathlib import Path
from wordle.rules import feedback_gyb
from wordle.solver import WordleSolver, fetch_words, search_words, solve


class WordleTests(unittest.TestCase):
    def test_all_green(self):
        self.assertEqual(feedback_gyb('APPLE', 'apple'), 'ggggg')

    def test_no_matches(self):
        self.assertEqual(feedback_gyb('zzzzz', 'apple'), 'bbbbb')

    def test_duplicates(self):
        self.assertEqual(feedback_gyb('allee', 'apple'), 'gybbg')
        self.assertEqual(feedback_gyb('eerie', 'serve'), 'bggbg')
        self.assertEqual(feedback_gyb('sassy', 'glass'), 'yybgb')

    def test_green_priority(self):
        self.assertEqual(feedback_gyb('aaaaa', 'cabin'), 'bgbbb')

    def test_invalid_words(self):
        for word in ['four', 'longer', 'ab12c', 'éabcd']:
            with self.assertRaises(ValueError):
                feedback_gyb(word, 'apple')

    def test_feedback_invariants(self):
        # Exhaustive small alphabet: every position and duplicate count.
        words = [''.join(p) for p in itertools.product('ab', repeat=5)]
        for guess in words:
            for answer in words:
                feedback = feedback_gyb(guess, answer)
                for i in range(5):
                    self.assertEqual(feedback[i] == 'g', guess[i] == answer[i])
                used = Counter(c for c, f in zip(guess, feedback) if f != 'b')
                expected = Counter(guess) & Counter(answer)
                self.assertEqual(used, expected)

    def test_position_filter(self):
        self.assertEqual(search_words('a__le', ['apple', 'angle', 'alone']), ['apple', 'angle'])

    def test_history_filter(self):
        words = fetch_words()
        s = WordleSolver(words)
        for guess in ['crane', 'spare']:
            s.add_feedback(guess, feedback_gyb(guess, 'apple'))
        self.assertIn('apple', s.candidates)
        for word in s.candidates:
            self.assertTrue(all(feedback_gyb(g, word) == f for g, f in s.history))

    def test_impossible_feedback_does_not_mutate(self):
        s = WordleSolver(['apple', 'angle'])
        before = s.candidates.copy()
        with self.assertRaises(ValueError):
            s.add_feedback('zzzzz', 'ggggg')
        self.assertEqual(s.candidates, before)
        self.assertEqual(s.history, [])

    def test_invalid_feedback(self):
        for f in ['green', 'gb', '12345']:
            with self.assertRaises(ValueError):
                WordleSolver(['apple']).add_feedback('apple', f)

    def test_undo(self):
        s = WordleSolver(['apple', 'angle', 'arise'])
        before = s.candidates.copy()
        s.add_feedback('apple', 'ggggg')
        s.undo()
        self.assertEqual(s.candidates, before)
        with self.assertRaises(ValueError):
            s.undo()

    def test_custom_word_file(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / 'words.txt'
            p.write_text('# comment\nAPPLE\napple\nangle\n')
            self.assertEqual(fetch_words(p), ['angle', 'apple'])
            p.write_text('bad\n')
            with self.assertRaises(ValueError): fetch_words(p)

    def test_known_answer_and_no_repeated_guesses(self):
        for answer in ['apple', 'level', 'eager', 'teeth', 'query']:
            history = solve(answer, fetch_words(), max_guesses=20)
            self.assertEqual(history[-1], (answer, 'ggggg'))
            guesses = [g for g, _ in history]
            self.assertEqual(len(guesses), len(set(guesses)))

    def test_missing_answer(self):
        with self.assertRaises(ValueError): solve('zzzzz', ['apple'])


if __name__ == '__main__':
    unittest.main()
