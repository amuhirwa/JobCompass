import { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface LogoProps {
  variant?: 'full' | 'icon-only' | 'text-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  animated?: boolean;
}

export const Logo = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = false,
  animated = true,
}: LogoProps) => {
  const { isDark } = useDarkMode();
  const [imageError, setImageError] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'h-6',
      icon: 'h-6 w-6',
      text: 'text-lg',
      tagline: 'text-xs',
    },
    md: {
      container: 'h-8',
      icon: 'h-8 w-8',
      text: 'text-xl',
      tagline: 'text-sm',
    },
    lg: {
      container: 'h-12',
      icon: 'h-12 w-12',
      text: 'text-2xl',
      tagline: 'text-base',
    },
    xl: {
      container: 'h-16',
      icon: 'h-16 w-16',
      text: 'text-3xl',
      tagline: 'text-lg',
    },
  };

  const config = sizeConfig[size];

  // Professional SVG Logo Icon
  const LogoIcon = () => (
    <div className={`${config.icon} relative flex items-center justify-center`}>
      <svg
        viewBox="0 0 48 48"
        className={`w-full h-full ${animated ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background gradient circle */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6347" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient
            id="compassGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Main circle background */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="url(#logoGradient)"
          className={`${animated ? 'group-hover:opacity-90 transition-opacity duration-300' : ''}`}
        />

        {/* Compass needle pointing directions */}
        <g
          className={`${animated ? 'group-hover:rotate-12 transition-transform duration-500 origin-center' : ''}`}
        >
          {/* North needle */}
          <path d="M24 8 L26 18 L24 20 L22 18 Z" fill="url(#compassGradient)" />
          {/* South needle */}
          <path
            d="M24 40 L22 30 L24 28 L26 30 Z"
            fill="white"
            fillOpacity="0.8"
          />
          {/* East needle */}
          <path
            d="M40 24 L30 22 L28 24 L30 26 Z"
            fill="white"
            fillOpacity="0.6"
          />
          {/* West needle */}
          <path
            d="M8 24 L18 26 L20 24 L18 22 Z"
            fill="white"
            fillOpacity="0.6"
          />
        </g>

        {/* Center dot */}
        <circle
          cx="24"
          cy="24"
          r="3"
          fill="white"
          className={`${animated ? 'group-hover:scale-125 transition-transform duration-300' : ''}`}
        />

        {/* Outer ring */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      </svg>
    </div>
  );

  // Fallback icon when image fails
  const FallbackIcon = () => (
    <div className={`${config.icon} relative flex items-center justify-center`}>
      <div
        className={`w-full h-full rounded-lg bg-gradient-to-br from-tabiya-accent to-red-600 flex items-center justify-center ${animated ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}
      >
        <span className="text-white font-bold text-lg">JC</span>
      </div>
    </div>
  );

  // Brand text component
  const BrandText = () => (
    <div className="flex flex-col">
      <span
        className={`font-bold tracking-tight leading-none ${config.text} ${
          isDark ? 'text-white' : 'text-gray-900'
        } ${animated ? 'group-hover:text-tabiya-accent transition-colors duration-300' : ''}`}
      >
        Job<span className="text-tabiya-accent">Compass</span>
      </span>
      {showTagline && (
        <span
          className={`${config.tagline} font-medium leading-tight ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Navigate Your Career
        </span>
      )}
    </div>
  );

  // Try to use the existing image first, then fallback to SVG
  const ImageLogo = () => (
    <img
      src="/images/JobCompass Logo.png"
      alt="JobCompass"
      className={`${config.icon} object-contain ${
        isDark ? 'brightness-100' : 'brightness-90'
      } ${animated ? 'group-hover:scale-105 transition-all duration-300' : ''}`}
      onError={() => setImageError(true)}
      style={{ display: imageError ? 'none' : 'block' }}
    />
  );

  return (
    <div
      className={`flex items-center gap-3 group select-none ${config.container} ${className}`}
      role="img"
      aria-label="JobCompass Logo"
    >
      {/* Icon/Image Section */}
      {variant !== 'text-only' && (
        <div className="relative">
          {!imageError ? <ImageLogo /> : <LogoIcon />}
          {imageError && <FallbackIcon />}
        </div>
      )}

      {/* Text Section */}
      {variant !== 'icon-only' && <BrandText />}
    </div>
  );
};

// Pre-configured logo variants for common use cases
export const NavigationLogo = () => (
  <Logo variant="full" size="md" animated={true} />
);

export const FooterLogo = () => (
  <Logo variant="full" size="lg" animated={true} showTagline={true} />
);

export const IconLogo = () => (
  <Logo variant="icon-only" size="md" animated={true} />
);

export const HeroLogo = () => (
  <Logo variant="full" size="xl" animated={true} showTagline={true} />
);
