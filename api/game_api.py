"""This module provides access to API routes/views to requesting clients for Bad Banana game.

While modules from the badbanana package are used to generate questions and 
calculate/verify answers, the game_api module helps by doing the 'admin' work that
makes playing the game possible, such as keeping score and determining when users
have lost.

Client-side session cookies are used to maintain state. The downside of this is 
that it is possible to 'cheat' by inspecting a cookie for an answer. While storing 
data server-side would've been more secure, I could not get it to work properly 
(something to do with the proxy setup of this project...). Client-side
session cookies are not an ideal solution, but they are a reasonable one for this game—I 
would hope programmers have better uses of their time than hacking to find the answer for 
7 x 6.
"""

import random
from typing import Dict

from flask import Blueprint, session, request

from .badbanana.game import Game
from .badbanana.question.questions import IntegerQuestion, DivisionQuestion

# Need for Flask app object to register and access this module. See __init__.py.
bp = Blueprint("api", __name__)

# Change to make the game harder or easier!
INITIAL_SCORE = 0
INITIAL_LIVES = 3

# Keep this in here for quick-testing purposes. Remove if deploying app.
@bp.get('/api/hello')
def hello() -> Dict:
    return {"msg": "hello, world"}


@bp.get('/api/new-game')
def new_game() -> Dict:
    """Resets score and lives back to their starting values, if needed.
    
    Returns dict object containing current session values for score and lives. 
    """
    score = session.get('score', None)
    lives = session.get('lives', None)
    if score != INITIAL_SCORE or lives != INITIAL_LIVES:
        session['score'] = INITIAL_SCORE
        session['lives'] = INITIAL_LIVES
    return {'score': session['score'], 'lives': session['lives']}


@bp.get('/api/score-lives')
def get_score_lives() -> Dict:
    """Gets user's current score and number of lives remaining.
    
    Returns dict object containing current session values for score and lives.
    """
    if not (session.get('score', None) and session.get('lives', None)):
        session['score'] = INITIAL_SCORE
        session['lives'] = INITIAL_LIVES
    return {'score': session['score'], 'lives': session['lives']}


@bp.post('/api/question')
def generate_question() -> Dict:
    """Generates a random arithmetic question for user to answer based on sent parameters.
    
    Request payload:
    { 
        questionType: 'Multiplication' OR 'Division' OR 'Addition' OR 'Subtraction' OR 'Any'
        smallestNumber: 0 <= integer <= largestNumber
        largestNumber: integer >= smallestNumber 
    } 

    Response payload (if request successful):
    {
        'success': True,
        'question': str,
        'operand1': int,
        'operand2': int,
        'operator': '+' OR '-' OR '*' OR '/',
        'answer': int if not division question else {'quotient': int, 'remainder': int},
        'question_type': 'Multiplication' OR 'Division' OR 'Addition' OR 'Subtraction' OR 'Any'
    }, 201

    Response payload (if request failed):
    {
            'success': False,
            'err_message': str
    }, 500
    """

    # Parameters to generate a random question are missing.
    if not (request_data := request.get_json()):
        return {
            'success': False,
            'err_message': "No payload with request."
        }, 500

    # Parse JSON request data.
    try:
        question_type = request_data['questionType']
        lowerbound = int(request_data['smallestNumber'])
        upperbound = int(request_data['largestNumber'])

        # Don't require a Player object in this client/server implementation of Bad Banana:
        # storing Player object in session for score and lives just adds an unneeded layer 
        # of abstraction.
        game = Game(player=None)

        # Set up question parameters.
        game.set_question_bounds(lowerbound, upperbound)

        # Allow the user to generate a question with a randomly-selected arithmetic operator.
        if question_type.strip().lower() == 'any':
            question_type = random.choice(list(game.get_valid_operations()))

        # Generate a random question.
        game.set_question_type(question_type)
        question = game.get_random_question()

        # Serializes object into a dict so it is JSON serializable.
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
    """Checks user's answer and updates game state depending on its correctness.

   Request payload:
    { 
        questionType: 'Multiplication' OR 'Division' OR 'Addition' OR 'Subtraction' OR 'Any'
        smallestNumber: 0 <= integer <= largestNumber
        largestNumber: integer >= smallestNumber 
    } 

    Response payload (if request successful):
    {
        'success': bool,
        'answer_correct': bool,
        'answer': int if not division question else {'quotient': int, 'remainder': int},
        'game_over': bool,
        'lives': int,
        'score': int,
        'new_game': False
    }, 201

    Response payload (if request failed):
    {
            'success': False,
            'err_message': str
    }, 500
    """

    # Parameters to check user answer are missing.
    if not (request_data := request.get_json()):
        return {
            'success': False,
            'err_message': "No payload with request."
        }, 500

    # Question missing from session memory. 
    # This can happen if a question has yet to be generated or there are proxy problems.
    if not (qdata := session.get('question', None)):
        return {
            'success': False,
            'err_message': "No question in session memory."
        }, 500

    # Start process of checking user's answer.
    try:
        # Fetch answer/quotient.
        user_answer1 = int(request_data['user_answer1'])

        # Because integer division returns a quotient and remainder
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
