# -*- coding: utf-8 -*-
from pydub import AudioSegment
from argparse import ArgumentParser
from glob import glob
from os.path import join, basename
import re
from transliterate import translit


def main(path, title=None, number=None, out=None):
    issue = AudioSegment.empty()
    tracks = []
    for f in glob(join(path, '*.mp3')):
        issue += AudioSegment.from_mp3(f)
        tracks.append('{0} {1}'.format(issue.duration_seconds, basename(f)))

    issue_number = number or int(re.search('\d+', basename(path)).group(0))
    issue_number = str(issue_number).zfill(3)
    issue_title = title or re.search('\d+\s?-\s?(.*)', basename(path)).group(1)
    issue_title = translit(issue_title.decode('utf8'), 'ru', reversed=True)
    out_path = out or path
    issue.export(
        join(out_path, '{number}-{title}.mp3'.format(number=issue_number, title=issue_title)),
        format='mp3',
        tags={'album': 'Aerostat', 'artist': 'Boris Grebenshikov', 'track': issue_title},
        parameters=["-q:a", "0"]
    )
    with open(join(out_path, '{number}-{title}.txt'.format(number=issue_number, title=issue_title)), 'w') as f:
        f.write('\n'.join(tracks))

if __name__ == '__main__':
    parser = ArgumentParser(description='Concatenate songs -> single podcast file')
    parser.add_argument('folder', type=str, help='A folder with podcast')
    parser.add_argument('--title', type=str, help='Issue title')
    parser.add_argument('--number', type=int, help='Issue number')
    parser.add_argument('--out', type=str, help='Result folder')

    args = parser.parse_args()
    main(args.folder, args.title, args.number, args.out)
