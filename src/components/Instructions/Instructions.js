/* Code for Card component from https://www.udemy.com/course/react-the-complete-guide-incl-redux/ */

import "./Instructions.css";

const Instructions = (props) => {
  return (
    <div className="instructions">
      Get a question right, get one point.<br></br>
      Get a question wrong, lose one life.<br></br>
      Lose all your lives and you're a BAD BANANA!
    </div>
  );
};

export default Instructions;
