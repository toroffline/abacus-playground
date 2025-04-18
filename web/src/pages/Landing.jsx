import { useSetting } from "../contexts/SettingContext";

function Landing() {
  const {
    setting,
    startGame,
    setTotalNumbers,
    invertRecheckAnswer,
    setMode,
    setOperationType,
    setDigit,
    setFlashingDelayMs,
  } = useSetting();

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
        <section className="setting-digit">
          <label>Set digit</label>
          <p>{setting.digit}</p>
          <input
            type="range"
            min={1}
            max={3}
            step={1}
            value={setting.digit}
            onChange={(e) => setDigit(Number(e.target.value))}
          />
        </section>
        <section className="setting-round-no">
          <label>Set Number of Rounds</label>
          <p>{setting.totalNumbers}</p>
          <input
            type="range"
            min={2}
            max={50}
            value={setting.totalNumbers}
            onChange={(e) => setTotalNumbers(Number(e.target.value))}
          />
        </section>
        <section className="setting-recheck-answer checkbox">
          <input
            id="landing-chk-recheck-answer"
            className="setting-chk-recheck"
            type="checkbox"
            checked={setting.recheckAnswer}
            onChange={() => invertRecheckAnswer(!setting.recheckAnswer)}
          />
          <label htmlFor="landing-chk-recheck-answer">Recheck answer</label>
        </section>
        <section className="setting-operation-type checkbox">
          <input
            id="landing-chk-operation-type"
            className="setting-chk-operation-type"
            type="checkbox"
            checked={setting.operationType === "mixed"}
            onChange={() => _setOperationType(setting.operationType)}
          />
          <label htmlFor="landing-chk-operation-type">Include negative number (➖)</label>
        </section>
        <section className="setting-flash-number checkbox">
          <div>
            <input
              id="landing-chk-flash-mode"
              className="setting-chk-flash"
              type="checkbox"
              checked={setting.mode === "flashing"}
              onChange={() => _setMode(setting.mode)}
            />
            <label htmlFor="landing-chk-flash-mode">Flashing mode</label>
          </div>
        </section>
        {setting.mode === "flashing" && (
          <section className="setting-flash-option">
            <label>Delay(ms)</label>
            <p>{setting.flashing.delayMs}</p>
            <input
              type="range"
              min={500}
              max={5000}
              step={500}
              value={setting.flashing.delayMs}
              onChange={(e) => setFlashingDelayMs(Number(e.target.value))}
            />
          </section>
        )}
        <button className="btn-start" type="button" onClick={() => startGame()}>
          START
        </button>
      </div>
    </>
  );
}

export default Landing;
