import os

from functools import cmp_to_key
from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


def load_session():
    filename = 'day_07.sample.txt'
    if os.environ.get('TARGET', 'SAMPLE') == 'FULL':
        filename = 'day_07.full.txt'

    filedir = os.path.dirname(os.path.abspath(__file__))
    filepath = '{}/../data/{}'.format(filedir, filename)

    raw_lines = ''
    with open(filepath) as fh:
        raw_lines = fh.read()

    return raw_lines.strip().split('\n')


def path(chunks):
    return '/{}'.format('/'.join(chunks))


def sort_paths(a, b):
    if a == '/':
        return -1
    elif b == '/':
        return 1
    else:
        segments_a = len(a.split('/'))
        segments_b = len(b.split('/'))
        if segments_a < segments_b or segments_b < segments_a:
            return segments_a - segments_b
        else:
            if a < b:
                return -1
            else:
                return 1


if __name__ == '__main__':
    print('Day 7.1 - dirtree C')

    # There are only 2 commands to process:
    #   - cd
    #   - ls

    # There are only 2 types of output to read:
    #   - dir foo
    #   - 12 bar.txt

    # Both sample and full input start in the root directory /

    # Both sample and full input only cd up and down into
    # relative directories after the initial `cd /` command.

    # Is it safe to use a dict of full paths instead of a tree structure?
    # I think that is simpler for debugging/logging.
    # The values in this dictionary could be total sizes.
    # How to calculate directory sizes?
    # Sort all paths by "number of segments", descending,
    # then iteratively update parent directory sizes
    

    filesystem = {
        '/': {
            'type': 'directory',
            'size': 0,
        },
    }
    cwd = []
    full_session = load_session()
    i = 0
    while i < len(full_session):
        print('line {}: ({})'.format(i, full_session[i]))
        if full_session[i][:4] == '$ cd':
            dirname = full_session[i][5:]
            if dirname == '/':
                print('moving to filesystem root')
                cwd = []
            elif dirname == '..':
                print('moving up to {}'.format(path(cwd)))
                cwd.pop()
            else:
                dirpath = path(cwd + [dirname])
                if dirpath not in filesystem:
                    raise KeyError('Unknown directory ({})'.format(dirpath))
                print('moving up to {}'.format(dirpath))
                cwd.append(dirname)
                filesystem[dirpath] = {
                    'type': 'directory',
                    'size': 0}
        elif full_session[i][:4] == '$ ls':
            print('Listing dir {}:'.format(path(cwd)))
            i += 1
            while i < len(full_session) and full_session[i][0] != '$':
                print(full_session[i])
                # process line
                chunks = full_session[i].split(' ')
                if chunks[0] == 'dir':
                    dirpath = path(cwd + [chunks[1]])
                    filesystem[dirpath] = {
                        'type': 'directory',
                        'size': 0}
                else:
                    filepath = path(cwd + [chunks[1]])
                    filesystem[filepath] = {
                        'type': 'file',
                        'size': int(chunks[0])}
                i += 1
            continue
        else:
            print('Unknown format ({}) on line {}'.format(full_session[i], i))
        i += 1

    file_paths = [k for k in filesystem if filesystem[k]['type'] == 'file']
    file_paths.sort(key=cmp_to_key(sort_paths), reverse=True)
    pp.pprint(file_paths)

    dir_paths = [k for k in filesystem if filesystem[k]['type'] == 'directory']
    dir_paths.sort(key=cmp_to_key(sort_paths), reverse=True)
    pp.pprint(dir_paths)

    pp.pprint(filesystem)

    for p in file_paths:
        chunks = p.split('/')
        # remove trailing filename to get path to parent directory
        chunks.pop()
        parent_path = '/'
        if 1 < len(chunks):
            parent_path = '/'.join(chunks)
        filesystem[parent_path]['size'] += filesystem[p]['size']

    threshold = 100000
    small_dirpaths = []
    total_du = 0
    for p in dir_paths:
        if filesystem[p]['size'] <= threshold:
            small_dirpaths.append(p)
            total_du += filesystem[p]['size']
        if p != '/':
            chunks = p.split('/')
            # remove trailing filename to get path to parent directory
            chunks.pop()
            parent_path = '/'
            if 1 < len(chunks):
                parent_path = '/'.join(chunks)
            filesystem[parent_path]['size'] += filesystem[p]['size']

    pp.pprint(filesystem)

    print('Found {} small directories with total disk usage: {}'.format(
        len(small_dirpaths), total_du))



