import os

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


def sort_topological(pairs):
    heads = set([])
    rest = set([])
    outbound = {}
    inbound = {}
    for p in pairs:
        if p[0] not in outbound:
            outbound[p[0]] = set([])
        outbound[p[0]].add(p[1])
        if p[1] not in outbound:
            outbound[p[1]] = set([])

        if p[0] not in inbound:
            inbound[p[0]] = set([])
        if p[1] not in inbound:
            inbound[p[1]] = set([])
        inbound[p[1]].add(p[0])

        # Prep heads for topo sort
        if p[0] not in rest and p[0] not in heads:
            heads.add(p[0])
        if p[1] in heads:
            heads.remove(p[1])
        rest.add(p[1])

    print('==========')

    #pp.pprint(outbound)
    #pp.pprint(inbound)
    print('out')
    for p in outbound:
        print('{}: {}'.format(p, len(outbound[p])))
    print('in')
    for p in inbound:
        print('{}: {}'.format(p, len(inbound[p])))
    pp.pprint(heads)

    # I think this is a good impl?
    #   https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm
    result = []
    while heads:
        n = heads.pop()
        result.append(n)
        #print('head is {}'.format(n))
        #print('    will touch Ms: {}'.format(outbound[n]))
        for m in outbound[n]:
            if n not in inbound[m]:
                print('m({}) is not referenced by n({})'.format(m,n))
                pp.pprint(inbound)
                raise KeyError()
            inbound[m].remove(n)
            if len(inbound[m]) == 0:
                heads.add(m)
                del inbound[m]
    return result


def solve(rules, all_updates):
    # Topological sort pages by rules
    # Then build big dict of { page: set(following_pages) }
    #
    # For each update
    #   build dict of { page: set(following_pages) }
    #   for each page in update

    # Proper topo doesn't apply here. Must adjust

    ordering = sort_topological(rules)
    pp.pprint(ordering)
    pages = set(ordering)
    lookup = {}
    for p in ordering:
        pages.remove(p)
        lookup[p] = pages.copy()

    correct_updates = []

    for update in all_updates:
        items = set(update)
        valid = True
        for p in update:
            items.remove(p)
            if not lookup[p].issuperset(items):
                valid = False
                break
        if valid:
            correct_updates.append(update)

    #pp.pprint(correct_updates)

    result = 0
    for update in correct_updates:
        if len(update) % 2 == 1:
            result += update[floor(len(update)/2)]
        else:
            print('update {} has an even number of items'.format(update))
            raise ValueError('')
    return result


if __name__ == '__main__':
    print('Day 5.1')
    target = os.environ.get('TARGET', 'SAMPLE')
    [rules, updates] = load_data(target)
    #pp.pprint(rules)
    #pp.pprint(updates)
    result = solve(rules, updates)

    print('Result: {}'.format(result))


