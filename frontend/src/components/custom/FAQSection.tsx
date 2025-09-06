import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  ScrollAnimation,
  ScrollAnimationContainer,
  ScrollAnimationItem,
} from '@/components/ui/scroll-animation';

const faqs = [
  {
    id: 1,
    question: 'How does JobCompass use AI to provide career recommendations?',
    answer:
      'JobCompass leverages advanced machine learning algorithms trained on the comprehensive Tabiya dataset. Our AI analyzes your skills, experience, and career goals against over 130,000 occupation-skill associations to provide personalized recommendations and identify optimal career pathways.',
  },
  {
    id: 2,
    question: 'What makes the Tabiya dataset unique for career planning?',
    answer:
      'The Tabiya dataset is an open-source, hierarchically organized taxonomy that maps real-world connections between 3,000+ occupations and 14,000+ skills. Unlike static job boards, it reveals dynamic relationships and skill transferability across industries, providing deeper career insights.',
  },
  {
    id: 3,
    question:
      'Can JobCompass help me transition to a completely different industry?',
    answer:
      'Absolutely! JobCompass excels at identifying transferable skills and revealing unexpected career pathways. Our AI can map your existing skills to new industries and show you exactly what additional skills you need to make a successful transition.',
  },
  {
    id: 4,
    question: 'How accurate are the skill gap analyses and recommendations?',
    answer:
      'Our recommendations are built on real labor market data and continuously updated. The system analyzes millions of job postings and career transitions to ensure accuracy. However, we always recommend using our insights as a guide alongside your own research and professional judgment.',
  },
  {
    id: 5,
    question: 'Is my personal career data secure and private?',
    answer:
      'Yes, we take data privacy seriously. Your personal information is encrypted and stored securely. We never sell your data to third parties, and you maintain full control over what information you share. Our privacy policy is transparent and easily accessible.',
  },
  {
    id: 6,
    question: 'How often is the job market data updated?',
    answer:
      'Our underlying dataset is continuously updated with new job postings, skills requirements, and market trends. The Tabiya taxonomy receives regular updates from the open-source community, ensuring our insights reflect current market realities.',
  },
  {
    id: 7,
    question: 'Can JobCompass help with salary expectations and negotiations?',
    answer:
      'Yes! JobCompass provides market-based salary insights for different roles and skill combinations. Our data helps you understand your market value and identify high-value skills that can boost your earning potential.',
  },
  {
    id: 8,
    question:
      'Does the platform work for entry-level professionals and recent graduates?',
    answer:
      'Definitely! JobCompass is particularly valuable for early-career professionals. We help identify entry-level pathways, show how academic skills translate to industry requirements, and suggest strategic skill development for career advancement.',
  },
  {
    id: 9,
    question: 'How does JobCompass handle regional job market differences?',
    answer:
      'Our platform incorporates regional job market data and can provide location-specific insights. We analyze local demand, salary variations, and skill requirements to give you relevant guidance for your geographic area of interest.',
  },
  {
    id: 10,
    question: 'What kind of ongoing support does JobCompass provide?',
    answer:
      'Beyond initial recommendations, JobCompass offers continuous career guidance. As you develop new skills or your goals evolve, our AI adapts its recommendations. We also provide learning resources, industry insights, and regular market updates to keep you informed.',
  },
];

export const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { isDark } = useDarkMode();

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section
      id="faq"
      className={`w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-tabiya-darker via-tabiya-dark to-tabiya-darker'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDark ? 'bg-tabiya-accent/3' : 'bg-tabiya-accent/5'
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-2xl ${
            isDark ? 'bg-white/3' : 'bg-orange-300/5'
          }`}
        ></div>
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2
              className={`font-sans text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Frequently Asked Questions
            </h2>

            <p
              className={`font-sans text-lg font-medium leading-relaxed max-w-3xl mx-auto ${
                isDark ? 'text-white/90' : 'text-gray-600'
              }`}
            >
              Get answers to common questions about JobCompass, our AI
              technology, and how we can help accelerate your career journey.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card
                key={faq.id}
                className={`
                  border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm
                  ${
                    openFAQ === faq.id
                      ? isDark
                        ? 'bg-gradient-to-br from-tabiya-medium/80 via-tabiya-medium/70 to-tabiya-dark/80 border-tabiya-accent/60 shadow-xl shadow-tabiya-accent/30'
                        : 'bg-gradient-to-br from-white via-orange-50/50 to-white border-orange-300 shadow-xl shadow-orange-500/10'
                      : isDark
                        ? 'bg-gradient-to-br from-tabiya-medium/70 via-tabiya-medium/60 to-tabiya-dark/70 border-tabiya-accent/30 hover:border-tabiya-accent/50 hover:shadow-lg shadow-lg'
                        : 'bg-gradient-to-br from-white via-gray-50/50 to-white border-gray-200 hover:border-orange-300 hover:shadow-lg shadow-sm'
                  }
                `}
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left p-6 focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-sans text-lg font-bold pr-8 leading-relaxed ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {faq.question}
                      </h3>

                      <div
                        className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 ${
                          openFAQ === faq.id
                            ? isDark
                              ? 'rotate-180 bg-tabiya-accent/50'
                              : 'rotate-180 bg-orange-100'
                            : isDark
                              ? 'bg-tabiya-accent/30 hover:bg-tabiya-accent/40'
                              : 'bg-gray-100 hover:bg-orange-100'
                        }
                      `}
                      >
                        <svg
                          className={`w-6 h-6 transition-transform duration-300 ${
                            isDark ? 'text-white' : 'text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  <div
                    className={`
                  transition-all duration-500 ease-out overflow-hidden
                  ${openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
                  >
                    <div className="px-6 pb-6">
                      <div
                        className={`border-t pt-4 ${
                          isDark ? 'border-white/20' : 'border-gray-200'
                        }`}
                      >
                        <p
                          className={`font-sans font-medium leading-relaxed ${
                            isDark ? 'text-white/90' : 'text-gray-600'
                          }`}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.4}>
          <div className="mt-16 text-center">
            <Card
              className={`shadow-xl ${
                isDark
                  ? 'bg-gradient-to-br from-tabiya-medium/60 via-tabiya-medium/50 to-tabiya-dark/70 border border-tabiya-accent/40'
                  : 'bg-gradient-to-br from-white via-orange-50/50 to-white border border-orange-200'
              }`}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3
                      className={`font-sans text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Still have questions?
                    </h3>
                    <p
                      className={`font-sans font-medium leading-relaxed ${
                        isDark ? 'text-white/90' : 'text-gray-600'
                      }`}
                    >
                      Our team is here to help. Reach out to us for personalized
                      assistance with your career journey.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      className={`font-sans font-medium px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        isDark
                          ? 'bg-tabiya-accent hover:bg-tabiya-accent/90 text-white shadow-tabiya-accent/30'
                          : 'bg-tabiya-accent hover:bg-tabiya-accent/90 text-white shadow-tabiya-accent/30'
                      }`}
                    >
                      Contact Support
                    </button>

                    <button
                      className={`font-sans font-medium px-8 py-3 rounded-full transition-all duration-300 ${
                        isDark
                          ? 'border border-white/30 text-white hover:bg-white/10'
                          : 'border border-gray-300 text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      Schedule a Demo
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};
