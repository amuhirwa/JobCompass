import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, useLocation } from "react-router-dom";

import NotFound from "./pages/NotFound";
import LandPage from "./pages/LandPage";
import SkillMapping from "./pages/SkillMapping";
import TabiyaDatasetExplorer from "./pages/TabiyaDatasetExplorer";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const location = useLocation();
  const isSkillMapping = location.pathname === "/skill-mapping";
  const isDatasetExplorer = location.pathname === "/dataset-explorer";

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div
        className={`min-h-screen bg-tabiya-dark ${isSkillMapping || isDatasetExplorer ? "w-full max-w-none overflow-x-hidden" : ""}`}
      >
        <Routes>
          <Route path="/" element={<LandPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/skill-mapping" element={<SkillMapping />} />
          <Route path="/dataset-explorer" element={<TabiyaDatasetExplorer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </TooltipProvider>
  );
};

export default App;
