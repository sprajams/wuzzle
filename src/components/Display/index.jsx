import { useEffect, useState } from "react";
function Display() {
  const [correctWord, setCorrectWord] = useState("");
  const [userGuess, setUserGuess] = useState("text");
  const [guessHistory, setGuessHistory] = useState([]);
  const [isValidWord, setIsValidWord] = useState(false);
  const [guessStatus, setGuessStatus] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
  });

  //   fetching and setting the correct word of the day
  useEffect(() => {
    fetch("https://api.frontendeval.com/fake/word")
      .then((res) => res.text())
      .then((data) => setCorrectWord(data));
    setUserGuess("");
  }, []);

  // if the user's input is 5 letters, check to see if it's a valid word
  useEffect(() => {
    if (userGuess.length === 5) {
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
    }
  }, [userGuess]);

  //  handle user input and automatically set
  const onChange = (e) => {
    setUserGuess(e.target.value);
    setIsValidWord(false);
  };

  // create an object to keep track of letters and corresponding indexes of the correct word
  const correctObj = correctWord.split("").reduce((acc, curr, index) => {
    const newAcc = { ...acc };
    // if newAcc[curr] is undefined, set it to empty array
    if (!newAcc[curr]) {
      newAcc[curr] = [];
    }
    // push current index to current key
    newAcc[curr].push(index);
    return newAcc;
  }, {});

  // check user guess against word of the day
  const checkGuess = (correctWord, userGuess, correctObj) => {
    if (isValidWord) {
      // if the user's guess is correct, skip all other checks
      if (correctWord === userGuess) {
        console.log("MATCH");
        return;
      }
      for (let j = 0; j < 5; j++) {
        let guessLetter = userGuess[j];
        if (correctObj.hasOwnProperty(guessLetter)) {
          let indexGL = userGuess.indexOf(guessLetter);
          let correctArr = correctObj[guessLetter];
          if (correctArr.includes(indexGL)) {
            setGuessStatus((curr) => {
              let cloneObj = curr;
              curr[j] = "correct letter, correct spot";
              return cloneObj;
            });
            console.log("correct letter, correct spot", guessLetter, j);
          } else {
            setGuessStatus((curr) => {
              let cloneObj = curr;
              curr[j] = "correct letter, WRONG spot";
              return cloneObj;
            });
            console.log("correct letter, WRONG spot", guessLetter, j);
          }
        } else {
          setGuessStatus((curr) => {
            let cloneObj = curr;
            curr[j] = "WRONG letter";
            return cloneObj;
          });
          console.log("WRONG letter", guessLetter, j);
        }
      }
    }
  };
  // on form submit, if it's a valid word then check guess to correct word
  const onSubmit = (e) => {
    e.preventDefault();
    if (isValidWord) {
      setGuessHistory((curr) => {
        return [...curr, userGuess];
      });
      checkGuess(correctWord, userGuess, correctObj);
    } else {
      console.log("not a word...");
    }
  };

  return (
    <div>
      <h2>Wuzzle</h2>
      <h3>Correct Word: {correctWord}</h3>
      <h3>You have {6 - guessHistory.length} guesses remaining</h3>
      <ul>
        {guessHistory
          ? guessHistory.map((x, i) => {
              return <li key={i}>{x}</li>;
            })
          : null}
      </ul>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          minLength="5"
          maxLength="5"
          required
          onChange={onChange}
          disabled={guessHistory.length === 6} // disable the input when user runs out of guesses
        ></input>
      </form>
      <div>{isValidWord ? "Valid" : "Not Valid"} Word</div>
    </div>
  );
}
export default Display;
