import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.min.css";

import { Container, Row, Col, Button, Modal, Collapse } from "react-bootstrap";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";

import Title from "./components/Title/Title";
import Instructions from "./components/Instructions/Instructions";
import QuestionSettings from "./components/Question/QuestionSettings";
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
  const title = "🍌✖️  Welcome to Bad Banana! ➗🙈";

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
  const [questionData, setQuestionData] = useState(null);
  const [smallestNumber, setSmallestNumber] = useState(1);
  const [largestNumber, setLargestNumber] = useState(10);
  const [questionType, setQuestionType] = useState("Multiplication");

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
      const remainder =
        gameStateData.answer.remainder === 0
          ? ""
          : `R${gameStateData.answer.remainder}`;
      const combinedAnswer = `${gameStateData.answer.quotient} ${remainder}`;
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

  const updateQuestionData = (operand1, operand2, operator) => {
    console.log(`UpdateQuestionData ${operand1}`);
    setQuestionData({ operand1, operand2, operator });
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

  // Modal states and handlers
  const [showInstructions, setShowInstructions] = useState(false);
  const handleCloseInstructions = () => setShowInstructions(false);
  const handleShowInstructions = () => setShowInstructions(true);

  const [showSettings, setShowSettings] = useState(true);
  const handleCloseSettings = () => setShowSettings(false);
  const handleShowSettings = () => setShowSettings(true);

  const restartHandler = () => {
    const url = "api/new-game";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setScore(data.score);
        setLives(data.lives);
        window.location.reload();
      })
      .catch((error) => console.log("Restart Game Error", error));
  };

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

      <Modal show={showInstructions} onHide={handleCloseInstructions}>
        <Modal.Header closeButton>
          <Modal.Title>Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Instructions />
        </Modal.Body>
      </Modal>

      <Row>
        <Col className="text-center">
          <Button onClick={handleShowInstructions}>Instructions</Button>
        </Col>
        <Col className="text-center">
          <Button
            onClick={() => setShowSettings(!showSettings)}
            aria-controls="settings-collapse-form"
            aria-expanded={showSettings}
          >
            Settings
          </Button>
        </Col>
        <Col className="text-center">
          <Button onClick={restartHandler}>Restart</Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Collapse in={showSettings}>
            <div id="settings-collapse-form">
              <QuestionSettings
                newGame={newGame}
                onUpdateNewGameToFalse={updateNewGameToFalse}
                questionAnswered={questionAnswered}
                onUpdateQuestionAnsweredToFalse={updateQuestionAnsweredToFalse}
                gameOver={gameOver}
                onUpdateIsDivisionQuestion={updateIsDivisionQuestion}
                onUpdateQuestionData={updateQuestionData}
                onSetSmallestNumber={setSmallestNumber}
                onSetLargestNumber={setLargestNumber}
                onSetQuestionType={setQuestionType}
                onHandleCloseSettings={handleCloseSettings}
              />
            </div>
          </Collapse>
        </Col>
      </Row>

      <Row>
        <Col>
          {!newGame && (
            <Card className="app-card">
              <ScoreLives score={score} lives={lives} />

              <Card className="qa-card">
                {newGame === false && questionData !== null && (
                  <Question
                    questionData={questionData}
                    questionAnswered={questionAnswered}
                    gameOver={gameOver}
                    onUpdateQuestionAnsweredToFalse={
                      updateQuestionAnsweredToFalse
                    }
                    smallestNumber={smallestNumber}
                    largestNumber={largestNumber}
                    questionType={questionType}
                    onUpdateIsDivisionQuestion={updateIsDivisionQuestion}
                    onUpdateQuestionData={updateQuestionData}
                    answerCorrect={answerCorrect}
                    answer={answer}
                    userAnswer={userAnswer}
                  />
                )}
                {/* <QuestionSettings
              newGame={newGame}
              onUpdateNewGameToFalse={updateNewGameToFalse}
              questionAnswered={questionAnswered}
              onUpdateQuestionAnsweredToFalse={updateQuestionAnsweredToFalse}
              gameOver={gameOver}
              onUpdateIsDivisionQuestion={updateIsDivisionQuestion}
              onUpdateQuestionData={updateQuestionData}
            /> */}
                {!questionAnswered && (
                  <AnswerForm
                    onUpdateGameState={updateGameState}
                    newGame={newGame}
                    isDivisionQuestion={isDivisionQuestion}
                  />
                )}

                {/* {questionAnswered && (
                  <AnswerResult
                    answerCorrect={answerCorrect}
                    answer={answer}
                    userAnswer={userAnswer}
                  />
                )} */}
              </Card>
              {gameOver && <GameOver />}
              {/* {gameOver && <NewGame onUpdateGameState={updateGameState} />} */}
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
