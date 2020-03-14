import Head from "next/head";
import { useState } from "react";

const distribution = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 9];

const generateNumbers = amount => {
  return Array.from({ length: amount }, () => {
    return {
      id: Math.floor(Math.random() * 1000000),
      digit: distribution[Math.floor(Math.random() * distribution.length)]
    };
  });
};

const calcResultState = (selectedNumbers: Array<number>) => {
  const result = selectedNumbers.reduce((num, acc) => acc + num, 0);
  if (result < 10) {
    return "READY";
  } else if (result === 10) {
    return "CORRECT";
  } else {
    return "WRONG";
  }
};

const Home = () => {
  const [remainingNumbers, setRemainingNumbers] = useState(generateNumbers(12));
  const [selectedNumberIds, setSelectedNumberIds] = useState([]);
  const [resultState, setResultState] = useState("READY");
  const [score, setScore] = useState(0);

  return (
    <div>
      <Head>
        <title>Numbers Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Numbers!</h1>

        <div className="instructions">Select numbers that add up to 10!</div>

        <div className="top-panel">
          <div className="result">
            {resultState === "READY" && <div>Choose a number</div>}
            {resultState === "CORRECT" && <div className="correct">✅</div>}
            {resultState === "WRONG" && <div className="wrong">❌</div>}
          </div>

          <div className="score">Score:</div>
          <div className="score-number">{score}</div>
        </div>

        <div className="numbers">
          {remainingNumbers.map(({ id, digit }) => {
            const isSelected = selectedNumberIds.includes(id);
            return (
              <button
                className={
                  "number-button " +
                  (isSelected ? "number-button-selected" : "")
                }
                key={id}
                onClick={() => {
                  let newSelectedNumberIds = undefined;

                  if (isSelected) {
                    newSelectedNumberIds = selectedNumberIds.filter(
                      i => id != i
                    );
                    setSelectedNumberIds(newSelectedNumberIds);
                  } else {
                    newSelectedNumberIds = [...selectedNumberIds, id];
                    setSelectedNumberIds(newSelectedNumberIds);
                  }

                  const selectedNumbers = newSelectedNumberIds.map(
                    i => remainingNumbers.find(number => number.id === i).digit
                  );
                  const result = calcResultState(selectedNumbers);
                  setResultState(result);
                  if (result === "CORRECT") {
                    setScore(score + 1);
                    setTimeout(() => {
                      setResultState("READY");
                      setRemainingNumbers([
                        ...remainingNumbers.filter(
                          number => !newSelectedNumberIds.includes(number.id)
                        ),
                        ...generateNumbers(newSelectedNumberIds.length)
                      ]);
                      setSelectedNumberIds([]);
                    }, 2000);
                  }
                }}
              >
                {digit}
              </button>
            );
          })}
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
        }

        .title {
          margin: 0;
          font-size: 40px;
          background: #e1ff00;
          color: #151900;
          padding: 10px;
          width: 100%;
          text-align: center;
        }

        .instructions {
          background: #edf4d7;
          text-align: center;
          padding: 10px;
        }

        .top-panel {
          display: flex;
        }

        .result {
          padding: 10px;
          flex: 1 0 auto;
          line-height: 40px;
        }

        .correct,
        .wrong {
          font-size: 40px;
          line-height: 40px;
        }

        .score {
          text-align: right;
          padding: 10px;
          line-height: 40px;
        }

        .score-number {
          font-size: 40px;
          line-height: 40px;
          padding: 10px;
        }

        .numbers {
          padding: 6px;
        }

        .number-button {
          width: 70px;
          height: 70px;
          font-size: 50px;
          background: #e1ff00;
          color: #ab0202;
          border: none;
          margin: 10px;
          cursor: pointer;
        }

        .number-button:hover {
          background: #c2dc01;
        }

        .number-button-selected {
          background: #ab0202;
          color: #e1ff00;
        }

        .number-button-selected:hover {
          background: #800202;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
