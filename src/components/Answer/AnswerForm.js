import React, { useState } from "react";

const AnswerForm = (props) => {
  const [enteredAnswer, setEnteredAnswer] = useState("");

  const answerChangeHandler = (event) => {
    setEnteredAnswer(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const url = "/api/answer";
    const user_answer = enteredAnswer;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_answer }),
    };

    // Submit answer.
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        props.onUpdateGameState(data);  
      })
      .catch((error) => console.log("Form submit error", error));

    // Clear answer field
    setEnteredAnswer("");
  };

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
};

export default AnswerForm;
