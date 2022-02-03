tar --exclude='./api/venv' --exclude='api/__pycache__'  --exclude='api/flask_session' --exclude='./api/.pytest_cache' --exclude='*__pycache__*' -zcvf api.tar.gz api/
tar -zcvf build.tar.gz build/