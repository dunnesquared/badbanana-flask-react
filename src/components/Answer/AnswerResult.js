const AnswerResult = (props) => {
  if (props.answerCorrect) {
    return <div>Correct!! ✅</div>;
  } else if (props.answerCorrect == false) {
    return (
      <div>
        <div>Incorrect!! ❌</div>
        <div>Right answer: {props.answer} </div>
      </div>
    );
  } else {
    return null;
  }
};

export default AnswerResult;
