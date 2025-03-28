import { SettingProvider, useSetting } from "./contexts/SettingContext";
import GamePlay from "./pages/GamePlay";
import Landing from "./pages/landing";

function App() {
  const { setting } = useSetting();

  return <>{setting.gameStarted ? <GamePlay /> : <Landing />}</>;
}

export default App;
