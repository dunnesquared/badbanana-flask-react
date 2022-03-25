"""Bad Banana backend package

Package that runs Flask backend for Bad Banana game.
"""
import os
from flask import Flask


def create_app(test_config=None):
    """Factory function that creates and sets up Flask application. Returns Flask class instance. 

    Pass test_config argument to configure app for use in testing environment.
    See test_api.py for an example.

    Adapted from tutorial: https://flask.palletsprojects.com/en/2.0.x/tutorial/factory/
    """

    # app = Flask(__name__)
    app = Flask(__name__, static_folder='../build', static_url_path='/')

    # Place SECRET_KEY in .env file in top-level directory of project (same level as 
    # .flaskenv).
    app.config.from_mapping(SECRET_KEY=os.getenv('SECRET_KEY') or 'unsafe-production-key')

    # To avoid console warnings caused by proxy requests made in client.
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_SAMESITE='None'
    )

    # Pytest fixture will pass in a value to get an app instance that
    # suitable for testing purposes. See test_api.py.
    if test_config:
        app.config.from_mapping(test_config)

    # Make sure app can access the api routes.
    from api import game_api
    app.register_blueprint(game_api.bp)

    # Going to see whether this actually works...
    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    return app

# Load private environment variable from .env. This needs to be done
# before object is created.
from pathlib import Path
from dotenv import load_dotenv

path = Path('.')            # Get top-level path of project.
envpath = path / '.env'     # Similar to os.path.join()
load_dotenv(envpath)

app = create_app()