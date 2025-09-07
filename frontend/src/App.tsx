import './global.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DarkModeContext, useDarkMode } from '@/contexts/DarkModeContext';

import NotFound from './pages/NotFound';
import LandPage from './pages/LandPage';
import SkillMapping from './pages/SkillMapping';
import TabiyaDatasetExplorer from './pages/TabiyaDatasetExplorer';
import { Dashboard } from '@/features/dashboard';
import AppLayout from './components/custom/AppLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Reduce retries for long operations
    },
    mutations: {
      retry: 1, // Reduce retries for AI operations
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const { isDark } = useDarkMode();
  const isSkillMapping = location.pathname === '/skill-mapping';
  const isDatasetExplorer = location.pathname === '/dataset-explorer';
  const isDashboard =
    location.pathname === '/dashboard' ||
    location.pathname === '/new-dashboard';

  return (
    <div
      className={`min-h-screen w-full ${isDark ? 'bg-tabiya-dark' : 'bg-white'} ${isSkillMapping || isDatasetExplorer || isDashboard ? 'dashboard-container' : ''}`}
    >
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandPage />} />
          <Route path="skill-mapping" element={<SkillMapping />} />
          <Route path="dataset-explorer" element={<TabiyaDatasetExplorer />} />
        </Route>
        {/* Dashboard routes without AppLayout (no nav/footer) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DarkModeContext>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </DarkModeContext>
  </QueryClientProvider>
);

export default App;
