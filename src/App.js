import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.min.css";

import { Container, Row, Col } from "react-bootstrap";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";

import Title from "./components/Title/Title";
import Instructions from "./components/Instructions/Instructions";
import Question from "./components/Question/Question";
import AnswerForm from "./components/Answer/AnswerForm";
import AnswerResult from "./components/Answer/AnswerResult";
import ScoreLives from "./components/ScoreLives/ScoreLives";
import NewGame from "./components/Controls/NewGame";
import GameOver from "./components/GameOver/GameOver";
import Card from "./components/UI/Card";

import "./App.css";

function App() {
  // App title
  const title = "🍌 Ahoj! Welcome to Bad Banana! 🍌";

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
    setNewGame(gameStateData.new_game);
    setQuestionAnswered(gameStateData.questionAnswered);
    setUserAnswer(gameStateData.userAnswer);

    // Need to show both quotient and remainder for division questions.
    if (isDivisionQuestion) {
      const combinedAnswer = `Quotient: ${gameStateData.answer.quotient},\
        Remainder: ${gameStateData.answer.remainder}`;
      setAnswer(combinedAnswer);
    } else {
      setAnswer(gameStateData.answer);
    }
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
    <Container fluid>
      <Helmet>
        <style>
          {"body { background-color: cornflowerblue;" +
            "font-family: pt sans, Arial, Helvetica, sans-serif;}"}
        </style>
      </Helmet>
      
        <Row>
          <Col>
            <Title title={title} />
          </Col>
        </Row>
        {/* <Row>
          <Col>
            <Instructions />
          </Col>
        </Row> */}

        <Row>
          <Col>
            <Card className="app-card">
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
            </Card>
          </Col>
        </Row>
      </Container>
  );
}

export default App;
