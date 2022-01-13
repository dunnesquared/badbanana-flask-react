import React, { useState } from "react";
import Button from "react-bootstrap/Button";

import "./Question.css";

/**
 *  Question that user must answer; result of that answer.
 */
const Question = (props) => {
  /**
   * Fetches new question from backend API.
   */
  const getNewQuestionFromAPI = () => {
    // Prepare paylod.
    const smallestNumber = props.smallestNumber;
    const largestNumber = props.largestNumber;
    const questionType = props.questionType;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionType, smallestNumber, largestNumber }),
    };

    // Request new question.
    const url = "api/question";
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

        // Update question data in app.
        props.onUpdateQuestionData(data.operand1, data.operand2, data.operator);

        // Let app know whether a division question returned.
        props.onUpdateIsDivisionQuestion(
          data.question_type.toLowerCase() === "division"
        );
      })
      .catch((error) => console.error("Question Form Submit Error", error));
  };

  /**
   * Fetches new question when Next Question button clicked.
   */
  const nextQuestionClickedHandler = () => {
    props.onUpdateQuestionAnsweredToFalse();
    getNewQuestionFromAPI();
  };

  /**
   * Returns question formatted with common arithmetic symbols.
   *
   * @param {Number} operand1
   * @param {Number} operand2
   * @param {string} operator
   * @returns {string} question
   */
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

  // To save space on viewport, display result of user answering question.
  if (props.questionAnswered) {
    return (
      <div className="question">
        <div>
          {createQuestionString(
            props.questionData.operand1,
            props.questionData.operand2,
            props.questionData.operator
          )}{" "}
          = {props.userAnswer} {props.answerCorrect ? "✅" : "❌ "}
        </div>
        <div>
          {props.answerCorrect ? "Nice!!" : `Right answer:`}
          {!props.answerCorrect && <div>{props.answer}</div>}
        </div>
        {!props.gameOver && props.questionAnswered && (
          <div>
            <Button onClick={nextQuestionClickedHandler}>Next Question</Button>
          </div>
        )}
      </div>
    );
  } else {
    {
      /* Display formatted question. */
    }
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
