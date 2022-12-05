import os

from collections import namedtuple
from math import floor
from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


Op = namedtuple('Op', ['count', 'src', 'dest'])


def get_input_lines():
    filename = 'day_05.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_05.full.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    return raw_lines.split('\n')


def load_stacks():
    full_input = get_input_lines()
    idx = 0
    # find empty line at end of stacks
    while full_input[idx] != '':
        idx += 1

    # Step backward 1 lines to the row of stack identifiers
    idx -= 1

    # Each stack takes up 4 characters: _1__
    total_stacks = floor((1 + len(full_input[idx])) / 4)
    # Add 1 to the total stacks so we get a dummy stack at index 0.
    # The 0 stack won't be used, but makes the move targets simpler to work with.
    stacks = [[] for _ in range(1 + total_stacks)]

    # Step backward from line of stack identifiers
    idx -= 1
    for r in range(idx, -1, -1):
        s = 1
        c = 0
        while c < len(full_input[r]):
            if full_input[r][c+1] != ' ':
                stacks[s].append(full_input[r][c+1])
            s += 1
            c += 4
    return stacks


def load_operations():
    full_input = get_input_lines()
    idx = 0
    # find empty line at end of stacks
    while full_input[idx] != '':
        idx += 1

    # Step forward 1 line to the first row of operations
    idx += 1
    ops = []
    for r in range(idx, (len(full_input)-1)):
        chunks = full_input[r].split(' ')
        ops.append(Op(int(chunks[1]), int(chunks[3]), int(chunks[5])))
    return ops


if __name__ == '__main__':
    print('Day 5.1 - Moving Crates')

    stacks = load_stacks()
    all_moves = load_operations()

    for op in all_moves:
        stacks[op.dest].extend(stacks[op.src][(-1 * op.count):])
        for _ in range(op.count):
            stacks[op.src].pop()

    top_crates = [s[-1] for s in stacks[1:]]

    print('Top crate in each stack:')
    print(''.join(top_crates))



