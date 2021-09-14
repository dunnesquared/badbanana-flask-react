import React, { useState } from "react";

const Question = (props) => {
  const [question, setQuestion] = useState("...");
  const [questionType, setQuestionType] = useState("");
  const [smallestNumber, setSmallestNumber] = useState(0);
  const [largestNumber, setLargestNumber] = useState(1000);

  const changeHandler = (event) => {
    setQuestionType(event.target.value);
  };

  const smallestNumberChangeHandler = (event) => {
    setSmallestNumber(event.target.value);
  };

  const largestNumberChangeHandler = (event) => {
    setLargestNumber(event.target.value);
  };

  const submitHandler = (event) => {
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
          <input type="submit" value="Generate Question" />
        </div>
      </div>
      <p>What is {question}?</p>
    </form>
  );
};

export default Question;
