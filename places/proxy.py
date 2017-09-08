# -*- coding: utf-8 -*-
from flask import Flask
from flask import request
from flask import Response
from flask import make_response
from flask import stream_with_context

import requests

app = Flask(__name__)

@app.route('/<path:url>')
def home(url):
    if request.method == 'OPTIONS':
        resp = make_response('')
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp
    req = requests.get(url, stream=True)
    return Response(
        stream_with_context(req.iter_content()),
        content_type=req.headers['content-type'],
        headers={'Access-Control-Allow-Origin': '*'}
    )

if __name__ == '__main__':
    app.run()