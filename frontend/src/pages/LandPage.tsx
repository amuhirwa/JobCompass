import { useDarkMode } from '@/contexts/DarkModeContext';
import { Chatbot } from '@/components/custom/Chatbot';
import { HeroSection } from '@/components/custom/HeroSection';
import { FeaturesSection } from '@/components/custom/FeaturesSection';
import { ToolsSection } from '@/components/custom/ToolsSection';
import { TestimonialsSection } from '@/components/custom/TestimonialsSection';
import { DemoSection } from '@/components/custom/DemoSection';
import { CreditsSection } from '@/components/custom/CreditsSection';
import { FAQSection } from '@/components/custom/FAQSection';
import { CTASection } from '@/components/custom/CTASection';

export default function LandPage() {
  const { isDark } = useDarkMode();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'}`}>
      <HeroSection />
      <FeaturesSection />
      <ToolsSection />
      <TestimonialsSection />
      <DemoSection />
      <CreditsSection />
      <FAQSection />
      <CTASection />

      {/* Chatbot for General Help */}
      <Chatbot
        contextType="general"
        contextData={{
          name: 'JobCompass Platform',
          description:
            'General help and information about JobCompass features and capabilities',
        }}
      />
    </div>
  );
}
