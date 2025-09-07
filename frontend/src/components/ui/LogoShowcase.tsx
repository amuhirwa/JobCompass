import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Logo,
  NavigationLogo,
  FooterLogo,
  IconLogo,
  HeroLogo,
} from '@/components/ui/Logo';

export const LogoShowcase = () => {
  const { isDark } = useDarkMode();

  return (
    <div
      className={`min-h-screen p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1
            className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            JobCompass Professional Logo System
          </h1>
          <p
            className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Scalable, accessible, and modern logo implementation
          </p>
        </div>

        {/* Logo Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Navigation Logo
            </h3>
            <div className="flex items-center justify-center p-4">
              <NavigationLogo />
            </div>
            <p
              className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Used in navigation bar - medium size, animated
            </p>
          </div>

          <div
            className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Footer Logo
            </h3>
            <div className="flex items-center justify-center p-4">
              <FooterLogo />
            </div>
            <p
              className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Used in footer - large size with tagline
            </p>
          </div>

          <div
            className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Icon Only
            </h3>
            <div className="flex items-center justify-center p-4">
              <IconLogo />
            </div>
            <p
              className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Compact icon for mobile or small spaces
            </p>
          </div>

          <div
            className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Hero Logo
            </h3>
            <div className="flex items-center justify-center p-4">
              <HeroLogo />
            </div>
            <p
              className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Large hero section logo with tagline
            </p>
          </div>
        </div>

        {/* Custom Sizes */}
        <div
          className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
        >
          <h3
            className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Custom Sizes & Variants
          </h3>
          <div className="space-y-6">
            <div className="flex items-center gap-8">
              <span
                className={`text-sm font-medium w-20 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Small:
              </span>
              <Logo variant="full" size="sm" />
            </div>
            <div className="flex items-center gap-8">
              <span
                className={`text-sm font-medium w-20 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Medium:
              </span>
              <Logo variant="full" size="md" />
            </div>
            <div className="flex items-center gap-8">
              <span
                className={`text-sm font-medium w-20 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Large:
              </span>
              <Logo variant="full" size="lg" />
            </div>
            <div className="flex items-center gap-8">
              <span
                className={`text-sm font-medium w-20 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                X-Large:
              </span>
              <Logo variant="full" size="xl" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div
          className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Professional Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>✅ Scalable SVG icon</strong> - Perfect quality at any
              size
            </div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>✅ Graceful fallbacks</strong> - Works even if images fail
            </div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>✅ Dark/Light mode</strong> - Adapts to theme
              automatically
            </div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>✅ Hover animations</strong> - Subtle, professional
              interactions
            </div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>✅ Accessibility ready</strong> - Proper ARIA labels and
              roles
            </div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>✅ TypeScript support</strong> - Fully typed component
              props
            </div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>✅ Multiple variants</strong> - Icon-only, text-only, or
              full
            </div>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>✅ Consistent branding</strong> - Unified design system
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
