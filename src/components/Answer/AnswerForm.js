import React, { useState } from "react";

import Card from "../UI/Card";
import "./AnswerForm.css";

const AnswerForm = (props) => {
  const [enteredAnswer, setEnteredAnswer] = useState("");

  const answerChangeHandler = (event) => {
    setEnteredAnswer(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const url = "/api/answer";
    const user_answer = enteredAnswer;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_answer }),
    };

    // Submit answer.
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        // Add user-answer data to response.
        data.questionAnswered = true;
        data.userAnswer = enteredAnswer;
        // Send it upward.
        props.onUpdateGameState(data);
      })
      .catch((error) => console.log("Form submit error", error));

    // Clear answer field
    setEnteredAnswer("");
  };

  // Don't display the answer form at the start of a new game or game resest.
  if (props.newGame) {
    return null;
  }

  return (
    <form onSubmit={submitHandler}>
      <Card className="answer-form">
        <div>
          <label>Answer</label>
          <input
            type="number"
            value={enteredAnswer}
            onChange={answerChangeHandler}
          />
        </div>
        <div>
          <button type="submit" disabled={!enteredAnswer}>
            Submit
          </button>
        </div>
      </Card>
    </form>
  );
};

export default AnswerForm;
