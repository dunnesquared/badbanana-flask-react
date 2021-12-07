import Card from "../UI/Card";
import "./AnswerResult.css";

const AnswerResult = (props) => {
  if (props.answerCorrect) {
<<<<<<< HEAD
    return (
      <div>
        <Card className="answer-result">Correct!! ✅</Card>
      </div>
    );
||||||| 0b59838
    return <div>Correct!! ✅</div>;
=======
    return (
      <div>
        <Card className="answer-result">
          <div>Correct!! ✅</div>
        </Card>
      </div>
    );
>>>>>>> dev
  } else if (props.answerCorrect == false) {
    return (
      <div>
<<<<<<< HEAD
        <Card className="answer-result">
          <div>Incorrect!! ❌</div>
          <div>Right answer: {props.answer} </div>
        </Card>
||||||| 0b59838
        <div>Incorrect!! ❌</div>
        <div>Right answer: {props.answer} </div>
=======
        <Card className="answer-result">
          <div>{props.userAnswer} is incorrect!! ❌</div>
          <div>Right answer: {props.answer} </div>
        </Card>
>>>>>>> dev
      </div>
    );
  } else {
    // Don't show any
    return null;
  }
};

export default AnswerResult;
