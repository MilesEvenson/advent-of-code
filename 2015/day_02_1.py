from os import getenv


#
# Initial Thoughts:
#   Each input line looks like this: '4x23x21'
#   How to easily determine two smallest dimensions?
#   (alternately, smallest side by area)
#   Just do naive scan of dimensions to find smallest 2?
#   Simpler to just find surface with min area.
#
#
#   Outline:
#       - load instructions
#           - read file
#           - translate each string line to (int, int, int) tuples
#       - sum = 0
#       - for each instruction
#           - calc area of each surface
#           - determine smallest surface by area
#           - calc total surface area
#           - add bonus area
#
#
#
# Complexity Analysis:
#   N: total boxes to process (lines of input)
#
#   Time Complexity:
#       Raw:    O(2N)
#           Map each string line to a tuple of 3 integers.
#           Then execute logic on each tuple.
#
#       Proper: O(N)
#
#
#   Space complexity:
#       Raw:    O(2N)
#           Load all string lines into memory.
#           Then execute logic on each tuple.
#
#       Proper: O(N)
#
#


def string_to_tuple(line):
    str_dims = line.split('x')
    return tuple([int(d) for d in str_dims])


def load_sizes():
    scenario = getenv('SOURCE', 'TEST')
    instructions = [
        '2x3x4',
        '1x1x10',
    ]
    if scenario == 'FULL':
        with open('day_02_data.txt') as fh:
            instructions = fh.read().strip().split('\n')

    return list(map(string_to_tuple, instructions))


def calc_surface_areas(dims):
    areas = [ 0, 0, 0 ]
    areas[0] = dims[0] * dims[1]
    areas[1] = dims[1] * dims[2]
    areas[2] = dims[2] * dims[0]
    return areas


def get_min_surface_area(areas):
    min_area = areas[0]
    if areas[1] < min_area:
        min_area = areas[1]
    if areas[2] < min_area:
        min_area = areas[2]
    return min_area


def calc_total_surface_area(side_areas):
    return (
        (2 * side_areas[0]) + \
        (2 * side_areas[1]) + \
        (2 * side_areas[2])
    )


def day_02_1():
    all_sizes = load_sizes()
    total_area = 0
    areas = []
    smallest_side = 0
    box_total = 0
    for box in all_sizes:
        # get surface areas
        areas = calc_surface_areas(box)
        # get smallest
        smallest_side = get_min_surface_area(areas)
        # calc total area needed for this box
        box_total = calc_total_surface_area(areas)
        # add box surface area, plus bonus, to total
        total_area += (box_total + smallest_side)

    print('Total area ({}) for ({}) boxes.'.format(
        total_area, len(all_sizes)))


if __name__ == '__main__':
    day_02_1()


