import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./AnswerForm.css";

/**
 * Form for user to answer question. 
 */
const AnswerForm = (props) => {
  const [enteredAnswer, setEnteredAnswer] = useState("");
  // To hold remainder for division questions.
  const [enteredAnswer2, setEnteredAnswer2] = useState("");

  const answerChangeHandler = (event) => {
    setEnteredAnswer(event.target.value);
  };

  const answer2ChangeHandler = (event) => {
    setEnteredAnswer2(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    // Prepare payload. Contents depends on whether division question asked.
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
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    // Submit answer; handle response.
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        // Add user-answer data to response.
        data.questionAnswered = true;

        // Need to pass back user's quotient and remainder answers for division questions.
        if (props.isDivisionQuestion) {
          const combinedAnswer = `${user_answer1} R${user_answer2}`;
          data.userAnswer = combinedAnswer;
        } else {
          data.userAnswer = enteredAnswer;
        }

        // Send it upward.
        props.onUpdateGameState(data);
      })
      .catch((error) => console.error("Form submit error", error));

    // Clear answer field.
    setEnteredAnswer("");
  };

  // Don't display the answer form at the start of a new game or game reset.
  if (props.newGame) {
    return null;
  }

  // Display the answer form. What shown depends on whether division question asked.
  if (!props.isDivisionQuestion) {
    return (
      <Form className="answer-form" onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <div>
            <Form.Label>Answer</Form.Label>
            <br></br>

            <Form.Control
              type="number"
              value={enteredAnswer}
              onChange={answerChangeHandler}
            />
          </div>
        </Form.Group>
        <div>
          <Button type="submit" disabled={!enteredAnswer}>
            Submit
          </Button>
        </div>
      </Form>
    );
  } else {
    return (
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <div>
            <Form.Label>Quotient</Form.Label>
            <br></br>
            <Form.Control
              type="number"
              value={enteredAnswer}
              onChange={answerChangeHandler}
            />
            <br></br>
            <label>Remainder</label>
            <br></br>
            <Form.Control
              type="number"
              value={enteredAnswer2}
              onChange={answer2ChangeHandler}
            />
          </div>
        </Form.Group>
        <div>
          <Button type="submit" disabled={!enteredAnswer}>
            Submit
          </Button>
        </div>
      </Form>
    );
  }
};

export default AnswerForm;
