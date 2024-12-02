import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_data(target):
    if target == 'SAMPLE':
        return [
            [7, 6, 4, 2, 1],
            [1, 2, 7, 8, 9],
            [9, 7, 6, 2, 1],
            [1, 3, 2, 4, 5],
            [8, 6, 4, 4, 1],
            [1, 3, 6, 7, 9],
        ]
    filename = 'data.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    pairs = []
    for rl in raw_lines.strip().split('\n'):
        pairs.append([int(x) for x in rl.split()])
    return pairs


def solve(data):
    count_safe = 0
    for ir, report in enumerate(data):
        #print('report {}'.format(ir))
        safe = True
        left = 0
        right = 1
        going_up = report[0] < report[1]
        while right < len(report):
            if abs(report[left] - report[right]) < 1 \
                or abs(report[left] - report[right]) > 3:
                #print('    NOT safe at {} due to magnitude'.format(right))
                #print('    [{}]'.format(', '.join([str(n) for n in report])))
                safe = False
                break
            elif (going_up and report[left] > report[right]) \
                or (not going_up and report[left] < report[right]):
                #print('    NOT safe at {} due to direction switch'.format(right))
                #print('    [{}]'.format(', '.join([str(n) for n in report])))
                safe = False
                break
            # else - safe, for now
            left += 1
            right += 1
        if safe:
            count_safe += 1
    return count_safe


if __name__ == '__main__':
    print('Day 2.1')
    target = os.environ.get('TARGET', 'SAMPLE')
    lines = load_data(target)
    #pp.pprint(lines)
    result = solve(lines)

    print('Safe lines: {}'.format(result))


