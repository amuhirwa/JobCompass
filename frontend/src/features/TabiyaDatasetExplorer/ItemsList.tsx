import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface ItemsListProps {
  activeTab: 'skills' | 'skill-groups' | 'occupations';
  displayedItems: any[];
  searchQuery: string;
  debouncedQuery: string;
  skillsLoading: boolean;
  skillGroupsLoading: boolean;
  occupationsLoading: boolean;
  currentPage: number;
  totalPages: number;
  onItemSelect: (item: any) => void;
  onPageChange: (page: number) => void;
}

export function ItemsList({
  activeTab,
  displayedItems,
  searchQuery,
  debouncedQuery,
  skillsLoading,
  skillGroupsLoading,
  occupationsLoading,
  currentPage,
  totalPages,
  onItemSelect,
  onPageChange,
}: ItemsListProps) {
  const { isDark } = useDarkMode();

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const isLoading =
    (activeTab === 'skills' && skillsLoading) ||
    (activeTab === 'skill-groups' && skillGroupsLoading) ||
    (activeTab === 'occupations' && occupationsLoading);

  return (
    <div
      role="tabpanel"
      id={`${activeTab}-panel`}
      aria-labelledby={`${activeTab}-tab`}
    >
      <h1
        id={`${activeTab}-heading`}
        className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
      >
        {activeTab === 'skills'
          ? 'Skills Explorer'
          : activeTab === 'skill-groups'
            ? 'Skill Groups'
            : 'Occupations'}
      </h1>

      {searchQuery && (
        <div className="mb-4" role="status" aria-live="polite">
          <span className={`${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            Search results for:{' '}
          </span>
          <span className="text-tabiya-accent font-medium">
            "{debouncedQuery}"
          </span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="status"
          aria-label={`Loading ${activeTab.replace('-', ' ')}`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
              aria-hidden="true"
            >
              <CardHeader className="pb-4">
                <Skeleton
                  className={`h-6 w-40 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                />
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <div className="space-y-4">
                  <Skeleton
                    className={`h-5 w-24 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                  />
                  <div className="space-y-2">
                    <Skeleton
                      className={`h-4 w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                    />
                    <Skeleton
                      className={`h-4 w-3/4 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                    />
                    <Skeleton
                      className={`h-4 w-1/2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Items Grid */
        <div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            role="list"
            aria-label={`${activeTab.replace('-', ' ')} items`}
          >
            {displayedItems.map((item: any) => (
              <Card
                key={item.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg group focus-within:ring-2 focus-within:ring-tabiya-accent/20 ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                role="listitem"
              >
                <button
                  onClick={() => onItemSelect(item)}
                  className="w-full h-full text-left focus:outline-none"
                  aria-labelledby={`item-${item.id}-title`}
                  aria-describedby={`item-${item.id}-description`}
                >
                  <CardHeader className="pb-4">
                    <CardTitle
                      id={`item-${item.id}-title`}
                      className={`text-lg font-semibold group-hover:text-tabiya-accent transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      {capitalizeFirstLetter(item.preferred_label)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-6 pb-6">
                    <div className="space-y-4">
                      <Badge
                        variant="outline"
                        className={`text-sm ${isDark ? 'border-white/20 text-white/70' : 'border-gray-300 text-gray-600'}`}
                        aria-hidden="true"
                      >
                        {activeTab === 'skills'
                          ? capitalizeFirstLetter(item.skill_type || 'skill')
                          : activeTab === 'occupations'
                            ? capitalizeFirstLetter(
                                item.occupation_type || 'occupation'
                              )
                            : 'Skill Group'}
                      </Badge>
                      {item.description && (
                        <p
                          id={`item-${item.id}-description`}
                          className={`text-base ${isDark ? 'text-white/70' : 'text-gray-600'} line-clamp-3 leading-relaxed`}
                        >
                          {item.description.length > 140
                            ? `${item.description.slice(0, 140)}...`
                            : item.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </button>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav
              className="flex items-center justify-between"
              aria-label="Pagination navigation"
            >
              <div
                className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}
                role="status"
                aria-label={`Page ${currentPage} of ${totalPages}`}
              >
                Page {currentPage} of {totalPages}
              </div>
              <div
                className="flex gap-2"
                role="group"
                aria-label="Pagination controls"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} focus:ring-2 focus:ring-tabiya-accent/20`}
                  aria-label="Go to previous page"
                >
                  Previous
                </Button>

                {/* Page numbers */}
                <div
                  className="flex gap-1"
                  role="group"
                  aria-label="Page numbers"
                >
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        className={
                          currentPage === pageNum
                            ? 'bg-tabiya-accent hover:bg-tabiya-accent/90 text-white focus:ring-2 focus:ring-tabiya-accent/20'
                            : isDark
                              ? 'border-white/20 text-white hover:bg-white/10 focus:ring-2 focus:ring-tabiya-accent/20'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-tabiya-accent/20'
                        }
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={
                          currentPage === pageNum ? 'page' : undefined
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} focus:ring-2 focus:ring-tabiya-accent/20`}
                  aria-label="Go to next page"
                >
                  Next
                </Button>
              </div>
            </nav>
          )}
        </div>
      )}

      {displayedItems.length === 0 && !isLoading && (
        <div
          className={`text-center py-8 ${isDark ? 'text-white/60' : 'text-gray-500'}`}
          role="status"
          aria-live="polite"
        >
          No {activeTab.replace('-', ' ')} found.
        </div>
      )}
    </div>
  );
}
