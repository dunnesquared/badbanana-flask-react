"""Adapted from Flask tutorial
https://flask.palletsprojects.com/en/2.0.x/tutorial/factory/
"""

from flask import Flask


def create_app(test_config=None):
    print("APP CREATED!!")
    app = Flask(__name__)

    # Not a great secret...
    app.config.from_mapping(SECRET_KEY='super-secret-key')

    # To avoid console warnings caused by proxy requests made in client.
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_SAMESITE='None'
    )

    if test_config:
        app.config.from_mapping(test_config)

    # Make sure app can access the api routes.
    from api import game_api
    app.register_blueprint(game_api.bp)

    return app
