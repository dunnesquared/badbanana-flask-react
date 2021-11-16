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



    


