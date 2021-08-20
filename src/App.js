import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
// import './App.css';

import Title from "./components/Title/Title";
import Question from "./components/Question/Question";
import AnswerForm from "./components/Answer/AnswerForm";
import PlayerStatus from "./components/PlayerStatus/PlayerStatus";

function App() {
  // App title
  const title = "Ahoj! Welcome to Bad Banana💩🍌!";

  const [question, setQuestion] = useState("");
  const [statusData, setStatusData] = useState("");

  const updatePlayerStatus = (statusData) => {
    setStatusData(statusData);
  };

  useEffect(() => {
    // Create a player by default so you don't get errors later on.
    fetch("/api/question")
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data.question);
      });
  }, []);

  return (
    <div>
      <Title title={title} />
      <Question question={question} />
      <AnswerForm onUpdatePlayerStatus={updatePlayerStatus} />
    </div>
  );
}

export default App;
