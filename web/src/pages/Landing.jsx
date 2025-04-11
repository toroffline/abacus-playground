import { useSetting } from "../contexts/SettingContext";

function Landing() {
  const { setting, startGame, setTotalNumbers, invertRecheckAnswer, setMode, setOperationType } =
    useSetting();

  function _setMode(mode) {
    setMode(mode === "flashing" ? "manual" : "flashing");
  }

  function _setOperationType(operationType) {
    setOperationType(operationType === "mixed" ? "additionOnly" : "mixed");
  }

  return (
    <>
      <div className="setting">
        <h1 className="header">Abacus Practice</h1>
        <section className="setting-round-no">
          <label>Enter Number of Rounds</label>
          <p>{setting.totalNumbers}</p>
          <input
            type="range"
            min={1}
            max={50}
            value={setting.totalNumbers}
            onChange={(e) => setTotalNumbers(Number(e.target.value))}
          />
        </section>
        <section className="setting-recheck-answer checkbox">
          <input
            className="setting-chk-recheck"
            type="checkbox"
            checked={setting.recheckAnswer}
            onChange={() => invertRecheckAnswer(!setting.recheckAnswer)}
          />
          <span>Recheck answer</span>
        </section>
        <section className="setting-operation-type checkbox">
          <input
            className="setting-chk-operation-type"
            type="checkbox"
            checked={setting.operationType === "mixed"}
            onChange={() => _setOperationType(setting.operationType)}
          />
          <span>Include negative number (➖)</span>
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
          <span>Flashing mode</span>
        </section>
        <button type="button" onClick={() => startGame()}>
          START
        </button>
      </div>
    </>
  );
}

export default Landing;
