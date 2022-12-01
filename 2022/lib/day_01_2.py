import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_data():
    filename = 'day_01.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_01.full.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    elf_cals = []
    current_cals = []
    for line in raw_lines.strip().split('\n'):
        if line == '':
            elf_cals.append(current_cals)
            current_cals = []
        else:
            current_cals.append(int(line))
    elf_cals.append(current_cals)
    return elf_cals


if __name__ == '__main__':
    print('Day 1.2')
    # Load data
    elf_snacks = load_data()

    # map to sum
    cal_sums = [sum(snacks) for snacks in elf_snacks]
    # sort sums in place
    cal_sums.sort()
    # take top 3 sums
    biggest_stashes = cal_sums[-3:]
    # sum the top 3 sums
    cals_top3 = sum(biggest_stashes)

    print('The top 3 biggest stashes have {} total calories'.format(cals_top3))



