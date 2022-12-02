import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)

ROCK = 'ROCK'
PAPER = 'PAPER'
SCISSORS = 'SCISSORS'


WIN = 'WIN'
DRAW = 'DRAW'
LOSS = 'LOSS'


SHAPE_MAP = {
    'A': ROCK,
    'X': ROCK,

    'B': PAPER,
    'Y': PAPER,

    'C': SCISSORS,
    'Z': SCISSORS,
}


WIN_MAP = {
    ROCK: SCISSORS,
    PAPER: ROCK,
    SCISSORS: PAPER,
}


SHAPE_SCORES = {
    ROCK: 1,
    PAPER: 2,
    SCISSORS: 3,
}


OUTCOME_SCORES = {
    WIN: 6,
    DRAW: 3,
    LOSS: 0,
}


def load_rounds():
    filename = 'day_02.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_02.full.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    rounds = []
    for line in raw_lines.strip().split('\n'):
        plays = line.split(' ')
        rounds.append({
            'opponent': SHAPE_MAP[plays[0]],
            'me': SHAPE_MAP[plays[1]],
        })
    return rounds


def resolve_round(play):
    if play['opponent'] == play['me']:
        return DRAW
    elif WIN_MAP[play['me']] == play['opponent']:
        return WIN
    else:
        return LOSS


def calc_round_score(my_play, outcome):
    return SHAPE_SCORES[my_play] + OUTCOME_SCORES[outcome]


if __name__ == '__main__':
    print('Day 2.1')

    # load rounds
    rounds = load_rounds()
    my_total = 0
    for r in rounds:
        outcome = resolve_round(r)
        print('{} - {} => {}'.format(r['opponent'], r['me'], outcome))
        score = calc_round_score(r['me'], outcome)
        print('  score: {}'.format(score))
        my_total += score

    print('My total score: {}'.format(my_total))


