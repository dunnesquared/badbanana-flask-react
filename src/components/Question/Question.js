import React, { useState } from "react";

const Question = (props) => {
  const [question, setQuestion] = useState("...");

  const clickHandler = () => {
    console.log("click!");
    fetch("/api/question")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.question);
        setQuestion(data.question);
      });
  };

  return (
    <div>
      <p>What is {question}?</p>
      <div>
        <button onClick={clickHandler}>Generate Question</button>
      </div>
    </div>
  );
};

export default Question;
