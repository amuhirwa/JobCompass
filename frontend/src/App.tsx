import './global.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { DarkModeContext, useDarkMode } from '@/contexts/DarkModeContext';
import { AuthProvider } from '@/lib/auth-context';

import NotFound from './pages/NotFound';
import LandPage from './pages/LandPage';
import SkillMapping from './pages/SkillMapping';
import TabiyaDatasetExplorer from './pages/TabiyaDatasetExplorer';
import OnboardingPage from './pages/OnboardingPage';
import AppLayout from './components/custom/AppLayout';
import { Dashboard } from './features/dashboard';
import LoginPage from './pages/LoginPage';
import TaxonomyNavigator from './pages/TaxanomyNavigator';

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
  const isTaxonomyNavigator = location.pathname === '/taxonomy-navigator';
  const isDashboard =
    location.pathname === '/dashboard' ||
    location.pathname === '/new-dashboard';

  // Scroll to top when pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      className={`min-h-screen w-full ${isDark ? 'bg-tabiya-dark' : 'bg-white'} ${isSkillMapping || isDatasetExplorer || isTaxonomyNavigator || isDashboard ? 'dashboard-container' : ''}`}
    >
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandPage />} />
          <Route path="skill-mapping" element={<SkillMapping />} />
          <Route path="dataset-explorer" element={<TabiyaDatasetExplorer />} />
          <Route path="taxonomy-navigator" element={<TaxonomyNavigator />} />
        </Route>
        {/* Dashboard routes without AppLayout (no nav/footer) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/new-dashboard" element={<Dashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DarkModeContext>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </DarkModeContext>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
