import './global.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import NotFound from './pages/NotFound';
import LandPage from './pages/LandPage';
import SkillMapping from './pages/SkillMapping';
import TabiyaDatasetExplorer from './pages/TabiyaDatasetExplorer';

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isSkillMapping = location.pathname === '/skill-mapping';
  const isDatasetExplorer = location.pathname === '/dataset-explorer';

  return (
    <div
      className={`min-h-screen bg-tabiya-dark ${isSkillMapping || isDatasetExplorer ? 'w-full max-w-none overflow-x-hidden' : ''}`}
    >
      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/skill-mapping" element={<SkillMapping />} />
        <Route path="/dataset-explorer" element={<TabiyaDatasetExplorer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
