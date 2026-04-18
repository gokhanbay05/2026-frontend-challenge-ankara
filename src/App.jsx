import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import PeoplePage from "./pages/PeoplePage";
import PersonDetail from "./pages/PersonDetail";
import LocationsPage from "./pages/LocationsPage";
import LocationDetail from "./pages/LocationDetail";
import Modal from "./components/layout/Modal";
import useThemeStore from "./store/useThemeStore.js";
import { useEffect } from "react";

export default function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Toaster position="top-center" />
      <Navbar title={"Missing Podo"} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/person/:name" element={<PersonDetail />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/location/:name" element={<LocationDetail />} />

          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h1 className="text-6xl font-black text-primary/20">404</h1>
                <p className="text-muted-foreground mt-4 text-lg">
                  The page you are looking for does not exist.
                </p>
              </div>
            }
          />
        </Routes>
        <Modal />
      </main>
    </div>
  );
}
