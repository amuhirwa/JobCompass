import { useDarkMode } from '@/contexts/DarkModeContext';

interface NavigationTabsProps {
  activeTab: 'skills' | 'skill-groups' | 'occupations';
  onTabChange: (tab: 'skills' | 'skill-groups' | 'occupations') => void;
}

export function NavigationTabs({
  activeTab,
  onTabChange,
}: NavigationTabsProps) {
  const { isDark } = useDarkMode();

  return (
    <div
      className={`flex gap-1 mb-8 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}
    >
      <button
        onClick={() => onTabChange('skills')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'skills'
            ? 'text-tabiya-accent border-b-2 border-tabiya-accent'
            : isDark
              ? 'text-white/70 hover:text-tabiya-accent'
              : 'text-gray-600 hover:text-tabiya-accent'
        }`}
      >
        Skills Explorer
      </button>
      <button
        onClick={() => onTabChange('skill-groups')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'skill-groups'
            ? 'text-tabiya-accent border-b-2 border-tabiya-accent'
            : isDark
              ? 'text-white/70 hover:text-tabiya-accent'
              : 'text-gray-600 hover:text-tabiya-accent'
        }`}
      >
        Skill Groups
      </button>
      <button
        onClick={() => onTabChange('occupations')}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === 'occupations'
            ? 'text-tabiya-accent border-b-2 border-tabiya-accent'
            : isDark
              ? 'text-white/70 hover:text-tabiya-accent'
              : 'text-gray-600 hover:text-tabiya-accent'
        }`}
      >
        Occupations
      </button>
    </div>
  );
}
