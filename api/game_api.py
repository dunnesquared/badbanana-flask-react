import random
from typing import Dict

from flask import Blueprint, session, request

from .badbanana.game import Game
from .badbanana.question.questions import IntegerQuestion, DivisionQuestion


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
            'question_type': question_type,
        }, 201
    except (AssertionError, ValueError, TypeError) as e:
        return {
            'success': False,
            'err_message': str(e)
        }, 500


@bp.post('/api/answer')
def submit_answer() -> Dict:
    # Retrieve user answer
    if not (request_data := request.get_json()):
        return {
            'success': False,
            'err_message': "No payload with request."
        }, 500

    # Retrieve question from session. Return error if question never asked.
    if not (qdata := session.get('question', None)):
        return {
            'success': False,
            'err_message': "No question in session memory."
        }, 500

    try:
        # Fetch answer/quotient.
        user_answer1 = int(request_data['user_answer1'])

        # Because integer division returns a quotient and remainder.
        # the operation needs to be handled differently from other arithmetic.
        is_division_question = request_data['is_division_question']

        # An absence for a value should be taken to be the same as False.
        if is_division_question is None:
            raise ValueError("is_division_question cannot be None.")

        if is_division_question is False:
            # Current design allows for the unwanted scenario of saying the answer
            # data is not for a division question, even if a division question
            # was indeed the one asked by the server.
            if qdata['operator'] == '//':
                raise ValueError("Conflict: is_division_question is False, but question in"
                                 "session memory is division question.")

            question = IntegerQuestion(operand1=qdata['operand1'], operand2=qdata['operand2'],
                                       operator=qdata['operator'])
            answer_correct = question.check_answer(user_answer1)
        else:
            # Same principle as above.
            if qdata['operator'] != '//':
                raise ValueError("Conflict: is_division_question is True, but question in"
                                 "session memory is a non-division question.")

            # Fetch remainder.
            user_answer2 = int(request_data['user_answer2'])
            question = DivisionQuestion(
                operand1=qdata['operand1'], operand2=qdata['operand2'])
            answer_correct = question.check_answer(user_answer1, user_answer2)

        # Check answer; manage score.
        game_over = False
        if answer_correct:
            session['score'] += 1
        else:
            session['lives'] -= 1
            if session['lives'] == 0:
                game_over = True

        # Send back response.
        return {
            'success': True,
            'answer_correct': answer_correct,
            'answer': question.get_right_answer(),
            'game_over': game_over,
            'lives': session['lives'],
            'score': session['score'],
            'new_game': False
        }, 201

    except (AssertionError, ValueError, TypeError) as e:
        print(f"Exception raised: {str(e)}")
        return {
            'success': False,
            'err_message': str(e)
        }, 500
