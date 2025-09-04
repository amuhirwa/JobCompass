import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  ScrollAnimation,
  ScrollAnimationContainer,
  ScrollAnimationItem,
} from '@/components/ui/scroll-animation';

export const HeroSection = () => {
  const { isDark } = useDarkMode();

  return (
    <section
      className={`w-full px-4 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 ${isDark ? 'bg-tabiya-dark' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'} relative overflow-hidden`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-tabiya-dark via-tabiya-dark/90 to-tabiya-medium/50' : 'bg-gradient-to-br from-blue-50/50 via-white/70 to-indigo-100/50'}`}
        ></div>

        {/* Floating geometric shapes */}
        <div
          className={`absolute top-10 right-10 w-32 h-32 ${isDark ? 'bg-tabiya-accent/20' : 'bg-blue-500/10'} rounded-full blur-xl animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-20 left-10 w-24 h-24 ${isDark ? 'bg-white/15' : 'bg-indigo-500/15'} rounded-full blur-lg animate-bounce`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/4 w-16 h-16 ${isDark ? 'bg-tabiya-accent/30' : 'bg-blue-400/20'} rotate-45 blur-md animate-spin`}
        ></div>
        <div
          className={`absolute top-20 left-1/2 w-20 h-20 ${isDark ? 'bg-white/10' : 'bg-purple-400/10'} rounded-full blur-lg animate-pulse`}
        ></div>

        {/* Grid pattern */}
        <div
          className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-5'}`}
        >
          <div className="grid grid-cols-12 gap-4 h-full">
            {[...Array(48)].map((_, i) => (
              <div
                key={i}
                className={`border ${isDark ? 'border-white/20' : 'border-gray-200/30'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center min-h-[600px] lg:min-h-[700px] gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 lg:pr-10">
            <div className="max-w-none">
              <ScrollAnimation delay={0.2}>
                <h1
                  className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[110%] tracking-tight mb-8`}
                >
                  Discover Your Path in the{' '}
                  <span className="text-tabiya-accent">World of Work</span>
                </h1>
              </ScrollAnimation>

              <ScrollAnimation delay={0.4}>
                <p
                  className={`${isDark ? 'text-white/90' : 'text-gray-700'} font-medium font-sans text-lg sm:text-xl leading-[140%] mb-10 max-w-2xl`}
                >
                  At JobCompass, we help individuals explore jobs and skills by
                  making the connections between occupations clearer and more
                  accessible. Inspired by the Tabiya dataset, we guide you in
                  navigating your career journey with structured insights.
                </p>
              </ScrollAnimation>

              <ScrollAnimation delay={0.6}>
                <div className="flex flex-row items-center gap-4 sm:gap-6">
                  <Button
                    variant="accent"
                    size="hero"
                    className="font-sans font-semibold leading-6 transition-all duration-300"
                  >
                    Explore Now
                  </Button>
                  <Button
                    variant="accent-outline"
                    size="hero"
                    className="font-sans font-medium leading-6 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </ScrollAnimation>
            </div>
          </div>

          {/* Right Content - Enhanced Image Grid */}
          <ScrollAnimationContainer
            className="flex-1 relative"
            staggerDelay={0.1}
          >
            <div
              className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-tabiya-accent/5 to-transparent' : 'bg-gradient-to-r from-blue-500/5 to-transparent'} rounded-3xl blur-3xl`}
            ></div>

            <div className="relative grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
              {/* Top Left - WAY UP HIGH */}
              <ScrollAnimationItem
                className="transform -translate-y-24 sm:-translate-y-32 translate-x-2 rotate-2"
                direction="left"
              >
                <div className="relative group">
                  <div
                    className={`absolute inset-0 ${isDark ? 'bg-tabiya-accent/20' : 'bg-blue-500/15'} rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300`}
                  ></div>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/08f049040e7e14881aa077d0f299b083e7bdc2ca?width=623"
                    alt="Career exploration"
                    className={`relative w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 border ${isDark ? 'border-white/10' : 'border-gray-200/30'}`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/20' : 'from-gray-900/10'} to-transparent rounded-2xl`}
                  ></div>
                </div>
              </ScrollAnimationItem>

              {/* Top Right - WAY DOWN LOW */}
              <ScrollAnimationItem
                className="transform translate-y-20 sm:translate-y-28 -translate-x-1 -rotate-1"
                direction="right"
              >
                <div className="relative group">
                  <div
                    className={`absolute inset-0 ${isDark ? 'bg-white/10' : 'bg-indigo-500/15'} rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300`}
                  ></div>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/133b6f62c0ddedbe91c116845a8fe3f43a144ee5?width=623"
                    alt="Job opportunities"
                    className={`relative w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 border ${isDark ? 'border-white/10' : 'border-gray-200/30'}`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/20' : 'from-gray-900/10'} to-transparent rounded-2xl`}
                  ></div>
                </div>
              </ScrollAnimationItem>

              {/* Bottom Left - DOWN LOW */}
              <ScrollAnimationItem
                className="transform translate-y-16 sm:translate-y-24 translate-x-3 -rotate-2"
                direction="left"
              >
                <div className="relative group">
                  <div
                    className={`absolute inset-0 ${isDark ? 'bg-white/10' : 'bg-purple-500/15'} rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300`}
                  ></div>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/2733900e63b37a281a3197b89178581ed6aa52e8?width=623"
                    alt="Professional development"
                    className={`relative w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 border ${isDark ? 'border-white/10' : 'border-gray-200/30'}`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/20' : 'from-gray-900/10'} to-transparent rounded-2xl`}
                  ></div>
                </div>
              </ScrollAnimationItem>

              {/* Bottom Right - UP HIGH */}
              <ScrollAnimationItem
                className="transform -translate-y-12 sm:-translate-y-20 -translate-x-2 rotate-1"
                direction="right"
              >
                <div className="relative group">
                  <div
                    className={`absolute inset-0 ${isDark ? 'bg-tabiya-accent/20' : 'bg-green-500/15'} rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300`}
                  ></div>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/fb964eae91a7157c5fe531c08c77b5b5dd0fb411?width=623"
                    alt="Career guidance"
                    className={`relative w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 border ${isDark ? 'border-white/10' : 'border-gray-200/30'}`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/20' : 'from-gray-900/10'} to-transparent rounded-2xl`}
                  ></div>
                </div>
              </ScrollAnimationItem>
            </div>

            {/* Floating accent elements around images */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-tabiya-accent rounded-full animate-ping opacity-30"></div>
            <div
              className={`absolute -bottom-4 -left-4 w-6 h-6 ${isDark ? 'bg-white/30' : 'bg-gray-400/40'} rounded-full animate-pulse`}
            ></div>
          </ScrollAnimationContainer>
        </div>
      </div>
    </section>
  );
};
