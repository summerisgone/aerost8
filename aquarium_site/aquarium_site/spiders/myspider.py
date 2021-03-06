# -*- coding: utf-8 -*-
import scrapy
import re
import datetime
from html2text import HTML2Text
from bs4 import BeautifulSoup


def parse_month(source):
    source = source.lower()
    if u'января' in source:
        return 1
    elif u'февраля' in source:
        return 2
    elif u'марта' in source:
        return 3
    elif u'апреля' in source:
        return 4
    elif u'мая' in source:
        return 5
    elif u'июня' in source:
        return 6
    elif u'июля' in source:
        return 7
    elif u'августа' in source:
        return 8
    elif u'сентября' in source:
        return 9
    elif u'октября' in source:
        return 10
    elif u'ноября' in source:
        return 11
    elif u'декабря' in source:
        return 12
    raise ValueError

def parse_date(source):
    match = re.search(r'(\d{1,2}\s*\w+\s*\d{4})', source, re.MULTILINE | re.UNICODE)
    if match:
        match2 = re.search(r'(\d{1,2})\s*(\w+)\s*(\d{4})', match.group(), re.MULTILINE | re.UNICODE)
        if match2:
            day, month, year = match2.groups()
            return datetime.datetime(int(year), parse_month(month), int(day))
    raise ValueError


def trim_inside(soup):
    return [re.sub('\s+', ' ', p) for p in soup]

def remove_ws(s):
    return re.sub('\s+', ' ', s.strip())

class MyspiderSpider(scrapy.Spider):
    name = "issues"
    allowed_domains = ["localhost:8000"]
    start_urls = [
        'http://localhost:8000/aerostat{0}.html'.format(str(i).zfill(2))
        for i in range(1,600)
    ]

    def debug_print(self, response):
        data = self.parse(response).next()
        for p in data['paragraphs']:
            print '*', p

    # in debugger: spider.parse(response).next()
    def parse(self, response):
        soup = BeautifulSoup(response.text, 'lxml')
        body = soup.findAll('table')[0].tr.td
        header = body.findAll('p')[0].text
        issue_date = parse_date(header.split(',')[-1])
        issue_name = header.rsplit(',', 1)[0]
        issue_number = int(re.findall('(\d+)\.html', response.url)[0])
        ps = response.xpath('//body//center//table[not(@id)]//text()').extract()
        paragraphs = filter(lambda p: p.strip(), ps)

        # If paragraph is less than 100 chars, it's track name
        yield {
            'paragraphs': [remove_ws(p) for p in paragraphs if p.strip()][2:],
            'name': remove_ws(issue_name),
            'date': issue_date,
            'issue': issue_number
        }
