import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function App() {
  const [totalNumbers, setTotalNumbers] = useState(3);
  const [numbers, setNumbers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedNumbers, setDisplayedNumbers] = useState([]);
  const [finalResult, setFinalResult] = useState(0);
  const [playerID, setPlayerID] = useState("player1");
  const [startTime, setStartTime] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [userResult, setUserResult] = useState();

  const startGame = async () => {
    setFetching(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-numbers",
        {
          count: totalNumbers,
        },
        {
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
        }
      );
      setFetching(false);
      setNumbers(response.data.numbers);
      setGameOver(false);
      setUserResult();
    } catch (error) {
      console.error("Failed to fetch numbers", error);
    }
  };

  const nextNumber = useCallback(() => {
    if (currentIndex < numbers.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setDisplayedNumbers((prevNumbers) => [...prevNumbers, numbers[newIndex]]);
      setFinalResult((prevResult) => prevResult + numbers[newIndex]);
    } else {
      setGameOver(true);
      submitStats();
    }
  }, [currentIndex, numbers]);

  const submitStats = async () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    await axios.post("http://localhost:5000/submit", {
      playerID,
      rounds: 1,
      numbersProcessed: numbers.length,
      timeTaken,
    });
  };

  useEffect(() => {
    const handleSpacebarPress = (event) => {
      if (event.key === " ") {
        event.preventDefault();
        nextNumber();
        if (gameOver) {
          startGame();
        }
      }
    };

    window.addEventListener("keydown", handleSpacebarPress);

    return () => {
      window.removeEventListener("keydown", handleSpacebarPress);
    };
  }, [nextNumber, gameOver]);

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

      {numbers.length === 0 ? (
        <div className="text-center">
          <label className="block mb-2">Enter Number of Rounds</label>
          <input type="number" value={totalNumbers} onChange={(e) => setTotalNumbers(Number(e.target.value))} className="p-2 text-black" />
          <button onClick={startGame} className="ml-2 bg-green-500 px-4 py-2 rounded hover:bg-green-700">
            Start Game
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl">Number: {numbers[currentIndex]}</h2>
          <button onClick={nextNumber} className="bg-yellow-500 px-4 py-2 mt-4 rounded hover:bg-yellow-700">
            Next
          </button>
          <h3 className="mt-4">Numbers Displayed:</h3>
          {displayedNumbers.map((displayedNumber) => (
            <div>{displayedNumber}</div>
          ))}
        </div>
      )}
      {numbers.length === displayedNumbers.length && numbers.length !== 0 && (
        <div>
          <input
            type="string"
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
        </div>
      )}
      {gameOver && (
        <div className="text-center">
          {userResult === finalResult ? <div>Correct ✅</div> : <div>Wrong ❌</div>}
          <h2 className="text-2xl mb-4">Final Result: {Math.abs(finalResult)}</h2>
          <button onClick={startGame} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700" disabled={fetching}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
