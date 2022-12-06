import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_signals():
    filename = 'day_06.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_06.full.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    return raw_lines.strip().split('\n')


def find_marker(signal):
    print(signal)

    counts = {}
    for c in signal[0:3]:
        if c not in counts:
            counts[c] = 0
        counts[c] += 1

    i = 3
    while i < len(signal):
        if signal[i] not in counts:
            if len(counts) == 3:
                return (i + 1)
            counts[signal[i]] = 0
        counts[signal[i]] += 1
        counts[signal[i-3]] -= 1
        if counts[signal[i-3]] == 0:
            counts.pop(signal[i-3])
        i += 1
    return -1


if __name__ == '__main__':
    print('Day 6.1 - Sliding Window')

    marker_indices = []
    all_signals = load_signals()
    for sig in all_signals:
        marker_indices.append(find_marker(sig))

    print('Marker indices:')
    print(marker_indices)



