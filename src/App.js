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
  const title = "Ahoj! Welcome to Bad Banana!";

  // Required to get data from AnswerForm component to ScoreLives ScoreComponentt
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(0);
  const [answerCorrect, setAnswerCorrect] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [answer, setAnswer] = useState("");
  const [newGame, setNewGame] = useState(true);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isDivisionQuestion, setIsDivisionQuestion] = useState(false);

  const updateGameState = (gameStateData) => {
    // Debugging
    console.log(gameStateData);

    setScore(gameStateData.score);
    setLives(gameStateData.lives);
    setAnswerCorrect(gameStateData.answer_correct);
    setGameOver(gameStateData.game_over);
    setAnswer(gameStateData.answer);
    setNewGame(gameStateData.new_game);
    setQuestionAnswered(gameStateData.questionAnswered);
    setUserAnswer(gameStateData.userAnswer);
  };

  const updateNewGameToFalse = () => {
    console.log("newGame set to false.");
    setNewGame(false);
  };

  const updateQuestionAnsweredToFalse = () => {
    console.log("questionAnswered set to false.");
    setQuestionAnswered(false);
  };

  const updateIsDivisionQuestion = (state) => {
    console.log(`isDivisionQuestion ${state}`);
    setIsDivisionQuestion(state);
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
      <ScoreLives score={score} lives={lives} />
      <Question
        newGame={newGame}
        onUpdateNewGameToFalse={updateNewGameToFalse}
        questionAnswered={questionAnswered}
        onUpdateQuestionAnsweredToFalse={updateQuestionAnsweredToFalse}
        gameOver={gameOver}
        onUpdateIsDivisionQuestion={updateIsDivisionQuestion}
      />
      {!questionAnswered && (
        <AnswerForm
          onUpdateGameState={updateGameState}
          newGame={newGame}
          isDivisionQuestion={isDivisionQuestion}
        />
      )}
      {questionAnswered && (
        <AnswerResult
          answerCorrect={answerCorrect}
          answer={answer}
          userAnswer={userAnswer}
        />
      )}
      {gameOver && <GameOver />}
      {gameOver && <NewGame onUpdateGameState={updateGameState} />}
    </div>
  );
}

export default App;
