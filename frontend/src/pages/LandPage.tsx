import { useDarkMode } from '@/contexts/DarkModeContext';
import { HeroSection } from '@/components/custom/HeroSection';
import { FeaturesSection } from '@/components/custom/FeaturesSection';
import { ToolsSection } from '@/components/custom/ToolsSection';
import { TestimonialsSection } from '@/components/custom/TestimonialsSection';
import { DemoSection } from '@/components/custom/DemoSection';
import { CreditsSection } from '@/components/custom/CreditsSection';
import { FAQSection } from '@/components/custom/FAQSection';
import { CTASection } from '@/components/custom/CTASection';
import { Footer } from '@/components/custom/Footer';

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
    </div>
  );
}
