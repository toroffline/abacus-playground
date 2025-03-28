import { useSetting } from "../contexts/SettingContext";

function Landing() {
  const { setting, startGame, setTotalNumbers, invertRecheckAnswer } = useSetting();

  return (
    <>
      <div className="text-center">
        <label className="block mb-2">Enter Number of Rounds</label>
        <p>{setting.totalNumbers}</p>
        <input type="range" min={2} max={4} value={setting.totalNumbers} onChange={(e) => setTotalNumbers(Number(e.target.value))} className="p-2 text-black" />
        <br />
        <br />
        <br />
        <br />
        <div>Recheck answer</div>
        <input type="checkbox" min={1} max={4} checked={setting.recheckAnswer} onChange={() => invertRecheckAnswer(!setting.recheckAnswer)} className="p-2 text-black" />
        <br />
        <br />
        <br />
        <button onClick={() => startGame()} className="ml-2 bg-green-500 px-4 py-2 rounded hover:bg-green-700">
          Start
        </button>
      </div>
    </>
  );
}

export default Landing;
