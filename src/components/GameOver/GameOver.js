import "./GameOver.css";
import Card from "../UI/Card";

const GameOver = () => {
  return (
    <div>
      <Card className="game-over">
        <div>GAME OVER!</div>
        <div>YOU'RE THE BAD BANANA.</div>
        <div>Better luck next time!</div>
        <div>🙈🍌😄</div>
      </Card>
    </div>
  );
};

export default GameOver;
