import History from "../History";
import { useEffect, useState } from "react";
function Main() {
  const [correctWord, setCorrectWord] = useState("");
  const [userGuess, setUserGuess] = useState("text");
  const [guessHistory, setGuessHistory] = useState([]);

  //   fetching and setting the correct word of the day on page load
  useEffect(() => {
    fetch("https://api.frontendeval.com/fake/word")
      .then((res) => res.text())
      .then((data) => setCorrectWord(data));
    setUserGuess("");
    setMatch(false);
  }, []);

  //  TODO: check if this is the best way...rerenders twice
  const onChange = (e) => {
    if (e.target.value.length === 5) {
      setUserGuess(e.target.value);
    }
  };

  // on form submit, if it's a valid word then check guess to correct word
  const onSubmit = async (e) => {
    e.preventDefault();
    // check to see if the guessed word is part of the valid words before moving on
    const isValid = await fetch(
      "https://api.frontendeval.com/fake/word/valid",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: userGuess,
        }),
      }
    ).then((res) => {
      return res.json();
    });

    if (isValid) {
      setGuessHistory((curr) => {
        return [...curr, userGuess];
      });
    } else {
      console.log("not a word...");
    }
  };

  // check if the guess is correct
  const [match, setMatch] = useState(false);
  useEffect(() => {
    if (guessHistory.slice(-1)[0] === correctWord) {
      setMatch(true);
    }
  }, [guessHistory, correctWord]);

  return (
    <div>
      <h2>Wuzzle</h2>
      <h3>Correct Word: {correctWord}</h3>
      <h3>You have {6 - guessHistory.length} guesses remaining</h3>

      <History
        guessHistory={guessHistory}
        correctWord={correctWord}
        setMatch={setMatch}
      />

      {match ? (
        <div>WINNER!</div>
      ) : (
        <form onSubmit={onSubmit}>
          <input
            type="text"
            minLength="5"
            maxLength="5"
            required
            onChange={onChange}
            disabled={guessHistory.length === 6} // disable the input when user runs out of guesses or if guess is correct
          ></input>
        </form>
      )}
    </div>
  );
}
export default Main;
