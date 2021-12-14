import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    // Submit answer.
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        // Add user-answer data to response.
        data.questionAnswered = true;

        // Need to pass back user's quotient and remainder answers for division questions.
        if (props.isDivisionQuestion) {
          const combinedAnswer = `Quotient: ${user_answer1}, 
            Remainder: ${user_answer2}`;
          data.userAnswer = combinedAnswer;
        } else {
          data.userAnswer = enteredAnswer;
        }

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

  if (!props.isDivisionQuestion) {
    return (
      <Form onSubmit={submitHandler}>
        <Card className="answer-form">
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
        </Card>
      </Form>
    );
  } else {
    return (
      <Form onSubmit={submitHandler}>
        <Card className="answer-form">
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
          
        </Card>
      </Form>
    );
  }
};

export default AnswerForm;
