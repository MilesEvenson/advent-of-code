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


def solve(data):
    result = 0

    mode = 'DO'

    digits = set([str(n) for n in range(10)])

    for line in data:
        #print('parsing line:\n{}\n'.format(line))

        pairs = []
        d = line.find("don't()")
        i = line.find('mul(')
        if d != -1 and d < i:
            mode = 'DONT'
            i = d+1

        while i != -1 and i < len(line) - 4:
            if mode == 'DONT':
                i = line.find('do()', i)
                if i == -1:
                    break
                #print('found do: {}'.format(line[max(i-3,0):min(i+10,len(line))]))
                mode = 'DO'
                i = line.find('mul(', i+1)
                continue

            #print('found instruction start: {}'.format(line[max(i-3,0):min(i+10,len(line))]))
            int_left = 0
            int_right = 0
            num_start = i + 4
            num_end = num_start

            while num_end < len(line) and line[num_end] in digits:
                num_end += 1
            if line[num_end] != ',':
                d = line.find("don't()", num_end)
                i = line.find('mul(', num_end)
                if d != -1 and d < i:
                    mode = 'DONT'
                    i = d+1
                continue
            if num_end == len(line):
                break
            int_left = int(line[num_start:num_end])

            num_start = num_end + 1
            num_end = num_start

            while num_end < len(line) and line[num_end] in digits:
                num_end += 1
            if line[num_end] != ')':
                d = line.find("don't()", num_end)
                i = line.find('mul(', num_end)
                if d != -1 and d < i:
                    mode = 'DONT'
                    i = d+1
                continue
            if num_end == len(line):
                break
            int_right = int(line[num_start:num_end])

            pairs.append([int_left, int_right])

            d = line.find("don't()", num_end)
            i = line.find('mul(', num_end)
            if d != -1 and d < i:
                mode = 'DONT'
                i = d+1

        #pp.pprint(pairs)
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


