import os

from functools import cmp_to_key
from pprint import PrettyPrinter


pp = PrettyPrinter(indent=2)


DISK_SIZE =         70000000
MIN_FREE_SPACE =    30000000


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


def sort_paths_by_depth(a, b):
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
    print('Day 7.1 - Clean up temp files')

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
    file_paths.sort(key=cmp_to_key(sort_paths_by_depth), reverse=True)
    #pp.pprint(file_paths)

    dir_paths = [k for k in filesystem if filesystem[k]['type'] == 'directory']
    dir_paths.sort(key=cmp_to_key(sort_paths_by_depth), reverse=True)
    #pp.pprint(dir_paths)

    pp.pprint(filesystem)

    total_du = 0
    for p in file_paths:
        total_du += filesystem[p]['size']
        chunks = p.split('/')
        # remove trailing filename to get path to parent directory
        chunks.pop()
        parent_path = '/'
        if 1 < len(chunks):
            parent_path = '/'.join(chunks)
        filesystem[parent_path]['size'] += filesystem[p]['size']

    # print('----')
    # print('Total usage: {}'.format(total_du))
    # print('Must free up at least: {}'.format((total_du - MIN_FREE_SPACE)))
    # print('----')

    candidates = []
    target_path = '/'
    target_du = total_du
    for p in dir_paths:
        if p == '/':
            continue
        if MIN_FREE_SPACE <= (DISK_SIZE - total_du + filesystem[p]['size']):
            candidates.append({ 'path': p, 'size': filesystem[p]['size'] })
            if filesystem[p]['size'] < target_du:
                target_path = p
                target_du = filesystem[p]['size']

        chunks = p.split('/')
        # remove trailing filename to get path to parent directory
        chunks.pop()
        parent_path = '/'
        if 1 < len(chunks):
            parent_path = '/'.join(chunks)
        # print('Adding {} storage from dir {} to parent dir {}'.format(
        #     filesystem[p]['size'], p, parent_path))
        filesystem[parent_path]['size'] += filesystem[p]['size']

    print('----')
    print('Total usage: {}'.format(total_du))
    print('Must free up at least: {}'.format((total_du - MIN_FREE_SPACE)))
    print('----')

    # for i in range(2, 6):
    #    paths_at_level = [p for p in dir_paths if len(p.split('/')) == i]
    #    paths_at_level.sort()
    #    maxlen = max([len(p) for p in paths_at_level])
    #    for p in paths_at_level:
    #        # https://docs.python.org/3.10/library/string.html#formatstrings
    #        # https://stackoverflow.com/a/3228928
    #        print('{path:<{maxlen}}  {size:>8}'.format(
    #            path=p, maxlen=maxlen, size=filesystem[p]['size']))


    print('----')
    pp.pprint(candidates)

    msg = 'Will delete directory {} to free up {} space, yielding {} free'
    print(msg.format(target_path, target_du, (DISK_SIZE - total_du + target_du)))



