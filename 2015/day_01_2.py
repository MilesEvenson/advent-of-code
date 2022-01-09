

# Initial Thoughts:
#   - read all instructions in from file
#   - track index in instructions
#   - process each instruction in order
#       - if floor == -1
#           break
#
#
# Complexity Analysis:
#   N: total instructions
#
#   Time Complexity:
#       O(N)
#       process each instruction once
#
#   Space complexity:
#       O(N)
#       store entire string of instructions in memory
#
#
#


def load_instructions():
    instructions = ''
    with open('day_01_data.txt') as fh:
        instructions = fh.read()
    return instructions


if __name__ == '__main__':
    # load data from file
    instructions = load_instructions()

    total_instructions = 0
    floor = 0
    # for each instruction
    for inst in instructions:
        if inst == '(':
            floor += 1
        elif inst == ')':
            floor -= 1
        total_instructions += 1
        if floor == -1:
            break

    print('Hit floor -1 after ({}) instructions.'.format(total_instructions))


