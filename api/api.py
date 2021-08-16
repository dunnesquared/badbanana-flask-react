from typing import Dict
from flask import Flask, session, request

from badbanana.game import Game
from badbanana.player import Player
from badbanana.question.questions import IntegerQuestion

app = Flask(__name__)

app.secret_key = "super-secret-key"

@app.route('/api/hello')
def hello():
    return {"msg": "hello, world"}

# Should be POST
@app.route('/api/player/<name>')
def create_player(name : str): 
    if not session.get('player', None):
        session['player'] = Player(name=name).__dict__
        return {'player': session['player'], 'success': True}, 201
    else:
        return {'success': False, 
                'message': "Player already exists.",
                'player': session['player']}


@app.route('/api/player')
def get_player_info() -> Dict:
    print("session in player", session)
    if session.get('player', None):
        return {'player': session['player']}
    return {'success': False, 'message': "Player does not exist."}, 404


@app.route('/api/question')
def get_question() -> Dict:
    game = Game(player=None)

    # Save question as a session object; required when user returns an answer
    question = game.get_random_question()

    print(question)

    # Serializes an object into a dict so it is JSON serializable
    session['question'] = question.__dict__

    print('session', session)

    return { 'question': str(question) }


# PUT 
@app.route('/api/answer', methods=['POST'])
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
        session['player']['score'] += 1
    else:
        session['player']['lives'] += -1
        if session['player']['lives'] == 0:
            game_over = True

    return {
            'correct_answer': correct_answer, 
            'answer': question.answer,
            'game_over': game_over,
            'lives': session['player']['lives'],
            'score': session['player']['score']
            }
    

# Set question type (name can be saved on stack), but will that work??