import os

from collections import deque
from collections import namedtuple
from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


Op = namedtuple('Op', ['code', 'data'])
PipeInst = namedtuple('PipeInst', ['idx', 'op', 'ticks'])
Sample = namedtuple('Sample', ['cycle', 'register_x', 'signal_strength'])


OP_TICKS = {
    'addx': 2,
    'noop': 1,
}


def load_instructions():
    filename = 'day_10.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_10.full.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'MINI':
        filename = 'day_10.mini.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    ops = []
    for line in raw_lines.strip().split('\n'):
        if (line[0] == 'n'):
            ops.append(Op('noop', 0))
        else:
            chunks = line.split(' ')
            ops.append(Op(chunks[0], int(chunks[1])))
    return ops


if __name__ == '__main__':
    print('Day 10.1 - Find the good signal')

    sum_of_samples = 0
    samples = []

    interval_offset = 20
    interval = 40

    register_x = 1
    idx = 0
    cycle = 1
    pipeline = deque()

    instructions = load_instructions()

    idx = 0
    while pipeline or instructions:
        print('----')
        print('Cycle {}'.format(cycle))
        if instructions:
            op = instructions.pop(0)
            # Subtract 1 from OP_TICKS here to count the current cycle.
            pipeline.append(PipeInst(idx, op, (OP_TICKS[op[0]]-1)))
            idx += 1

        if (cycle - interval_offset) % interval == 0:
            strength = cycle * register_x
            sum_of_samples += strength
            samples.append(Sample(cycle, register_x, strength))

        print('processing pipeline during cycle {}'.format(cycle))
        pp.pprint(pipeline)
        pinst = pipeline.popleft()
        if pinst.ticks == 0:
            if pinst.op.code == 'noop':
                pass
            elif pinst.op.code == 'addx':
                register_x += pinst.op.data
            else:
                print('Unknown opcode ({})'.format(pinst.op.code))
        else:
            pipeline.appendleft(pinst._replace(ticks=(pinst.ticks-1)))

        print('After cycle {}, register_x has value: {}'.format(cycle, register_x))
        cycle += 1

    pp.pprint(samples)
    print('Sum of samples: {}'.format(sum_of_samples))



