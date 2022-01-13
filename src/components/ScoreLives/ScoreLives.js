import "./ScoreLives.css";
import Card from "../UI/Card";

/**
 * Display of user's current score and number of lives left.
 */
const ScoreLives = (props) => {
  return (
    <div>
      <Card className="score-lives">
        <div>Score: {props.score}</div>
        <div>Lives: {props.lives}</div>
      </Card>
    </div>
  );
};

export default ScoreLives;
