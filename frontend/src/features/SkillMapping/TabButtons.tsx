import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface TabButtonsProps {
  activeTab: 'skills' | 'occupations';
  onTabChange: (tab: 'skills' | 'occupations') => void;
}

export function TabButtons({ activeTab, onTabChange }: TabButtonsProps) {
  const { isDark } = useDarkMode();

  return (
    <div className="flex gap-1">
      <Button
        variant={activeTab === 'skills' ? 'default' : 'outline'}
        size="sm"
        className={`flex-1 text-xs ${
          activeTab === 'skills'
            ? 'bg-tabiya-accent hover:bg-tabiya-accent/90 text-white border-tabiya-accent'
            : isDark
              ? 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
              : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
        onClick={() => onTabChange('skills')}
      >
        Skills
      </Button>
      <Button
        variant={activeTab === 'occupations' ? 'default' : 'outline'}
        size="sm"
        className={`flex-1 text-xs ${
          activeTab === 'occupations'
            ? 'bg-tabiya-accent hover:bg-tabiya-accent/90 text-white border-tabiya-accent'
            : isDark
              ? 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
              : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
        onClick={() => onTabChange('occupations')}
      >
        Occupations
      </Button>
    </div>
  );
}
