import os

from functools import cmp_to_key
from math import floor
from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_data(target):
    raw_text = """
        47|53
        97|13
        97|61
        97|47
        75|29
        61|13
        75|53
        29|13
        97|29
        53|29
        61|53
        97|53
        61|29
        47|13
        75|47
        97|75
        47|61
        75|61
        47|29
        75|13
        53|13

        75,47,61,53,29
        97,61,53,29,13
        75,29,13
        75,97,47,61,53
        61,13,29
        97,13,75,29,47"""

    if target == 'FULL':
        filename = 'data.txt'
        filedir = os.path.dirname(os.path.abspath(__file__))
        filepath = '{}/{}'.format(filedir, filename)
        with open(filepath) as fh:
            raw_text = fh.read()

    raw_lines = raw_text.strip().splitlines()
    rules = []
    updates = []
    for line in raw_lines:
        if line.find('|') != -1:
            rules.append([int(c.strip()) for c in line.split('|')])
        elif line.find(',') != -1:
            updates.append([int(c.strip()) for c in line.split(',')])

    return [rules, updates]


def pairs2graphs(pairs):
    inbound = {}
    outbound = {}

    for p in pairs:
        if p[0] not in inbound:
            inbound[p[0]] = set([])
        if p[1] not in inbound:
            inbound[p[1]] = set([])

        if p[0] not in outbound:
            outbound[p[0]] = set([])
        if p[1] not in outbound:
            outbound[p[1]] = set([])

        inbound[p[1]].add(p[0])
        outbound[p[0]].add(p[1])

    return {
        'in': inbound,
        'outbount': outbound }


def solve(rules, all_updates):
    graphs = pairs2graphs(rules)

    lookup = {}
    for pd in graphs['in']:
        for ps in graphs['in'][pd]:
            if not ps in lookup:
                lookup[ps] = set([])
            if not pd in lookup:
                lookup[pd] = set([])
            lookup[ps].add(pd)

    updates_needed = []
    for update in all_updates:
        items = set(update)
        for p in update:
            items.remove(p)
            if not lookup[p].issuperset(items):
                updates_needed.append(update)
                break

    def compare(a, b):
        if b in lookup[a]:
            return -1
        if a in lookup[b]:
            return 1
        return 0

    result = 0
    for update in updates_needed:
        # Sort by lookup
        fixed = sorted(update, key=cmp_to_key(compare))
        if len(fixed) % 2 == 1:
            result += fixed[floor(len(fixed)/2)]
        else:
            print('update {} has an even number of items'.format(fixed))
            raise ValueError(
                'update {} has an even number of items'.format(fixed))

    return result


if __name__ == '__main__':
    print('Day 5.2')
    target = os.environ.get('TARGET', 'SAMPLE')
    [rules, updates] = load_data(target)
    result = solve(rules, updates)

    print('Result: {}'.format(result))


