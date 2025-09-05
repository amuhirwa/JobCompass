import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useSkills,
  useSkill,
  useOccupations,
  useOccupation,
  useDebouncedSearch,
  useSkillSuggestions,
} from '@/lib/hooks';
import type { Occupation } from '@/lib/types';

export default function SkillMapping() {
  const { isDark } = useDarkMode();

  // State management from the copy file
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedOccupationId, setSelectedOccupationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'skills' | 'occupations'>(
    'skills'
  );
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [relatedSkillsPage, setRelatedSkillsPage] = useState(1);
  const [careerOpportunitiesPage, setCareerOpportunitiesPage] = useState(1);

  const ITEMS_PER_PAGE = 4;

  // API calls from the copy file
  const {
    debouncedQuery,
    data: searchResults,
    isLoading: searchLoading,
  } = useDebouncedSearch(searchQuery);

  const { data: selectedSkill, isLoading: skillLoading } = useSkill(
    selectedSkillId || ''
  );
  const { data: selectedOccupation, isLoading: occupationLoading } =
    useOccupation(selectedOccupationId || '');

  const { data: skillSuggestions, isLoading: suggestionsLoading } =
    useSkillSuggestions(selectedSkillId || '');
  const { data: occupations } = useOccupations();
  const { data: skills } = useSkills();

  // Helper functions from the copy file
  const getAvailableItems = () => {
    if (searchQuery.trim()) {
      if (activeTab === 'skills') {
        return searchResults?.skills || [];
      } else if (activeTab === 'occupations') {
        return searchResults?.occupations || [];
      }
      return [];
    } else {
      if (activeTab === 'skills') {
        return skills?.results || [];
      } else if (activeTab === 'occupations') {
        return occupations?.results || [];
      }
      return [];
    }
  };

  // Utility function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Utility function to get paginated data
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

  const availableItems = getAvailableItems();

  const handleItemSelect = (item: any) => {
    if (activeTab === 'skills') {
      setSelectedSkillId(item.id);
      setSelectedOccupationId(null);
    } else if (activeTab === 'occupations') {
      setSelectedOccupationId(item.id);
      setSelectedSkillId(null);
    }
    setSearchQuery('');
    // Reset pagination when selecting new item
    setRelatedSkillsPage(1);
    setCareerOpportunitiesPage(1);
  };

  const getSelectedItem = () => {
    if (selectedSkillId && selectedSkill) return selectedSkill;
    if (selectedOccupationId && selectedOccupation) return selectedOccupation;
    return null;
  };

  const selectedItem = getSelectedItem();

  const relatedOccupations =
    occupations?.results?.filter((occupation) =>
      occupation.related_skills?.some(
        (skill) => skill.skill_id === selectedSkillId
      )
    ) || [];

  const calculateMatchPercentage = (occupation: Occupation): number => {
    if (!selectedSkill) return 0;
    const totalSkills = occupation.related_skills?.length || 0;
    if (totalSkills === 0) return 0;
    const hasSelectedSkill = occupation.related_skills?.some(
      (skill) => skill.skill_id === selectedSkillId
    );
    return hasSelectedSkill
      ? Math.floor(60 + Math.random() * 30)
      : Math.floor(Math.random() * 40);
  };

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'} w-screen overflow-x-hidden pt-20`}
    >
      {/* Overview Section */}
      {selectedItem && (
        <div className="px-6 py-6">
          <div
            className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-tabiya-accent font-bold text-3xl">
                  {activeTab === 'skills'
                    ? skillSuggestions?.length || 0
                    : selectedOccupation?.related_skills?.length || 0}
                </div>
                <div
                  className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
                >
                  {activeTab === 'skills'
                    ? 'Related Skills'
                    : 'Required Skills'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-tabiya-accent font-bold text-3xl">
                  {
                    activeTab === 'skills' ? relatedOccupations.length : 1 // Current occupation
                  }
                </div>
                <div
                  className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
                >
                  {activeTab === 'skills'
                    ? 'Career Opportunities'
                    : 'Selected Occupation'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-tabiya-accent font-bold text-3xl">
                  {activeTab === 'skills'
                    ? (skillSuggestions?.length || 0) +
                      relatedOccupations.length
                    : (selectedOccupation?.related_skills?.length || 0) +
                      relatedOccupations.length}
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
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 pb-6">
        {/* Left Sidebar - Title, Description, Search and Selection */}
        <div className="space-y-6">
          {/* Page Title and Description */}
          <div className="space-y-3">
            <h1
              className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-xl md:text-2xl font-medium`}
            >
              Skill Mapping
            </h1>
            <p
              className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm md:text-base leading-relaxed`}
            >
              Explore the interconnected world of skills and careers. Discover
              how skills connect to various occupations, related competencies,
              and career pathways.
            </p>
          </div>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search skills or occupations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 ${isDark ? 'bg-white/10 text-white placeholder-white/60 border-white/20' : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'} rounded-lg border focus:border-tabiya-accent focus:outline-none`}
            />
            <svg
              className={`absolute right-3 top-3 w-5 h-5 ${isDark ? 'text-white/60' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchLoading && (
              <div className="absolute right-10 top-3.5">
                <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-tabiya-accent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-4 border max-h-48 overflow-y-auto`}
            >
              <h3
                className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-3 text-sm`}
              >
                Search Results ({activeTab})
              </h3>
              {searchLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className={`h-8 w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              ) : availableItems.length > 0 ? (
                <div className="space-y-2">
                  {availableItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className={`p-2 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} rounded cursor-pointer transition-colors`}
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
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div
                  className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
                >
                  No {activeTab} found for "{debouncedQuery}"
                </div>
              ) : null}
            </div>
          )}

          {/* Tab Buttons */}
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
              onClick={() => {
                setActiveTab('skills');
                setRelatedSkillsPage(1);
                setCareerOpportunitiesPage(1);
              }}
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
              onClick={() => {
                setActiveTab('occupations');
                setRelatedSkillsPage(1);
                setCareerOpportunitiesPage(1);
              }}
            >
              Occupations
            </Button>
          </div>

          {/* Current Selection */}
          <div
            className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-4 border`}
          >
            <h3
              className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-3 text-lg`}
            >
              Current Selection
            </h3>
            {skillLoading || occupationLoading ? (
              <div
                className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg p-3`}
              >
                <Skeleton
                  className={`h-6 w-24 mb-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                />
                <Skeleton
                  className={`h-4 w-32 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                />
              </div>
            ) : selectedItem ? (
              <div className="bg-tabiya-accent/20 rounded-lg p-3 border border-tabiya-accent/30">
                <div className="text-tabiya-accent font-medium text-lg">
                  {selectedItem.preferred_label}
                </div>
                <div
                  className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm mt-1`}
                >
                  {selectedSkillId
                    ? selectedSkill?.skill_type
                    : selectedOccupation?.occupation_type}
                </div>
                {(selectedItem as any).definition && (
                  <p
                    className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-xs mt-2`}
                  >
                    {(selectedItem as any).definition.length > 100
                      ? `${(selectedItem as any).definition.slice(0, 100)}...`
                      : (selectedItem as any).definition}
                  </p>
                )}
                {selectedSkillId && selectedSkill?.reuse_level && (
                  <Badge
                    variant="outline"
                    className={`mt-2 ${isDark ? 'border-white/20 text-white/80' : 'border-gray-300 text-gray-700'} text-xs`}
                  >
                    {selectedSkill.reuse_level}
                  </Badge>
                )}
              </div>
            ) : (
              <div
                className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
              >
                Select a {activeTab.slice(0, -1)} to see details
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Data Display */}
        <div className="lg:col-span-3 space-y-6">
          {/* Related Skills/Requirements */}
          <div
            className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-6 border`}
          >
            <h3
              className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-4 text-xl`}
            >
              {activeTab === 'skills'
                ? 'Related Skills'
                : activeTab === 'occupations'
                  ? 'Required Skills'
                  : 'Related Items'}
            </h3>
            {activeTab === 'skills' && suggestionsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                  ITEMS_PER_PAGE
                );
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paginatedData.items.map((skill: any) => {
                        const isExpanded = expandedCards.has(skill.id);
                        const description =
                          skill.definition || skill.description || '';
                        const displayDescription = description;

                        return (
                          <div
                            key={skill.id}
                            className={`p-5 ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} rounded-lg border cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-md`}
                            onClick={(e) => {
                              // Only select skill if not clicking on Read More button
                              if (
                                !(e.target as HTMLElement).closest(
                                  '.read-more-btn'
                                )
                              ) {
                                handleItemSelect(skill);
                              }
                            }}
                          >
                            <div className="space-y-3">
                              {/* Skill Name */}
                              <h4 className="text-tabiya-accent font-semibold text-lg group-hover:text-tabiya-accent/80 transition-colors">
                                {capitalizeFirstLetter(skill.preferred_label)}
                              </h4>

                              {/* Skill Type/Group */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'}`}
                                >
                                  {capitalizeFirstLetter(
                                    skill.skill_type || 'Skill'
                                  )}
                                </Badge>
                                {skill.reuse_level && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-blue-400 border-blue-400"
                                  >
                                    {capitalizeFirstLetter(skill.reuse_level)}
                                  </Badge>
                                )}
                              </div>

                              {/* Description - Always visible */}
                              <div className="space-y-2">
                                <p
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
                                      className="read-more-btn text-tabiya-accent text-sm font-medium hover:text-tabiya-accent/80 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardExpansion(skill.id);
                                      }}
                                    >
                                      {isExpanded ? 'Read Less' : 'Read More'}
                                    </button>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination for Related Skills */}
                    {paginatedData.totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4">
                        <div
                          className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
                        >
                          Showing {(relatedSkillsPage - 1) * ITEMS_PER_PAGE + 1}{' '}
                          to{' '}
                          {Math.min(
                            relatedSkillsPage * ITEMS_PER_PAGE,
                            skillSuggestions.length
                          )}{' '}
                          of {skillSuggestions.length} related skills
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setRelatedSkillsPage((prev) => prev - 1)
                            }
                            disabled={!paginatedData.hasPrev}
                            className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span
                            className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm px-2`}
                          >
                            {relatedSkillsPage} of {paginatedData.totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setRelatedSkillsPage((prev) => prev + 1)
                            }
                            disabled={!paginatedData.hasNext}
                            className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
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
                  ITEMS_PER_PAGE
                );
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paginatedData.items.map((skill: any) => {
                        const skillCardId = `occ-skill-${skill.skill_id}`;
                        const isExpanded = expandedCards.has(skillCardId);
                        // Since RelatedSkillFromOccupation doesn't include description,
                        // we need to get it from the full skill data if available
                        const fullSkillData = skills?.results?.find(
                          (s: any) => s.id === skill.skill_id
                        );
                        const description =
                          fullSkillData?.definition ||
                          fullSkillData?.description ||
                          'Description not available - click to view full skill details';
                        const displayDescription = description;

                        return (
                          <div
                            key={skill.skill_id}
                            className={`p-5 ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} rounded-lg border cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-md`}
                            onClick={(e) => {
                              if (
                                !(e.target as HTMLElement).closest(
                                  '.read-more-btn'
                                )
                              ) {
                                setActiveTab('skills');
                                setSelectedSkillId(skill.skill_id);
                                setSelectedOccupationId(null);
                                setRelatedSkillsPage(1);
                                setCareerOpportunitiesPage(1);
                              }
                            }}
                          >
                            <div className="space-y-3">
                              {/* Skill Name */}
                              <h4 className="text-tabiya-accent font-semibold text-lg group-hover:text-tabiya-accent/80 transition-colors">
                                {capitalizeFirstLetter(skill.skill_name)}
                              </h4>

                              {/* Skill Type and Relation */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'}`}
                                >
                                  {capitalizeFirstLetter(
                                    skill.skill_type || 'Skill'
                                  )}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    skill.relation_type === 'essential'
                                      ? 'text-red-400 border-red-400'
                                      : skill.relation_type === 'optional'
                                        ? 'text-blue-400 border-blue-400'
                                        : 'text-gray-400 border-gray-400'
                                  }`}
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

                              {/* Description - Always visible */}
                              <div className="space-y-2">
                                <p
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
                                      className="read-more-btn text-tabiya-accent text-sm font-medium hover:text-tabiya-accent/80 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardExpansion(skillCardId);
                                      }}
                                    >
                                      {isExpanded ? 'Read Less' : 'Read More'}
                                    </button>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination for Required Skills */}
                    {paginatedData.totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4">
                        <div
                          className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
                        >
                          Showing {(relatedSkillsPage - 1) * ITEMS_PER_PAGE + 1}{' '}
                          to{' '}
                          {Math.min(
                            relatedSkillsPage * ITEMS_PER_PAGE,
                            selectedOccupation.related_skills.length
                          )}{' '}
                          of {selectedOccupation.related_skills.length} required
                          skills
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setRelatedSkillsPage((prev) => prev - 1)
                            }
                            disabled={!paginatedData.hasPrev}
                            className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span
                            className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm px-2`}
                          >
                            {relatedSkillsPage} of {paginatedData.totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setRelatedSkillsPage((prev) => prev + 1)
                            }
                            disabled={!paginatedData.hasNext}
                            className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : selectedItem ? (
              <div
                className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-center py-8`}
              >
                No related {activeTab} found for this selection
              </div>
            ) : (
              <div
                className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-center py-8`}
              >
                Select a {activeTab.slice(0, -1)} to view related {activeTab}
              </div>
            )}
          </div>

          {/* Career Opportunities */}
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
                  ITEMS_PER_PAGE
                );
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paginatedData.items.map((occupation: any) => {
                        const matchPercentage =
                          calculateMatchPercentage(occupation);
                        const occupationCardId = `occ-${occupation.id}`;
                        const isExpanded = expandedCards.has(occupationCardId);
                        const description =
                          occupation.definition || occupation.description || '';
                        const displayDescription = description;

                        return (
                          <div
                            key={occupation.id}
                            className={`p-5 ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} rounded-lg border cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-md`}
                            onClick={(e) => {
                              if (
                                !(e.target as HTMLElement).closest(
                                  '.read-more-btn'
                                )
                              ) {
                                setActiveTab('occupations');
                                setSelectedOccupationId(occupation.id);
                                setSelectedSkillId(null);
                                setRelatedSkillsPage(1);
                                setCareerOpportunitiesPage(1);
                              }
                            }}
                          >
                            <div className="space-y-3">
                              {/* Header with title and match percentage */}
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-tabiya-accent font-semibold text-lg group-hover:text-tabiya-accent/80 transition-colors">
                                    {capitalizeFirstLetter(
                                      occupation.preferred_label
                                    )}
                                  </h4>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-tabiya-accent border-tabiya-accent font-medium"
                                >
                                  {matchPercentage}% match
                                </Badge>
                              </div>

                              {/* Occupation Type */}
                              <Badge
                                variant="outline"
                                className={`text-xs w-fit ${isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'}`}
                              >
                                {capitalizeFirstLetter(
                                  occupation.occupation_type || 'Occupation'
                                )}
                              </Badge>

                              {/* Description - Always visible */}
                              <div className="space-y-2">
                                <p
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
                                      className="read-more-btn text-tabiya-accent text-sm font-medium hover:text-tabiya-accent/80 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardExpansion(occupationCardId);
                                      }}
                                    >
                                      {isExpanded ? 'Read Less' : 'Read More'}
                                    </button>
                                  )}
                              </div>

                              {/* Skills count indicator */}
                              <div
                                className={`${isDark ? 'text-white/50' : 'text-gray-500'} text-xs flex items-center gap-1`}
                              >
                                <span className="w-2 h-2 bg-tabiya-accent rounded-full"></span>
                                {occupation.related_skills?.length || 0} related
                                skills
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination for Career Opportunities */}
                    {paginatedData.totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4">
                        <div
                          className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
                        >
                          Showing{' '}
                          {(careerOpportunitiesPage - 1) * ITEMS_PER_PAGE + 1}{' '}
                          to{' '}
                          {Math.min(
                            careerOpportunitiesPage * ITEMS_PER_PAGE,
                            relatedOccupations.length
                          )}{' '}
                          of {relatedOccupations.length} career opportunities
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCareerOpportunitiesPage((prev) => prev - 1)
                            }
                            disabled={!paginatedData.hasPrev}
                            className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span
                            className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm px-2`}
                          >
                            {careerOpportunitiesPage} of{' '}
                            {paginatedData.totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCareerOpportunitiesPage((prev) => prev + 1)
                            }
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
                          <div className="text-lg font-medium">
                            No career opportunities found
                          </div>
                          <div className="text-sm">
                            Try selecting a different skill to explore career
                            paths.
                          </div>
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
                  <div className="text-lg font-medium">
                    No career opportunities to display
                  </div>
                  <div className="text-sm max-w-md mx-auto">
                    Select a skill from the sidebar to discover related career
                    paths and opportunities in your field.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Market Insights - Bottom Section */}
      <div className="px-6 pb-6">
        <div
          className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-6 border`}
        >
          <h3
            className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-6 text-xl`}
          >
            Market Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-tabiya-accent font-bold text-3xl">
                $95,000
              </div>
              <div
                className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
              >
                Average Salary
              </div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold text-3xl">+22%</div>
              <div
                className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
              >
                Growth Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-3xl">68%</div>
              <div
                className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
              >
                Remote Opportunities
              </div>
            </div>
            <div className="text-center">
              <div className="flex gap-2 justify-center">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-tabiya-accent hover:bg-tabiya-accent/90"
                  disabled={!selectedItem}
                >
                  Explore Path
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  disabled={!selectedItem}
                >
                  Save View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
