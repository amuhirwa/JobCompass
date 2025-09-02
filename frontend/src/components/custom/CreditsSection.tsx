import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ui/scroll-animation';

export const CreditsSection = () => {
  return (
    <section
      id="credits"
      className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 bg-gradient-to-br from-tabiya-dark via-tabiya-medium/20 to-tabiya-dark relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-tabiya-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-white/3 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - Tabiya Logo */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <Card className="bg-gradient-to-br from-white/95 via-white to-white/90 border-2 border-tabiya-accent/20 shadow-2xl backdrop-blur-sm p-8 md:p-12 rounded-3xl transform hover:scale-105 transition-all duration-500">
                <CardContent className="p-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    {/* Tabiya Logo - Using the attached logo */}
                    <div className="flex items-center justify-center mb-6">
                      <img
                        src="/images/tabiya-logo.png"
                        alt="Tabiya Logo"
                        className="h-16 md:h-20 object-contain"
                        onError={(e) => {
                          // Fallback to creating a logo with SVG if image fails
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove(
                            'hidden'
                          );
                        }}
                      />
                      {/* SVG Fallback Logo */}
                      <div className="hidden">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                              <svg
                                className="w-7 h-7 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full opacity-60"></div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              tabiya
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-gray-900 font-sans text-lg font-bold">
                        Powered by Tabiya
                      </div>
                      <div className="text-gray-700 font-sans text-sm">
                        Open Data Taxonomy
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating elements around the logo */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-tabiya-accent/30 rounded-full blur-sm animate-bounce"></div>
              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-emerald-400/20 rounded-full blur-md animate-pulse"></div>
            </div>
          </div>

          {/* Right Content - Dataset Description */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-white font-sans text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Built on Comprehensive
                <span className="text-tabiya-accent"> Career Intelligence</span>
              </h2>

              <p className="text-white/90 font-sans text-lg font-medium leading-relaxed">
                Our platform leverages the Tabiya taxonomy—an open-data graph
                structure that maps the intricate connections between
                occupations and skills across the global labor market.
              </p>
            </div>

            {/* Data Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-tabiya-medium/40 border border-tabiya-accent/20 hover:border-tabiya-accent/40 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-tabiya-accent font-sans text-2xl font-bold mb-1">
                    3K+
                  </div>
                  <div className="text-white/80 font-sans text-xs">
                    Occupations
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-tabiya-medium/40 border border-tabiya-accent/20 hover:border-tabiya-accent/40 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-tabiya-accent font-sans text-2xl font-bold mb-1">
                    14K+
                  </div>
                  <div className="text-white/80 font-sans text-xs">Skills</div>
                </CardContent>
              </Card>

              <Card className="bg-tabiya-medium/40 border border-tabiya-accent/20 hover:border-tabiya-accent/40 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-tabiya-accent font-sans text-2xl font-bold mb-1">
                    650+
                  </div>
                  <div className="text-white/80 font-sans text-xs">Groups</div>
                </CardContent>
              </Card>

              <Card className="bg-tabiya-medium/40 border border-tabiya-accent/20 hover:border-tabiya-accent/40 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-tabiya-accent font-sans text-2xl font-bold mb-1">
                    130K+
                  </div>
                  <div className="text-white/80 font-sans text-xs">
                    Connections
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-tabiya-medium/20 rounded-xl border border-tabiya-accent/10">
                <div className="w-8 h-8 bg-tabiya-accent/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-tabiya-accent"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-sans text-sm font-semibold mb-1">
                    Hierarchically Organized
                  </div>
                  <div className="text-white/80 font-sans text-sm font-medium">
                    Structured data reveals how skills and occupations
                    interconnect across industries
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-tabiya-medium/20 rounded-xl border border-tabiya-accent/10">
                <div className="w-8 h-8 bg-tabiya-accent/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-tabiya-accent"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-sans text-sm font-semibold mb-1">
                    Open & Accessible
                  </div>
                  <div className="text-white/80 font-sans text-sm font-medium">
                    Transparent, community-driven data that evolves with the
                    changing job market
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
