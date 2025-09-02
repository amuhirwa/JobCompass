import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ui/scroll-animation';

export const DemoSection = () => {
  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 bg-tabiya-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-tabiya-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-white font-sans text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                See JobCompass in Action
              </h2>

              <p className="text-white/90 font-sans text-lg font-medium leading-relaxed">
                Experience the power of AI-driven career insights firsthand.
                Discover how JobCompass can help you navigate your professional
                journey by transforming complex career data into clear,
                actionable guidance that accelerates your career growth.
              </p>

              <p className="text-white/80 font-sans text-base font-medium leading-relaxed">
                Watch our interactive demo to see exactly how the system
                analyzes your skills, identifies opportunities you might have
                missed, and provides personalized recommendations to help you
                achieve your career goals faster than ever before.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-tabiya-medium/30 rounded-xl border border-tabiya-accent/20">
                  <div className="w-8 h-8 bg-tabiya-accent/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-tabiya-accent"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white font-sans text-sm font-medium">
                    Real-time Analysis
                  </span>
                </div>

                <div className="flex items-center gap-3 p-4 bg-tabiya-medium/30 rounded-xl border border-tabiya-accent/20">
                  <div className="w-8 h-8 bg-tabiya-accent/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-tabiya-accent"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-sans text-sm font-medium">
                    AI-Powered Insights
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Video Preview */}
          <div className="relative">
            <Card className="bg-gradient-to-br from-tabiya-medium/40 via-tabiya-medium/30 to-tabiya-dark/50 border border-tabiya-accent/30 shadow-2xl backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-tabiya-medium to-tabiya-dark">
                  {/* Placeholder for video */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Play button */}
                      <button className="group relative w-20 h-20 bg-tabiya-accent/90 hover:bg-tabiya-accent rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-tabiya-accent/50">
                        <svg
                          className="w-8 h-8 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>

                        {/* Pulse rings */}
                        <div className="absolute inset-0 rounded-full border-2 border-tabiya-accent animate-ping opacity-30"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-tabiya-accent animate-ping opacity-20 animation-delay-300"></div>
                      </button>
                    </div>
                  </div>

                  {/* Video thumbnail overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-tabiya-dark/80 via-transparent to-tabiya-accent/20"></div>

                  {/* Demo preview elements */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-tabiya-accent rounded-full animate-pulse"></div>
                      <span className="text-white/90 font-sans text-sm">
                        Live Demo Preview
                      </span>
                    </div>

                    {/* Mock interface elements */}
                    <div className="space-y-3 opacity-60">
                      <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                      <div className="h-2 bg-tabiya-accent/40 rounded-full w-1/2"></div>
                      <div className="h-2 bg-white/15 rounded-full w-2/3"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-tabiya-accent/30 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </div>
                        <span className="text-white/90 font-sans text-sm">
                          Interactive Experience
                        </span>
                      </div>

                      <div className="text-white/70 font-sans text-xs bg-black/30 rounded-full px-3 py-1">
                        2:30
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-tabiya-accent/20 rounded-full blur-xl animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/10 rounded-full blur-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
