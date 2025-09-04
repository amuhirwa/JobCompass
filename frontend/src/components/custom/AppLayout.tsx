import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import Navigation from './Navigation';

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <main className="pt-[60px] xl:pt-[65px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
