import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-tabiya-dark px-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-9xl font-bold text-white font-space-mono mb-8">404</h1>
        <h2 className="text-5xl text-white font-space-mono mb-6 leading-tight">
          Page Not Found
        </h2>
        <p className="text-white font-inter text-lg leading-relaxed mb-8">
          The page you're looking for doesn't exist. Let us know if you need help finding what you're looking for, and we'll help guide you back to exploring career opportunities with Tabiya.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-tabiya-accent border border-tabiya-accent text-white font-inter text-base font-medium leading-6 hover:bg-white hover:text-tabiya-dark transition-colors"
          >
            Go Home
          </a>
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-inter text-base font-medium leading-6 hover:bg-white hover:text-tabiya-dark transition-colors"
          >
            Explore Careers
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
