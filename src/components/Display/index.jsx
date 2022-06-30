import clsx from "clsx";
import styles from "./styles.module.scss";
function Display({ guessHistory, guessStatus }) {
  return (
    <div>
      <ul className={styles.outer}>
        {guessHistory
          ? guessHistory.map((x, i) => {
              const wordArr = x.split("");
              const wordStatus = guessStatus[i];
              console.log(wordStatus);

              return (
                <li className={styles.letterWrap} key={i}>
                  {wordArr.map((letter, i) => {
                    console.log(letter, i, wordStatus[i]);
                    let color;
                    if (wordStatus[i] === "match") {
                      color = "green";
                    } else {
                      console.log(wordStatus[i]);

                      switch (wordStatus[i]) {
                        case "correct letter, correct spot":
                          color = "green";
                          break;
                        case "correct letter, WRONG spot":
                          color = "orange";
                          break;
                        default:
                          color = "white";
                      }
                    }
                    return (
                      <span
                        className={clsx(
                          styles.letter,
                          color === "green" && styles.green,
                          color === "orange" && styles.orange
                        )}
                        key={`letter-${i}`}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}

export default Display;
