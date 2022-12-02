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
    'B': PAPER,
    'C': SCISSORS,
}


OUTCOME_MAP = {
    'X': LOSS,
    'Y': DRAW,
    'Z': WIN,
}


WIN_MAP = {
    ROCK: SCISSORS,
    PAPER: ROCK,
    SCISSORS: PAPER,
}


TARGET_OUTCOME_MAP = {
    ROCK: {
        WIN: PAPER,
        DRAW: ROCK,
        LOSS: SCISSORS,
    },
    PAPER: {
        WIN: SCISSORS,
        DRAW: PAPER,
        LOSS: ROCK,
    },
    SCISSORS: {
        WIN: ROCK,
        DRAW: SCISSORS,
        LOSS: PAPER,
    },
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
            'outcome': OUTCOME_MAP[plays[1]],
        })
    return rounds


def choose_my_play(play):
    return TARGET_OUTCOME_MAP[play['opponent']][play['outcome']]


def calc_round_score(my_play, outcome):
    return SHAPE_SCORES[my_play] + OUTCOME_SCORES[outcome]


if __name__ == '__main__':
    print('Day 2.2 - hit your marks')

    # load rounds
    rounds = load_rounds()
    my_total = 0
    for r in rounds:
        me = choose_my_play(r)
        print('{} - {} => {}'.format(r['opponent'], me, r['outcome']))
        score = calc_round_score(me, r['outcome'])
        print('  score: {}'.format(score))
        my_total += score

    print('My total score: {}'.format(my_total))


