import os

from collections import namedtuple
from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


Coord = namedtuple('Coord', ['x', 'y'])
Move = namedtuple('Move', ['dx', 'dy'])


def load_moves():
    filename = 'day_09.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_09.full.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    moves = []
    for line in raw_lines.strip().split('\n'):
        chunks = line.split(' ')
        moves.append((chunks[0], int(chunks[1])))
    return moves


def get_head_move(direction):
    dx = 0
    dy = 0
    if direction == 'U':
        dy = 1
    elif direction == 'R':
        dx = 1
    elif direction == 'D':
        dy = -1
    elif direction == 'L':
        dx = -1
    return Move(dx, dy)


def get_tail_move(head, tail):
    gap_x = head['x'] - tail['x']
    gap_y = head['y'] - tail['y']
    dx = 0
    dy = 0
    if head['x'] == tail['x'] and abs(gap_y) == 2:
        dy = int(gap_y / 2)
    elif head['y'] == tail['y'] and abs(gap_x) == 2:
        dx = int(gap_x / 2)
    else:
        if (gap_x == 2 and gap_y == 1) or (gap_x == 1 and gap_y == 2):
            # head is NE from tail
            dx = 1
            dy = 1
        elif (gap_x == 2 and gap_y == -1) or (gap_x == 1 and gap_y == -2):
            # head is SE from tail
            dx = 1
            dy = -1
        elif (gap_x == -2 and gap_y == -1) or (gap_x == -1 and gap_y == -2):
            # head is SW from tail
            dx = -1
            dy = -1
        elif (gap_x == -2 and gap_y == 1) or (gap_x == -1 and gap_y == 2):
            # head is NW from tail
            dx = -1
            dy = 1
    return Move(dx, dy)


def path(chunks):
    return '/{}'.format('/'.join(chunks))


if __name__ == '__main__':
    print('Day 9.1 - Knots in 2 dimensions')

    all_moves = load_moves()
    pp.pprint(all_moves)

    tail_coords = set([Coord(0, 0)])

    head = { 'x': 0, 'y': 0 }
    tail = { 'x': 0, 'y': 0 }

    for move in all_moves:
        for i in range(move[1]):
            hm = get_head_move(move[0])
            head['x'] += hm.dx
            head['y'] += hm.dy
            print('head to ({}, {})'.format(head['x'], head['y']))
            tm = get_tail_move(head, tail)
            tail['x'] += tm.dx
            tail['y'] += tm.dy
            print('tail to ({}, {})'.format(tail['x'], tail['y']))
            tail_coords.add(Coord(tail['x'], tail['y']))
            print('----')

    pp.pprint(tail_coords)

    print('The tail stopped at {} distinct coords'.format(len(tail_coords)))

