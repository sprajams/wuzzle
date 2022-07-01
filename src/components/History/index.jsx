import clsx from "clsx";
import styles from "./styles.module.scss";
function History({ guessHistory, correctWord }) {
  return (
    <div>
      <ul className={styles.outer}>
        {guessHistory
          ? guessHistory.map((x, i) => {
              const guessArr = x.split("");
              const correctArr = correctWord.split("");
              const checkedArr = correctArr.map(() => false);
              return (
                <li className={styles.letterWrap} key={i}>
                  {guessArr.map((letter, i) => {
                    let color;
                    // check if each letter in the guessed word matches with the same index for the correct word
                    if (letter === correctArr[i]) {
                      correctArr.splice(i, 1, "matched");
                      color = "green";
                    }
                    // if the letter doesnt match the same index, check if letter is even in the correct word
                    else if (correctArr.includes(letter)) {
                      const targetIndex = correctArr.indexOf(letter);
                      // check to see if this letter was already checked in case of duplicates letters
                      if (!checkedArr[targetIndex]) {
                        checkedArr[targetIndex] = true;
                        color = "orange";
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

export default History;
