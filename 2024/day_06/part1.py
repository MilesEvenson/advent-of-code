import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_data(target):
    raw_text = """
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#..."""

    if target == 'FULL':
        filename = 'data.txt'
        filedir = os.path.dirname(os.path.abspath(__file__))
        filepath = '{}/{}'.format(filedir, filename)
        with open(filepath) as fh:
            raw_text = fh.read()

    return [
        [c for c in line] \
        for line in raw_text.strip().splitlines()]

def solve(grid):
    # Find guard
    # while in_bounds(r,c):
    #   if at box
    #       rotate
    #       continue
    #   step
    #
    #

    dirs = set(['^', '>', 'v', '<'])
    after_turn = {
        '^': '>',
        '>': 'v',
        'v': '<',
        '<': '^' }

    point = [-1, -1]
    for r in range(len(grid)):
        for c in range(len(grid[r])):
            if grid[r][c] in dirs:
                point = [r, c]
                break
                # do a bunch of extra loops, oops
    print('guard at {} facing {}'.format(point, grid[point[0]][point[1]]))

    def in_bounds(coords):
        return (
            0 <= coords[0] < len(grid)
            and 0 <= coords[1] < len(grid[0]))

    def is_obstructed(coords):
        blocked_north = (
            0 < coords[0]
            and grid[coords[0]][coords[1]] == '^'
            and grid[coords[0]-1][coords[1]] == '#')
        blocked_east = (
            coords[1] < len(grid[coords[0]]) - 1
            and grid[coords[0]][coords[1]] == '>'
            and grid[coords[0]][coords[1]+1] == '#')
        blocked_south = (
            coords[0] < len(grid) - 1
            and grid[coords[0]][coords[1]] == 'v'
            and grid[coords[0]+1][coords[1]] == '#')
        blocked_west = (
            0 < coords[1]
            and grid[coords[0]][coords[1]] == '<'
            and grid[coords[0]][coords[1]-1] == '#')
        return blocked_north or blocked_east or blocked_south or blocked_west

    def step(coords):
        r_next = coords[0]
        c_next = coords[1]
        if grid[point[0]][point[1]] == '^':
            r_next = coords[0] - 1
        elif grid[point[0]][point[1]] == '>':
            c_next = coords[1] + 1
        elif grid[point[0]][point[1]] == 'v':
            r_next = coords[0] + 1
        elif grid[point[0]][point[1]] == '<':
            c_next = coords[1] - 1
        else:
            raise ValueError('unknown direction ({}) at {}'.format(
                grid[point[0]][point[1]], point))
        return [r_next, c_next]
    
    path = []
    while in_bounds(point):
        if is_obstructed(point):
            grid[point[0]][point[1]] = after_turn[grid[point[0]][point[1]]]
            continue
        path.append(point)
        point_next = step(point)
        #pp.pprint(grid)
        #print('will move to {} from {}'.format(point_next, point))
        if in_bounds(point_next):
            grid[point_next[0]][point_next[1]] = grid[point[0]][point[1]]
        grid[point[0]][point[1]] = 'x'
        point = point_next

    distinct_points = set(['{}-{}'.format(p[0],p[1]) for p in path])
    return len(distinct_points)


if __name__ == '__main__':
    print('Day 6.1')
    target = os.environ.get('TARGET', 'SAMPLE')
    grid = load_data(target)
    #pp.pprint(grid)
    result = solve(grid)

    print('Result: {}'.format(result))


