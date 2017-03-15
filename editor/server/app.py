from flask import Flask, request, jsonify
from polyglot.text import Text
from polyglot.detect import Detector
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def analyze():
    if request.method == 'GET':
        return '''
        <h1>Usage</h1>
        <code>curl -XPOST http://localhost:5000 -H "Content-Type: text/plain; charset=UTF-8" --data-ascii "Australia posted a World Cup record total of 417-6 as they beat Afghanistan by 275 runs."</code>'''
    if request.method == 'POST':
        text = Text(request.data)
        result = []
        cur = 0
        for entity in text.entities:
            result.append({'text': ' '.join(text.words[cur:entity.start])})
            result.append({'entity': entity.tag, 'text': ' '.join(text.words[entity.start:entity.end])})
            cur = entity.end
        result.append({'text': ' '.join(text.words[cur:])})
        return jsonify({'result': result})

if __name__ == "__main__":
    app.run()