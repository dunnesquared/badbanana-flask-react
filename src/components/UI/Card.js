import "./Card.css";

/**
 * Component to make division of content more aesthetically pleasing.
 *
 * Code from Code from
 * https://www.udemy.com/course/react-the-complete-guide-incl-redux/
 */
const Card = (props) => {
  const classes = "card " + props.className;
  return <div className={classes}>{props.children}</div>;
};

export default Card;
