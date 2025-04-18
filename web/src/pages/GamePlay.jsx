import { useState, useEffect, useCallback, useRef } from "react";
import { useSetting } from "../contexts/SettingContext";

function GamePlay() {
  const { setting, backToMain } = useSetting();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div className="gameplay">
      <h1 className="header">Abacus Practice</h1>
      {setting.mode === "manual" && <ManualModeGame />}
      {setting.mode === "flashing" && <FlashingModeGame />}
      <button type="button" className="back-main" onClick={() => backToMain()}>
        Time to rest 🍵
      </button>
    </div>
  );
}

function ManualModeGame() {
  const { setting, onRoundOver, setFetchingData, startGame, submitAnswer, fecthRandomNumber } =
    useSetting();
  const [numbers, setNumbers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedNumbers, setDisplayedNumbers] = useState([]);
  const [answer, setAnswer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [userAnswer, setUserAnswer] = useState();

  const nextNumber = useCallback(() => {
    if (currentIndex < numbers.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setDisplayedNumbers((prevNumbers) => [...prevNumbers, numbers[newIndex]]);
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
        const data = fecthRandomNumber();
        setNumbers(data.numbers);
        setAnswer(data.answer);
        setUserAnswer(null);
        setFetchingData(false);
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
      setStartTime(Date.now());
    }
  }, [numbers]);

  return (
    <>
      <div className="top">
        <section className="show-number">
          <div className="current-number">
            {numbers[currentIndex]}
          </div>
          <h3>
            Number <span> </span>
            <small>
              ({currentIndex + 1}/{setting.totalNumbers})
            </small>
          </h3>
          {numbers.length !== displayedNumbers.length && numbers.length !== 0 && (
            <button className="next-number" type="button" onClick={nextNumber}>
              Next
            </button>
          )}
        </section>

      </div>

      <div className="bottom">
        <div className="displayed-number">
          {displayedNumbers.map((displayedNumber) => (
            <div className="displayed-number-item">{displayedNumber}</div>
          ))}
        </div>
        {numbers.length === displayedNumbers.length && numbers.length !== 0 && (
          <div>
            <input
              type="number"
              pattern="[0-9]*"
              value={userAnswer}
              onChange={(e) => setUserAnswer(Number(e.target.value))}
              className="user-answer"
              autoFocus={true}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  nextNumber();
                }
              }}
            />
            <button className="submit-user-answer" onClick={() => submitAnswer()}>
              ➡️
            </button>
            {setting.submittedAnswer ? (
              userAnswer === answer ? (
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
            {setting.roundOver && userAnswer !== answer && (
              <h3>Correct answer: {Math.abs(answer)}</h3>
            )}
            <button
              className="retry"
              onClick={() => startGame()}
              type="button"
              disabled={setting.fetchingData}
              autoFocus={true}
            >
              Next 🔥
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const startDelay = 3000;

function FlashingModeGame() {
  const { setting, fecthRandomNumber, submitAnswer, startGame } = useSetting();
  const [countdown, setCountdown] = useState(startDelay);
  const [flashingStarted, setFlashingStarted] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [userAnswer, setUserAnswer] = useState();
  const [answer, setAnswer] = useState();
  const inputAnswerRef = useRef(null);
  const hiddenRef = useRef(null);

  function onRetry() {
    setFlashingStarted(false);
    setNumbers([]);
    setUserAnswer();
    setCountdown(startDelay);
    setCurrentIndex(0);
    startGame();
  }

  function onSubmit() {
    window.document.body.style.zoom = 1;
    submitAnswer();
  }

  useEffect(() => {
    if (setting.gameStarted) {
      const data = fecthRandomNumber();
      setNumbers(data.numbers);
      setAnswer(data.answer);
      setCountdown(startDelay);
      setFlashingStarted(false);
    }
  }, [setting.gameStarted, setting.round]);

  useEffect(() => {
    if (countdown > 0 && setting.gameStarted) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1000);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (countdown === 0 && setting.gameStarted) {
      setFlashingStarted(true);
    }
  }, [countdown, setting.gameStarted, setting.round]);

  useEffect(() => {
    if (flashingStarted) {
      // Show the first number immediately
      setCurrentIndex(0);
      setCurrentNumber(numbers[0]);
    }
  }, [flashingStarted, numbers]);

  useEffect(() => {
    let timer;
    if (flashingStarted && currentIndex <= numbers.length - 1) {
      timer = setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setCurrentNumber(numbers[nextIndex]);
      }, setting.flashing.delayMs);
    }

    return () => {
      clearInterval(timer);
    };
  }, [flashingStarted, numbers, currentIndex]);

  useEffect(() => {
    if (flashingStarted && currentIndex > numbers.length - 1) {
      // hiddenRef.current?.click();
      setTimeout(() => {
        // inputAnswerRef.current?.blur();
        // inputAnswerRef.current?.focus();
        hiddenRef.current?.click();
      }, 500);
    }
  }, [flashingStarted, currentIndex]);

  return (
    <>
      <button hidden ref={hiddenRef} onClick={
        () => {
          inputAnswerRef.current?.click();
          inputAnswerRef.current?.focus();
        }}>eiei</button>
      <div>
        {countdown > 0 && <h2>Starting in: {countdown / 1000}</h2>}
        <section className="show-number">
          {flashingStarted && currentNumber !== null && currentIndex <= numbers.length - 1 && (
            <h3>
              Number <span> </span>
              <small>
                ({currentIndex + 1}/{setting.totalNumbers})
              </small>
            </h3>
          )}
          {flashingStarted && currentNumber !== null && currentIndex <= numbers.length - 1 && (
            <div className="current-number flashing-number-item">{numbers[currentIndex]}</div>
          )}
        </section>
        {flashingStarted && currentIndex > numbers.length - 1 && (
          <>
            <input
              ref={inputAnswerRef}
              type="number"
              pattern="[0-9]*"
              value={userAnswer}
              onChange={(e) => setUserAnswer(Number(e.target.value))}
              // onClick={() => alert('eiei')}
              className="user-answer"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  submitAnswer();
                }
              }}
            />
            <button className="submit-user-answer" tabIndex={-1} onClick={() => onSubmit()}>
              ➡️
            </button>
            {setting.submittedAnswer ? (
              userAnswer === answer ? (
                <div className="answer-result">Correct ✅</div>
              ) : (
                <div className="answer-result">Wrong ❌</div>
              )
            ) : (
              <></>
            )}
            {setting.submittedAnswer && <div className="all-displayed-number">
              {
                numbers.join(',')
              }
            </div>}
            {setting.roundOver && (
              <div className="text-center">
                {setting.roundOver && userAnswer !== answer && (
                  <h3>Correct answer: {Math.abs(answer)}</h3>
                )}
                <button
                  className="retry"
                  onClick={() => onRetry()}
                  type="button"
                  disabled={setting.fetchingData}
                  autoFocus={true}
                >
                  Next 🔥
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default GamePlay;
