import { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { SkillLearningModal } from '@/components/custom';
import {
  StatsOverview,
  SearchSection,
  TabButtons,
  CurrentSelection,
  RelatedSkillsSection,
  CareerOpportunitiesSection,
  MarketInsightsSection,
  CareerPathsSection,
} from '@/features/SkillMapping';
import {
  useSkills,
  useSkill,
  useOccupations,
  useOccupation,
  useDebouncedSearch,
  useSkillSuggestions,
  useMarketInsights,
  useGenerateMarketInsights,
  useCareerPaths,
  useGenerateCareerPaths,
} from '@/lib/hooks';
import type { CareerStepSkill } from '@/lib/types';

export default function SkillMapping() {
  const { isDark } = useDarkMode();

  // State management
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
  const [skillLearningModal, setSkillLearningModal] = useState<{
    isOpen: boolean;
    skillInfo: CareerStepSkill | null;
  }>({
    isOpen: false,
    skillInfo: null,
  });

  const ITEMS_PER_PAGE = 4;

  // API hooks
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
  const { data: marketInsights, isLoading: marketInsightsLoading } =
    useMarketInsights(selectedOccupationId || '');
  const generateMarketInsights = useGenerateMarketInsights();
  const { data: careerPaths, isLoading: careerPathsLoading } = useCareerPaths(
    selectedOccupationId || ''
  );
  const generateCareerPaths = useGenerateCareerPaths();

  // Utility functions
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

  const getSelectedItem = () => {
    if (selectedSkillId && selectedSkill) return selectedSkill;
    if (selectedOccupationId && selectedOccupation) return selectedOccupation;
    return null;
  };

  const relatedOccupations =
    occupations?.results?.filter((occupation) =>
      occupation.related_skills?.some(
        (skill) => skill.skill_id === selectedSkillId
      )
    ) || [];

  // Event handlers
  const handleItemSelect = (item: any) => {
    if (activeTab === 'skills') {
      setSelectedSkillId(item.id);
      setSelectedOccupationId(null);
    } else if (activeTab === 'occupations') {
      setSelectedOccupationId(item.id);
      setSelectedSkillId(null);
    }
    setSearchQuery('');
    resetPagination();
  };

  const handleTabChange = (tab: 'skills' | 'occupations') => {
    setActiveTab(tab);
    resetPagination();
  };

  const handleOccupationSelect = (occupationId: string) => {
    setActiveTab('occupations');
    setSelectedOccupationId(occupationId);
    setSelectedSkillId(null);
    resetPagination();
  };

  const resetPagination = () => {
    setRelatedSkillsPage(1);
    setCareerOpportunitiesPage(1);
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

  const handleGenerateInsights = () => {
    if (selectedOccupationId) {
      generateMarketInsights.mutate(selectedOccupationId);
    }
  };

  const handleGenerateCareerPaths = () => {
    if (selectedOccupationId) {
      generateCareerPaths.mutate(selectedOccupationId);
    }
  };

  const handleSkillClick = (skillInfo: CareerStepSkill) => {
    setSkillLearningModal({
      isOpen: true,
      skillInfo,
    });
  };

  const handleCloseSkillModal = () => {
    setSkillLearningModal({
      isOpen: false,
      skillInfo: null,
    });
  };

  const selectedItem = getSelectedItem();
  const availableItems = getAvailableItems();

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'} w-screen overflow-x-hidden pt-20`}
    >
      {/* Stats Overview */}
      {selectedItem && (
        <StatsOverview
          activeTab={activeTab}
          skillSuggestionsLength={skillSuggestions?.length || 0}
          selectedOccupationSkillsLength={
            selectedOccupation?.related_skills?.length || 0
          }
          relatedOccupationsLength={relatedOccupations.length}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 pb-6">
        {/* Sidebar */}
        <div className="space-y-6">
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

          <SearchSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchLoading={searchLoading}
            searchResults={searchResults}
            availableItems={availableItems}
            activeTab={activeTab}
            debouncedQuery={debouncedQuery}
            onItemSelect={handleItemSelect}
          />

          <TabButtons activeTab={activeTab} onTabChange={handleTabChange} />

          <CurrentSelection
            loading={skillLoading || occupationLoading}
            selectedItem={selectedItem}
            selectedSkillId={selectedSkillId}
            selectedSkill={selectedSkill}
            selectedOccupation={selectedOccupation}
            activeTab={activeTab}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <RelatedSkillsSection
            activeTab={activeTab}
            suggestionsLoading={suggestionsLoading}
            skillSuggestions={skillSuggestions || []}
            selectedOccupation={selectedOccupation}
            skills={skills}
            selectedItem={selectedItem}
            expandedCards={expandedCards}
            relatedSkillsPage={relatedSkillsPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onItemSelect={handleItemSelect}
            onTabChange={setActiveTab}
            onSkillIdChange={setSelectedSkillId}
            onOccupationIdChange={setSelectedOccupationId}
            onPageChange={setRelatedSkillsPage}
            onToggleCardExpansion={toggleCardExpansion}
            onPaginationReset={resetPagination}
          />

        
          <CareerOpportunitiesSection
            selectedSkill={selectedSkill}
            relatedOccupations={relatedOccupations}
            expandedCards={expandedCards}
            careerOpportunitiesPage={careerOpportunitiesPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onOccupationSelect={handleOccupationSelect}
            onToggleCardExpansion={toggleCardExpansion}
            onPageChange={setCareerOpportunitiesPage}
          />
        </div>
      </div>

      {/* Market Insights Section */}
      <MarketInsightsSection
        selectedOccupationId={selectedOccupationId}
        marketInsights={marketInsights}
        marketInsightsLoading={marketInsightsLoading}
        generateMarketInsights={generateMarketInsights}
        generateCareerPaths={generateCareerPaths}
        onGenerateInsights={handleGenerateInsights}
        onGenerateCareerPaths={handleGenerateCareerPaths}
      />

      {/* Career Paths Section */}
      <CareerPathsSection
        selectedOccupationId={selectedOccupationId}
        careerPaths={careerPaths}
        careerPathsLoading={careerPathsLoading}
        onSkillClick={handleSkillClick}
      />

      {/* Skill Learning Modal */}
      <SkillLearningModal
        isOpen={skillLearningModal.isOpen}
        onClose={handleCloseSkillModal}
        skillInfo={skillLearningModal.skillInfo}
      />
    </div>
  );
}
