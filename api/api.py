from flask import Flask

app = Flask(__name__)

@app.route('/api/hello')
def hello():
    return {"msg": "hello, world"}