import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Service Worker registration & cleanup
if (import.meta.env.PROD) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js")
        .then((registration) => console.log("[SW] Registered:", registration))
        .catch((error) => console.log("[SW] Registration failed:", error));
    });
  }
} else {
  // In development, clean up any active service workers on localhost to avoid caching and connection interference
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log("[SW] Unregistered active service worker in development mode.");
          }
        });
      }
    });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
