import os


def load_data(target):
    if target == 'SAMPLE':
        return [
            [3, 4],
            [4, 3],
            [2, 5],
            [1, 3],
            [3, 9],
            [3, 3],
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


if __name__ == '__main__':
    print('Day 1.1')
    target = os.environ.get('TARGET', 'SAMPLE')
    lines = load_data(target)

    left_values = []
    right_values = []
    for pair in lines:
        left_values.append(pair[0])
        right_values.append(pair[1])

    left_values.sort()
    right_values.sort()

    result = 0

    for i in range(len(left_values)):
        result += abs(right_values[i] - left_values[i])

    print('Total differences: {}'.format(result))


