import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Occupation } from '@/lib/types';

interface CareerOpportunitiesSectionProps {
  selectedSkill: any;
  relatedOccupations: Occupation[];
  expandedCards: Set<string>;
  careerOpportunitiesPage: number;
  itemsPerPage: number;
  onOccupationSelect: (occupationId: string) => void;
  onToggleCardExpansion: (cardId: string) => void;
  onPageChange: (page: number) => void;
}

export function CareerOpportunitiesSection({
  selectedSkill,
  relatedOccupations,
  expandedCards,
  careerOpportunitiesPage,
  itemsPerPage,
  onOccupationSelect,
  onToggleCardExpansion,
  onPageChange,
}: CareerOpportunitiesSectionProps) {
  const { isDark } = useDarkMode();

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const calculateMatchPercentage = (occupation: Occupation): number => {
    if (!selectedSkill) return 0;
    const totalSkills = occupation.related_skills?.length || 0;
    if (totalSkills === 0) return 0;
    const hasSelectedSkill = occupation.related_skills?.some(
      (skill) => skill.skill_id === selectedSkill.id
    );
    return hasSelectedSkill
      ? Math.floor(60 + Math.random() * 30)
      : Math.floor(Math.random() * 40);
  };

  const getPaginatedData = (data: any[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: data.slice(startIndex, endIndex),
      totalPages: Math.ceil(data.length / itemsPerPage),
      hasNext: endIndex < data.length,
      hasPrev: page > 1,
    };
  };

  return (
    <div
      className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-6 border`}
    >
      <h3
        className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-4 text-xl`}
      >
        Career Opportunities
      </h3>
      
      {selectedSkill ? (
        (() => {
          const paginatedData = getPaginatedData(
            relatedOccupations,
            careerOpportunitiesPage,
            itemsPerPage
          );
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedData.items.map((occupation: any) => {
                  const matchPercentage = calculateMatchPercentage(occupation);
                  const occupationCardId = `occ-${occupation.id}`;
                  const isExpanded = expandedCards.has(occupationCardId);
                  const description = occupation.definition || occupation.description || '';
                  const displayDescription = description;

                  return (
                    <div
                      key={occupation.id}
                      className={`p-5 ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} rounded-lg border cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-md`}
                      onClick={(e) => {
                        if (!(e.target as HTMLElement).closest('.read-more-btn')) {
                          onOccupationSelect(occupation.id);
                        }
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-tabiya-accent font-semibold text-lg group-hover:text-tabiya-accent/80 transition-colors">
                              {capitalizeFirstLetter(occupation.preferred_label)}
                            </h4>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-tabiya-accent border-tabiya-accent font-medium"
                          >
                            {matchPercentage}% match
                          </Badge>
                        </div>

                        <Badge
                          variant="outline"
                          className={`text-xs w-fit ${isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'}`}
                        >
                          {capitalizeFirstLetter(occupation.occupation_type || 'Occupation')}
                        </Badge>

                        <div className="space-y-2">
                          <p
                            className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm leading-relaxed`}
                          >
                            {isExpanded
                              ? displayDescription
                              : displayDescription.length > 120
                                ? `${displayDescription.slice(0, 120)}...`
                                : displayDescription || 'No description available.'}
                          </p>
                          {displayDescription && displayDescription.length > 120 && (
                            <button
                              className="read-more-btn text-tabiya-accent text-sm font-medium hover:text-tabiya-accent/80 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleCardExpansion(occupationCardId);
                              }}
                            >
                              {isExpanded ? 'Read Less' : 'Read More'}
                            </button>
                          )}
                        </div>

                        <div
                          className={`${isDark ? 'text-white/50' : 'text-gray-500'} text-xs flex items-center gap-1`}
                        >
                          <span className="w-2 h-2 bg-tabiya-accent rounded-full"></span>
                          {occupation.related_skills?.length || 0} related skills
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {paginatedData.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div
                    className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
                  >
                    Showing {(careerOpportunitiesPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(careerOpportunitiesPage * itemsPerPage, relatedOccupations.length)} of{' '}
                    {relatedOccupations.length} career opportunities
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(careerOpportunitiesPage - 1)}
                      disabled={!paginatedData.hasPrev}
                      className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span
                      className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm px-2`}
                    >
                      {careerOpportunitiesPage} of {paginatedData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(careerOpportunitiesPage + 1)}
                      disabled={!paginatedData.hasNext}
                      className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {relatedOccupations.length === 0 && (
                <div
                  className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-center py-8`}
                >
                  <div className="space-y-2">
                    <div className="text-lg font-medium">No career opportunities found</div>
                    <div className="text-sm">Try selecting a different skill to explore career paths.</div>
                  </div>
                </div>
              )}
            </div>
          );
        })()
      ) : (
        <div
          className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-center py-12`}
        >
          <div className="space-y-3">
            <div className="text-lg font-medium">No career opportunities to display</div>
            <div className="text-sm max-w-md mx-auto">
              Select a skill from the sidebar to discover related career paths and opportunities in your field.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
