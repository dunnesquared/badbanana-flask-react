/* Code from https://www.udemy.com/course/react-the-complete-guide-incl-redux/ */

import "./Card.css";

const Card = (props) => {
    const classes = "card " + props.className;
    return <div className={classes}>{props.children}</div>
};

export default Card;