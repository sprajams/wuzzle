import History from "../History";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
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
    setUserGuess(e.target.value);
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
      setUserGuess("");
      setGuessHistory((curr) => {
        return [...curr, userGuess.toLowerCase()];
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
    <div className={styles.outer}>
      <div className={styles.titleWrap}>
        <h2 className={styles.title}>? ? ? ? ?</h2>
        {match ? (
          <div className={styles.win}>WINNER!</div>
        ) : (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              minLength="5"
              maxLength="5"
              required
              className={styles.input}
              onChange={onChange}
              value={userGuess.toUpperCase()}
              disabled={guessHistory.length === 6} // disable the input when user runs out of guesses or if guess is correct
            ></input>
          </form>
        )}
      </div>
      <History
        guessHistory={guessHistory}
        correctWord={correctWord}
        setMatch={setMatch}
      />
    </div>
  );
}
export default Main;
