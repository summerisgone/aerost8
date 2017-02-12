# -*- coding: utf-8 -*-
from mongokit import Document, Connection
from datetime import datetime
import os

MONGO_DBNAME = 'aerost8'
MONGO_COLLECTION = 'issues'
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhsot:27017/aerost8')
connection = Connection(MONGO_URI)

@connection.register
class Issue(Document):
    __collection__ = MONGO_COLLECTION
    __database__ = MONGO_DBNAME
    use_schemaless = True
    structure = {
        'issue': int,
        'content': basestring,
        'paragraphs': [basestring],
        'excerpt': basestring,
        'slug': basestring,
        'title': basestring,
        'date': datetime,
        'track': basestring,
        'tracks': [{
            'order': int,
            'start': float,
            'end': float,
            'artist': basestring,
            'title': basestring,
            'coverUrl': basestring,
            'release': basestring,
            'uid': basestring,
            'provider': basestring
        }]
    }
    required_fields = ['date', 'slug', 'issue', 'title']
