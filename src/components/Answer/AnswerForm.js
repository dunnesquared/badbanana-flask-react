import React, { useState } from "react";

import Card from "../UI/Card";
import "./AnswerForm.css";

const AnswerForm = (props) => {
  const [enteredAnswer, setEnteredAnswer] = useState("");
  const [enteredAnswer2, setEnteredAnswer2] = useState("");

  const answerChangeHandler = (event) => {
    setEnteredAnswer(event.target.value);
  };

  const answer2ChangeHandler = (event) => {
    setEnteredAnswer2(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const url = "/api/answer";
    const is_division_question = props.isDivisionQuestion;
    const user_answer1 = enteredAnswer;
    const user_answer2 = enteredAnswer2;
    let payload = {};
    if (!is_division_question) {
      payload = { is_division_question, user_answer1 };
    } else {
      payload = { is_division_question, user_answer1, user_answer2 };
    }

    // const user_answers = {userAnswer1: null, userAnswer2: null}
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    // Submit answer.
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
<<<<<<< HEAD
        props.onUpdateGameState(data);
||||||| 0b59838
        props.onUpdateGameState(data);  
=======
        // Add user-answer data to response.
        data.questionAnswered = true;

        // Need to pass back user's quotient and remainder answers for division questions.
        if (props.isDivisionQuestion) {
          const combinedAnswer = `Quotient: ${user_answer1},\ 
            Remainder: ${user_answer2}`;
          data.userAnswer = combinedAnswer;
        } else {
          data.userAnswer = enteredAnswer;
        }

        // Send it upward.
        props.onUpdateGameState(data);
>>>>>>> dev
      })
      .catch((error) => console.log("Form submit error", error));

    // Clear answer field
    setEnteredAnswer("");
  };

  // Don't display the answer form at the start of a new game or game resest.
  if (props.newGame) {
    return null;
  }

<<<<<<< HEAD
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
          <button type="submit">Submit</button>
        </div>
      </Card>
    </form>
  );
||||||| 0b59838
  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>Answer</label>
        <input
          type="number"
          value={enteredAnswer}
          onChange={answerChangeHandler}
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
=======
  if (!props.isDivisionQuestion) {
    return (
      <form onSubmit={submitHandler}>
        <Card className="answer-form">
          <div>
            <label>Answer</label>
            <br></br>

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
  } else {
    return (
      <form onSubmit={submitHandler}>
        <Card className="answer-form">
          <div>
            <label>Quotient</label>
            <br></br>
            <input
              type="number"
              value={enteredAnswer}
              onChange={answerChangeHandler}
            />
            <br></br>
            <label>Remainder</label>
            <br></br>
            <input
              type="number"
              value={enteredAnswer2}
              onChange={answer2ChangeHandler}
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
  }
>>>>>>> dev
};

export default AnswerForm;
