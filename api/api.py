from typing import Dict
from flask import Flask, session, request

from badbanana.game import Game
from badbanana.player import Player
from badbanana.question.questions import IntegerQuestion

app = Flask(__name__)

app.secret_key = "super-secret-key"

@app.get('/api/hello')
def hello():
    return {"msg": "hello, world"}


@app.get('/api/score-lives')
def get_score_lives():
    """Gets player's current score and number of lives remaining."""
    if not session.get('player', None):
        return {'success': False,  'message': "Player not created."}, 404
    else:
        return {
                'success': True, 
                'score': session['player']['score'],
                'lives': session['player']['lives']
                }

@app.get('/api/question')
def get_question() -> Dict:
    """Gets a random arithmetic question."""
    # Default player required if you're going to instantiate a Game object.
    game = Game(player=None)
    question = game.get_random_question()
    # Serializes object into a dict so it is JSON serializable
    session['question'] = question.__dict__
    return { 'question': str(question) }



