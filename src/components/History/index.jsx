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

              // use this array to keep track of if the guessed letter in each index is correct or not
              const checkedArr = correctArr.map(() => false);

              for (let j = 0; j < 5; j++) {
                // check if the letter of the correct word and guessed word matches in each index
                if (correctArr[j] === guessArr[j]) {
                  // if that index has not been checked, then mark that index in checkedArr as green
                  if (!checkedArr[j]) {
                    checkedArr[j] = "green";
                  }
                }
                // if the letter doesnt match the same index, check if letter is even in the correct word
                else if (guessArr.includes(correctArr[j])) {
                  const targetIndex = guessArr.indexOf(correctArr[j]);
                  // check to see if that index was already checked in checkedArr, to account for duplicate letters
                  if (!checkedArr[targetIndex]) {
                    checkedArr[targetIndex] = "orange";
                  }
                }
              }
              return (
                <li className={styles.letterWrap} key={i}>
                  {guessArr.map((letter, i) => {
                    return (
                      <span
                        className={clsx(
                          styles.letter,
                          checkedArr[i] === "green" && styles.green,
                          checkedArr[i] === "orange" && styles.orange
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
