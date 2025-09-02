import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCareerExploreDropdownOpen, setIsCareerExploreDropdownOpen] =
    useState(false);
  const [isMobileCareerExploreOpen, setIsMobileCareerExploreOpen] =
    useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsCareerExploreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full sticky top-0 bg-tabiya-dark/70 backdrop-blur-md px-4 sm:px-8 md:px-12 lg:px-16 py-3 md:py-4 z-50 border-b border-white/10 transition-all duration-300">
      <div className="w-full flex items-center justify-between">
        {/* Left Side - Logo and Navigation */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* JobCompass Modern Logo */}
          <a href="#" className="flex items-center group select-none">
            <span className="text-2xl font-bold text-white tracking-wide font-sans group-hover:text-tabiya-accent transition-colors">
              Job<span className="text-tabiya-accent">Compass</span>
            </span>
          </a>
          {/* Navigation Links */}
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#features"
              className="text-white font-sans text-base font-medium leading-6 hover:text-tabiya-accent transition-colors"
            >
              About Us
            </a>
            <a
              href="#features"
              className="text-white font-sans text-base font-medium leading-6 hover:text-tabiya-accent transition-colors"
            >
              Features
            </a>
            <a
              href="#tools"
              className="text-white font-sans text-base font-medium leading-6 hover:text-tabiya-accent transition-colors"
            >
              Key Tools
            </a>
            <a
              href="#"
              className="text-white font-sans text-base font-medium leading-6 hover:text-tabiya-accent transition-colors"
            >
              Job Insights
            </a>

            {/* Career Explore Dropdown */}
            <div
              className="relative dropdown-container"
              onMouseEnter={() => setIsCareerExploreDropdownOpen(true)}
              onMouseLeave={() => setIsCareerExploreDropdownOpen(false)}
            >
              <button
                onClick={() =>
                  setIsCareerExploreDropdownOpen(!isCareerExploreDropdownOpen)
                }
                className="flex items-center gap-1 text-white font-sans text-base font-medium leading-6 hover:text-tabiya-accent transition-colors"
              >
                Career Explore
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCareerExploreDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isCareerExploreDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-56 bg-tabiya-dark/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50"
                  onMouseEnter={() => setIsCareerExploreDropdownOpen(true)}
                  onMouseLeave={() => setIsCareerExploreDropdownOpen(false)}
                >
                  <div className="py-2">
                    <a
                      href="#job-explorer"
                      className="block px-4 py-3 text-white/90 hover:text-white hover:bg-tabiya-accent/10 font-sans text-sm font-medium transition-colors border-b border-white/5 last:border-b-0"
                      onClick={() => setIsCareerExploreDropdownOpen(false)}
                    >
                      Job Explorer
                      <div className="text-xs text-white/60 mt-1">
                        Browse jobs and see required skills
                      </div>
                    </a>
                    <Link
                      to="/skill-mapping"
                      className="block px-4 py-3 text-white/90 hover:text-white hover:bg-tabiya-accent/10 font-sans text-sm font-medium transition-colors"
                      onClick={() => setIsCareerExploreDropdownOpen(false)}
                    >
                      Skill mapping
                      <div className="text-xs text-white/60 mt-1">
                        Explore skills and connected occupations
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/dataset-explorer"
              className="text-white font-sans text-base font-medium leading-6 hover:text-tabiya-accent transition-colors"
            >
              Tabiya Data
            </Link>
            <a
              href="#cta"
              className="text-white font-sans text-base font-medium leading-6 hover:text-tabiya-accent transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Center - Logo */}
        {/* <div className="flex items-center justify-center px-7 py-0">
          <svg
            width="70"
            height="36"
            viewBox="0 0 71 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[70px] h-9"
          >
            <g clipPath="url(#clip0_10_54)">
              <path
                d="M67.9112 17.0815L67.8741 17.1187C68.1343 16.4125 68.6546 16.1523 69.1006 16.1523C69.7325 16.1523 70.29 16.6355 70.29 17.3417C70.29 17.4904 70.29 17.6762 70.2157 17.8992C68.9148 21.2444 66.1643 22.9541 63.4882 23.2143C62.2617 25.2957 60.2546 26.8196 57.3926 26.8196C53.3041 26.8196 51.4829 23.586 51.4829 20.055C51.4829 15.7063 54.2334 10.8744 58.8422 10.8744C59.8457 10.8744 60.7006 11.0975 61.4068 11.3948C63.4882 12.1753 64.8263 14.8886 64.8263 17.7877C64.8263 18.7169 64.7519 19.6461 64.5289 20.5382C65.9042 20.055 67.205 18.9399 67.9112 17.0815ZM60.1431 13.9222V13.8851C59.3254 13.8851 58.8422 14.9629 58.8422 16.2638C58.8422 18.1594 59.8829 19.9063 61.5183 20.5382C61.7785 19.7205 61.89 18.7913 61.89 17.7134C61.89 15.632 61.2581 13.9222 60.1431 13.9222ZM57.4298 24.1063C58.4705 24.1063 59.5112 23.6603 60.3289 22.7311C57.913 21.6532 56.3891 19.1258 56.3891 16.7098C56.3891 15.8921 56.5378 15.0373 56.7608 14.2939C55.2741 15.5205 54.4192 17.9364 54.4192 20.055C54.4192 22.8054 55.7201 24.1063 57.4298 24.1063Z"
                fill="white"
              />
              <path
                d="M52.0568 17.0815L52.0196 17.1187C52.2798 16.4125 52.7258 16.1152 53.1718 16.1152C53.8037 16.1152 54.4355 16.6727 54.4355 17.3789C54.4355 17.5647 54.3984 17.7134 54.324 17.8992C52.8745 21.4302 50.7187 25.5559 47.2621 27.9718L47.1878 28.7152C46.7789 33.1754 44.5117 36.0001 41.6497 36.0001C39.4939 36.0001 38.2302 34.5134 38.2302 32.7665C38.2302 29.6072 41.4638 28.455 44.4745 26.5223C44.5488 25.7417 44.586 24.8497 44.6231 23.8461C43.1364 25.4815 41.5382 26.1506 40.1258 26.1506C37.301 26.1506 34.9966 23.8461 34.9966 20.3152C34.9966 14.8886 38.5647 11.3205 42.5417 11.3205H42.5789C45.2922 11.3205 48.1913 12.77 48.1913 15.3718C48.1913 16.2267 47.8196 20.8727 47.5223 24.478C49.5293 22.5824 51.2019 19.4975 52.0568 17.0815ZM40.5346 23.4745C41.9099 23.4745 43.7683 22.6196 44.9205 18.4196C45.1063 17.4904 45.2178 16.6727 45.1807 15.7063C44.9577 14.7028 44.1028 14.1081 42.8762 14.1081C40.3488 14.1081 37.9329 16.524 37.9329 20.2037C37.9329 22.4338 38.9736 23.4745 40.5346 23.4745ZM41.947 33.2869H41.9842C42.7647 33.2869 43.6196 32.7665 44.1771 29.4214C42.5417 30.3877 41.0178 31.3541 41.0178 32.5063C41.0178 32.9895 41.3895 33.2869 41.947 33.2869Z"
                fill="white"
              />
              <path
                d="M35.649 17.0815L35.6119 17.1187C35.872 16.4125 36.3924 16.1523 36.8384 16.1523C37.4703 16.1523 38.0278 16.6355 38.0278 17.3417C38.0278 17.4904 38.0278 17.6762 37.9535 17.8992C36.6526 21.2444 33.9021 22.9541 31.226 23.2143C29.9995 25.2957 27.9924 26.8196 25.1304 26.8196C21.0419 26.8196 19.2207 23.586 19.2207 20.055C19.2207 15.7063 21.9711 10.8744 26.58 10.8744C27.5835 10.8744 28.4384 11.0975 29.1446 11.3948C31.226 12.1753 32.5641 14.8886 32.5641 17.7877C32.5641 18.7169 32.4897 19.6461 32.2667 20.5382C33.642 20.055 34.9428 18.9399 35.649 17.0815ZM27.8809 13.9222V13.8851C27.0632 13.8851 26.58 14.9629 26.58 16.2638C26.58 18.1594 27.6207 19.9063 29.2561 20.5382C29.5163 19.7205 29.6278 18.7913 29.6278 17.7134C29.6278 15.632 28.9959 13.9222 27.8809 13.9222ZM25.1676 24.1063C26.2083 24.1063 27.249 23.6603 28.0667 22.7311C25.6508 21.6532 24.1269 19.1258 24.1269 16.7098C24.1269 15.8921 24.2756 15.0373 24.4986 14.2939C23.0119 15.5205 22.157 17.9364 22.157 20.055C22.157 22.8054 23.4579 24.1063 25.1676 24.1063Z"
                fill="white"
              />
              <path
                d="M21.1096 15.9083C20.5892 15.9083 20.1432 16.1685 19.8458 16.8747C18.8795 19.3278 16.8723 23.4907 14.828 23.4907C13.5408 23.4907 12.5447 23.1996 11.5381 22.9054C10.5102 22.605 9.47142 22.3013 8.10053 22.3013C7.61733 22.3013 6.94829 22.3757 6.31642 22.4872C8.22 19.8914 8.93114 16.7477 9.62022 10.8054C8.32276 10.7228 7.26735 10.4831 6.49807 10.241C5.67642 17.7775 4.74336 20.6511 1.33579 23.4907C0.889758 23.8624 0.666748 24.3828 0.666748 24.9032C0.666748 25.7209 1.37296 26.4271 2.26502 26.4271C2.56237 26.4271 2.89688 26.3156 3.2314 26.1669C5.12702 25.312 6.27925 25.089 7.69167 25.089C8.58984 25.089 9.66458 25.3459 10.8152 25.6208C12.1406 25.9376 13.5667 26.2784 14.9396 26.2784C17.9502 26.2784 19.9202 23.3421 22.1131 17.6552C22.2247 17.4694 22.2618 17.2464 22.2618 17.0605C22.2618 16.3543 21.7043 15.9083 21.1096 15.9083Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.68666 8.70287C7.35975 8.93784 8.41057 9.2114 9.773 9.29233L9.99601 9.29222C14.1961 9.29222 16.9466 6.6904 16.9466 3.56821C16.9466 1.56109 15.3855 0 13.1925 0C10.2562 0 8.21191 2.00712 7.17118 5.98419C5.87027 5.27798 4.97822 4.01424 4.53219 2.41598C4.30917 1.63543 3.82598 1.15223 3.15693 1.15223C2.33922 1.15223 1.81885 1.78411 1.81885 2.63899C1.81885 5.16648 3.78881 7.58245 6.68798 8.69752L6.68666 8.70287ZM10.219 6.57889C10.7765 4.01424 11.6686 2.78767 12.858 2.78767C13.4899 2.78767 13.8987 3.15936 13.8987 3.8284C13.8987 5.05497 12.5978 6.50455 10.219 6.57889Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_10_54">
                <rect
                  width="70"
                  height="36"
                  fill="white"
                  transform="translate(0.666748)"
                />
              </clipPath>
            </defs>
          </svg>
          </div> */}

        {/* Right Side - Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button className="px-5 py-2 rounded border border-white/20 bg-transparent text-white font-sans text-base font-medium hover:bg-white hover:text-tabiya-dark transition-colors duration-200">
            Sign In
          </button>
          <button className="px-5 py-2 rounded border border-tabiya-accent bg-tabiya-accent text-white font-sans text-base font-medium hover:bg-white hover:text-tabiya-dark transition-colors duration-200">
            Sign Up
          </button>
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden flex items-center">
          <button
            className="inline-flex items-center justify-center p-2 rounded text-white hover:bg-tabiya-accent/20 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open menu"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute left-0 top-full w-full bg-tabiya-dark border-t border-white/10 shadow-lg z-40 animate-fade-in">
          <div className="flex flex-col gap-2 p-4">
            <a
              href="#features"
              className="text-white font-sans text-base font-medium py-2 px-2 rounded hover:bg-tabiya-accent/10 hover:text-tabiya-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </a>
            <a
              href="#features"
              className="text-white font-sans text-base font-medium py-2 px-2 rounded hover:bg-tabiya-accent/10 hover:text-tabiya-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#tools"
              className="text-white font-sans text-base font-medium py-2 px-2 rounded hover:bg-tabiya-accent/10 hover:text-tabiya-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Key Tools
            </a>
            <a
              href="#"
              className="text-white font-sans text-base font-medium py-2 px-2 rounded hover:bg-tabiya-accent/10 hover:text-tabiya-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Job Insights
            </a>

            {/* Career Explore Mobile Submenu */}
            <div className="py-2 px-2">
              <button
                onClick={() =>
                  setIsMobileCareerExploreOpen(!isMobileCareerExploreOpen)
                }
                className="flex items-center justify-between w-full text-white font-sans text-base font-medium hover:bg-tabiya-accent/10 hover:text-tabiya-accent transition-colors rounded py-1"
              >
                Career Explore
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileCareerExploreOpen ? 'rotate-180' : ''
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </button>
              {isMobileCareerExploreOpen && (
                <div className="pl-4 space-y-1 mt-2 animate-fadeIn">
                  <a
                    href="#job-explorer"
                    className="block text-white/90 font-sans text-sm font-medium py-2 hover:text-tabiya-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Job Explorer
                    <div className="text-xs text-white/60 mt-1">
                      Browse jobs and see required skills
                    </div>
                  </a>
                  <Link
                    to="/skill-mapping"
                    className="block text-white/90 font-sans text-sm font-medium py-2 hover:text-tabiya-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Skill Mapping
                    <div className="text-xs text-white/60 mt-1">
                      Explore skills and connected occupations
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <a
              href="#credits"
              className="text-white font-sans text-base font-medium py-2 px-2 rounded hover:bg-tabiya-accent/10 hover:text-tabiya-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tabiya Data
            </a>
            <a
              href="#cta"
              className="text-white font-sans text-base font-medium py-2 px-2 rounded hover:bg-tabiya-accent/10 hover:text-tabiya-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 px-5 py-2 rounded border border-white/20 bg-transparent text-white font-sans text-base font-medium hover:bg-white hover:text-tabiya-dark transition-colors duration-200">
                Sign In
              </button>
              <button className="flex-1 px-5 py-2 rounded border border-tabiya-accent bg-tabiya-accent text-white font-sans text-base font-medium hover:bg-white hover:text-tabiya-dark transition-colors duration-200">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
