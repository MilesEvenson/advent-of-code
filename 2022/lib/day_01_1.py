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
    print('Day 1.1')
    # Load data
    elf_cals = load_data()
    elf_max = -1
    cals_max = 0
    cals_current = 0
    for idx, elf in enumerate(elf_cals):
        for snack in elf:
            cals_current += snack
        if cals_current > cals_max:
            cals_max = cals_current
            elf_max = idx
        cals_current = 0

    print('Elf {} has {} calories'.format(elf_max, cals_max))


