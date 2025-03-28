import { useState, useEffect, useCallback } from "react";
import { dummyService } from "../services/DummyService";
import { useSetting } from "../contexts/SettingContext";

function GamePlay() {
  const [numbers, setNumbers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedNumbers, setDisplayedNumbers] = useState([]);
  const [finalResult, setFinalResult] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [userResult, setUserResult] = useState();
  const { setting, setFetchingData, startGame, onRoundOver, backToMain } = useSetting();

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Abacus Practice</h1>

      <div className="text-center">
        <h2 className="text-2xl">Number: {numbers[currentIndex]}</h2>
        <button onClick={nextNumber} className="bg-yellow-500 px-4 py-2 mt-4 rounded hover:bg-yellow-700">
          Next
        </button>
        <hr />
        {displayedNumbers.map((displayedNumber) => (
          <div>{displayedNumber}</div>
        ))}
        <hr />
      </div>
      {numbers.length === displayedNumbers.length && numbers.length !== 0 && (
        <div>
          <input
            type="number"
            value={userResult}
            onChange={(e) => setUserResult(Number(e.target.value))}
            className="p-2 text-black"
            autoFocus={true}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                nextNumber();
              }
            }}
          />
          <br />
        </div>
      )}
      {setting.roundOver && (
        <div className="text-center">
          {userResult === finalResult ? <div>Correct ✅</div> : <div>Wrong ❌</div>}
          <h2 className="text-2xl mb-4">Final Result: {Math.abs(finalResult)}</h2>
          <button onClick={() => startGame()} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700" disabled={setting.fetchingData}>
            Play Again
          </button>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />
      <button onClick={() => backToMain()} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700">
        Rest
      </button>
    </div>
  );
}

export default GamePlay;
