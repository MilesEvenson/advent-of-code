import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_data(target):
    sample_a2 = """
..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
.........."""

    sample_a3 = """
..........
..........
..........
....a.....
........a.
.....a....
..........
..........
..........
.........."""

    sample_A_and_0 = """
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............"""

    sample_T = """
T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
.........."""

    raw_text = ''
    if target == 'SAMPLE':
        raw_text = sample_A_and_0
    elif target == 'SAMPLE_A2':
        raw_text = sample_a2
    elif target == 'SAMPLE_A3':
        raw_text = sample_a3
    elif target == 'SAMPLE_T':
        raw_text = sample_T
    elif target == 'FULL':
        filename = 'data.txt'
        filedir = os.path.dirname(os.path.abspath(__file__))
        filepath = '{}/{}'.format(filedir, filename)
        with open(filepath) as fh:
            raw_text = fh.read()

    raw_lines = raw_text.strip().splitlines()
    return [list(rl) for rl in raw_lines]


# need rowmax and colmax
def get_nodes(a, b, rowmax, colmax):
    rd = abs(a[0] - b[0])
    cd = abs(a[1] - b[1])

    # hold arrays of north/south points
    # loop north until r < 0 or c < 0 or len == c
    # loop south until len == r or c < 0 or len == c
    points = [a.copy(), b.copy()]

    row = min(a[0], b[0])
    col = -1
    if a[0] <= b[0]:
        col = a[1]
        if a[1] <= b[1]:
            cd = -1 * cd
    else:
        col = b[1]
        if b[1] <= a[1]:
            cd = -1 * cd
    #print('looping north from [{}, {}] with deltas ({}, {})'.format(
    #    row, col, rd, cd))
    # loop north
    while 0 <= row and 0 <= col < colmax:
        points.append([row, col])
        col += cd
        row -= rd

    row = max(a[0], b[0])
    col = -1
    cd = abs(a[1] - b[1])
    if a[0] <= b[0]:
        col = b[1]
        if b[1] <= a[1]:
            cd = -1 * cd
    else:
        col = a[1]
        if a[1] <= b[1]:
            cd = -1 * cd
    #print('looping south from [{}, {}] with deltas ({}, {})'.format(
    #    row, col, rd, cd))
    # loop south
    while row < rowmax and 0 <= col < colmax:
        points.append([row, col])
        col += cd
        row += rd

    return points


def p2k(point):
    return '{}-{}'.format(point[0], point[1])


def solve(grid):
    # collect points by frequency
    # 54 frequencies in full input
    # Each has 3 or 4 points
    # Calc anti-node points for each pair

    sources = {}
    for r in range(len(grid)):
        for c in range(len(grid[r])):
            if grid[r][c] != '.':
                if grid[r][c] not in sources:
                    sources[grid[r][c]] = []
                sources[grid[r][c]].append([r, c])

    marks = [['.' for _ in row] for row in grid]
    overlay = [row.copy() for row in grid]

    rowmax = len(grid)
    colmax = len(grid[0])
    node_points = set([])
    for f, towers in sources.items():
        #print('Frequency {} has towers: {}'.format(f, towers))
        for i in range(len(towers)):
            for j in range(i+1, len(towers)):
                nodes = get_nodes(towers[i], towers[j], rowmax, colmax)
                #print('towers {} {} can have nodes at {}'.format(
                #    towers[i], towers[j], nodes))
                for n in nodes:
                    node_points.add(p2k(n))
                    marks[n[0]][n[1]] = '#'
                    overlay[n[0]][n[1]] = '#'

    #   for r in range(len(grid)):
    #       print('{}    {}'.format(''.join(grid[r]), ''.join(marks[r])))
    #print('\n\n')
    #for row in overlay:
    #    print(''.join(row))

    return len(node_points)


if __name__ == '__main__':
    print('Day 8.2')
    target = os.environ.get('TARGET', 'SAMPLE')
    data = load_data(target)
    #pp.pprint(data)
    result = solve(data)

    print('Result: {}'.format(result))


