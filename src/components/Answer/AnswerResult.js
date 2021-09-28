import Card from "../UI/Card";
import "./AnswerResult.css";

const AnswerResult = (props) => {
  if (props.answerCorrect) {
    return (
      <div>
        <Card className="answer-result">Correct!! ✅</Card>
      </div>
    );
  } else if (props.answerCorrect == false) {
    return (
      <div>
        <Card className="answer-result">
          <div>Incorrect!! ❌</div>
          <div>Right answer: {props.answer} </div>
        </Card>
      </div>
    );
  } else {
    return null;
  }
};

export default AnswerResult;
