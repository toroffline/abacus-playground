import { createContext, useContext, useState } from "react";

const SettingContext = createContext();

const useSetting = () => useContext(SettingContext);

const SettingProvider = ({ children }) => {
  const [setting, setSetting] = useState({
    totalNumbers: 2,
    digit: 2,
    recheckAnswer: true,
    gameStarted: false,
    fetchingData: false,
    roundOver: true,
    round: 0,
    mode: "manual",
    operationType: "mixed",
    submittedAnswer: false,
  });

  function startGame() {
    setSetting({
      ...setting,
      gameStarted: true,
      roundOver: false,
      round: setting.round + 1,
      submittedAnswer: false,
    });
  }

  function onRoundOver() {
    setSetting({
      ...setting,
      roundOver: true,
    });
  }

  function backToMain() {
    setSetting({
      ...setting,
      gameStarted: false,
    });
  }

  function setTotalNumbers(totalNumbers) {
    setSetting({ ...setting, totalNumbers });
  }

  function invertRecheckAnswer() {
    setSetting({ ...setting, recheckAnswer: !setting.recheckAnswer });
  }

  function setFetchingData(fetchingData) {
    setSetting({ ...setting, fetchingData });
  }

  function setMode(mode) {
    setSetting({ ...setting, mode });
  }

  function setOperationType(operationType) {
    setSetting({ ...setting, operationType });
  }

  function submitAnswer() {
    setSetting({ ...setting, submittedAnswer: true, roundOver: true });
  }

  return (
    <SettingContext.Provider
      value={{
        setting,
        startGame,
        setTotalNumbers,
        invertRecheckAnswer,
        setFetchingData,
        setMode,
        setOperationType,
        onRoundOver,
        backToMain,
        submitAnswer,
      }}
    >
      {" "}
      {children}{" "}
    </SettingContext.Provider>
  );
};

export { useSetting, SettingProvider };
