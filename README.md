# 🍌 Bad Banana: Math Game (ReactJS version, Alpha release) 🙈

## About the game

Bad Banana is a simple game that allows you to practice your mental math. Try to answer as many arithmetic questions as possible before losing all your lives!

This version of Bad Banana uses the `badbanana` package originally purposed for the
[original CLI-version of the game](https://github.com/dunnesquared/badbanana). Additional game-logic happens in the `api.game_api` module.

Python 3 and Flask 2 were used for the backend; ReactJS was used for the frontend.

![Game gif](https://media.giphy.com/media/z6hrMCGheUQfU36DiF/giphy.gif)

## Motivation

I wanted to learn a frontend framework/library, and React seemed like a good choice given its popularity. There was definitely a learning curve from having worked primarily in Python, but I got something to clunk away (I hope!).

## How to play

### From the demo
You can play online [here](https://mathwoods.pythonanywhere.com)!

### From source
I highly recommend cloning this repository. You should have `Node.js`, `yarn`, and at least `Python 3.8.5` installed on your machine.

In the project-root directory, run `npm install`. This should install 
all the JS dependencies for the project. 

Inside the `api` folder, create a virtual environment using `venv`. Once you've activated your virtual environment, run `pip3 install requirements.txt` to download all the necessary Python packages for the backend.

You should be good at this point to get the project running. To start the Flask server, 
run `yarn start-api`. To start the React client, run `yarn start`. Open `localhost:3000` in a browser. Happy math-ing!

### From Docker
I'm currently learning the basics of Docker. I hope to have a Docker image on Docker Hub for this project soon!

### Automated tests
I used `pytest` for unit testing. To run the tests, make sure you're in the `api` folder. Once there, run `pytest test_api.py`.

I have yet to write any frontend tests. 

### Safari issue
I'm having proxy issues in Safari that make the game non-functional. I have yet to look into the problem deeply to see whether there's something wrong with my configuration or something more generally amiss. As such, I developed this app on Firefox and Chrome, and it ran well on both. Hopefully, either of those browsers will work for you, too. 

## Special Thanks
As with all projects, I've been the beneficiary of a multitude of online resources, but there were two in particular that helped me out the most for Bad Banana. 
- Miguel Grinberg's tutorial: [How to Create a React + Flask Project](https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project)
- Maximilian Schwarzmüller's Udemy course: [React - The Complete Guide](https://www.udemy.com/course/react-the-complete-guide-incl-redux/?src=sac&kw=React+-+The+Comple)

Some of you might recognize the leopard background from Season 1 of Mike White's [The White Lotus](https://www.hbo.com/the-white-lotus). If you haven't seen it yet, what are you waiting for??

## About the author
Read [here](https://dunnesquared.github.io).