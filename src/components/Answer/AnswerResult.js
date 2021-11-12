import Card from "../UI/Card";
import "./AnswerResult.css";

const AnswerResult = (props) => {

  const clickHandler = () => {
    console.log("Next Question clicked!");
    // sprintHello();

    // Start here
    // Need to generate another question...how??

  };

  if (props.answerCorrect) {
    return (
      <div>
        <Card className="answer-result">
          <div>Correct!! ✅</div>
          <button onClick={clickHandler}>Next Question</button>
        </Card>
      </div>
    );
  } else if (props.answerCorrect == false) {
    return (
      <div>
        <Card className="answer-result">
          <div>Incorrect!! ❌</div>
          <div>Right answer: {props.answer} </div>
          <button onClick={clickHandler}>Next Question</button>
        </Card>
      </div>
    );
  } else {
    return null;
  }
};

export default AnswerResult;
