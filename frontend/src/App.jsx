import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandPage from './pages/LandPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandPage />} />
      </Routes>
    </BrowserRouter>
  );
}
