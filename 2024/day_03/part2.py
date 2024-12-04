import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_data(target):
    if target == 'SAMPLE':
        return [
            "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"
        ]

    filename = 'data.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/{}'.format(filedir, filename)

    raw_lines = []
    with open(filepath) as fh:
        raw_text = fh.read()
        raw_lines = raw_text.strip().split('\n')

    return [rl.strip() for rl in raw_lines]


def parse_line(line):
    return pairs


def solve(data):
    result = 0
    digits = set([str(n) for n in range(10)])

    # NOTE - mode carries over from one line to the next
    mode = 'DO'

    for line in data:
        # Simple(ish) state machine
        def next_mode(curr_mode, idx):
            d = line.find("do()", idx)
            t = line.find("don't()", idx)
            m = line.find('mul(', idx)

            if curr_mode == 'DO':
                if m == -1:
                    # We're done because there are no more mul(x,y) to capture
                    return (curr_mode, -1)
                elif t == -1 or m < t:
                    # Advance to the next mul(x,y) if there is no don't(),
                    # or if the next mul(x,y) is closer than the next don't()
                    return ('DO', m)
                elif t < m:
                    # If the next don't() is closer than the next mul(x,y),
                    # simply switch to DONT mode.
                    return ('DONT', t)
                else:
                    print('ERROR - curr_mode ({}) at idx({}) with d({}), t({}), m({})'.format(
                        curr_mode, idx, d, t, m))
                    return (curr_mode, -1)

            elif curr_mode == 'DONT':
                if d == -1:
                    # We're done because there are no more do() blocks
                    return (curr_mode, -1)
                # If there is another do() block advance to it,
                # then recurse to advance to the next mul(x,y), if it exists
                return next_mode('DO', d)

            else:
                print('ERROR - unknown mode({}) at idx({})'.format(curr_mode, idx))
                return (curr_mode, -1)

        pairs = []
        i = 0
        while i != -1 and i < len(line) - 4:
            if mode == 'DO':
                # NOTE - *assumes* that line[i] is the start of an instance of 'mul('
                left_num_start = i + 4
                left_num_end = left_num_start

                # Scan forward for the left number
                while left_num_end < len(line) and line[left_num_end] in digits:
                    left_num_end += 1

                right_num_start = left_num_end + 1
                right_num_end = right_num_start

                # Scan forward for the right number
                while right_num_end < len(line) and line[right_num_end] in digits:
                    right_num_end += 1

                if left_num_start < left_num_end \
                    and right_num_start < right_num_end \
                    and line[right_num_end] == ')':
                    int_left = int(line[left_num_start:left_num_end])
                    int_right = int(line[right_num_start:right_num_end])
                    pairs.append([int_left, int_right])
                    i = right_num_end
            
            # Regardless of mode, or what was parsed, update mode and advance
            (mode, i) = next_mode(mode, i+1)

        for ints in pairs:
            result += ints[0] * ints[1]

    return result


if __name__ == '__main__':
    print('Day 3.1')
    target = os.environ.get('TARGET', 'SAMPLE')
    lines = load_data(target)
    #pp.pprint(lines)
    result = solve(lines)

    print('Result: {}'.format(result))


