# -*- coding: utf-8 -*-
import argparse
import re
from os.path import basename
from yaml import load, dump
from datetime import date, datetime
from model import Issue, connection


def read_post(filename):
    with open(filename) as f:
        content = f.read().decode('utf8')
        front_matter = load(content.split('---')[1])
        content = content.split('---')[2]
        paragraphs = content.split('\n\n')
        slug = re.findall(r'\d{4}-\d{2}-\d{2}-(.*).md', basename(filename))[0]

    db_handler = connection[Issue.__database__][Issue.__collection__]
    front_matter['date'] = datetime.combine(front_matter['date'], datetime.min.time())
    content_data = dict(
        content=content,
        paragraphs=paragraphs,
        slug=slug
    )
    doc = db_handler.Issue.find_one({'date': front_matter['date']})
    if doc is not None:
        print 'update'
        doc.update(**front_matter)
        doc.update(**content_data)
        doc.save()
    else:
        print 'save'
        issue = db_handler.Issue(front_matter)
        issue.update(**content_data)
        print issue.save()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('filename', help='post filename')
    args = parser.parse_args()
    read_post(args.filename)
