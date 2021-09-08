import React, { useState } from "react";

const Question = (props) => {
  const [question, setQuestion] = useState("...");
  const [questionType, setQuestionType] = useState("");

  const changeHandler = (event) => {
    setQuestionType(event.target.value);
  };

  const submitHandler = (event) => {
    console.log("submit!");
    console.log(questionType);
    fetch("/api/question")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.question);
        setQuestion(data.question);
      });
    event.preventDefault();
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>
          What kind of arithmetic do you want to practice?
          <div>
            <select value={questionType} onChange={changeHandler}>
              <option value="">--Please choose a question type--</option>
              <option value="Multiplication">Multiplication</option>
              <option value="Division">Division</option>
              <option value="Addition">Addition</option>
              <option value="Subtraction">Subtraction</option>
            </select>
          </div>
        </label>
        <div>
          <br></br>
          <input type="submit" value="Generate Question" />
        </div>
      </div>
      <p>What is {question}?</p>
    </form>
  );
};

export default Question;
