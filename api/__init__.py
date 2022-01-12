"""Package that runs Flask backend for Bad Banana game."""

from flask import Flask


def create_app(test_config=None):
    """Factory function that creates and sets up Flask application. Returns Flask class instance. 

    Pass test_config argument to configure app for use in testing environment.
    See test_api.py for an example.

    Adapted from tutorial: https://flask.palletsprojects.com/en/2.0.x/tutorial/factory/
    """

    app = Flask(__name__)

    # Not a great secret key. Okay when in development, but should be initialized
    # and hidden inside an environment variable in production code.
    app.config.from_mapping(SECRET_KEY='super-secret-key')

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

    return app
