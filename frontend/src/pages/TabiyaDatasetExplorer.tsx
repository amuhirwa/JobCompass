import { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Sidebar,
  StatsOverview,
  NavigationTabs,
  DetailView,
  ItemsList,
} from '@/features/TabiyaDatasetExplorer';
import {
  useSkills,
  useSkill,
  useSkillGroups,
  useOccupations,
  useOccupation,
  useOccupationGroups,
  useDebouncedSearch,
  useTaxonomyStats,
  useSkillSuggestions,
} from '@/lib/hooks';

export default function TabiyaDatasetExplorer() {
  const { isDark } = useDarkMode();

  // State management
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedOccupationId, setSelectedOccupationId] = useState<
    string | null
  >(null);
  const [selectedSkillGroupId, setSelectedSkillGroupId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<
    'skills' | 'skill-groups' | 'occupations'
  >('skills');
  const [filters, setFilters] = useState({
    crossSectorOnly: false,
    localOccupationsOnly: false,
    emergingSkills: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // API calls
  const { data: skills, isLoading: skillsLoading } = useSkills({
    reuse_level: filters.crossSectorOnly ? 'cross-sector' : undefined,
    page: currentPage,
    page_size: itemsPerPage,
  });
  const { data: skillGroups, isLoading: skillGroupsLoading } = useSkillGroups();
  const { data: occupations, isLoading: occupationsLoading } = useOccupations({
    occupation_type: filters.localOccupationsOnly
      ? 'localoccupation'
      : undefined,
    page: currentPage,
    page_size: itemsPerPage,
  });
  const { data: occupationGroups, isLoading: occupationGroupsLoading } =
    useOccupationGroups();
  const { data: taxonomyStats } = useTaxonomyStats();
  const {
    debouncedQuery,
    data: searchResults,
    isLoading: searchLoading,
  } = useDebouncedSearch(searchQuery);

  // Get selected item details
  const { data: selectedSkill } = useSkill(selectedSkillId || '');
  const { data: selectedOccupation } = useOccupation(
    selectedOccupationId || ''
  );
  const { data: skillSuggestions } = useSkillSuggestions(selectedSkillId || '');

  // Utility functions
  const getSelectedItem = () => {
    if (selectedSkillId && selectedSkill) return selectedSkill;
    if (selectedOccupationId && selectedOccupation) return selectedOccupation;
    if (selectedSkillGroupId) {
      return skillGroups?.results?.find((g) => g.id === selectedSkillGroupId);
    }
    return null;
  };

  const getDisplayedItems = () => {
    if (activeTab === 'skills') {
      return searchQuery.trim()
        ? searchResults?.skills || []
        : skills?.results || [];
    } else if (activeTab === 'occupations') {
      return searchQuery.trim()
        ? searchResults?.occupations || []
        : occupations?.results || [];
    } else if (activeTab === 'skill-groups') {
      if (searchQuery.trim()) {
        return (
          skillGroups?.results?.filter(
            (group) =>
              group.preferred_label
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              group.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          ) || []
        );
      }
      return skillGroups?.results || [];
    }
    return [];
  };

  const getTotalPages = () => {
    if (activeTab === 'skills') {
      return Math.ceil((skills?.count || 0) / itemsPerPage);
    } else if (activeTab === 'occupations') {
      return Math.ceil((occupations?.count || 0) / itemsPerPage);
    } else if (activeTab === 'skill-groups') {
      return Math.ceil((skillGroups?.count || 0) / itemsPerPage);
    }
    return 1;
  };

  const getRelatedOccupations = () => {
    return selectedSkillId && occupations?.results
      ? occupations.results.filter((occupation) =>
          occupation.related_skills?.some(
            (skill) => skill.skill_id === selectedSkillId
          )
        )
      : [];
  };

  // Event handlers
  const handleFilterChange = (filterKey: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey as keyof typeof prev],
    }));
    setCurrentPage(1);
  };

  const handleTabChange = (tab: 'skills' | 'skill-groups' | 'occupations') => {
    setActiveTab(tab);
    setSelectedSkillId(null);
    setSelectedOccupationId(null);
    setSelectedSkillGroupId(null);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleItemSelect = (item: any) => {
    if (activeTab === 'skills') {
      setSelectedSkillId(item.id);
      setSelectedOccupationId(null);
      setSelectedSkillGroupId(null);
    } else if (activeTab === 'occupations') {
      setSelectedOccupationId(item.id);
      setSelectedSkillId(null);
      setSelectedSkillGroupId(null);
    } else if (activeTab === 'skill-groups') {
      setSelectedSkillGroupId(item.id);
      setSelectedSkillId(null);
      setSelectedOccupationId(null);
    }
  };

  const handleBackClick = () => {
    setSelectedSkillId(null);
    setSelectedOccupationId(null);
    setSelectedSkillGroupId(null);
  };

  const selectedItem = getSelectedItem();
  const displayedItems = getDisplayedItems();
  const totalPages = getTotalPages();
  const relatedOccupations = getRelatedOccupations();

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'} w-screen overflow-x-hidden`}
    >
      <div className="flex w-screen min-w-0">
        {/* Left Sidebar */}
        <aside
          className="flex-shrink-0"
          role="complementary"
          aria-label="Dataset explorer filters and navigation"
        >
          <Sidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchLoading={searchLoading}
            filters={filters}
            onFilterChange={handleFilterChange}
            skillGroups={skillGroups}
            skillGroupsLoading={skillGroupsLoading}
            occupationGroups={occupationGroups}
            occupationGroupsLoading={occupationGroupsLoading}
            selectedSkillGroupId={selectedSkillGroupId}
            onTabChange={handleTabChange}
            onItemSelect={handleItemSelect}
          />
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 min-w-0 p-8 ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'}`}
          role="main"
          aria-labelledby="dataset-explorer-heading"
        >
          <h1 id="dataset-explorer-heading" className="sr-only">
            Tabiya Dataset Explorer
          </h1>

          {/* Stats Overview */}
          <section aria-labelledby="stats-overview-heading">
            <h2 id="stats-overview-heading" className="sr-only">
              Dataset Statistics Overview
            </h2>
            <StatsOverview taxonomyStats={taxonomyStats} />
          </section>

          {/* Navigation Tabs */}
          <section aria-labelledby="navigation-tabs-heading">
            <h2 id="navigation-tabs-heading" className="sr-only">
              Dataset Category Navigation
            </h2>
            <NavigationTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </section>

          {/* Main Content */}
          <section className="w-full" aria-labelledby="content-section-heading">
            <h2 id="content-section-heading" className="sr-only">
              {selectedItem
                ? 'Item Details'
                : `${activeTab.replace('-', ' ')} List`}
            </h2>
            {selectedItem ? (
              /* Detail View */
              <DetailView
                selectedItem={selectedItem}
                selectedSkillId={selectedSkillId}
                selectedOccupationId={selectedOccupationId}
                selectedSkillGroupId={selectedSkillGroupId}
                selectedSkill={selectedSkill}
                selectedOccupation={selectedOccupation}
                skillSuggestions={skillSuggestions}
                relatedOccupations={relatedOccupations}
                skills={skills}
                skillsLoading={skillsLoading}
                activeTab={activeTab}
                onBackClick={handleBackClick}
                onItemSelect={handleItemSelect}
                onTabChange={handleTabChange}
                onSkillIdChange={setSelectedSkillId}
                onOccupationIdChange={setSelectedOccupationId}
                onSkillGroupIdChange={setSelectedSkillGroupId}
              />
            ) : (
              /* List View */
              <ItemsList
                activeTab={activeTab}
                displayedItems={displayedItems}
                searchQuery={searchQuery}
                debouncedQuery={debouncedQuery}
                skillsLoading={skillsLoading}
                skillGroupsLoading={skillGroupsLoading}
                occupationsLoading={occupationsLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onItemSelect={handleItemSelect}
                onPageChange={setCurrentPage}
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
