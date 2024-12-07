import os

from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_data(target):
    raw_text = """
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20"""

    if target == 'FULL':
        filename = 'data.txt'
        filedir = os.path.dirname(os.path.abspath(__file__))
        filepath = '{}/{}'.format(filedir, filename)
        with open(filepath) as fh:
            raw_text = fh.read()

    all_lines = raw_text.strip().splitlines()
    data = []
    for line in all_lines:
        chunks = line.split(':')
        data.append((int(chunks[0].strip()),
             [int(s.strip()) for s in chunks[1].strip().split(' ')]))
    return data


def solve(data):

    def dp(target, nums, depth):
        #spaces = ''.join([' ' for _ in range(2*depth)])
        #print('{}{} <= {}'.format(spaces, target, nums))
        if len(nums) == 2:
            if target == nums[0] + nums[1]:
                return target
            elif target == nums[0] * nums[1]:
                return target
            else:
                return -1
        target_add = target - nums[-1]
        dig_add = dp(target_add, nums[:-1], depth+1)
        if target_add == dig_add:
            return target
        target_mult = target / nums[-1]
        dig_mult = dp(target_mult, nums[:-1], depth+1)
        if target_mult == dig_mult:
            return target
        return -1


    values = []
    for eq in data:
        if eq[0] == dp(eq[0], eq[1], 0):
            values.append(eq[0])

    result = sum(values)
    return result


if __name__ == '__main__':
    print('Day 7.1')
    target = os.environ.get('TARGET', 'SAMPLE')
    data = load_data(target)
    #pp.pprint(data)
    result = solve(data)

    print('Result: {}'.format(result))


