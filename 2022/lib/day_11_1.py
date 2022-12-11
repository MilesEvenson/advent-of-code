import math
import os

from collections import namedtuple
from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


MathOp = namedtuple('MathOp', ['left', 'operator', 'right'])
Throw = namedtuple('Throw', ['target', 'item_worry'])


class Monkey():

    def __init__(self, mid, items,
        worry_operation, test_val, target_mid_yes, target_mid_no):
        self.mid = mid
        self.items = items
        self.worry_operation = worry_operation
        self.test_val = test_val
        self.target_mid_yes = target_mid_yes
        self.target_mid_no = target_mid_no
        self.inspections = 0

    def __repr__(self):
        repr_chunks = [
            'mid={}',
            'inspections={}',
            'items=[{}]',
            'worry_operation={}',
            'test_val={}',
            'target_mid_yes={}',
            'target_mid_no={}',
        ]
        repr_line = 'Monkey(\n  {}\n)'.format(',\n  '.join(repr_chunks))
        return repr_line.format(self.mid, self.inspections,
            ','.join(map(str, self.items)), self.worry_operation, self.test_val,
            self.target_mid_yes, self.target_mid_no)

    @staticmethod
    def get_mid(raw_id):
        return 'm{}'.format(raw_id)

    def _apply_operation(self, item_worry):
        val_left = item_worry
        val_right = item_worry
        if self.worry_operation.right != 'old':
            val_right = self.worry_operation.right
        if self.worry_operation.operator == '+':
            return val_left + val_right
        elif self.worry_operation.operator == '*':
            return val_left * val_right
        else:
            raise ValueError('Unknown operator ({})'.format(
                self.worry_operation.operator))

    def inspect_items(self):
        for i in range(len(self.items)):
            self.inspections += 1
            self.items[i] = self._apply_operation(self.items[i])
            self.items[i] = math.floor(self.items[i] / 3)

    def throw_items(self):
        throws = []
        # Map items into list of tuples (target_mid, item_worry)
        for item_worry in self.items:
            mid = self.target_mid_no
            if item_worry % self.test_val == 0:
                mid = self.target_mid_yes
            throws.append(Throw(mid, item_worry))
        self.items = []
        return throws

    def receive_item(self, new_item):
        self.items.append(new_item)


def parse_monkey(block):
    lines = block.split('\n')

    mid = Monkey.get_mid(lines[0].split(' ').pop()[0])

    [_, raw_items] = lines[1].split(':')
    items = [int(w) for w in raw_items.split(', ')]

    [_, whole_op] = lines[2].split(' = ')
    op_chunks = whole_op.split(' ')
    op_right = op_chunks[2]
    if 48 <= ord(op_right[0]) and ord(op_right[0]) <= 57:
        op_right = int(op_right)
    operation = MathOp(op_chunks[0], op_chunks[1], op_right)

    test_val = int(lines[3].split(' ').pop())
    target_mid_yes = Monkey.get_mid(lines[4].split(' ').pop())
    target_mid_no = Monkey.get_mid(lines[5].split(' ').pop())
    return Monkey(mid, items, operation, test_val, target_mid_yes, target_mid_no)


def load_monkeys():
    filename = 'day_11.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_11.full.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    monkey_blocks = raw_lines.split('\n\n')

    monkey_map = {}
    for mb in monkey_blocks:
        mono = parse_monkey(mb)
        monkey_map[mono.mid] = mono
    return monkey_map


if __name__ == '__main__':
    print('Day 11.1 - Chasing the right monkeys')

    monkey_map = load_monkeys()
    pp.pprint(monkey_map)

    for r in range(20):
        for mono in monkey_map.values():
            mono.inspect_items()
            throws = mono.throw_items()
            # TODO: Build one array per target monkey?
            for t in throws:
                monkey_map[t.target].receive_item(t.item_worry)

    pp.pprint(['{}: {}'.format(mono.mid, mono.inspections) for mono in monkey_map.values()])

    monkeys = sorted(monkey_map.values(), key=lambda m: m.inspections, reverse=True)

    result = monkeys[0].inspections * monkeys[1].inspections
    print('Result: {}'.format(result))

