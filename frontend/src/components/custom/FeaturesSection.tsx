import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAnchorNavigation } from '@/hooks/useAnchorNavigation';
import { useNavigate } from 'react-router-dom';
import {
  ScrollAnimation,
  ScrollAnimationContainer,
  ScrollAnimationItem,
} from '@/components/ui/scroll-animation';

const features = [
  {
    icon: (
      <svg
        className="w-10 h-10 text-tabiya-accent"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'Discover Your Ideal Career Path',
    shortDescription:
      'Explore various occupations tailored to your interests and skills.',
    fullDescription:
      'Explore various occupations tailored to your interests, skills, and aspirations. Our intelligent matching system helps you discover career paths you might never have considered, opening doors to new possibilities and growth opportunities. We analyze your background, preferences, and market trends to suggest personalized career trajectories that align with your goals and the evolving job market.',
  },
  {
    icon: (
      <svg
        className="w-10 h-10 text-tabiya-accent"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M9 11H7v4h2v-4zm4-4H11v8h2V7zm4-2H15v10h2V5zm2.5 11.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      </svg>
    ),
    title: 'Match Skills with Job Opportunities',
    shortDescription:
      'Identify the skills needed for your dream job and bridge any gaps.',
    fullDescription:
      'Identify the skills needed for your dream job and discover how to bridge any gaps. Our comprehensive skill analysis shows you exactly what competencies are required and provides pathways to develop them effectively. We map current market demands to your existing skills, highlighting areas for improvement and suggesting targeted learning resources to enhance your professional profile.',
  },
  {
    icon: (
      <svg
        className="w-10 h-10 text-tabiya-accent"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
    title: 'Gain Insights into Labor Market Trends',
    shortDescription:
      'Stay informed about the evolving job landscape with real-time analysis.',
    fullDescription:
      'Stay informed about the evolving job landscape with real-time market analysis. Understand which industries are growing, what skills are in demand, and where the best opportunities lie for your career advancement. Our data-driven insights help you make informed decisions about your professional development, ensuring you stay ahead of market trends and position yourself for success in emerging fields.',
  },
];

export const FeaturesSection = () => {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const { isDark } = useDarkMode();
  const { navigateToSection } = useAnchorNavigation();
  const navigate = useNavigate();

  const toggleFeature = (featureIndex: number) => {
    setExpandedFeature(expandedFeature === featureIndex ? null : featureIndex);
  };

  return (
    <section
      id="features"
      className={`w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 ${isDark ? 'bg-tabiya-dark' : 'bg-white'} relative overflow-hidden`}
      aria-labelledby="features-heading"
    >
      <div className="w-full max-w-7xl mx-auto">
        <ScrollAnimation className="text-center mb-16">
          <p
            className="text-tabiya-accent font-sans text-sm font-medium uppercase tracking-wide mb-4"
            aria-label="Section category"
          >
            Explore
          </p>
          <h2
            id="features-heading"
            className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-3xl sm:text-4xl md:text-5xl font-bold leading-[110%] mb-6 max-w-4xl mx-auto`}
          >
            Unlock Your Career Potential with JobCompass
          </h2>
          <p
            className={`${isDark ? 'text-white/90' : 'text-gray-700'} font-sans text-lg font-medium leading-[140%] max-w-3xl mx-auto`}
            id="features-description"
          >
            JobCompass empowers you to navigate the complex world of jobs and
            skills. Discover pathways that align with your aspirations and
            market demands.
          </p>
        </ScrollAnimation>

        <ScrollAnimationContainer
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12"
          staggerDelay={0.2}
        >
          {features.map((feature, index) => (
            <ScrollAnimationItem key={index}>
              <Card
                className={`${isDark ? 'bg-tabiya-medium/30 border-white/10 hover:border-tabiya-accent/30' : 'bg-white border-gray-200 hover:border-tabiya-accent/50'} rounded-2xl border transition-all duration-300 group backdrop-blur-sm shadow-lg hover:shadow-xl`}
                role="article"
                aria-labelledby={`feature-title-${index}`}
                aria-describedby={`feature-description-${index}`}
              >
                <CardHeader className="p-8 pb-0">
                  <div
                    className={`w-20 h-20 ${isDark ? 'bg-tabiya-accent/20 group-hover:bg-tabiya-accent/30' : 'bg-tabiya-accent/10 group-hover:bg-tabiya-accent/20'} rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300`}
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>

                  <h3
                    id={`feature-title-${index}`}
                    className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-xl font-bold mb-4`}
                  >
                    {feature.title}
                  </h3>
                </CardHeader>

                <CardContent className="p-8 pt-0">
                  <p
                    id={`feature-description-${index}`}
                    className={`${isDark ? 'text-white/80' : 'text-gray-700'} font-sans text-base leading-[150%] mb-6 font-medium`}
                  >
                    {expandedFeature === index
                      ? feature.fullDescription
                      : feature.shortDescription}
                  </p>

                  <Button
                    variant="read-more"
                    size="sm"
                    onClick={() => toggleFeature(index)}
                    className={`text-tabiya-accent font-sans text-sm font-semibold ${isDark ? 'hover:text-white' : 'hover:text-tabiya-accent/80'} transition-colors group p-0 h-auto focus:ring-2 focus:ring-tabiya-accent focus:ring-offset-2 focus:outline-none`}
                    aria-expanded={expandedFeature === index}
                    aria-controls={`feature-description-${index}`}
                    aria-label={`${expandedFeature === index ? 'Show less' : 'Show more'} information about ${feature.title}`}
                  >
                    {expandedFeature === index ? 'Read Less' : 'Read More'}
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandedFeature === index
                          ? 'rotate-90'
                          : 'group-hover:translate-x-1'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
                    </svg>
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationItem>
          ))}
        </ScrollAnimationContainer>

        <ScrollAnimation delay={0.6} className="text-center mt-16">
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            role="group"
            aria-labelledby="features-actions"
          >
            <span id="features-actions" className="sr-only">
              Features section call-to-action buttons
            </span>
            <Button
              variant="cta-outline"
              size="cta"
              className="font-sans font-medium transition-all duration-300 focus:ring-2 focus:ring-tabiya-accent focus:ring-offset-2 focus:outline-none"
              aria-describedby="features-description"
              onClick={() => navigateToSection('demo')}
            >
              Learn More
            </Button>
            <Button
              variant="cta-primary"
              size="cta"
              className="font-sans font-semibold transition-all duration-300 focus:ring-2 focus:ring-tabiya-accent focus:ring-offset-2 focus:outline-none"
              aria-describedby="features-description"
              onClick={() => navigate('/login')}
            >
              Sign Up
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
              </svg>
            </Button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};
