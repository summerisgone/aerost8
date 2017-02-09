# -*- coding: utf-8 -*-
from argparse import ArgumentParser
from os.path import join, basename
import requests

def main(outdir):
    for issue in range(0, 650):
        url = 'http://aquarium.ru/misc/aerostat/aerostat{0}.html'.format(str(issue).zfill(2))
        response = requests.get(url)
        if response.status_code == 200:
            with open(join(outdir, basename(url)), 'w') as f:
                f.write(response.content.decode('koi8-r').encode('utf8'))
        print '{0} - {1}'.format(issue, response.status_code)

if __name__ == '__main__':
    parser = ArgumentParser(description='Download all pages to out folder')
    parser.add_argument('folder', type=str, help='Output folder')
    args = parser.parse_args()
    main(args.folder)
