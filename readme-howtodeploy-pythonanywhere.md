# How to deploy Bad Banana on pythonanywhere after changes have been made.

0. To build React app, type `yarn build`. You'll probably need to do this every time you update
the app. 
1. You need the following files and folder uploaded to pythonanywhere: `.flaskenv`, `build/` and 
`api/`. Theses last two are directories, so you can only upload them if they're archived and zip. 
Use the `zip-uploads.sh` as a fast way to do this. 
2. Once the zipped archives are uploaded, open up a console and extract: `tar -xzvf file.tar.gz`.
3. As you've already setup the folders and the environment in pythonanywhere, there shouldn't be
any issues after this point. 