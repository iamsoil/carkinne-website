import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./globals.css";
import { CompareProvider } from "./contexts/CompareContext";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <CompareProvider>
      <App />
    </CompareProvider>
  </HelmetProvider>
);