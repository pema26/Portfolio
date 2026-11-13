"""Run with python -m wordle from projects/wordle-assistant/."""
import argparse
from .solver import WordleSolver, fetch_words, solve


def main():
    parser = argparse.ArgumentParser(description='Interactive Wordle assistant')
    parser.add_argument('--words', help='Text file with one five-letter word per line')
    parser.add_argument('--answer', help='Simulate a game against a known answer')
    parser.add_argument('--benchmark', action='store_true', help='Evaluate every word in the supplied list')
    args = parser.parse_args()
    try:
        words = fetch_words(args.words)
        if args.benchmark:
            games = [solve(answer, words) for answer in words]
            wins = [g for g in games if g[-1][1] == 'ggggg']
            print(f'{len(wins)}/{len(games)} solved within six guesses')
            if wins:
                print(f'Mean guesses among wins: {sum(map(len, wins))/len(wins):.2f}')
            return
        if args.answer:
            history = solve(args.answer, words)
            for guess, feedback in history:
                print(guess, feedback)
            print('Solved.' if history[-1][1] == 'ggggg' else 'Not solved within six guesses.')
            return
        solver = WordleSolver(words)
        print('Enter a guess and g/y/b feedback. Type undo or quit at the guess prompt.')
        if not args.words:
            print('Using the small demo vocabulary; use --words for a full dictionary.')
        while len(solver.history) < 6:
            print(f'{len(solver.candidates)} candidates. Suggestions: {", ".join(solver.suggest())}')
            guess = input('Guess: ').strip().lower()
            if guess == 'quit':
                return
            try:
                if guess == 'undo':
                    solver.undo()
                    continue
                feedback = input('Feedback: ').strip().lower()
                solver.add_feedback(guess, feedback)
                if feedback == 'ggggg':
                    print('Solved!')
                    return
            except ValueError as exc:
                print(exc)
        print('Six guesses used.')
    except (ValueError, OSError) as exc:
        parser.exit(2, f'Error: {exc}\n')
    except (EOFError, KeyboardInterrupt):
        print('\nSession ended.')


if __name__ == '__main__':
    main()
