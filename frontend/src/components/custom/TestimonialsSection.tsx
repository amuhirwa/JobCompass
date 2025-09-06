import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { useDarkMode } from '@/contexts/DarkModeContext';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    position: 'Product Manager, TechFlow',
    quote:
      'JobCompass transformed my career journey. The AI-powered insights helped me identify skills I never knew I needed and connected me with opportunities that perfectly matched my goals.',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face',
    company: 'TechFlow',
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    position: 'Software Engineering Lead, DataCore',
    quote:
      'Finally, a platform that makes complex career data accessible and actionable. The skill mapping feature revolutionized how I plan my professional development.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    company: 'DataCore',
  },
  {
    id: 3,
    name: 'Emily Thompson',
    position: 'UX Design Director, CreativeHub',
    quote:
      "JobCompass's intuitive design and comprehensive data made my career transition seamless. I discovered new opportunities I never considered before.",
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    company: 'CreativeHub',
  },
  {
    id: 4,
    name: 'David Park',
    position: 'Data Scientist, InnovateLabs',
    quote:
      'Navigating the job market has never been easier. The AI-powered recommendations are incredibly accurate and helped me land my dream role.',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    company: 'InnovateLabs',
  },
  {
    id: 5,
    name: 'Lisa Wang',
    position: 'Marketing Director, BrandForward',
    quote:
      "The insights provided by JobCompass are game-changing. It's like having a career coach available 24/7 with data-driven recommendations.",
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    company: 'BrandForward',
  },
];

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[0];
  isVisible: boolean;
}

const TestimonialCard = ({ testimonial, isVisible }: TestimonialCardProps) => {
  const { isDark } = useDarkMode();

  return (
    <Card
      className={`
        w-full h-48 transition-all duration-700 ease-out transform shadow-lg
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${
          isDark
            ? 'bg-gradient-to-br from-tabiya-medium/90 via-tabiya-medium/80 to-tabiya-dark/90 border-tabiya-accent/30 hover:border-tabiya-accent/50 hover:from-tabiya-medium/95 hover:via-tabiya-medium/90 hover:to-tabiya-dark/95'
            : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
        } backdrop-blur-sm hover:shadow-2xl
      `}
    >
      <CardContent className="p-6 h-full flex items-center gap-6">
        <div className="flex-shrink-0">
          <div
            className={`w-20 h-20 rounded-full overflow-hidden shadow-lg ${
              isDark
                ? 'border-3 border-tabiya-accent/50'
                : 'border-3 border-tabiya-accent/30'
            }`}
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 fill-current drop-shadow-sm ${
                  isDark ? 'text-tabiya-accent' : 'text-tabiya-accent'
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          <blockquote
            className={`font-sans text-sm leading-relaxed mb-3 line-clamp-3 ${
              isDark ? 'text-white' : 'text-gray-700'
            }`}
          >
            "{testimonial.quote}"
          </blockquote>

          <div className="flex items-center justify-between">
            <div>
              <div
                className={`font-sans font-bold text-sm ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {testimonial.name}
              </div>
              <div
                className={`font-sans text-xs font-medium ${
                  isDark ? 'text-tabiya-accent' : 'text-tabiya-accent'
                }`}
              >
                {testimonial.position}
              </div>
            </div>
            <div
              className={`font-sans text-xs rounded-full px-3 py-1 ${
                isDark
                  ? 'text-white/70 bg-tabiya-accent/20 border border-tabiya-accent/20'
                  : 'text-gray-600 bg-orange-50 border border-tabiya-accent/20'
              }`}
            >
              {testimonial.company}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isDark } = useDarkMode();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextTestimonial();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToTestimonial = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <section
      className={`w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-tabiya-darker via-tabiya-dark to-tabiya-darker'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDark ? 'bg-tabiya-accent/3' : 'bg-tabiya-accent/5'
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-2xl animate-bounce ${
            isDark ? 'bg-white/3' : 'bg-purple-500/5'
          }`}
        ></div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2
              className={`font-sans text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              What Our Users Say
            </h2>
            <p
              className={`font-sans text-lg leading-relaxed max-w-3xl mx-auto ${
                isDark ? 'text-white/80' : 'text-gray-600'
              }`}
            >
              Discover how JobCompass has transformed careers and helped
              professionals unlock their potential.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="flex items-center justify-center gap-8 lg:gap-16">
            <div className="flex flex-col items-center gap-8">
              <Button
                onClick={prevTestimonial}
                disabled={isAnimating}
                variant="outline"
                size="icon"
                className={`w-12 h-12 rounded-full transition-all duration-300 disabled:opacity-50 group ${
                  isDark
                    ? 'bg-tabiya-medium/80 border-tabiya-accent/40 text-tabiya-accent hover:bg-tabiya-accent hover:text-white'
                    : 'bg-white border-tabiya-accent text-tabiya-accent hover:bg-tabiya-accent hover:text-white'
                }`}
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                </svg>
              </Button>

              <div className="flex flex-col gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    disabled={isAnimating}
                    className={`
                      rounded-full transition-all duration-300 cursor-pointer
                      ${
                        index === currentIndex
                          ? isDark
                            ? 'w-2 h-8 bg-tabiya-accent shadow-lg shadow-tabiya-accent/30'
                            : 'w-2 h-8 bg-tabiya-accent shadow-lg shadow-tabiya-accent/30'
                          : isDark
                            ? 'w-1.5 h-6 bg-white/30 hover:bg-white/50'
                            : 'w-1.5 h-6 bg-gray-300 hover:bg-gray-400'
                      }
                    `}
                  />
                ))}
              </div>

              <Button
                onClick={nextTestimonial}
                disabled={isAnimating}
                variant="outline"
                size="icon"
                className={`w-12 h-12 rounded-full transition-all duration-300 disabled:opacity-50 group ${
                  isDark
                    ? 'bg-tabiya-medium/80 border-tabiya-accent/40 text-tabiya-accent hover:bg-tabiya-accent hover:text-white'
                    : 'bg-white border-tabiya-accent text-tabiya-accent hover:bg-tabiya-accent hover:text-white'
                }`}
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </Button>
            </div>

            <div className="flex-1 max-w-3xl">
              <div className="relative h-[600px] overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out"
                  style={{
                    transform: `translateY(-${currentIndex * 200}px)`,
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className="absolute inset-x-0 transition-all duration-700 ease-out"
                      style={{
                        transform: `translateY(${index * 200}px)`,
                        zIndex:
                          testimonials.length - Math.abs(index - currentIndex),
                      }}
                    >
                      <TestimonialCard
                        testimonial={testimonial}
                        isVisible={Math.abs(index - currentIndex) < 3}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};
