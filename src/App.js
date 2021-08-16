import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
// import './App.css';

import Question from './components/Question/Question';
import AnswerForm from './components/Answer/AnswerForm';
import PlayerStatus from './components/PlayerStatus/PlayerStatus';

function App() {
  const [question, setQuestion] = useState("");

  useEffect( () => {
    // Create a player by default so you don't get errors later on.
    fetch('/api/question')
      .then(res => res.json())
        .then(data => { setQuestion(data.question); });
  }, []);

  return (
    <div>
      <p>Ahoj!</p>
      <Question question={question} />
    </div>
  );
}

export default App;

