import React, { useState } from "react";

import Button from "react-bootstrap/Button";

import Card from "../UI/Card";
import "./Question.css";

const Question = (props) => {
  // Default interval for operand values
  const numFrom = 1;
  const numTo = 10;

  const [question, setQuestion] = useState("...");
  const [questionType, setQuestionType] = useState("Multiplication");
  const [smallestNumber, setSmallestNumber] = useState(numFrom);
  const [largestNumber, setLargestNumber] = useState(numTo);

  const nextQuestionClickedHandler = () => {
    console.log("Next Question clicked!");
    props.onUpdateQuestionAnsweredToFalse();
    getNewQuestionFromAPI();
  };

  const changeHandler = (event) => {
    setQuestionType(event.target.value);
  };

  const smallestNumberChangeHandler = (event) => {
    setSmallestNumber(event.target.value);
  };

  const largestNumberChangeHandler = (event) => {
    setLargestNumber(event.target.value);
  };

  const getNewQuestionFromAPI = () => {
    const url = "api/question";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionType, smallestNumber, largestNumber }),
    };

    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        // Update question
        setQuestion(data.question);
        // Let app know whether a division question returned.
        props.onUpdateIsDivisionQuestion(
          data.question_type.toLowerCase() === "division"
        );
      })
      .catch((error) => console.log("Question Form Submit Error", error));
  };

  const submitHandler = (event) => {
    // Once this button is clicked, game is no longer new.
    props.onUpdateNewGameToFalse();
    getNewQuestionFromAPI();

    // You'll want to show the answer form if you've
    // just answered a question, but changed the question
    // parameters.
    if (props.questionAnswered) {
      props.onUpdateQuestionAnsweredToFalse();
    }

    event.preventDefault();
  };

  console.log("question.newGame", props.newGame);

  // If new game, hide the last question; reset arithmetic type to the first value in the
  // selection list; reset from/to values to default starting values.
  return (
    <div>
      {!props.gameOver && (
        <form onSubmit={submitHandler}>
          <div>
            <Card className="question-form">
              <label>
                What kind of arithmetic do you want to practice?
                <div>
                  <select value={questionType} onChange={changeHandler}>
                    <option value="Multiplication">Multiplication</option>
                    <option value="Division">Division</option>
                    <option value="Addition">Addition</option>
                    <option value="Subtraction">Subtraction</option>
                    <option value="Any">Any Kind</option>
                  </select>
                </div>
              </label>
              <br></br>
              <div>
                <label>From:</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={smallestNumber}
                  onChange={smallestNumberChangeHandler}
                />
                <label>To:</label>
                <input
                  type="number"
                  min={smallestNumber}
                  step="1"
                  value={largestNumber}
                  onChange={largestNumberChangeHandler}
                />
              </div>

              <div>
                <br></br>
                <input
                  type="submit"
                  value="Apply"
                  disabled={!questionType || !smallestNumber || !largestNumber}
                />
              </div>
            </Card>
          </div>
        </form>
      )}
      {props.newGame === false && (
        <Card className="question">
          <p>{question} = ?</p>
          {!props.gameOver && props.questionAnswered && (
            <Button onClick={nextQuestionClickedHandler}>Next Question</Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default Question;
