# -*- coding: utf-8 -*-
from pymongo import MongoClient
import datetime
from os.path import join
import argparse
import yaml
from slugify import slugify

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
excerpt: >
    {excerpt}
{track}---

{content}
"""

html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    ">": "&gt;",
    "<": "&lt;",
}

def html_escape(text):
    """Produces entities within text."""
    return "".join(html_escape_table.get(c,c) for c in text)

def main(out_folder):
    client = MongoClient(MONGO_CONNECTION)
    cur = client[MONGO_DBNAME][MONGO_COLLECTION]
    for issue in cur.find({}):
        long_ps = [p for p in issue.get('paragraphs') if len(p) > 80]
        data = dict(
            date=issue['date'].strftime('%Y-%m-%d'),
            slug=slugify(issue.get('name', None)),
            title=html_escape(issue.get('name', None)),
            url=issue.get('url', ''),
            track='' if not issue.get('url', None) else 'track: "{0}"\n'.format(issue.get('url')),
            issue=issue.get('issue', None),
            content='\n\n'.join(issue['paragraphs']),
            excerpt=long_ps[0] if long_ps else issue.get('paragraphs')[0],
            # cue=yaml.dump(issue.get('tracks', None)),
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
