import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_sacks():
    filename = 'day_03.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_03.full.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    return raw_lines.strip().split('\n')


def find_common_type(items):
    known_types = set([])
    seen_left = set([])
    seen_right = set([])

    left = 0
    right = len(items) - 1

    while left < right:
        #print('known_types is: {}'.format(known_types))
        #print(items)
        #print(''.join(['^' if i == left or i == right else ' ' for i in range(len(items))]))
        
        if items[left] in seen_right:
            return items[left]
        elif items[right] in seen_left:
            return items[right]
        elif items[left] == items[right]:
            return items[left]

        seen_left.add(items[left])
        seen_right.add(items[right])

        left += 1
        right -= 1

    raise ValueError('No common item type in this rucksack')


def t2p(item_type):
    offset = 0
    if ord(item_type) >= ord('a'):
        offset = 96
    elif ord(item_type) <= ord('Z'):
        offset = 38
    else:
        raise ValueError('Unknown item_type ({})'.format(item_type))
    return ord(item_type) - offset


if __name__ == '__main__':
    print('Day 3.1 - Checking item priorities')

    all_sacks = load_sacks()

    common_types = []
    for sack in all_sacks:
        common_types.append(find_common_type(sack))

    priorities = [t2p(t) for t in common_types]
    priority_sum = sum(priorities)

    print('Sum of all priorities: {}'.format(priority_sum))


