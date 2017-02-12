# -*- coding: utf-8 -*-
import datetime
from os.path import join
import argparse
import yaml
from slugify import slugify
from model import Issue, connection

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

def html_unescape(text):
    for k, v in html_escape_table.iteritems():
        text = text.replace(v, k)
    return text

def main(out_folder):
    db_handler = connection[Issue.__database__][Issue.__collection__]
    for issue in db_handler.Issue.find({}):
        long_ps = [p for p in issue.get('paragraphs') if len(p) > 80]
        data = dict(
            date=issue['date'].strftime('%Y-%m-%d'),
            slug=slugify(html_unescape(issue.get('title', None))),
            title=issue.get('title', None),
            url=issue.get('url', ''),
            track='track: "{0}"\n'.format(issue.get('track')) if issue.get('track') else '',
            issue=issue.get('issue', None),
            content='\n\n'.join([p.strip() for p in issue['paragraphs'] if len(p)]),
            excerpt=long_ps[0] if long_ps else issue.get('paragraphs')[0],
            # cue=yaml.dump(issue.get('tracks', None)),
        )
        with open(join(out_folder, FILENAME.format(**data)), 'w') as f:
            # print type(CONTENT.format(**data))
            f.write(CONTENT.format(**data).encode('utf8'))
        # print data['title']

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('folder', help='out folder')
    args = parser.parse_args()
    main(args.folder)
