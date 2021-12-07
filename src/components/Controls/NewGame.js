import "./NewGame.css";
import Card from "../UI/Card";

const NewGame = (props) => {
  const clickHandler = () => {
    console.log("Restart game!");
    if (
      window.confirm(
        "Are you sure you want to restart game? Your score will be reset to zero."
      )
    ) {
      console.log("Score and lives reset!");
      fetch("/api/new-game")
        .then((res) => res.json())
        .then((data) => {
          console.log("score:", data.score, "lives:", data.lives);
          const newGameData = {
            score: data.score,
            lives: data.lives,
            answer_correct: null,
            game_over: false,
            answer: "",
            new_game: true,
          };
          props.onUpdateGameState(newGameData);
        });
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
