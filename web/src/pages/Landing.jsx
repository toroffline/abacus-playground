import { useSetting } from "../contexts/SettingContext";

function Landing() {
  const { setting, startGame, setTotalNumbers, invertRecheckAnswer, setMode } = useSetting();

  function _setMode(mode) {
    setMode(mode === "flashing" ? "manual" : "flashing");
  }

  return (
    <>
      <div className="setting">
        <h1 className="header">Abacus Practice</h1>
        <section className="setting-round-no">
          <label className="block mb-2">Enter Number of Rounds</label>
          <p>{setting.totalNumbers}</p>
          <input
            type="range"
            min={1}
            max={4}
            value={setting.totalNumbers}
            onChange={(e) => setTotalNumbers(Number(e.target.value))}
            className="p-2 text-black"
          />
        </section>
        <section className="setting-recheck-answer checkbox">
          <input
            className="setting-chk-recheck"
            type="checkbox"
            min={1}
            max={4}
            checked={setting.recheckAnswer}
            onChange={() => invertRecheckAnswer(!setting.recheckAnswer)}
          />
          <span>Recheck answer</span>
        </section>
        <section className="setting-flash-number checkbox">
          <input
            className="setting-chk-flash"
            type="checkbox"
            min={1}
            max={4}
            checked={setting.mode === "flashing"}
            onChange={() => _setMode(setting.mode)}
          />
          <span>Flash number</span>
        </section>
        <button type="button" onClick={() => startGame()}>
          START
        </button>
      </div>
    </>
  );
}

export default Landing;
