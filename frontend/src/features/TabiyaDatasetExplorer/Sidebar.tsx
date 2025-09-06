import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface SidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchLoading: boolean;
  filters: {
    crossSectorOnly: boolean;
    localOccupationsOnly: boolean;
    emergingSkills: boolean;
  };
  onFilterChange: (filterKey: string) => void;
  skillGroups: any;
  skillGroupsLoading: boolean;
  occupationGroups: any;
  occupationGroupsLoading: boolean;
  selectedSkillGroupId: string | null;
  onTabChange: (tab: 'skills' | 'skill-groups' | 'occupations') => void;
  onItemSelect: (item: any) => void;
}

export function Sidebar({
  searchQuery,
  onSearchChange,
  searchLoading,
  filters,
  onFilterChange,
  skillGroups,
  skillGroupsLoading,
  occupationGroups,
  occupationGroupsLoading,
  selectedSkillGroupId,
  onTabChange,
  onItemSelect,
}: SidebarProps) {
  const { isDark } = useDarkMode();

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div
      className={`w-80 flex-shrink-0 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border-r min-h-screen p-6`}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded flex items-center justify-center`}
          >
            <svg
              className={`w-5 h-5 ${isDark ? 'text-white/80' : 'text-gray-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <h1
            className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Tabiya Dataset Explorer
          </h1>
        </div>

        {/* Description */}
        <p
          className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'} mb-6 leading-relaxed`}
        >
          Explore the comprehensive dataset of skills, skill groups, and
          occupations. Use filters and search to discover connections and build
          your career insights.
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search skills or occupations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full px-4 py-2 ${isDark ? 'bg-white/10 text-white placeholder-white/60 border-white/20' : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'} rounded-lg border focus:border-tabiya-accent focus:outline-none`}
          />
          {searchLoading && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-tabiya-accent rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-8">
        <h3
          className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
        >
          Filters
        </h3>
        <div className="space-y-3">
          {Object.entries(filters).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => onFilterChange(key)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 transition-all ${
                    value
                      ? 'bg-tabiya-accent border-tabiya-accent'
                      : isDark
                        ? 'border-white/30 bg-transparent'
                        : 'border-gray-300 bg-white'
                  }`}
                >
                  {value && (
                    <svg
                      className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span
                className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}
              >
                {key === 'crossSectorOnly'
                  ? 'Cross-sector skills only'
                  : key === 'localOccupationsOnly'
                    ? 'Local occupations only'
                    : 'Emerging skills'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Skill Groups */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Skill Groups
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTabChange('skill-groups')}
            className="text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10"
          >
            Explore All
          </Button>
        </div>
        <div className="space-y-2">
          {skillGroupsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-8 w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          ) : (
            skillGroups?.results?.slice(0, 4).map((group: any) => (
              <div
                key={group.id}
                onClick={() => {
                  onTabChange('skill-groups');
                  onItemSelect(group);
                }}
                className={`flex justify-between items-center py-2 cursor-pointer hover:opacity-80 transition-opacity group ${
                  selectedSkillGroupId === group.id
                    ? 'text-tabiya-accent'
                    : isDark
                      ? 'text-white/80'
                      : 'text-gray-700'
                }`}
              >
                <span className="text-sm">
                  {capitalizeFirstLetter(group.preferred_label)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Occupation Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Occupation Groups
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTabChange('occupations')}
            className="text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10"
          >
            Explore All
          </Button>
        </div>
        <div className="space-y-2">
          {occupationGroupsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-8 w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          ) : (
            occupationGroups?.results?.slice(0, 4).map((group: any) => (
              <div
                key={group.id}
                className="flex justify-between items-center py-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onTabChange('occupations')}
              >
                <span
                  className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}
                >
                  {capitalizeFirstLetter(group.preferred_label)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
