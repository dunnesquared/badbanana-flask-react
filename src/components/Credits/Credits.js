import "./Credits.css";

/**
 * Hyperlink to author's website.
 */
const Credits = () => {
  const url = "https://www.dunnesquared.dev";

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
