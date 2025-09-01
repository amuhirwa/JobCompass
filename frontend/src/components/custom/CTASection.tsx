import { useState } from 'react';

export const CTASection = () => {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <section
      id="cta"
      className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://api.builder.io/api/v1/image/assets/TEMP/94aa130eebc90ad071dbec3be2aca56ba5dae612?width=2880')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full">
        <div className="max-w-4xl">
          <h2 className="text-white font-space-mono text-5xl font-normal leading-[120%] tracking-[-0.52px] mb-6">
            Stay Ahead in Your Career
          </h2>
          <p className="text-white font-inter text-lg font-normal leading-[150%] mb-8">
            Subscribe to our newsletter for insights on labor market trends and
            career opportunities.
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
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/60 font-inter text-base leading-6"
              required
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-white text-tabiya-dark font-inter text-base font-medium leading-6 hover:bg-tabiya-accent hover:text-white transition-colors"
            >
              Sign Up
            </button>
          </form>
          <p className="text-white font-inter text-xs font-normal leading-[150%]">
            By clicking Sign Up, you agree to our Terms and Conditions.
          </p>
        </div>
      </div>
    </section>
  );
};
