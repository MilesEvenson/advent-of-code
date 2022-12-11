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
    elif os.environ.get('TARGET', 'SAMPLE') == 'MEDIUM':
        filename = 'day_09.medium.txt'

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


def get_follower_move(leader, follower):
    gap_x = leader['x'] - follower['x']
    gap_y = leader['y'] - follower['y']
    # print('      {} {}'.format(leader['x'], leader['y']))
    # print('      {} {}'.format(follower['x'], follower['y']))
    # print('      gap_x ({}), gap_y ({})'.format(gap_x, gap_y))
    dx = 0
    dy = 0
    if leader['x'] == follower['x'] and abs(gap_y) == 2:
        dy = int(gap_y / 2)
    elif leader['y'] == follower['y'] and abs(gap_x) == 2:
        dx = int(gap_x / 2)
    else:
        if (gap_x == 2 and gap_y == 1) \
            or (gap_x == 1 and gap_y == 2) \
            or (gap_x == 2 and gap_y == 2):
            # leader is NE from follower
            dx = 1
            dy = 1
        elif (gap_x == 2 and gap_y == -1) \
            or (gap_x == 1 and gap_y == -2) \
            or (gap_x == 2 and gap_y == -2):
            # leader is SE from follower
            dx = 1
            dy = -1
        elif (gap_x == -2 and gap_y == -1) \
            or (gap_x == -1 and gap_y == -2) \
            or (gap_x == -2 and gap_y == -2):
            # leader is SW from follower
            dx = -1
            dy = -1
        elif (gap_x == -2 and gap_y == 1) \
            or (gap_x == -1 and gap_y == 2) \
            or (gap_x == -2 and gap_y == 2):
            # leader is NW from follower
            dx = -1
            dy = 1
    return Move(dx, dy)


def path(chunks):
    return '/{}'.format('/'.join(chunks))


def build_grid(all_knots):
    x_min = 0
    x_max = 0
    y_min = 0
    y_max = 0
    lookup = {}
    for i, kn in enumerate(all_knots):
        key = '{}-{}'.format(kn['x'], kn['y'])
        if key not in lookup:
            lookup[key] = str(i)
            if i == 0:
                lookup[key] = 'H'
            elif i == 9:
                lookup[key] = 'T'
        if kn['x'] < x_min:
            x_min = kn['x']
        if x_max < kn['x']:
            x_max = kn['x']
        if kn['y'] < y_min:
            y_min = kn['y']
        if y_max < kn['y']:
            y_max = kn['y']
    if '0-0' not in lookup:
        lookup['0-0'] = 's'

    grid = []
    for y in range((y_max+2), (y_min-3), -1):
        line = []
        for x in range((x_min-2), (x_max+3)):
            key = '{}-{}'.format(x, y)
            line.append(lookup.get(key, '.'))
        grid.append(line)
    return grid


def draw_grid(grid):
    [print(''.join(line)) for line in grid]


if __name__ == '__main__':
    print('Day 9.2 - Snakey')

    all_moves = load_moves()
    #pp.pprint(all_moves)

    tail_coords = set([Coord(0, 0)])

    # Now that there are 10 knots in the rope,
    # use a list to track each one and perform follower moves for each.

    all_knots = [{ 'x': 0, 'y': 0 } for _ in range(10)]

    for move in all_moves:
        print('\n----')
        print('Moving {} spots {}'.format(move[1], move[0]))
        for im in range(move[1]):
            hm = get_head_move(move[0])
            all_knots[0]['x'] += hm.dx
            all_knots[0]['y'] += hm.dy
            print('  head to ({}, {})'.format(all_knots[0]['x'], all_knots[0]['y']))
            for k in range(1, len(all_knots)):
                #print('    checking if follower {} should move'.format(k))
                #pp.pprint(all_knots[k])
                fm = get_follower_move(all_knots[k-1], all_knots[k])
                all_knots[k]['x'] += fm.dx
                all_knots[k]['y'] += fm.dy
                print('    follower {} to ({}, {})'.format(
                    k, all_knots[k]['x'], all_knots[k]['y']))
            tail_coords.add(Coord(all_knots[-1]['x'], all_knots[-1]['y']))
        draw_grid(build_grid(all_knots))

    pp.pprint(tail_coords)

    print('The tail stopped at {} distinct coords'.format(len(tail_coords)))

