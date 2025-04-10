import { createContext, useContext, useState } from "react";

const SettingContext = createContext();

const useSetting = () => useContext(SettingContext);

const SettingProvider = ({ children }) => {
  const [setting, setSetting] = useState({
    totalNumbers: 2,
    recheckAnswer: true,
    gameStarted: false,
    fetchingData: false,
    roundOver: true,
    round: 0,
    mode: "manual"
  });

  function startGame() {
    setSetting({
      ...setting,
      gameStarted: true,
      roundOver: false,
      round: setting.round + 1
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

  return (
    <SettingContext.Provider
      value={{
        setting,
        startGame,
        setTotalNumbers,
        invertRecheckAnswer,
        setFetchingData,
        setMode,
        onRoundOver,
        backToMain
      }}
    >
      {" "}
      {children}{" "}
    </SettingContext.Provider>
  );
};

export { useSetting, SettingProvider };
