import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAnchorNavigation } from '@/hooks/useAnchorNavigation';
import { FooterLogo } from '@/components/ui/Logo';

export const Footer = () => {
  const { isDark } = useDarkMode();
  const { navigateToSection } = useAnchorNavigation();

  return (
    <footer
      className={`w-full border-t ${
        isDark
          ? 'bg-tabiya-dark border-tabiya-medium/30'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16">
        <ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-start">
                <FooterLogo />
              </div>

              <div className="space-y-4">
                <h3
                  className={`font-sans text-2xl md:text-3xl font-bold leading-tight ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Explore Your Career Path with
                  <span className="block text-tabiya-accent">
                    Tabiya Technology
                  </span>
                </h3>
                <p
                  className={`font-sans font-medium leading-relaxed text-lg ${
                    isDark ? 'text-white/80' : 'text-gray-600'
                  }`}
                >
                  Discover how jobs and skills connect in today's dynamic labor
                  market through data-driven insights.
                </p>
                <div className="flex gap-4 pt-2">
                  <button
                    className={`font-sans font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                      isDark
                        ? 'bg-gradient-to-r from-tabiya-accent to-red-600 hover:from-red-500 hover:to-tabiya-accent text-white'
                        : 'bg-gradient-to-r from-tabiya-accent to-red-600 hover:from-red-500 hover:to-tabiya-accent text-white'
                    }`}
                  >
                    Start Exploring
                  </button>
                  <button
                    className={`font-sans font-semibold px-8 py-3 rounded-xl transition-all duration-300 border-2 hover:shadow-lg transform hover:-translate-y-1 ${
                      isDark
                        ? 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4
                className={`font-sans text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Career Insights
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigateToSection('features')}
                    className={`font-sans font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-white/80 hover:text-tabiya-accent'
                        : 'text-gray-600 hover:text-tabiya-accent'
                    }`}
                  >
                    Skill Mapping
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection('tools')}
                    className={`font-sans font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-white/80 hover:text-tabiya-accent'
                        : 'text-gray-600 hover:text-tabiya-accent'
                    }`}
                  >
                    Job Trends
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection('demo')}
                    className={`font-sans font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-white/80 hover:text-tabiya-accent'
                        : 'text-gray-600 hover:text-tabiya-accent'
                    }`}
                  >
                    Explore Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection('cta')}
                    className={`font-sans font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-white/80 hover:text-tabiya-accent'
                        : 'text-gray-600 hover:text-tabiya-accent'
                    }`}
                  >
                    Get Started
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4
                className={`font-sans text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigateToSection('features')}
                    className={`font-sans font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-white/80 hover:text-tabiya-accent'
                        : 'text-gray-600 hover:text-tabiya-accent'
                    }`}
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection('tools')}
                    className={`font-sans font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-white/80 hover:text-tabiya-accent'
                        : 'text-gray-600 hover:text-tabiya-accent'
                    }`}
                  >
                    Key Tools
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection('features')}
                    className={`font-sans font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-white/80 hover:text-tabiya-accent'
                        : 'text-gray-600 hover:text-tabiya-accent'
                    }`}
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection('faq')}
                    className={`font-sans font-medium transition-colors duration-300 ${
                      isDark
                        ? 'text-white/80 hover:text-tabiya-accent'
                        : 'text-gray-600 hover:text-tabiya-accent'
                    }`}
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4
                className={`font-sans text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Connect With Us
              </h4>
              <p
                className={`font-sans text-sm leading-relaxed ${
                  isDark ? 'text-white/70' : 'text-gray-600'
                }`}
              >
                Stay updated with the latest career insights and platform
                updates
              </p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group ${
                    isDark
                      ? 'bg-white/10 hover:bg-tabiya-accent hover:shadow-lg'
                      : 'bg-gray-100 hover:bg-tabiya-accent hover:shadow-lg hover:text-white'
                  }`}
                  aria-label="Follow us on Twitter"
                >
                  <svg
                    className={`w-5 h-5 transition-all duration-300 ${
                      isDark
                        ? 'text-white group-hover:text-white'
                        : 'text-gray-600 group-hover:text-white'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  <span
                    className={`text-sm font-medium group-hover:text-white ${isDark ? 'text-white/80' : 'text-gray-600'}`}
                  >
                    Twitter
                  </span>
                </a>
                <a
                  href="#"
                  className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group ${
                    isDark
                      ? 'bg-white/10 hover:bg-tabiya-accent hover:shadow-lg'
                      : 'bg-gray-100 hover:bg-tabiya-accent hover:shadow-lg hover:text-white'
                  }`}
                  aria-label="Connect on LinkedIn"
                >
                  <svg
                    className={`w-5 h-5 transition-all duration-300 ${
                      isDark
                        ? 'text-white group-hover:text-white'
                        : 'text-gray-600 group-hover:text-white'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span
                    className={`text-sm font-medium group-hover:text-white ${isDark ? 'text-white/80' : 'text-gray-600'}`}
                  >
                    LinkedIn
                  </span>
                </a>
                <a
                  href="#"
                  className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group ${
                    isDark
                      ? 'bg-white/10 hover:bg-red-600 hover:shadow-lg'
                      : 'bg-gray-100 hover:bg-red-600 hover:shadow-lg hover:text-white'
                  }`}
                  aria-label="Subscribe to our YouTube channel"
                >
                  <svg
                    className={`w-5 h-5 transition-all duration-300 ${
                      isDark
                        ? 'text-white group-hover:text-white'
                        : 'text-gray-600 group-hover:text-white'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span
                    className={`text-sm font-medium group-hover:text-white ${isDark ? 'text-white/80' : 'text-gray-600'}`}
                  >
                    YouTube
                  </span>
                </a>
                <a
                  href="#"
                  className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group ${
                    isDark
                      ? 'bg-white/10 hover:bg-red-600 hover:shadow-lg'
                      : 'bg-gray-100 hover:bg-red-600 hover:shadow-lg hover:text-white'
                  }`}
                  aria-label="Follow us on GitHub"
                >
                  <svg
                    className={`w-5 h-5 transition-all duration-300 ${
                      isDark
                        ? 'text-white group-hover:text-white'
                        : 'text-gray-600 group-hover:text-white'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span
                    className={`text-sm font-medium group-hover:text-white ${isDark ? 'text-white/80' : 'text-gray-600'}`}
                  >
                    GitHub
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div
            className={`mt-12 pt-8 border-t ${
              isDark ? 'border-white/10' : 'border-gray-300'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p
                className={`font-sans font-medium text-sm ${
                  isDark ? 'text-white/60' : 'text-gray-500'
                }`}
              >
                © 2025 JobCompass by{' '}
                <span className="font-semibold text-tabiya-accent">
                  Tabiya Technology
                </span>
                . All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <button
                  className={`font-sans font-medium transition-colors duration-300 ${
                    isDark
                      ? 'text-white/60 hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Privacy Policy
                </button>
                <button
                  className={`font-sans font-medium transition-colors duration-300 ${
                    isDark
                      ? 'text-white/60 hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Terms of Service
                </button>
                <button
                  className={`font-sans font-medium transition-colors duration-300 ${
                    isDark
                      ? 'text-white/60 hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Accessibility
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </footer>
  );
};
