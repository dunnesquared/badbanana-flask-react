const ScoreLives = (props) => {
    return (
        <div>
            <div>Score: {props.score}</div>
            <div>Lives: {props.lives}</div>
        </div>
    );
};

export default ScoreLives;