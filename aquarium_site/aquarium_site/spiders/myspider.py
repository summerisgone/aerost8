# -*- coding: utf-8 -*-
import scrapy
import re
from html2text import HTML2Text

class MyspiderSpider(scrapy.Spider):
    name = "issues"
    allowed_domains = ["aquarium.ru"]
    start_urls = [
        'http://aquarium.ru/misc/aerostat/aerostat{0}.html'.format(str(i).zfill(2))
        for i in range(1,600)
    ]

    def parse(self, response):
        ps = response.xpath("body//center//table[1]//tr//p//text()").extract()
        handler = HTML2Text(baseurl=response.url)
        handler.ignore_emphasis = True
        handler.ignore_links = True
        handler.ignore_images = True
        text = handler.handle(response.xpath('body//center//table[1]').extract_first())
        # If paragraph is less than 100 chars, it's track name
        yield {
            'paragraphs': text.split('\n\n'),
            'title': response.xpath('body//center//table[1]//tr[1]//p[1]//text()').extract_first(),
            'issue': int(re.findall('(\d+)\.html',  response.url)[0])
        }
