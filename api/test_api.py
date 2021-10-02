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