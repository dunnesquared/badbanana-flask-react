import random
from typing import Dict

from flask import Blueprint, session, request

from .badbanana.game import Game
from .badbanana.player import Player
from .badbanana.question.questions import IntegerQuestion


bp = Blueprint("api", __name__)

INITIAL_SCORE = 0
INITIAL_LIVES = 3


@bp.get('/api/hello')
def hello():
    return {"msg": "hello, world"}


@bp.get('/api/new-game')
def new_game():
    """Resets score and lives back to their starting values if needed. returns current score
    and lives regardless."""
    score = session.get('score', None)
    lives = session.get('lives', None)
    if score != INITIAL_SCORE or lives != INITIAL_LIVES:
        session['score'] = INITIAL_SCORE
        session['lives'] = INITIAL_LIVES
    return {'score': session['score'], 'lives': session['lives']}


@bp.get('/api/score-lives')
def get_score_lives():
    """Gets player's current score and number of lives remaining."""
    if not (session.get('score', None) and session.get('lives', None)):
        session['score'] = INITIAL_SCORE
        session['lives'] = INITIAL_LIVES
    return {'score': session['score'], 'lives': session['lives']}


@bp.post('/api/question')
def generate_question() -> Dict:
    """Gets a random arithmetic question."""
    if not (request_data := request.get_json()):
        return {
            'success': False,
            'err_message': "No payload with request."
        }, 500

    # Parse JSON data from request.
    try:
        question_type = request_data['questionType']
        lowerbound = int(request_data['smallestNumber'])
        upperbound = int(request_data['largestNumber'])

        # Default player required if you're going to instantiate a Game object.
        game = Game(player=None)

        # Set up question parameters.
        game.set_question_bounds(lowerbound, upperbound)

        # Allow the user to generate a question with a randomly-selected arithmetic operator
        if question_type.strip().lower() == 'any':
            question_type = random.choice(list(game.get_valid_operations()))

        game.set_question_type(question_type)
        question = game.get_random_question()

        # Serializes object into a dict so it is JSON serializable
        session['question'] = question.__dict__
        return {
            'success': True,
            'question': str(question),
            'operand1': question.operand1,
            'operand2': question.operand2,
            'operator': question.operator,
            'answer': question.answer,
        }, 201
    except (AssertionError, ValueError, TypeError) as e:
        return {
            'success': False,
            'err_message': str(e)
        }, 500


@bp.post('/api/answer')
def submit_answer() -> Dict:
    # Only use this if you want generate a new question
    qdata = session.get('question', None)

    # Retrieve user answer
    request_data = request.get_json()
    user_answer = int(request_data['user_answer'])

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
        'score': session['score'],
        'new_game': False
    }
