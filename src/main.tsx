import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { CompareProvider } from "./contexts/CompareContext";

createRoot(document.getElementById("root")!).render(
  <CompareProvider>
    <App />
  </CompareProvider>
);