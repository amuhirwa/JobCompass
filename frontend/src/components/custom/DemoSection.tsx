import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { useDarkMode } from '@/contexts/DarkModeContext';

export const DemoSection = () => {
  const { isDark } = useDarkMode();

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      role="region"
      className={`w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 relative overflow-hidden ${
        isDark
          ? 'bg-tabiya-dark'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className={`absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse ${
            isDark ? 'bg-tabiya-accent/5' : 'bg-tabiya-accent/5'
          }`}
        ></div>
        <div
          className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-2xl animate-bounce ${
            isDark ? 'bg-white/3' : 'bg-orange-300/5'
          }`}
        ></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <ScrollAnimation>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2
                  id="demo-heading"
                  className={`font-sans text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  See JobCompass in Action
                </h2>

                <p
                  className={`font-sans text-lg font-medium leading-relaxed ${
                    isDark ? 'text-white/90' : 'text-gray-600'
                  }`}
                >
                  Experience the power of AI-driven career insights firsthand.
                  Discover how JobCompass can help you navigate your
                  professional journey by transforming complex career data into
                  clear, actionable guidance that accelerates your career
                  growth.
                </p>

                <p
                  className={`font-sans text-base font-medium leading-relaxed ${
                    isDark ? 'text-white/80' : 'text-gray-500'
                  }`}
                >
                  Watch our interactive demo to see exactly how the system
                  analyzes your skills, identifies opportunities you might have
                  missed, and provides personalized recommendations to help you
                  achieve your career goals faster than ever before.
                </p>
              </div>

              <div className="space-y-6" role="list" aria-label="Demo features">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl border ${
                      isDark
                        ? 'bg-tabiya-medium/30 border-tabiya-accent/20'
                        : 'bg-orange-50/80 border-orange-200'
                    }`}
                    role="listitem"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-tabiya-accent/20' : 'bg-orange-100'
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className={`w-4 h-4 ${
                          isDark ? 'text-tabiya-accent' : 'text-tabiya-accent'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span
                      className={`font-sans text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Real-time Analysis
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl border ${
                      isDark
                        ? 'bg-tabiya-medium/30 border-tabiya-accent/20'
                        : 'bg-orange-50/80 border-orange-200'
                    }`}
                    role="listitem"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-tabiya-accent/20' : 'bg-orange-100'
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className={`w-4 h-4 ${
                          isDark ? 'text-tabiya-accent' : 'text-tabiya-accent'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span
                      className={`font-sans text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      AI-Powered Insights
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Video Preview */}
            <div
              className="relative"
              role="img"
              aria-labelledby="demo-video-heading"
            >
              <h3 id="demo-video-heading" className="sr-only">
                Interactive Demo Video
              </h3>
              <Card
                className={`shadow-2xl backdrop-blur-sm overflow-hidden border ${
                  isDark
                    ? 'bg-gradient-to-br from-tabiya-medium/40 via-tabiya-medium/30 to-tabiya-dark/50 border-tabiya-accent/30'
                    : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-200'
                }`}
              >
                <CardContent className="p-0">
                  <div
                    className={`relative aspect-video ${
                      isDark
                        ? 'bg-gradient-to-br from-tabiya-medium to-tabiya-dark'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}
                  >
                    {/* Placeholder for video */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Play button */}
                        <button
                          className={`group relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:scale-110 shadow-2xl focus:outline-none focus:ring-4 focus:ring-tabiya-accent/50 ${
                            isDark
                              ? 'bg-tabiya-accent/90 hover:bg-tabiya-accent shadow-tabiya-accent/50'
                              : 'bg-tabiya-accent hover:bg-tabiya-accent/90 shadow-tabiya-accent/50'
                          }`}
                          aria-label="Play demo video"
                          type="button"
                        >
                          <svg
                            className="w-8 h-8 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>

                          {/* Pulse rings */}
                          <div
                            className={`absolute inset-0 rounded-full border-2 animate-ping opacity-30 ${
                              isDark
                                ? 'border-tabiya-accent'
                                : 'border-tabiya-accent'
                            }`}
                            aria-hidden="true"
                          ></div>
                          <div
                            className={`absolute inset-0 rounded-full border-2 animate-ping opacity-20 animation-delay-300 ${
                              isDark
                                ? 'border-tabiya-accent'
                                : 'border-tabiya-accent'
                            }`}
                            aria-hidden="true"
                          ></div>
                        </button>
                      </div>
                    </div>

                    {/* Video thumbnail overlay */}
                    <div
                      className={`absolute inset-0 ${
                        isDark
                          ? 'bg-gradient-to-tr from-tabiya-dark/80 via-transparent to-tabiya-accent/20'
                          : 'bg-gradient-to-tr from-gray-900/20 via-transparent to-tabiya-accent/20'
                      }`}
                      aria-hidden="true"
                    ></div>

                    {/* Demo preview elements */}
                    <div
                      className="absolute top-4 left-4 right-4"
                      aria-hidden="true"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className={`w-3 h-3 rounded-full animate-pulse ${
                            isDark ? 'bg-tabiya-accent' : 'bg-tabiya-accent'
                          }`}
                        ></div>
                        <span
                          className={`font-sans text-sm ${
                            isDark ? 'text-white/90' : 'text-gray-700'
                          }`}
                        >
                          Live Demo Preview
                        </span>
                      </div>

                      {/* Mock interface elements */}
                      <div className="space-y-3 opacity-60">
                        <div
                          className={`h-2 rounded-full w-3/4 ${
                            isDark ? 'bg-white/20' : 'bg-gray-300'
                          }`}
                        ></div>
                        <div
                          className={`h-2 rounded-full w-1/2 ${
                            isDark
                              ? 'bg-tabiya-accent/40'
                              : 'bg-tabiya-accent/60'
                          }`}
                        ></div>
                        <div
                          className={`h-2 rounded-full w-2/3 ${
                            isDark ? 'bg-white/15' : 'bg-gray-300'
                          }`}
                        ></div>
                      </div>
                    </div>

                    <div
                      className="absolute bottom-4 left-4 right-4"
                      aria-hidden="true"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isDark ? 'bg-tabiya-accent/30' : 'bg-orange-100'
                            }`}
                          >
                            <svg
                              className={`w-4 h-4 ${
                                isDark ? 'text-white' : 'text-tabiya-accent'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          </div>
                          <span
                            className={`font-sans text-sm ${
                              isDark ? 'text-white/90' : 'text-gray-700'
                            }`}
                          >
                            Interactive Experience
                          </span>
                        </div>

                        <div
                          className={`font-sans text-xs rounded-full px-3 py-1 ${
                            isDark
                              ? 'text-white/70 bg-black/30'
                              : 'text-gray-600 bg-white/80'
                          }`}
                        >
                          2:30
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating elements */}
              <div
                className={`absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl animate-bounce ${
                  isDark ? 'bg-tabiya-accent/20' : 'bg-tabiya-accent/20'
                }`}
                aria-hidden="true"
              ></div>
              <div
                className={`absolute -bottom-4 -left-4 w-12 h-12 rounded-full blur-lg animate-pulse ${
                  isDark ? 'bg-white/10' : 'bg-orange-300/20'
                }`}
                aria-hidden="true"
              ></div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};
