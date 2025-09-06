import { useDarkMode } from '@/contexts/DarkModeContext';

interface StatsOverviewProps {
  activeTab: 'skills' | 'occupations';
  skillSuggestionsLength: number;
  selectedOccupationSkillsLength: number;
  relatedOccupationsLength: number;
}

export function StatsOverview({
  activeTab,
  skillSuggestionsLength,
  selectedOccupationSkillsLength,
  relatedOccupationsLength,
}: StatsOverviewProps) {
  const { isDark } = useDarkMode();

  const getFirstStat = () => {
    if (activeTab === 'skills') {
      return {
        value: skillSuggestionsLength || 0,
        label: 'Related Skills'
      };
    }
    return {
      value: selectedOccupationSkillsLength || 0,
      label: 'Required Skills'
    };
  };

  const getSecondStat = () => {
    if (activeTab === 'skills') {
      return {
        value: relatedOccupationsLength,
        label: 'Career Opportunities'
      };
    }
    return {
      value: 1,
      label: 'Selected Occupation'
    };
  };

  const getTotalConnections = () => {
    if (activeTab === 'skills') {
      return (skillSuggestionsLength || 0) + relatedOccupationsLength;
    }
    return (selectedOccupationSkillsLength || 0) + relatedOccupationsLength;
  };

  const firstStat = getFirstStat();
  const secondStat = getSecondStat();

  return (
    <div className="px-6 py-6">
      <div
        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg border p-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-tabiya-accent font-bold text-3xl">
              {firstStat.value}
            </div>
            <div
              className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
            >
              {firstStat.label}
            </div>
          </div>
          <div className="text-center">
            <div className="text-tabiya-accent font-bold text-3xl">
              {secondStat.value}
            </div>
            <div
              className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
            >
              {secondStat.label}
            </div>
          </div>
          <div className="text-center">
            <div className="text-tabiya-accent font-bold text-3xl">
              {getTotalConnections()}
            </div>
            <div
              className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
            >
              Total Connections
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
