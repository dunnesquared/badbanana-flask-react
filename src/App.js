import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
// import './App.css';

import Title from "./components/Title/Title";
import Instructions from "./components/Instructions/Instructions";
import Question from "./components/Question/Question";
import AnswerForm from "./components/Answer/AnswerForm";
import ScoreLives from "./components/ScoreLives/ScoreLives";
import PlayerStatus from "./components/PlayerStatus/PlayerStatus";

function App() {
  // App title
  const title = "Ahoj! Welcome to Bad Banana💩🍌!";

  let age = 40;
  console.log('my age', age);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(0);

  const updateScore = (currScore) => {
    setScore(currScore);
  };

  const updateLives = (currLives) => {
    setLives(currLives);
  };

  // Keep this as it fetches the lastest scores from the server
  // if the session is still alive.
  useEffect(() => {  
    fetch("/api/score-lives")
      .then((res) => res.json())
      .then((data) => {
        setScore(data.score);
        setLives(data.lives);
      });
  }, []);

  return (
    <div>
      <Title title={title} />
      <Instructions />
      <hr></hr>
      <Question />
      <hr></hr>
      <AnswerForm
        onUpdateScore={updateScore}
        onUpdateLives={updateLives}
      />
      <hr></hr>
      <ScoreLives score={score} lives={lives} />
    </div>
  );
}

export default App;
