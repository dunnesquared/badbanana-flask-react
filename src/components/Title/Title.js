import "./Title.css";
import Card from "../UI/Card";

const Title = (props) => {
  return (
    <div>
      <Card className="game-title">
        <h1>{props.title}</h1>
      </Card>
    </div>
  );
};

export default Title;
