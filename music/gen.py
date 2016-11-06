# -*- coding: utf-8 -*-
from pymongo import MongoClient
import datetime
from os.path import join
import argparse
import yaml

client = MongoClient()
MONGO_CONNECTION = 'localhost:27017'
MONGO_DBNAME = 'aerost8'
MONGO_COLLECTION = 'issues'
FILENAME = '{date}-{slug}.md'
CONTENT = u"""---
layout: post
title: "{title}"
issue: {issue}
date: {date}
track: "{url}"
---

{content}
"""

def main(out_folder):
    client = MongoClient(MONGO_CONNECTION)
    cur = client[MONGO_DBNAME][MONGO_COLLECTION]
    for issue in cur.find({}):
        data = dict(
            date=issue['date'].strftime('%Y-%m-%d'),
            slug=issue.get('slug', None),
            title=issue.get('name', None).replace('"', '&quot;'),
            url=issue.get('url', None),
            issue=issue.get('issue', None),
            content='\n\n'.join(issue['paragraphs']),
            cue=yaml.dump(issue.get('tracks', None))
        )
        with open(join(out_folder, FILENAME.format(**data)), 'w') as f:
            # print type(CONTENT.format(**data))
            f.write(CONTENT.format(**data).encode('utf8'))
        print data['title']

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('folder', help='out folder')
    args = parser.parse_args()
    main(args.folder)
