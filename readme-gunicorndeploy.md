# To test out deployment version of this app on gunicorn: 

0. Make sure you're in the build branch of your project. DO NOT MERGE IT WITH YOUR DEV BRANCH!!!
1. Make sure you've pip installed gunicorn. 
2. Run `gunicorn -b :3000 api:app`
3. Go to localhost:3000 in your browser and voila!