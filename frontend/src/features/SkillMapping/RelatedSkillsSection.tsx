import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RelatedSkillsSectionProps {
  activeTab: 'skills' | 'occupations';
  suggestionsLoading: boolean;
  skillSuggestions: any[];
  selectedOccupation: any;
  skills: any;
  selectedItem: any;
  expandedCards: Set<string>;
  relatedSkillsPage: number;
  itemsPerPage: number;
  onItemSelect: (item: any) => void;
  onTabChange: (tab: 'skills' | 'occupations') => void;
  onSkillIdChange: (id: string | null) => void;
  onOccupationIdChange: (id: string | null) => void;
  onPageChange: (page: number) => void;
  onToggleCardExpansion: (cardId: string) => void;
  onPaginationReset: () => void;
}

export function RelatedSkillsSection({
  activeTab,
  suggestionsLoading,
  skillSuggestions,
  selectedOccupation,
  skills,
  selectedItem,
  expandedCards,
  relatedSkillsPage,
  itemsPerPage,
  onItemSelect,
  onTabChange,
  onSkillIdChange,
  onOccupationIdChange,
  onPageChange,
  onToggleCardExpansion,
  onPaginationReset,
}: RelatedSkillsSectionProps) {
  const { isDark } = useDarkMode();

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPaginatedData = (
    data: any[],
    page: number,
    itemsPerPage: number
  ) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: data.slice(startIndex, endIndex),
      totalPages: Math.ceil(data.length / itemsPerPage),
      hasNext: endIndex < data.length,
      hasPrev: page > 1,
    };
  };

  const handleSkillClick = (skill: any) => {
    onTabChange('skills');
    onSkillIdChange(skill.skill_id);
    onOccupationIdChange(null);
    onPaginationReset();
  };

  return (
    <section
      className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-6 border`}
      aria-labelledby="related-skills-heading"
      role="region"
    >
      <h3
        id="related-skills-heading"
        className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-4 text-xl`}
      >
        {activeTab === 'skills'
          ? 'Related Skills'
          : activeTab === 'occupations'
            ? 'Required Skills'
            : 'Related Items'}
      </h3>

      {activeTab === 'skills' && suggestionsLoading ? (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
          role="status"
          aria-label="Loading related skills"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-12 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-lg`}
            />
          ))}
        </div>
      ) : activeTab === 'skills' && skillSuggestions?.length ? (
        (() => {
          const paginatedData = getPaginatedData(
            skillSuggestions,
            relatedSkillsPage,
            itemsPerPage
          );
          return (
            <div className="space-y-4">
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                role="list"
                aria-label="Related skills"
              >
                {paginatedData.items.map((skill: any) => {
                  const isExpanded = expandedCards.has(skill.id);
                  const description =
                    skill.definition || skill.description || '';
                  const displayDescription = description;

                  return (
                    <article
                      key={skill.id}
                      className={`p-5 ${isDark ? 'bg-white/5 hover:bg-white/10 focus-within:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 focus-within:bg-gray-100 border-gray-200'} rounded-lg border cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-md`}
                      onClick={(e) => {
                        if (
                          !(e.target as HTMLElement).closest('.read-more-btn')
                        ) {
                          onItemSelect(skill);
                        }
                      }}
                      role="listitem"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (
                            !(e.target as HTMLElement).closest('.read-more-btn')
                          ) {
                            onItemSelect(skill);
                          }
                        }
                      }}
                      aria-labelledby={`skill-${skill.id}-title`}
                      aria-describedby={`skill-${skill.id}-description`}
                    >
                      <div className="space-y-3">
                        <h4
                          id={`skill-${skill.id}-title`}
                          className="text-tabiya-accent font-semibold text-lg group-hover:text-tabiya-accent/80 transition-colors"
                        >
                          {capitalizeFirstLetter(skill.preferred_label)}
                        </h4>

                        <div
                          className="flex items-center gap-2 flex-wrap"
                          role="list"
                          aria-label="Skill attributes"
                        >
                          <Badge
                            variant="outline"
                            className={`text-xs ${isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'}`}
                            role="listitem"
                            aria-label={`Skill type: ${capitalizeFirstLetter(skill.skill_type || 'Skill')}`}
                          >
                            {capitalizeFirstLetter(skill.skill_type || 'Skill')}
                          </Badge>
                          {skill.reuse_level && (
                            <Badge
                              variant="outline"
                              className="text-xs text-tabiya-accent border-tabiya-accent"
                              role="listitem"
                              aria-label={`Reuse level: ${capitalizeFirstLetter(skill.reuse_level)}`}
                            >
                              {capitalizeFirstLetter(skill.reuse_level)}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <p
                            id={`skill-${skill.id}-description`}
                            className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm leading-relaxed`}
                          >
                            {isExpanded
                              ? displayDescription
                              : displayDescription.length > 120
                                ? `${displayDescription.slice(0, 120)}...`
                                : displayDescription ||
                                  'No description available.'}
                          </p>
                          {displayDescription &&
                            displayDescription.length > 120 && (
                              <button
                                className="read-more-btn text-tabiya-accent text-sm font-medium hover:text-tabiya-accent/80 focus:text-tabiya-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-tabiya-accent/50 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleCardExpansion(skill.id);
                                }}
                                type="button"
                                aria-expanded={isExpanded}
                                aria-controls={`skill-${skill.id}-description`}
                              >
                                {isExpanded ? 'Read Less' : 'Read More'}
                              </button>
                            )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {paginatedData.totalPages > 1 && (
                <nav
                  aria-label="Related skills pagination"
                  className="flex items-center justify-between pt-4"
                >
                  <div
                    className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
                    role="status"
                    aria-live="polite"
                  >
                    Showing {(relatedSkillsPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(
                      relatedSkillsPage * itemsPerPage,
                      skillSuggestions.length
                    )}{' '}
                    of {skillSuggestions.length} related skills
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(relatedSkillsPage - 1)}
                      disabled={!paginatedData.hasPrev}
                      className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      aria-label="Previous page"
                      type="button"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <span
                      className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm px-2`}
                      aria-current="page"
                    >
                      {relatedSkillsPage} of {paginatedData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(relatedSkillsPage + 1)}
                      disabled={!paginatedData.hasNext}
                      className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      aria-label="Next page"
                      type="button"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </nav>
              )}
            </div>
          );
        })()
      ) : activeTab === 'occupations' &&
        selectedOccupation?.related_skills?.length ? (
        (() => {
          const paginatedData = getPaginatedData(
            selectedOccupation.related_skills,
            relatedSkillsPage,
            itemsPerPage
          );
          return (
            <div className="space-y-4">
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                role="list"
                aria-label="Required skills"
              >
                {paginatedData.items.map((skill: any) => {
                  const skillCardId = `occ-skill-${skill.skill_id}`;
                  const isExpanded = expandedCards.has(skillCardId);
                  const fullSkillData = skills?.results?.find(
                    (s: any) => s.id === skill.skill_id
                  );
                  const description =
                    fullSkillData?.definition ||
                    fullSkillData?.description ||
                    'Description not available - click to view full skill details';
                  const displayDescription = description;

                  return (
                    <article
                      key={skill.skill_id}
                      className={`p-5 ${isDark ? 'bg-white/5 hover:bg-white/10 focus-within:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 focus-within:bg-gray-100 border-gray-200'} rounded-lg border cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-md`}
                      onClick={(e) => {
                        if (
                          !(e.target as HTMLElement).closest('.read-more-btn')
                        ) {
                          handleSkillClick(skill);
                        }
                      }}
                      role="listitem"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (
                            !(e.target as HTMLElement).closest('.read-more-btn')
                          ) {
                            handleSkillClick(skill);
                          }
                        }
                      }}
                      aria-labelledby={`occ-skill-${skill.skill_id}-title`}
                      aria-describedby={`occ-skill-${skill.skill_id}-description`}
                    >
                      <div className="space-y-3">
                        <h4
                          id={`occ-skill-${skill.skill_id}-title`}
                          className="text-tabiya-accent font-semibold text-lg group-hover:text-tabiya-accent/80 transition-colors"
                        >
                          {capitalizeFirstLetter(skill.skill_name)}
                        </h4>

                        <div
                          className="flex items-center gap-2 flex-wrap"
                          role="list"
                          aria-label="Skill attributes"
                        >
                          <Badge
                            variant="outline"
                            className={`text-xs ${isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'}`}
                            role="listitem"
                            aria-label={`Skill type: ${capitalizeFirstLetter(skill.skill_type || 'Skill')}`}
                          >
                            {capitalizeFirstLetter(skill.skill_type || 'Skill')}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              skill.relation_type === 'essential'
                                ? 'text-red-400 border-red-400'
                                : skill.relation_type === 'optional'
                                  ? 'text-tabiya-accent border-tabiya-accent'
                                  : 'text-gray-400 border-gray-400'
                            }`}
                            role="listitem"
                            aria-label={`Requirement level: ${skill.relation_type === 'essential' ? 'Essential' : skill.relation_type === 'optional' ? 'Optional' : capitalizeFirstLetter(skill.relation_type || 'Required')}`}
                          >
                            {skill.relation_type === 'essential'
                              ? 'Essential'
                              : skill.relation_type === 'optional'
                                ? 'Optional'
                                : capitalizeFirstLetter(
                                    skill.relation_type || 'Required'
                                  )}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <p
                            id={`occ-skill-${skill.skill_id}-description`}
                            className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm leading-relaxed`}
                          >
                            {isExpanded
                              ? displayDescription
                              : displayDescription.length > 120
                                ? `${displayDescription.slice(0, 120)}...`
                                : displayDescription ||
                                  'No description available.'}
                          </p>
                          {displayDescription &&
                            displayDescription.length > 120 && (
                              <button
                                className="read-more-btn text-tabiya-accent text-sm font-medium hover:text-tabiya-accent/80 focus:text-tabiya-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-tabiya-accent/50 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleCardExpansion(skillCardId);
                                }}
                                type="button"
                                aria-expanded={isExpanded}
                                aria-controls={`occ-skill-${skill.skill_id}-description`}
                              >
                                {isExpanded ? 'Read Less' : 'Read More'}
                              </button>
                            )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {paginatedData.totalPages > 1 && (
                <nav
                  aria-label="Required skills pagination"
                  className="flex items-center justify-between pt-4"
                >
                  <div
                    className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
                    role="status"
                    aria-live="polite"
                  >
                    Showing {(relatedSkillsPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(
                      relatedSkillsPage * itemsPerPage,
                      selectedOccupation.related_skills.length
                    )}{' '}
                    of {selectedOccupation.related_skills.length} required
                    skills
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(relatedSkillsPage - 1)}
                      disabled={!paginatedData.hasPrev}
                      className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      aria-label="Previous page"
                      type="button"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <span
                      className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm px-2`}
                      aria-current="page"
                    >
                      {relatedSkillsPage} of {paginatedData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(relatedSkillsPage + 1)}
                      disabled={!paginatedData.hasNext}
                      className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      aria-label="Next page"
                      type="button"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </nav>
              )}
            </div>
          );
        })()
      ) : selectedItem ? (
        <div
          className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-center py-8`}
          role="status"
        >
          No related {activeTab} found for this selection
        </div>
      ) : (
        <div
          className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-center py-8`}
          role="status"
        >
          Select a {activeTab.slice(0, -1)} to view related {activeTab}
        </div>
      )}
    </section>
  );
}
