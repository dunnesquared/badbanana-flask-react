import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
// import './App.css';

import Title from "./components/Title/Title";
import Instructions from "./components/Instructions/Instructions";
import Question from "./components/Question/Question";
import AnswerForm from "./components/Answer/AnswerForm";
import AnswerResult from "./components/Answer/AnswerResult";
import ScoreLives from "./components/ScoreLives/ScoreLives";
import NewGame from "./components/Controls/NewGame";
import GameOver from "./components/GameOver/GameOver";

function App() {
  // App title
  const title = "Ahoj! Welcome to Bad Banana💩🍌!";

  // Required to get data from AnswerForm component to ScoreLives ScoreComponentt
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(0);
  const [answerCorrect, setAnswerCorrect] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [answer, setAnswer] = useState("");
  const [newGame, setNewGame] = useState(true);

  const updateGameState = (gameStateData) => {
    // Debugging
    console.log(gameStateData);

    setScore(gameStateData.score);
    setLives(gameStateData.lives);
    setAnswerCorrect(gameStateData.correct_answer);
    setGameOver(gameStateData.game_over);
    setAnswer(gameStateData.answer);
    setNewGame(gameStateData.new_game);
  };

  const updateNewGameToFalse = () => {
    console.log("fgfdgfdgdf");
    setNewGame(false);
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
      <Question
        newGame={newGame}
        onUpdateNewGameToFalse={updateNewGameToFalse}
      />
      <AnswerForm
        onUpdateGameState={updateGameState}
        newGame={newGame}
        onUpdateNewGameToFalse={updateNewGameToFalse}
      />
      <AnswerResult answerCorrect={answerCorrect} answer={answer} />
      <hr></hr>
      <ScoreLives score={score} lives={lives} />
      {gameOver && <GameOver />}
      <hr></hr>
      <NewGame onUpdateGameState={updateGameState} />
    </div>
  );
}

export default App;
