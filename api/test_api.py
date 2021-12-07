import pytest

from api import create_app


@pytest.fixture
def client():
    app = create_app({'TESTING': True})

    with app.test_client() as client:
        with app.app_context():
            pass
        yield client


# To test that pytest setup works.
def test_hello(client):
    rv = client.get('/api/hello')
    json_data = rv.get_json()
    assert "hello, world" == json_data['msg']


def test_newgame(client):
    rv = client.get('/api/new-game', follow_redirects=True)
    json_data = rv.get_json()
    assert json_data['score'] == 0 and json_data['lives'] == 3


def test_score_lives_init(client):
    rv = client.get('api/score-lives', follow_redirects=True)
    json_data = rv.get_json()
    assert json_data['score'] == 0 and json_data['lives'] == 3


def test_generate_question_success(client):
    """
    question_type = request_data['questionType']
    lowerbound = int(request_data['smallestNumber'])
    upperbound = int(request_data['largestNumber'])
    """
    qtype = 'Multiplication'
    nsmallest = 1
    nlargest = 1000
    payload = {
        'questionType': qtype,
        'smallestNumber': nsmallest,
        'largestNumber': nlargest,
    }
    rv = client.post('/api/question', json=payload)
    json_data = rv.get_json()

    # Test success
    assert rv.status_code == 201
    assert json_data['success'] == True

    # Test existence of data,
    assert 'question' in json_data
    assert 'operand1' in json_data
    assert 'operand2' in json_data
    assert 'operator' in json_data
    assert 'answer' in json_data

    # Test value bounds.
    assert nsmallest <= json_data['operand1'] <= nlargest
    assert nsmallest <= json_data['operand2'] <= nlargest

    # Test whether operator is valid.
    assert json_data['operator'] in {'+', '*', '/', '-'}

    # Test whether provided answer is correct
    assert json_data['answer'] == eval(json_data['question'])


PARAMETERS = [
    ("{}", False),
    ("{'questionType': None, 'smallestNumber': None, 'largestNumber': None,}", False),
    ("{'questionType': 'badtype', 'smallestNumber': 5, 'largestNumber': 10,}", False),
    ("{'questionType': 'Division', 'smallestNumber': 'x', 'largestNumber': 10,}", False),
    ("{'questionType': 'Division', 'smallestNumber': 1000, 'largestNumber': 1,}", False),
]


@pytest.mark.parametrize("test_input, expected", PARAMETERS)
def test_generate_question_failure(client, test_input, expected):
    payload = eval(test_input)
    rv = client.post('/api/question', json=payload)
    json_data = rv.get_json()
    assert rv.status_code == 500
    assert json_data['success'] == expected


def test_submit_answer_good_data(client):
    # Start new game
    rv = client.get('/api/new-game', follow_redirects=True)
    json_data = rv.get_json()
    assert json_data['score'] == 0 and json_data['lives'] == 3

    # Generate question.
    qtype = 'Multiplication'
    nsmallest = 5
    nlargest = 5
    payload = {'questionType': qtype,
               'smallestNumber': nsmallest, 'largestNumber': nlargest, }
    rv = client.post('/api/question', json=payload)
    json_data = rv.get_json()
    assert rv.status_code == 201
    assert json_data['success'] == True

    # Answer the question.
    payload = {'user_answer': 25}
    rv = client.post('/api/answer', json=payload)
    json_data = rv.get_json()
    assert rv.status_code == 201
    assert json_data['success'] == True
    assert json_data['answer_correct'] == True
    assert json_data['answer'] == 25
    assert json_data['game_over'] == False
    assert json_data['lives'] == 3
    assert json_data['score'] == 1
    assert json_data['new_game'] == False

    
    
    


