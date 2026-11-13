# Wordle assistant

A command-line solver built from an initial feedback and vowel-ranking prototype.
Uses Python's standard library. Python 3.10 or later is recommended.

From the repository root, run `cd projects/wordle-assistant` first:

```bash
python -m wordle
python -m wordle --answer apple
python -m wordle --words /path/to/words.txt
python -m wordle --benchmark
python -m unittest discover -s tests -v
```

Enter the actual word you played and five feedback characters: `g` for green,
`y` for yellow, and `b` for grey. Guesses need not be in the answer dictionary.
Type `undo` to correct a previous round, or `quit` to exit.

The default vocabulary is shared with the browser demo at
[`../../public/wordle_words_texts/words.txt`](../../public/wordle_words_texts/words.txt). Edit that file
to update both versions. If you copy this project outside the repository, supply
your own vocabulary with `--words /path/to/words.txt`.

The browser implementation lives in [`../../src/features/wordle/`](../../src/features/wordle/).

## How it works

1. Give exact matches their green marks and count the unmatched answer letters.
2. Assign yellows only while that letter still has an unused occurrence.
3. For each candidate answer, calculate what feedback it would give the guess.
   Keep it only when that feedback exactly matches the player's feedback.
4. Rank remaining candidates by the number of common distinct letters they cover.
   Use positional frequency, then alphabetical order, to break ties.
5. Repeat after each guess. Reject contradictory feedback without losing history.

For example, `allee` against `apple` produces `gybbg`. There is only one `l`
and the final green `e` already uses the only `e`, so extra copies are grey.

The original two-pass feedback idea is retained. Full feedback filtering replaces
vowel-only guesses, which could ignore green positions and previous grey letters.
Word files are read once at startup instead of downloading again for each function.

## Limits and tradeoffs

The bundled words are a manually assembled demonstration vocabulary, not the
complete or official Wordle dictionary. An answer absent from that list will not
be solvable; use `--words` with a suitable one-word-per-line file. No official daily
puzzle service is called. The heuristic is easy to inspect and fast, but does not
guarantee a win within six turns. It only guesses remaining answers; an exploratory
non-answer guess can sometimes be better. Filtering takes O(N) for fixed five-letter
words; ranking uses O(N log N) sorting and O(N) memory.

`--benchmark` simulates every word in the selected vocabulary. Any result refers
only to that vocabulary, not performance against the official daily game.

## Things to understand before an interview

- Why greens must be processed before yellows.
- Why comparing generated feedback handles repeated letters better than a banned-letter set.
- How dictionaries and sets differ in the ranking function.
- Why a failed update leaves the candidate list unchanged.
- How to test a missing answer and contradictory feedback.
- What you would change to compare expected candidate counts or use a larger vocabulary.
