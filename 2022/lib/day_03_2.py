import os

from math import floor
from math import log2
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


def find_group_type(group_sacks):
    # for item in group_sacks[0]
    #   if new, dict[item] = 0

    # for item in group_sacks[1]
    #   if item in dict
    #       dict.item += s

    # repeat for final sack


    # Can I do better than 3 separate loops?

    # Convert each sack to a bitstring
    # | in each new letter
    # Then & together all strings

    sack_masks = []
    for sack in group_sacks:
        mask = 0
        for item in sack:
            offset = t2p(item)
            mask = mask | (1 << offset)
        sack_masks.append(mask)

    intersection = pow(2, 53) - 1
    for mask in sack_masks:
        #print(bin(intersection).zfill(52))
        #print(bin(mask).zfill(52))
        #print('\n')
        intersection = intersection & mask

    #print('final')
    #print(bin(intersection).zfill(52))
    #print(intersection)
    #print(floor(log2(intersection)))

    return floor(log2(intersection))


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
    print('Day 3.2 - Find the intersection')

    all_sacks = load_sacks()

    group_types = []
    for g in range(0, len(all_sacks), 3):
        group_types.append(find_group_type([
            all_sacks[g], all_sacks[g+1], all_sacks[g+2]]))
        #print('\n\n')

    priority_sum = sum(group_types)

    print('Sum of group types: {}'.format(priority_sum))


