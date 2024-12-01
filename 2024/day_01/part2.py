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
    print('Day 1.2')
    target = os.environ.get('TARGET', 'SAMPLE')
    lines = load_data(target)

    lookup = {}
    for pair in lines:
        if pair[1] not in lookup:
            lookup[pair[1]] = 0
        lookup[pair[1]] += 1

    result = 0
    for pair in lines:
        if pair[0] in lookup:
            result += pair[0] * lookup[pair[0]]

    print('Similarity score: {}'.format(result))


