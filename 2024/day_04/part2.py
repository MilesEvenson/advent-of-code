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
    result = 0

    corners = [
        [-1, -1],
        [-1,  1],
        [ 1,  1],
        [ 1, -1]]

    for r in range(1, len(grid)-1):
        for c in range(1, len(grid[r])-1):
            # The four coords are always
            #   r-1 c-1   r-1 c+1
            #           A
            #   r+1 c-1   r+1 c+1
            #
            # How to simply rotate through these coords?
            # Two arrays:
            #   - [ NW NE SE SW ]
            #   - [ M  M  S  S  ]
            # pop(0)/append on letters to check each of 4 possible rotations

            letters = ['M', 'M', 'S', 'S']
            if grid[r][c] == 'A':
                # try each of the 4 possible rotations
                for t in range(4):
                    match = True
                    # Check if all 4 corners match
                    for idx, pair in enumerate(corners):
                        rp = r+pair[0]
                        cp = c+pair[1]
                        if grid[rp][cp] != letters[idx]:
                            match = False
                            break
                    # If all 4 corners match, count it and break to continue the traversal loops
                    if match:
                        result += 1
                        break
                    # Else no match, "rotate" the letters by moving one letter from the front to the back
                    ch = letters.pop(0)
                    letters.append(ch)

    return result


if __name__ == '__main__':
    print('Day 4.2')
    target = os.environ.get('TARGET', 'SAMPLE_SMALL')
    lines = load_data(target)
    #pp.pprint(lines)
    result = solve(lines)

    print('Result: {}'.format(result))


