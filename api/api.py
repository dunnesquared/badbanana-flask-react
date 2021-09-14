from typing import Dict
from flask import Flask, session, request

from badbanana.game import Game
from badbanana.player import Player
from badbanana.question.questions import IntegerQuestion

app = Flask(__name__)

app.secret_key = "super-secret-key"

# To avoid console warnings caused by proxy requests made in client.
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='None'
)

INITIAL_SCORE = 0
INITIAL_LIVES = 3


@app.get('/api/hello')
def hello():
    return {"msg": "hello, world"}


@app.get('/api/new-game')
def new_game():
    """Resets score and lives back to their starting values if needed. returns current score
    and lives regardless."""
    score = session.get('score', None)
    lives = session.get('lives', None)
    if score != INITIAL_SCORE or lives != INITIAL_LIVES:
        session['score'] = INITIAL_SCORE
        session['lives'] = INITIAL_LIVES
    return {'score': session['score'], 'lives': session['lives']}


@app.get('/api/score-lives')
def get_score_lives():
    """Gets player's current score and number of lives remaining."""
    if not (session.get('score', None) and session.get('lives', None)):
        session['score'] = INITIAL_SCORE
        session['lives'] = INITIAL_LIVES
    return {'score': session['score'], 'lives': session['lives']}


@app.post('/api/question')
def generate_question() -> Dict:
    """Gets a random arithmetic question."""

    # Parse JSON data from request
    request_data = request.get_json()
    question_type = request_data['questionType']
    lowerbound = int(request_data['smallestNumber'])
    upperbound = int(request_data['largestNumber'])
    print(question_type, lowerbound, upperbound)

    # Default player required if you're going to instantiate a Game object.
    game = Game(player=None)
    game.set_question_bounds(lowerbound, upperbound)
    game.set_question_type(question_type)
    question = game.get_random_question()
    
    # Serializes object into a dict so it is JSON serializable
    session['question'] = question.__dict__
    return {'question': str(question)}


@app.post('/api/answer')
def submit_answer() -> Dict:
    # Only use this if you want generate a new question
    print(session)
    qdata = session.get('question', None)

    # Retrieve user answer
    request_data = request.get_json()
    print(request_data)
    user_answer = int(request_data['user_answer'])

    # DEBUG
    print(qdata)
    print(user_answer)

    # This won't work for division questions.
    question = IntegerQuestion(operand1=qdata['operand1'], operand2=qdata['operand2'],
                               operator=qdata['operator'])

    # Need to deserialize dict back into object to do actual checking
    if not question:
        return {'message': 'No question asked.'}

    correct_answer = question.check_answer(user_answer)
    game_over = False
    if correct_answer:
        session['score'] += 1
    else:
        session['lives'] -= 1
        if session['lives'] == 0:
            game_over = True

    return {
        'correct_answer': correct_answer,
        'answer': question.answer,
        'game_over': game_over,
        'lives': session['lives'],
        'score': session['score']
    }
