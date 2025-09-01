import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
  return (
    <Card
      className={`
        w-full h-48 bg-gradient-to-br from-tabiya-medium/90 via-tabiya-medium/80 to-tabiya-dark/90 
        border border-tabiya-accent/30 shadow-xl backdrop-blur-sm
        transition-all duration-700 ease-out transform
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        hover:shadow-2xl hover:border-tabiya-accent/50 hover:from-tabiya-medium/95 hover:via-tabiya-medium/90 hover:to-tabiya-dark/95
      `}
    >
      <CardContent className="p-6 h-full flex items-center gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-tabiya-accent/50 shadow-lg">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-tabiya-accent fill-current drop-shadow-sm"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-white font-sans text-sm leading-relaxed mb-3 line-clamp-3">
            "{testimonial.quote}"
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-sans font-bold text-sm">
                {testimonial.name}
              </div>
              <div className="text-tabiya-accent font-sans text-xs font-medium">
                {testimonial.position}
              </div>
            </div>
            <div className="text-white/70 font-sans text-xs bg-tabiya-accent/20 rounded-full px-3 py-1 border border-tabiya-accent/20">
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

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextTestimonial();
      }
    }, 4000);

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

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 bg-tabiya-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-tabiya-accent/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white font-sans text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            What Our Users Say
          </h2>
          <p className="text-white/80 font-sans text-lg leading-relaxed max-w-3xl mx-auto">
            Discover how JobCompass has transformed careers and helped
            professionals unlock their potential.
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 lg:gap-16">
          {/* Navigation Controls */}
          <div className="flex flex-col items-center gap-8">
            {/* Up Button */}
            <Button
              onClick={prevTestimonial}
              disabled={isAnimating}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full bg-tabiya-medium/80 border-tabiya-accent/40 text-tabiya-accent hover:bg-tabiya-accent hover:text-white transition-all duration-300 disabled:opacity-50 group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
              </svg>
            </Button>

            {/* Slide Indicators */}
            <div className="flex flex-col gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isAnimating}
                  className={`
                    rounded-full transition-all duration-300 cursor-pointer
                    ${
                      index === currentIndex
                        ? 'w-2 h-8 bg-tabiya-accent shadow-lg shadow-tabiya-accent/30'
                        : 'w-1.5 h-6 bg-white/30 hover:bg-white/50'
                    }
                  `}
                />
              ))}
            </div>

            {/* Down Button */}
            <Button
              onClick={nextTestimonial}
              disabled={isAnimating}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full bg-tabiya-medium/80 border-tabiya-accent/40 text-tabiya-accent hover:bg-tabiya-accent hover:text-white transition-all duration-300 disabled:opacity-50 group"
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

          {/* Testimonial Cards Container */}
          <div className="flex-1 max-w-3xl">
            <div className="relative h-[600px] overflow-hidden">
              {/* Card Stack */}
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
      </div>
    </section>
  );
};
