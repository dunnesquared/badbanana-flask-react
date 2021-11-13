import React, { useState, useEffect } from "react";
import Card from "../UI/Card";
import "./Question.css";

const Question = (props) => {
  const [question, setQuestion] = useState("...");
  const [questionType, setQuestionType] = useState("Multiplication");
  const [smallestNumber, setSmallestNumber] = useState(0);
  const [largestNumber, setLargestNumber] = useState(1000);

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
        console.log(data.question);
        setQuestion(data.question);
      })
      .catch((error) => console.log("Question Form Submit Error", error));
  };

  const submitHandler = (event) => {
    // Once this button is clicked, game is no longer new.
    props.onUpdateNewGameToFalse();
    getNewQuestionFromAPI();
    event.preventDefault();
  };

  console.log("question.newGame", props.newGame);

  // If new game, hide the last question; reset arithmetic type to the first value in the
  // selection list; reset from/to values to default starting values.
  return (
    <div>
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
              <input type="submit" value="Apply" />
            </div>
          </Card>
        </div>
      </form>
      {props.newGame == false && (
        <Card className="question">
          <p>{question} = ?</p>
          {!props.gameOver && props.questionAnswered && (
            <button onClick={nextQuestionClickedHandler}>Next Question</button>
          )}
        </Card>
      )}
    </div>
  );
};

export default Question;
