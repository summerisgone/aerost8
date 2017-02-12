# Repository for managing podcast site aerostat

## Website
[![](https://raw.githubusercontent.com/summerisgone/aerost8/master/docs/public/icon.png) Website](http://aerostat.rocks/) is build with github pages, and set up in the ``docs`` folder in the master branch.

## Repository

Root folder should be considered as python project, aimed to generate and scrape
data for the website.


## Scraper

In aquarium_site folder run ``scrapy crawl issues -LINFO -o issues.json``

## How to set up content

1. Download all music from [here](https://rutracker.org/forum/viewtopic.php?t=4922999) or [here](https://rutracker.org/forum/viewtopic.php?t=4384724).
Music excpected to be organizaed as issue-per-folder, track-per-file.

2. Create python environment with all packages listed in requitements.txt.

3. Install ``ffmpeg`` software, it'll be used for encoding.

4. Run python script for each issue folder (~600 times):

    python music/concat.py --out <path-for-compiled-issues> <path-to-issue-folder>

You should have``123-issue-title.mp3`` and ``123-issue-title.txt`` files per each issue.

5. Cache text descriptions from official site. For that, run

    pushd aquarium_site
    python download_all_pages.py <cache-folder>
    popd

6. Serve local copy of aquarium_site with:

    cd <cache-folder>
    python -m SimpleHTTPServer

7. Set up local instance of [Mongo](http://www.mongodb.org/)

8. Collect data from cache to mongodb

    pushd aquarium_site
    scrapy crawl issues -LINFO
    popd

9. Extend database with track data from encoding. You'll need only txt's be there.

    python music/fill_mongo.py <path-for-compiled-issues>

10. Finally, generate posts:

    python music/gen.py docs/_posts


# Notepad for commands

Cut mp3 into tracks:

    ffmpeg -i 595.mp3 -af silencedetect=noise=-50dB:duration=0.1 -f null - 2> 595.txt 


Read data from markup

    find docs/_posts/ -name \*\.md -exec python music/reader.py '{}' \;

Generate data in posts from DB

    python music/gen.py docs/_posts/