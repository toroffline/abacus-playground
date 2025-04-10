import { useState, useEffect, useCallback } from "react";
import { dummyService } from "../services/DummyService";
import { useSetting } from "../contexts/SettingContext";

function GamePlay() {
  const { setting } = useSetting();

  return (
    <div className="gameplay">
      <h1 className="header">Abacus Practice</h1>
      {setting.mode === "manual" && <ManualModeGame />}
      {setting.mode === "flashing" && <FlashingModeGame />}
    </div>
  );
}

function ManualModeGame() {
  const { setting, onRoundOver, setFetchingData, startGame, backToMain } = useSetting();
  const [numbers, setNumbers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedNumbers, setDisplayedNumbers] = useState([]);
  const [finalResult, setFinalResult] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [userResult, setUserResult] = useState();

  const nextNumber = useCallback(() => {
    if (currentIndex < numbers.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setDisplayedNumbers((prevNumbers) => [...prevNumbers, numbers[newIndex]]);
      setFinalResult((prevResult) => prevResult + numbers[newIndex]);
    } else {
      onRoundOver();
      submitStats();
    }
  }, [currentIndex, numbers]);

  const submitStats = async () => {
    // const timeTaken = (Date.now() - startTime) / 1000;
    // await
  };

  useEffect(() => {
    if (setting.gameStarted && setting.round > 0) {
      setFetchingData(true);
      try {
        const data = dummyService.generateNumbers(2, setting.totalNumbers);
        setUserResult(null)
        setFetchingData(false);
        setNumbers(data.numbers);
      } catch (error) {
        console.error("Failed to fetch numbers", error);
      }
    }
  }, [setting.gameStarted, setting.round]);

  useEffect(() => {
    const handleSpacebarPress = (event) => {
      if (event.key === " ") {
        event.preventDefault();
        nextNumber();
        // if (gameOver) {
        //   startGame();
        // }
      }
    };

    window.addEventListener("keydown", handleSpacebarPress);

    return () => {
      window.removeEventListener("keydown", handleSpacebarPress);
    };
  }, [nextNumber]);

  useEffect(() => {
    if (numbers.length > 0) {
      setCurrentIndex(0);
      setDisplayedNumbers([numbers[0]]);
      setFinalResult(numbers[0]);
      setStartTime(Date.now());
    }
  }, [numbers]);

  return (
    <>
      <section className="show-number">
        <h2 className="text-2xl">Number: {numbers[currentIndex]}</h2>
        {displayedNumbers.map((displayedNumber) => (
          <div className="displayed-number">{displayedNumber}</div>
        ))}
        {numbers.length !== displayedNumbers.length && numbers.length !== 0 && (
          <button className="next-number" type="button" onClick={nextNumber}>
            Next
          </button>
        )}
      </section>
      {numbers.length === displayedNumbers.length && numbers.length !== 0 && (
        <div>
          <input
            type="number"
            value={userResult}
            onChange={(e) => setUserResult(Number(e.target.value))}
            className="user-answer"
            autoFocus={true}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                nextNumber();
              }
            }}
          />
          {setting.roundOver ? (
            userResult === finalResult ? (
              <div className="answer-result">Correct ✅</div>
            ) : (
              <div className="answer-result">Wrong ❌</div>
            )
          ) : (
            <></>
          )}
        </div>
      )}
      {setting.roundOver && (
        <div className="text-center">
          {setting.roundOver && userResult !== finalResult && (
            <h3>Correct answer: {Math.abs(finalResult)}</h3>
          )}
          <button
            className="retry"
            onClick={() => startGame()}
            type="button"
            disabled={setting.fetchingData}
          >
            Go On
          </button>
        </div>
      )}
      <button type="button" onClick={() => backToMain()}>
        REST
      </button>
    </>
  );
}

function FlashingModeGame() {
  return <></>;
}

export default GamePlay;
