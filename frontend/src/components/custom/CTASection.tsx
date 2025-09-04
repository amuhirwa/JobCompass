import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { useDarkMode } from '@/contexts/DarkModeContext';

export const CTASection = () => {
  const [email, setEmail] = useState('');
  const { isDark } = useDarkMode();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <section
      id="cta"
      className={`w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 relative ${
        isDark ? 'bg-tabiya-dark' : 'bg-gray-900'
      }`}
      style={
        isDark
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://api.builder.io/api/v1/image/assets/TEMP/94aa130eebc90ad071dbec3be2aca56ba5dae612?width=2880')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://api.builder.io/api/v1/image/assets/TEMP/94aa130eebc90ad071dbec3be2aca56ba5dae612?width=2880')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
      }
    >
      <div className="w-full">
        <ScrollAnimation>
          <div className="max-w-4xl">
            <h2 className="text-white font-sans text-5xl font-bold leading-[120%] tracking-tight mb-6">
              Stay Ahead in Your Career
            </h2>
            <p className="text-white/90 font-sans text-lg font-medium leading-[150%] mb-8">
              Subscribe to our newsletter for insights on labor market trends
              and career opportunities.
            </p>

            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-4 mb-4 max-w-lg"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Here"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/60 font-inter text-base leading-6 rounded-md focus:ring-2 focus:ring-white/20 focus:border-white/40"
                required
              />
              <button
                type="submit"
                className={`flex items-center justify-center gap-2 px-6 py-3 border text-base font-medium leading-6 transition-colors rounded-md ${
                  isDark
                    ? 'bg-white border-white text-tabiya-dark font-inter hover:bg-tabiya-accent hover:text-white hover:border-tabiya-accent'
                    : 'bg-white border-white text-gray-900 font-inter hover:bg-tabiya-accent hover:text-white hover:border-tabiya-accent'
                }`}
              >
                Sign Up
              </button>
            </form>
            <p className="text-white font-inter text-xs font-normal leading-[150%]">
              By clicking Sign Up, you agree to our Terms and Conditions.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};
