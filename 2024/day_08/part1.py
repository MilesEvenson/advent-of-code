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

    raw_text = ''
    if target == 'SAMPLE':
        raw_text = sample_A_and_0
    elif target == 'SAMPLE_A2':
        raw_text = sample_a2
    elif target == 'SAMPLE_A3':
        raw_text = sample_a3
    elif target == 'FULL':
        filename = 'data.txt'
        filedir = os.path.dirname(os.path.abspath(__file__))
        filepath = '{}/{}'.format(filedir, filename)
        with open(filepath) as fh:
            raw_text = fh.read()

    raw_lines = raw_text.strip().splitlines()
    return [list(rl) for rl in raw_lines]


def get_nodes(a, b):
    rd = abs(a[0] - b[0])
    cd = abs(a[1] - b[1])

    p_north = [-1, -1]
    p_south = [-1, -1]

    if a[0] <= b[0]:
        p_north[0] = a[0] - rd
        p_south[0] = b[0] + rd
        if a[1] <= b[1]:
            p_north[1] = a[1] - cd
            p_south[1] = b[1] + cd
        else:
            p_north[1] = a[1] + cd
            p_south[1] = b[1] - cd
    else:
        p_north[0] = b[0] - rd
        p_south[0] = a[0] + rd
        if a[1] <= b[1]:
            p_north[1] = b[1] - cd
            p_south[1] = a[1] + cd
        else:
            p_north[1] = b[1] + cd
            p_south[1] = a[1] - cd

    return [p_north, p_south]


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

    node_points = set([])
    #print('Found {} distinct frequencies'.format(len(sources.keys())))
    for f, towers in sources.items():
        #print('Frequency {} has towers: {}'.format(f, towers))
        for i in range(len(towers)):
            for j in range(i+1, len(towers)):
                nodes = get_nodes(towers[i], towers[j])
                #print('towers {} {} can have nodes at {}'.format(
                #    towers[i], towers[j], nodes))
                if 0 <= nodes[0][0] < len(grid) \
                    and 0 <= nodes[0][1] < len(grid[0]):
                        node_points.add(p2k(nodes[0]))
                        marks[nodes[0][0]][nodes[0][1]] = '#'
                        overlay[nodes[0][0]][nodes[0][1]] = '#'
                if 0 <= nodes[1][0] < len(grid) \
                    and 0 <= nodes[1][1] < len(grid[0]):
                        node_points.add(p2k(nodes[1]))
                        marks[nodes[1][0]][nodes[1][1]] = '#'
                        overlay[nodes[1][0]][nodes[1][1]] = '#'

    #   for r in range(len(grid)):
    #       print('{}    {}'.format(''.join(grid[r]), ''.join(marks[r])))
    #   print('\n\n')
    #   for row in overlay:
    #       print(''.join(row))

    return len(node_points)


if __name__ == '__main__':
    print('Day 8.1')
    target = os.environ.get('TARGET', 'SAMPLE')
    data = load_data(target)
    #pp.pprint(data)
    result = solve(data)

    print('Result: {}'.format(result))


