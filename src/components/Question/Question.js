import React, { useState } from "react";
import Button from "react-bootstrap/Button";

import Card from "../UI/Card";
import "./Question.css";

const Question = (props) => {
  const [questionString, setQuestionString] = useState("");

  const getNewQuestionFromAPI = () => {
    const url = "api/question";
    const smallestNumber = props.smallestNumber;
    const largestNumber = props.largestNumber;
    const questionType = props.questionType;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionType, smallestNumber, largestNumber }),
    };

    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        // Question string in response uses special characters for arithmetic
        // e.g. * for times, // for integer division.
        // Convert them into something more human-readable.
        const questionString = createQuestionString(
          data.operand1,
          data.operand2,
          data.operator
        );
        setQuestionString(questionString);
        props.onUpdateQuestionData(data.operand1, data.operand2, data.operator);
        // setQuestion(data.question);
        // Let app know whether a division question returned.
        props.onUpdateIsDivisionQuestion(
          data.question_type.toLowerCase() === "division"
        );
      })
      .catch((error) => console.log("Question Form Submit Error", error));
  };

  const nextQuestionClickedHandler = () => {
    console.log("Next Question clicked!");
    props.onUpdateQuestionAnsweredToFalse();
    getNewQuestionFromAPI();
  };

  const createQuestionString = (operand1, operand2, operator) => {
    let question = null;
    switch (operator) {
      case "*":
        question = `${operand1} × ${operand2}`;
        break;
      case "+":
        question = `${operand1} + ${operand2}`;
        break;
      case "-":
        question = `${operand1} - ${operand2}`;
        break;
      case "//":
        question = `${operand1} ÷ ${operand2}`;
        break;
      default:
        console.error(
          "Unable to create question string: Operator character not recognized!"
        );
    }
    return question;
  };

  if (props.questionAnswered) {
    return (
      <div className="question">
        <div>
          {createQuestionString(
            props.questionData.operand1,
            props.questionData.operand2,
            props.questionData.operator
          )}{" "}
          = {props.userAnswer} {props.answerCorrect ? "✔️" : "❌"}
        </div>
        <div>
          {props.answerCorrect
            ? "Correct😸!!"
            : `🙈! Right answer: ${props.answer}`}
        </div>
        {!props.gameOver && props.questionAnswered && (
          <div>
            <Button onClick={nextQuestionClickedHandler}>Next Question</Button>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="question">
        <div>
          {createQuestionString(
            props.questionData.operand1,
            props.questionData.operand2,
            props.questionData.operator
          )}{" "}
          = ?
        </div>
      </div>
    );
  }
};

export default Question;
