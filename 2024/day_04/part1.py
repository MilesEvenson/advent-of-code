import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_data(target):
    if target == 'SAMPLE_SMALL':
        return [
            '..X...',
            '.SAMX.',
            '.A..A.',
            'XMAS.S',
            '.X....'
        ]
    elif target == 'SAMPLE_LARGE':
        return [
            'MMMSXXMASM',
            'MSAMXMSMSA',
            'AMXSXMAAMM',
            'MSAMASMSMX',
            'XMASAMXAMM',
            'XXAMMXXAMA',
            'SMSMSASXSS',
            'SAXAMASAAA',
            'MAMMMXMMMM',
            'MXMXAXMASX',
        ]

    filename = 'data.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/{}'.format(filedir, filename)

    raw_lines = []
    with open(filepath) as fh:
        raw_text = fh.read()
        raw_lines = raw_text.strip().split('\n')

    return [rl.strip() for rl in raw_lines]


def solve(grid):
    # Could be a graph search
    # scan for grid[r][c] in set(XMAS)
    # scan all 8 neighbors
    # extend in proper direction

    chars = set(['X', 'M', 'A', 'S'])
    visited = set([])
    queue = []

    # TODO -    some kind of generic "check direction"
    #           takes offset (0 for x, 1 for m, etc)
    #           takes tuples "step left" and "step_right"

    def count_words(row, col):
        c = grid[row][col]
        count = 0
        if c == 'X':
            pass
        elif c == 'M':
            pass
        elif c == 'A':
            pass
        elif c == 'S':
            pass
        else:
            print('Unknonw char ({}) at [{}, {}]'.format(c, row, col))
        return count

    result = 0
    for r in range(len(grid)):
        for c in range(len(grid)):
            if '-'.join(grid[r][c]) in visited:
                continue
            if grid[r][c] in chars:
                queue.append([r,c])
            while len(queue):
                [row, col] = queue.pop(0)
                if '-'.join(grid[row][col]) in visited:
                    continue
                result += count_words(row, col)

    return result


if __name__ == '__main__':
    print('Day 4.1')
    target = os.environ.get('TARGET', 'SAMPLE_SMALL')
    lines = load_data(target)
    #pp.pprint(lines)
    result = solve(lines)

    print('Result: {}'.format(result))


