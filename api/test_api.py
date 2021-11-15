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


def test_get_score_lives_newgame(client):
    rv = client.get('api/score-lives', follow_redirects=True)
    json_data = rv.get_json()
    assert json_data['score'] == 0 and json_data['lives'] == 3
