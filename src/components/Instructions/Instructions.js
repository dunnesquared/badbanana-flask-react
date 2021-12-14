/* Code for Card component from https://www.udemy.com/course/react-the-complete-guide-incl-redux/ */
import Card from "../UI/Card";

import "./Instructions.css";

const Instructions = (props) => {
  return (
    <div>
      <Card className="instructions">
        Get a question right, get a point. Get a question wrong, lose a life.
        Lose all your lives and you're a BAD BANANA!
      </Card>
    </div>
  );
};

export default Instructions;
