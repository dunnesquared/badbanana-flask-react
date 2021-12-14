import Card from "../UI/Card";
import "./AnswerResult.css";

const AnswerResult = (props) => {
  if (props.answerCorrect) {
    return (
      <div>
        <Card className="answer-result">
          <div>Correct!! ✅</div>
        </Card>
      </div>
    );
  } else if (props.answerCorrect === false) {
    return (
      <div>
        <Card className="answer-result">
          <div>{props.userAnswer} is incorrect!! ❌</div>
          <div>Right answer: {props.answer} </div>
        </Card>
      </div>
    );
  } else {
    // Don't show any
    return null;
  }
};

export default AnswerResult;
