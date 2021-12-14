import "./ScoreLives.css";
import Card from "../UI/Card";

const ScoreLives = (props) => {
  return (
    <div>
      <Card className="score-lives">
        <pre>Score: {props.score}     Lives: {props.lives}</pre>

      </Card>
    </div>
  );
};

export default ScoreLives;
