import { useDarkMode } from '@/contexts/DarkModeContext';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchLoading: boolean;
  searchResults: any;
  availableItems: any[];
  activeTab: 'skills' | 'occupations';
  debouncedQuery: string;
  onItemSelect: (item: any) => void;
}

export function SearchSection({
  searchQuery,
  onSearchChange,
  searchLoading,
  availableItems,
  activeTab,
  debouncedQuery,
  onItemSelect,
}: SearchSectionProps) {
  const { isDark } = useDarkMode();

  return (
    <div role="search" aria-label="Skills and occupations search">
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search skills or occupations
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Search skills or occupations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full px-4 py-3 ${isDark ? 'bg-white/10 text-white placeholder-white/60 border-white/20' : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'} rounded-lg border focus:border-tabiya-accent focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20`}
          aria-describedby={searchQuery ? 'search-results' : undefined}
          autoComplete="off"
        />
        <svg
          className={`absolute right-3 top-3 w-5 h-5 ${isDark ? 'text-white/60' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchLoading && (
          <div className="absolute right-10 top-3.5" aria-hidden="true">
            <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-tabiya-accent rounded-full"></div>
          </div>
        )}
      </div>

      {searchQuery && (
        <div
          id="search-results"
          className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-4 border max-h-48 overflow-y-auto`}
          role="region"
          aria-live="polite"
          aria-label="Search results"
        >
          <h3
            className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-3 text-sm`}
            id="search-results-heading"
          >
            Search Results ({activeTab})
          </h3>
          {searchLoading ? (
            <div
              className="space-y-2"
              role="status"
              aria-label="Loading search results"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-8 w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          ) : availableItems.length > 0 ? (
            <div
              className="space-y-2"
              role="list"
              aria-labelledby="search-results-heading"
            >
              {availableItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onItemSelect(item)}
                  className={`w-full text-left p-2 ${isDark ? 'bg-white/5 hover:bg-white/10 focus:bg-white/10' : 'bg-gray-50 hover:bg-gray-100 focus:bg-gray-100'} rounded cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-tabiya-accent/50`}
                  role="listitem"
                  type="button"
                >
                  <div
                    className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium`}
                  >
                    {item.preferred_label}
                  </div>
                  <div
                    className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-xs`}
                  >
                    {activeTab === 'skills'
                      ? (item as any).skill_type
                      : (item as any).occupation_type}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <div
              className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
              role="status"
            >
              No {activeTab} found for "{debouncedQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
