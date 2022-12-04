import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_assignments():
    filename = 'day_04.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_04.full.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    assignments = []
    for line in raw_lines.strip().split('\n'):
        [left, right] = line.split(',')
        [left_start, left_end] = left.split('-')
        [right_start, right_end] = right.split('-')
        assignments.append((
            (int(left_start), int(left_end)),
            (int(right_start), int(right_end))))

    return assignments


def is_overlap(pair):
    if pair[0][0] <= pair[1][0] and pair[1][1] <= pair[0][1]:
        return True
    elif pair[1][0] <= pair[0][0] and pair[0][1] <= pair[1][1]:
        return True
    return False


if __name__ == '__main__':
    print('Day 4.1 - Find complete overlaps')

    all_assignments = load_assignments()
    #pp.pprint(all_assignments)
    #print('\n')

    total_overlaps = 0
    for pair in all_assignments:
        if is_overlap(pair):
            total_overlaps += 1

    print('Total overlaps: {}'.format(total_overlaps))


