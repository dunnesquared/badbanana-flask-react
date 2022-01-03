import "./Credits.css";

const Credits = () => {
  const url = "https://dunnesquared.github.io";

  return (
    <div>
      <br></br>A{" "}
      <small>
        <a href={url} target="_blank" id="credits-url">
          DunneSquared
        </a>{" "}
        Game{" "}
      </small>
    </div>
  );
};

export default Credits;
