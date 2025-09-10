import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAnchorNavigation } from '@/hooks/useAnchorNavigation';
import { useScrollspy } from '@/hooks/useScrollspy';
import { useAuth } from '@/lib/auth-context';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, changeMode } = useDarkMode();
  const { navigateToSection } = useAnchorNavigation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Use scrollspy to track active section
  const activeSection = useScrollspy({
    sectionIds: ['hero', 'tools', 'demo', 'testimonials', 'faq', 'cta'],
    rootMargin: '-10% 0px -80% 0px',
    threshold: 0.1,
  });

  return (
    <nav
      className={`w-full ${isDark ? 'bg-tabiya-dark/70' : 'bg-white/70'} backdrop-blur-md px-4 sm:px-8 md:px-12 lg:px-16 py-3 md:py-4 z-50 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} transition-all duration-300`}
    >
      <div className="w-full flex items-center justify-between">
        {/* Left Side - Logo and Navigation */}
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
          <Link to="/" className="flex items-center group select-none">
            <div className="flex items-center gap-3">
              <img
                src="/images/JobCompass Logo.png"
                alt="JobCompass"
                className={`h-8 w-auto transition-all duration-300 ${isDark ? 'brightness-100' : 'brightness-90'} group-hover:scale-105`}
              />
              <span
                className={` nav:hidden 2xl:block text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} tracking-wide font-sans group-hover:text-tabiya-accent transition-colors`}
              >
                JobCompass
              </span>
            </div>
          </Link>
          {/* Navigation Links - Hidden below 900px */}
          <div className="hidden nav:flex items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6">
            <button
              onClick={() => navigateToSection('features')}
              className={`font-sans text-sm xl:text-base font-medium transition-colors focus:outline-none ${
                activeSection === 'features'
                  ? 'text-tabiya-accent'
                  : isDark
                    ? 'text-white hover:text-tabiya-accent'
                    : 'text-gray-700 hover:text-tabiya-accent'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => navigateToSection('tools')}
              className={`font-sans text-sm xl:text-base font-medium transition-colors focus:outline-none ${
                activeSection === 'tools'
                  ? 'text-tabiya-accent'
                  : isDark
                    ? 'text-white hover:text-tabiya-accent'
                    : 'text-gray-700 hover:text-tabiya-accent'
              }`}
            >
              Key Tools
            </button>

            <NavLink
              to="/skill-mapping"
              className={({ isActive }) =>
                `${isDark ? 'text-white' : 'text-gray-700'} ${isActive ? 'text-tabiya-accent' : ''} font-sans text-sm xl:text-base font-medium hover:text-tabiya-accent transition-colors focus:outline-none focus:text-tabiya-accent`
              }
            >
              Career Explore
            </NavLink>

            <NavLink
              to="/taxonomy-navigator"
              className={({ isActive }) =>
                `${isDark ? 'text-white' : 'text-gray-700'} ${isActive ? 'text-tabiya-accent' : ''} font-sans text-sm xl:text-base font-medium hover:text-tabiya-accent transition-colors focus:outline-none focus:text-tabiya-accent`
              }
            >
              Skill Graph
            </NavLink>

            <NavLink
              to="/dataset-explorer"
              className={({ isActive }) =>
                `${isDark ? 'text-white' : 'text-gray-700'} ${isActive ? 'text-tabiya-accent' : ''} font-sans text-sm xl:text-base font-medium hover:text-tabiya-accent transition-colors focus:outline-none focus:text-tabiya-accent`
              }
            >
              Tabiya Data
            </NavLink>
            <button
              onClick={() => navigateToSection('cta')}
              className={`font-sans text-sm xl:text-base font-medium transition-colors focus:outline-none ${
                activeSection === 'cta'
                  ? 'text-tabiya-accent'
                  : isDark
                    ? 'text-white hover:text-tabiya-accent'
                    : 'text-gray-700 hover:text-tabiya-accent'
              }`}
            >
              Contact
            </button>
          </div>
        </div>

        {/* Right Side - Theme Toggle & Auth Buttons - Hidden below 900px */}
        <div className="hidden nav:flex items-center gap-1 md:gap-2 lg:gap-3">
          <button
            onClick={() => changeMode()}
            className={`p-2 rounded-lg ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg
                className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            // Avatar for authenticated users
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-tabiya-accent hover:bg-tabiya-accent/90 flex items-center justify-center transition-colors duration-200 group"
              aria-label="Go to dashboard"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            // Sign in/up buttons for unauthenticated users
            <>
              <button
                onClick={() => navigate('/login')}
                className={`px-3 lg:px-5 py-2 rounded border ${isDark ? 'border-white/20 bg-transparent text-white hover:bg-white hover:text-tabiya-dark' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} font-sans text-sm lg:text-base font-medium transition-colors duration-200`}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-3 lg:px-5 py-2 rounded border border-tabiya-accent bg-tabiya-accent text-white font-sans text-sm lg:text-base font-medium hover:bg-tabiya-accent/90 transition-colors duration-200"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Hamburger Menu - Show below 900px (tablets and mobile) */}
        <div className="nav:hidden flex items-center gap-2">
          <button
            onClick={() => changeMode()}
            className={`p-2 rounded-lg ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            className={`inline-flex items-center justify-center p-2 rounded ${isDark ? 'text-white hover:bg-tabiya-accent/20' : 'text-gray-700 hover:bg-gray-100'} focus:outline-none`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu - Show below 900px */}
      {isMobileMenuOpen && (
        <div
          className={`nav:hidden absolute left-0 top-full w-full ${isDark ? 'bg-tabiya-dark' : 'bg-white'} border-t ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-lg z-40 animate-fade-in`}
        >
          <div className="flex flex-col gap-2 p-4 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => {
                navigateToSection('features');
                setIsMobileMenuOpen(false);
              }}
              className={`font-sans text-base font-medium py-2 px-2 rounded transition-colors text-left focus:outline-none ${
                activeSection === 'features'
                  ? 'text-tabiya-accent'
                  : isDark
                    ? 'text-white hover:bg-tabiya-accent/10 hover:text-tabiya-accent'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-tabiya-accent'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => {
                navigateToSection('tools');
                setIsMobileMenuOpen(false);
              }}
              className={`font-sans text-base font-medium py-2 px-2 rounded transition-colors text-left focus:outline-none ${
                activeSection === 'tools'
                  ? 'text-tabiya-accent'
                  : isDark
                    ? 'text-white hover:bg-tabiya-accent/10 hover:text-tabiya-accent'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-tabiya-accent'
              }`}
            >
              Key Tools
            </button>

            <button
              onClick={() => {
                navigateToSection('job-explorer');
                setIsMobileMenuOpen(false);
              }}
              className={`${isDark ? 'text-white hover:bg-tabiya-accent/10 hover:text-tabiya-accent' : 'text-gray-700 hover:bg-gray-100 hover:text-tabiya-accent'} font-sans text-base font-medium py-2 px-2 rounded transition-colors text-left focus:outline-none focus:text-tabiya-accent`}
            >
              Job Explorer
            </button>
            <NavLink
              to="/skill-mapping"
              className={({ isActive }) =>
                `${isDark ? 'text-white hover:bg-tabiya-accent/10 hover:text-tabiya-accent' : 'text-gray-700 hover:bg-gray-100 hover:text-tabiya-accent'} ${isActive ? 'text-tabiya-accent' : ''} font-sans text-base font-medium py-2 px-2 rounded transition-colors focus:outline-none focus:text-tabiya-accent`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Skill Mapping
            </NavLink>

            <NavLink
              to="/dataset-explorer"
              className={({ isActive }) =>
                `${isDark ? 'text-white hover:bg-tabiya-accent/10 hover:text-tabiya-accent' : 'text-gray-700 hover:bg-gray-100 hover:text-tabiya-accent'} ${isActive ? 'text-tabiya-accent' : ''} font-sans text-base font-medium py-2 px-2 rounded transition-colors focus:outline-none focus:text-tabiya-accent`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tabiya Data
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${isDark ? 'text-white hover:bg-tabiya-accent/10 hover:text-tabiya-accent' : 'text-gray-700 hover:bg-gray-100 hover:text-tabiya-accent'} ${isActive ? 'text-tabiya-accent' : ''} font-sans text-base font-medium py-2 px-2 rounded transition-colors focus:outline-none focus:text-tabiya-accent`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
            <button
              onClick={() => {
                navigateToSection('cta');
                setIsMobileMenuOpen(false);
              }}
              className={`font-sans text-base font-medium py-2 px-2 rounded transition-colors text-left focus:outline-none ${
                activeSection === 'cta'
                  ? 'text-tabiya-accent'
                  : isDark
                    ? 'text-white hover:bg-tabiya-accent/10 hover:text-tabiya-accent'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-tabiya-accent'
              }`}
            >
              Contact
            </button>

            {/* Auth Section in Mobile Menu */}
            <div className="border-t border-gray-200/20 pt-4 mt-4">
              {isAuthenticated ? (
                // Avatar and logout for authenticated users
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full py-2 px-2 rounded hover:bg-tabiya-accent/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-tabiya-accent flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-sans text-base font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}
                    >
                      Go to Dashboard
                    </span>
                  </button>
                </div>
              ) : (
                // Sign in/up buttons for unauthenticated users
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className={`flex-1 px-5 py-2 rounded border ${isDark ? 'border-white/20 bg-transparent text-white hover:bg-white hover:text-tabiya-dark' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} font-sans text-base font-medium transition-colors duration-200`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="flex-1 px-5 py-2 rounded border border-tabiya-accent bg-tabiya-accent text-white font-sans text-base font-medium hover:bg-tabiya-accent/90 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
