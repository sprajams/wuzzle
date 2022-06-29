import { useEffect, useState } from "react";
function Display() {
  const [targetWord, setTargetWord] = useState("");
  const [userGuess, setUserGuess] = useState("text");
  const [guessHistory, setGuessHistory] = useState([]);
  const [isValidWord, setIsValidWord] = useState(false);
  const [guessNum, setGuessNum] = useState(6);
  //   fetching and setting the target word of the day
  useEffect(() => {
    fetch("https://api.frontendeval.com/fake/word")
      .then((res) => res.text())
      .then((data) => setTargetWord(data));
  }, []);

  // on submit, check to see if the user input is a valid word
  const checkValidity = (e) => {
    e.preventDefault();
    fetch("https://api.frontendeval.com/fake/word/valid", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        word: userGuess,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsValidWord(data);
      });
  };

  //  handle user input and automatically set
  const onChange = (e) => {
    setUserGuess(e.target.value);
    setIsValidWord(false);
  };

  //  if the user's guess is a valid word, add it to a history and decrease gusses remaining
  useEffect(() => {
    if (isValidWord) {
      setGuessHistory((curr) => {
        return [...curr, userGuess];
      });
      setGuessNum((curr) => {
        let clone = curr;
        if (clone > 0) {
          return curr - 1;
        }
      });
    }
  }, [isValidWord, userGuess]);

  return (
    <div>
      <h2>Wuzzle</h2>
      <h3>Target Word: {targetWord}</h3>
      <h3>You have {guessNum} guesses remaining</h3>
      <ul>
        {guessHistory
          ? guessHistory.map((x, i) => {
              return <li key={i}>{x}</li>;
            })
          : null}
      </ul>
      <form onSubmit={checkValidity}>
        <input
          type="text"
          minLength="5"
          maxLength="5"
          required
          onChange={onChange}
          disabled={guessNum === 0} // disable the input when user runs out of guesses
        ></input>
      </form>
      <div>{isValidWord ? "Valid" : "Not Valid"} Word</div>
    </div>
  );
}
export default Display;
