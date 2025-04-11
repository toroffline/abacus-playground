import { createContext, useContext, useState } from "react";
import { dummyService } from "../services/DummyService";

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
    mode: "flashing",
    operationType: "additionOnly",
    submittedAnswer: false,
    flashing: {
      delayMs: 1000,
    },
  });

  function setFlashingDelayMs(delayMs) {
    setSetting({...setting, flashing: {...setting.flashing, delayMs: delayMs}})
  }

  function fecthRandomNumber() {
    const data = dummyService.generateNumbers(
      setting.digit,
      setting.totalNumbers,
      setting.operationType === "mixed"
    );

    return data;
  }

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

  function setDigit(digit) {
    setSetting({ ...setting, digit });
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
        setDigit,
        invertRecheckAnswer,
        setFetchingData,
        setMode,
        setOperationType,
        onRoundOver,
        backToMain,
        submitAnswer,
        fecthRandomNumber,
        setFlashingDelayMs
      }}
    >
      {" "}
      {children}{" "}
    </SettingContext.Provider>
  );
};

export { useSetting, SettingProvider };
