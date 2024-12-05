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

    # More fun to do multi-axis search?
    # I don't want to do Islands again
    # O(4N) is like O(N) (plus O(1) in space)

    result = 0

    for r in range(len(grid)):
        for c in range(len(grid[r])-3):
            match_forwards = (
                grid[r][c] == 'X'
                and grid[r][c+1] == 'M'
                and grid[r][c+2] == 'A'
                and grid[r][c+3] == 'S')
            match_backwards = (
                grid[r][c] == 'S'
                and grid[r][c+1] == 'A'
                and grid[r][c+2] == 'M'
                and grid[r][c+3] == 'X')
            if match_forwards:
                result += 1
            if match_backwards:
                result += 1

    for c in range(len(grid[0])):
        for r in range(len(grid)-3):
            match_forwards = (
                grid[r][c] == 'X'
                and grid[r+1][c] == 'M'
                and grid[r+2][c] == 'A'
                and grid[r+3][c] == 'S')
            match_backwards = (
                grid[r][c] == 'S'
                and grid[r+1][c] == 'A'
                and grid[r+2][c] == 'M'
                and grid[r+3][c] == 'X')
            if match_forwards:
                result += 1
            if match_backwards:
                result += 1

    # What is len of diagonal?
    # Do we need to know the diagonal?
    # It's still 4 chars up or down
    # So instead of diag, just need to check r AND c

    for r in range(len(grid)-3):
        for c in range(len(grid[r])-3):
            match_forwards = (
                grid[r][c] == 'X'
                and grid[r+1][c+1] == 'M'
                and grid[r+2][c+2] == 'A'
                and grid[r+3][c+3] == 'S')
            match_backwards = (
                grid[r][c] == 'S'
                and grid[r+1][c+1] == 'A'
                and grid[r+2][c+2] == 'M'
                and grid[r+3][c+3] == 'X')
            if match_forwards:
                result += 1
            if match_backwards:
                result += 1

    for r in range(len(grid)-3):
        for c in reversed(range(3, len(grid[r]))):
            match_forwards = (
                grid[r][c] == 'X'
                and grid[r+1][c-1] == 'M'
                and grid[r+2][c-2] == 'A'
                and grid[r+3][c-3] == 'S')
            match_backwards = (
                grid[r][c] == 'S'
                and grid[r+1][c-1] == 'A'
                and grid[r+2][c-2] == 'M'
                and grid[r+3][c-3] == 'X')
            if match_forwards:
                result += 1
            if match_backwards:
                result += 1

    return result


if __name__ == '__main__':
    print('Day 4.1')
    target = os.environ.get('TARGET', 'SAMPLE_SMALL')
    lines = load_data(target)
    #pp.pprint(lines)
    result = solve(lines)

    print('Result: {}'.format(result))


