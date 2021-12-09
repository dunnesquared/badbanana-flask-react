import "./NewGame.css";
import Card from "../UI/Card";

const NewGame = (props) => {
  const clickHandler = () => {
    console.log("Restart game!");
    const msg =
      "Are you sure you want to restart the game? Your score will be reset to zero.";
    if (window.confirm(msg)) {
      // Refreshing the window is the easiest way to reset game parameters.
      window.location.reload();
    } else {
      console.log("Game restart cancelled!");
    }
  };

  return (
    <div>
      <Card className="new-game">
        <button onClick={clickHandler}>New Game</button>
      </Card>
    </div>
  );
};

export default NewGame;
