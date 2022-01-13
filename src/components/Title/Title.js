import "./Title.css";
import Card from "../UI/Card";

/**
 * Game title.
 */
const Title = (props) => {
  return (
    <div>
      <Card className="game-title">
        <div>{props.title}</div>
      </Card>
    </div>
  );
};

export default Title;
