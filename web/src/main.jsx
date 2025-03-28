import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SettingProvider } from "./contexts/SettingContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettingProvider>
      <App />
    </SettingProvider>
  </StrictMode>
);
