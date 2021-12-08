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


PARAMETERS = [
    # Test 1: Non-division question, right answer
    (str({'question_payload': {'questionType': 'Multiplication', 'smallestNumber': 5,
                               'largestNumber': 5},
          'answer_payload': {'user_answer1': 25, 'is_division_question': False}}),
        {'status_code': 201,
         'data': {
             'success': True,
             'answer_correct': True,
             'answer': 25,
             'game_over': False,
             'lives': 3,
             'score': 1,
             'new_game': False,
         }
         }),
    # Test 2: Division question, right answer
    (str({'question_payload': {'questionType': 'Division', 'smallestNumber': 5,
                               'largestNumber': 5},
          'answer_payload': {'user_answer1': 1, 'user_answer2': 0,
                             'is_division_question': True}}),
        {'status_code': 201,
         'data': {
             'success': True,
             'answer_correct': True,
             'answer': {'quotient': 1, 'remainder': 0},
             'game_over': False,
             'lives': 3,
             'score': 1,
             'new_game': False,
         }
         }),
    # Test 3: Non-division question, wrong answer
    (str({'question_payload': {'questionType': 'Addition', 'smallestNumber': 5,
                               'largestNumber': 5},
          'answer_payload': {'user_answer1': 11, 'is_division_question': False}}),
        {'status_code': 201,
         'data': {
             'success': True,
             'answer_correct': False,
             'answer': 10,
             'game_over': False,
             'lives': 2,
             'score': 0,
             'new_game': False,
         }
         }),
    # Test 4: Division question, wrong answer
    (str({'question_payload': {'questionType': 'Division', 'smallestNumber': 5,
                               'largestNumber': 5},
          'answer_payload': {'user_answer1': 0, 'user_answer2': 1,
                             'is_division_question': True}}),
        {'status_code': 201,
         'data': {
             'success': True,
             'answer_correct': False,
             'answer': {'quotient': 1, 'remainder': 0},
             'game_over': False,
             'lives': 2,
             'score': 0,
             'new_game': False,
         }
         }),
]


@pytest.mark.parametrize("test_input, expected", PARAMETERS)
def test_submit_answer_success(client, test_input, expected):
    # Start new game
    rv = client.get('/api/new-game', follow_redirects=True)
    json_data = rv.get_json()
    assert json_data['score'] == 0 and json_data['lives'] == 3

    # Generate question.
    payload = eval(test_input)['question_payload']
    rv = client.post('/api/question', json=payload)
    json_data = rv.get_json()
    assert rv.status_code == 201
    assert json_data['success'] == True

    # Answer the question.
    payload = eval(test_input)['answer_payload']
    rv = client.post('/api/answer', json=payload)
    json_data = rv.get_json()
    assert rv.status_code == expected['status_code']
    assert json_data == expected['data']


PARAMETERS = [
    # Test 1: No question generated.
    (str({'question_payload': {},
         'answer_payload': {'user_answer1': 11, 'is_division_question': False}}),
        {'status_code': 500,
         'data': {'success': False, 'err_message': "No question in session memory.", }
         }),
    # Test 2: Question generated but bad data passed.
    (str({'question_payload': {'questionType': 'Multiplication', 'smallestNumber': 5, 'largestNumber': 5},
         'answer_payload': {'user_answer1': 'fart', 'is_division_question': False}}),
        {'status_code': 500,
         'data': {'success': False}
         }),
    # Test 3: Question generated but bad data passed.
    (str({'question_payload': {'questionType': 'Division', 'smallestNumber': 5, 'largestNumber': 5},
         'answer_payload': {'user_answer1': 1, 'user_answer2': 'fart', 'is_division_question': True}}),
        {'status_code': 500,
         'data': {'success': False}
         }),
    # Test 4: Question generated but no data passed.
    (str({'question_payload': {'questionType': 'Division', 'smallestNumber': 5, 'largestNumber': 5},
         'answer_payload': None}),
        {'status_code': 500,
         'data': {'success': False}
         }),
    # Test 5: Pretending you're answering a non-division question when really it should be
    # a division question.
    (str({'question_payload': {'questionType': 'Division', 'smallestNumber': 5, 'largestNumber': 5},
         'answer_payload': {'user_answer1': 1, 'user_answer2': 0, 'is_division_question': False}}),
        {'status_code': 500,
         'data': {'success': False}
         }),
    # Test 6: Pretending you're answering a division question when really it's not.
    (str({'question_payload': {'questionType': 'Subtraction', 'smallestNumber': 5, 'largestNumber': 5},
         'answer_payload': {'user_answer1': 0, 'user_answer2': 0, 'is_division_question': True}}),
        {'status_code': 500,
         'data': {'success': False}
         }),
    # Test 7: Division question with missing answer data.
    (str({'question_payload': {'questionType': 'Division', 'smallestNumber': 5, 'largestNumber': 5},
         'answer_payload': {'user_answer1': 1, 'user_answer2': 0, 'is_division_question': None}}),
        {'status_code': 500,
         'data': {'success': False}
         }),
]


@pytest.mark.parametrize("test_input, expected", PARAMETERS)
def test_submit_answer_failure(client, test_input, expected):
    # Start new game
    rv = client.get('/api/new-game', follow_redirects=True)
    json_data = rv.get_json()
    assert json_data['score'] == 0 and json_data['lives'] == 3

    # Try submitting an answer if there in no question in session memory.
    if not eval(test_input)['question_payload']:
        payload = eval(test_input)['answer_payload']
        rv = client.post('/api/answer', json=payload)
        json_data = rv.get_json()
        assert rv.status_code == expected['status_code']
        assert json_data == expected['data']
    else:
        # Generate question.
        payload = eval(test_input)['question_payload']
        rv = client.post('/api/question', json=payload)
        json_data = rv.get_json()
        print(json_data)
        assert rv.status_code == 201
        assert json_data['success'] == True

        # Answer the question.
        payload = eval(test_input)['answer_payload']
        rv = client.post('/api/answer', json=payload)
        json_data = rv.get_json()
        print(json_data)
        assert rv.status_code == expected['status_code']
        assert json_data['success'] == expected['data']['success']
