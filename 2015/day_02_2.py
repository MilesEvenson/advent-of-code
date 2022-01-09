from os import getenv


#
# Initial Thoughts:
#   I think the general flow of the code stays the same.
#   I'll simplify data processing, though
#   so I don't load the whole set of instructions,
#   then map all of them to int tuples.
#   For this prompt, I replace "find smallest area"
#   with "find smallest perimeter",
#   and replace "add bonus area"
#   with "add bonus length"
#
#
# Complexity Analysis:
#   N: total boxes to process (lines of input)
#
#   Time Complexity:
#       Raw: O(N)
#       Process each line of input once.
#
#   Space complexity:
#       Raw: O(N)
#       Load all lines into memory,
#       then process them one at a time.
#


def string_to_tuple(line):
    str_dims = line.split('x')
    return tuple([int(d) for d in str_dims])


def load_lines():
    scenario = getenv('SOURCE', 'TEST')
    lines = [
        '2x3x4',
        '1x1x10',
    ]
    if scenario == 'FULL':
        with open('day_02_data.txt') as fh:
            lines = fh.read().strip().split('\n')

    return lines;


def calc_volume(dims):
    return (dims[0] * dims[1] * dims[2])


def calc_permieters(dims):
    lengths = [ 0, 0, 0 ]
    lengths[0] = 2 * (dims[0] + dims[1])
    lengths[1] = 2 * (dims[1] + dims[2])
    lengths[2] = 2 * (dims[2] + dims[0])
    return lengths


def get_min_perimeter(lengths):
    min_length = lengths[0]
    if lengths[1] < min_length:
        min_length = lengths[1]
    if lengths[2] < min_length:
        min_length = lengths[2]
    return min_length


def day_02_2():
    total_length = 0

    raw_lines = load_lines()

    box = (0, 0, 0)
    volume = 0
    lengths = []
    smallest_length = 0
    box_total = 0
    for line in raw_lines:
        box = string_to_tuple(line)
        print(f'Box dims: {box}')
        volume = calc_volume(box)
        print(f'Volume: {volume}')
        lengths = calc_permieters(box)
        print(f'Lengths: {lengths}')
        smallest_length = get_min_perimeter(lengths)
        print(f'Min perimeter: {smallest_length}')
        total_length += (volume + smallest_length)

    print('Total ribbon ({}) for ({}) boxes.'.format(
        total_length, len(raw_lines)))


if __name__ == '__main__':
    day_02_2()


