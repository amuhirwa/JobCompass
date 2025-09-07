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

  const tabs = [
    {
      id: 'skills',
      label: 'Skills Explorer',
      ariaLabel: 'View skills explorer',
    },
    {
      id: 'skill-groups',
      label: 'Skill Groups',
      ariaLabel: 'View skill groups',
    },
    {
      id: 'occupations',
      label: 'Occupations',
      ariaLabel: 'View occupations',
    },
  ] as const;

  return (
    <nav
      className={`flex gap-1 mb-8 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}
      role="tablist"
      aria-label="Dataset category navigation"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() =>
            onTabChange(tab.id as 'skills' | 'skill-groups' | 'occupations')
          }
          className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 rounded-t ${
            activeTab === tab.id
              ? 'text-tabiya-accent border-b-2 border-tabiya-accent'
              : isDark
                ? 'text-white/70 hover:text-tabiya-accent'
                : 'text-gray-600 hover:text-tabiya-accent'
          }`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          aria-label={tab.ariaLabel}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
