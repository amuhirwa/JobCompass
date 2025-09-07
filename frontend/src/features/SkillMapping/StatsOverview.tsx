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
        label: 'Related Skills',
      };
    }
    return {
      value: selectedOccupationSkillsLength || 0,
      label: 'Required Skills',
    };
  };

  const getSecondStat = () => {
    if (activeTab === 'skills') {
      return {
        value: relatedOccupationsLength,
        label: 'Career Opportunities',
      };
    }
    return {
      value: 1,
      label: 'Selected Occupation',
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
        role="region"
        aria-labelledby="stats-heading"
      >
        <h2 id="stats-heading" className="sr-only">
          Statistics overview for{' '}
          {activeTab === 'skills' ? 'selected skill' : 'selected occupation'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
          <div className="text-center" role="listitem">
            <div
              className="text-tabiya-accent font-bold text-3xl"
              aria-label={`${firstStat.value} ${firstStat.label}`}
            >
              {firstStat.value}
            </div>
            <div
              className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
              id={`stat-1-label`}
            >
              {firstStat.label}
            </div>
          </div>
          <div className="text-center" role="listitem">
            <div
              className="text-tabiya-accent font-bold text-3xl"
              aria-label={`${secondStat.value} ${secondStat.label}`}
            >
              {secondStat.value}
            </div>
            <div
              className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
              id={`stat-2-label`}
            >
              {secondStat.label}
            </div>
          </div>
          <div className="text-center" role="listitem">
            <div
              className="text-tabiya-accent font-bold text-3xl"
              aria-label={`${getTotalConnections()} Total Connections`}
            >
              {getTotalConnections()}
            </div>
            <div
              className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
              id={`stat-3-label`}
            >
              Total Connections
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
