import { SettingProvider, useSetting } from "./contexts/SettingContext";
import GamePlay from "./pages/GamePlay";
import Landing from "./pages/Landing";

function App() {
  const { setting } = useSetting();

  return <div className="main">{setting.gameStarted ? <GamePlay /> : <Landing />}</div>;
}

export default App;
