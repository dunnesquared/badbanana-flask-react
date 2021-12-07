<<<<<<< HEAD
/* Code for Card component from https://www.udemy.com/course/react-the-complete-guide-incl-redux/ */
import Card from "../UI/Card";

import "./Instructions.css";

const Instructions = (props) => {
  return (
    <div>
      <Card className="instructions">
        Get a question right, get one point. Get a question wrong, lose a life.
        Lose all your lives and you're a BAD BANANA :-p!
      </Card>
    </div>
  );
||||||| 0b59838
const Instructions =  (props) => {
    return (
        <div>
            <section>
            Get a question right, get one point. 
            Get a question wrong, lose a life.
            Lose all your lives and you're a BAD BANANA :-p!
            </section>
        </div>
    )
=======
/* Code for Card component from https://www.udemy.com/course/react-the-complete-guide-incl-redux/ */
import Card from "../UI/Card";

import "./Instructions.css";

const Instructions = (props) => {
  return (
    <div>
      <Card className="instructions">
        Get a question right, get a point. Get a question wrong, lose a life.
        Lose all your lives and you're a BAD BANANA :-p!
      </Card>
    </div>
  );
>>>>>>> dev
};

export default Instructions;
