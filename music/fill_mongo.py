# -*- coding: utf-8 -*-
import datetime
import json
import re
import argparse
from os.path import join, basename
from glob import glob
from pymongo import MongoClient

MONGO_CONNECTION = 'localhost:27017'
MONGO_DBNAME = 'aerost8'
MONGO_COLLECTION = 'issues'

client = MongoClient(MONGO_CONNECTION)

def process_track(line):
    time, track_no, name = re.match('^([0-9.]+)\s(\d{1,3})\s?-{1,3}\s?(.*).mp3$', line).groups()
    return {
        'time': float(time),
        'order': int(track_no),
        'title': name
    }

def main(txt_folder):
    collection = client[MONGO_DBNAME][MONGO_COLLECTION]
    for filename in glob(join(txt_folder, '*.txt')):
        with open(filename, 'r') as f:
            content = f.read().decode('utf8')
            issue, slug = re.search('(\d{3})-(.*)\.txt', filename).groups()
            tracks = [process_track(t) for t in content.splitlines()]

            collection.find_one_and_update({
                'issue': int(issue)
            }, {
                '$set': {
                    'tracks': tracks,
                    'url': 'http://aerost8.s3.eu-central-1.amazonaws.com/{0}'.format(basename(filename).replace('.txt', '.mp3')),
                    'slug': slug
                }
            })
            print '{0} updated'.format(issue)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('folder', help='folder with txt files')
    args = parser.parse_args()
    main(args.folder)
