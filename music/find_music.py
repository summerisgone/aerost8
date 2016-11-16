# -*- coding: utf-8 -*-
import argparse
import requests
import musicbrainzngs as m


def itunes(query):
    r = requests.get('https://itunes.apple.com/search', params=dict(
        term=query,
        media='music',
        limit=1
    ))
    data = r.json()['results'][0]
    return dict(
        artist=data['artistName'],
        track_name=data['trackName'],
        coverUrl=data['artworkUrl100'],
        genre=data['primaryGenreName'],
    )

def musicbrainz(query):
    m.set_useragent('application', '0.01', 'http://example.com')
    rec = m.search_recordings(query=query, limit=1)['recording-list'][0]
    release_id = rec['release-list'][0]['id']

    return dict(
        artist_name=rec['artist-credit-phrase'],
        length=rec['length'],
        title=rec['title'],
        release=release_id
    )

def main(query):
    for source in [itunes, musicbrainz]:
        data = source(query)
        print '---' + source.__name__ + '---'
        from pprint import pprint
        pprint(data)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('query', help='Name of track')
    args = parser.parse_args()
    main(args.query)
