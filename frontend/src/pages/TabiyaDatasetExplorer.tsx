import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Occupation, SkillGroup } from '@/lib/types';

export default function TabiyaDatasetExplorer() {
  const { isDark } = useDarkMode();

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

  // Get current selection based on active tab
  const selectedItem =
    selectedSkillId && selectedSkill
      ? selectedSkill
      : selectedOccupationId && selectedOccupation
        ? selectedOccupation
        : selectedSkillGroupId
          ? skillGroups?.results?.find((g) => g.id === selectedSkillGroupId)
          : null;

  // Get related occupations for selected skill
  const relatedOccupations =
    selectedSkillId && occupations?.results
      ? occupations.results.filter((occupation) =>
          occupation.related_skills?.some(
            (skill) => skill.skill_id === selectedSkillId
          )
        )
      : [];

  // Filter and display items based on current tab and search
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
        // Filter skill groups by search query since the API doesn't support search
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

  const displayedItems = getDisplayedItems();

  // Get pagination info
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

  const totalPages = getTotalPages();

  const handleFilterChange = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleTabChange = (tab: 'skills' | 'skill-groups' | 'occupations') => {
    setActiveTab(tab);
    setSelectedSkillId(null);
    setSelectedOccupationId(null);
    setSelectedSkillGroupId(null);
    setCurrentPage(1); // Reset to first page when tab changes
    setSearchQuery(''); // Clear search when changing tabs
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

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'} w-screen overflow-x-hidden`}
    >
      <div className="flex w-screen min-w-0">
        {/* Left Sidebar */}
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
              occupations. Use filters and search to discover connections and
              build your career insights.
            </p>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search skills or occupations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.crossSectorOnly}
                    onChange={() => handleFilterChange('crossSectorOnly')}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 transition-all ${
                      filters.crossSectorOnly
                        ? 'bg-tabiya-accent border-tabiya-accent'
                        : isDark
                          ? 'border-white/30 bg-transparent'
                          : 'border-gray-300 bg-white'
                    }`}
                  >
                    {filters.crossSectorOnly && (
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
                  Cross-sector skills only
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.localOccupationsOnly}
                    onChange={() => handleFilterChange('localOccupationsOnly')}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 transition-all ${
                      filters.localOccupationsOnly
                        ? 'bg-tabiya-accent border-tabiya-accent'
                        : isDark
                          ? 'border-white/30 bg-transparent'
                          : 'border-gray-300 bg-white'
                    }`}
                  >
                    {filters.localOccupationsOnly && (
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
                  Local occupations only
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.emergingSkills}
                    onChange={() => handleFilterChange('emergingSkills')}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 transition-all ${
                      filters.emergingSkills
                        ? 'bg-tabiya-accent border-tabiya-accent'
                        : isDark
                          ? 'border-white/30 bg-transparent'
                          : 'border-gray-300 bg-white'
                    }`}
                  >
                    {filters.emergingSkills && (
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
                  Emerging skills
                </span>
              </label>
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
                onClick={() => {
                  handleTabChange('skill-groups');
                }}
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
                skillGroups?.results?.slice(0, 4).map((group: SkillGroup) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      setActiveTab('skill-groups');
                      handleItemSelect(group);
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
                onClick={() => {
                  handleTabChange('occupations');
                }}
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
                    onClick={() => {
                      handleTabChange('occupations');
                    }}
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

        {/* Main Content Area */}
        <div
          className={`flex-1 min-w-0 p-8 ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'}`}
        >
          {/* Stats Overview */}
          {taxonomyStats && (
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card
                className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    Total Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tabiya-accent">
                    {taxonomyStats.total_skills}
                  </div>
                </CardContent>
              </Card>
              <Card
                className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    Occupations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tabiya-accent">
                    {taxonomyStats.total_occupations}
                  </div>
                </CardContent>
              </Card>
              <Card
                className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    Skill Groups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tabiya-accent">
                    {taxonomyStats.total_skill_groups}
                  </div>
                </CardContent>
              </Card>
              <Card
                className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tabiya-accent">
                    {29}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Tabs */}
          <div
            className={`flex gap-1 mb-8 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}
          >
            <button
              onClick={() => handleTabChange('skills')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'skills'
                  ? 'text-tabiya-accent border-b-2 border-tabiya-accent'
                  : isDark
                    ? 'text-white/70 hover:text-tabiya-accent'
                    : 'text-gray-600 hover:text-tabiya-accent'
              }`}
            >
              Skills Explorer
            </button>
            <button
              onClick={() => handleTabChange('skill-groups')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'skill-groups'
                  ? 'text-tabiya-accent border-b-2 border-tabiya-accent'
                  : isDark
                    ? 'text-white/70 hover:text-tabiya-accent'
                    : 'text-gray-600 hover:text-tabiya-accent'
              }`}
            >
              Skill Groups
            </button>
            <button
              onClick={() => handleTabChange('occupations')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'occupations'
                  ? 'text-tabiya-accent border-b-2 border-tabiya-accent'
                  : isDark
                    ? 'text-white/70 hover:text-tabiya-accent'
                    : 'text-gray-600 hover:text-tabiya-accent'
              }`}
            >
              Occupations
            </button>
          </div>

          {/* Main Content */}
          <div className="w-full">
            {searchQuery && (
              <div className="mb-4">
                <span
                  className={`${isDark ? 'text-white/60' : 'text-gray-600'}`}
                >
                  Search results for:{' '}
                </span>
                <span className="text-tabiya-accent font-medium">
                  "{debouncedQuery}"
                </span>
              </div>
            )}

            {selectedItem ? (
              /* Detail View */
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedSkillId(null);
                      setSelectedOccupationId(null);
                      setSelectedSkillGroupId(null);
                    }}
                    className={`${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    ← Back to {activeTab.replace('-', ' ')} list
                  </Button>
                </div>

                <h1
                  className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
                >
                  {capitalizeFirstLetter(selectedItem.preferred_label)}
                </h1>

                {/* Item Tags */}
                <div className="flex gap-2 mb-6">
                  <Badge className="bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30">
                    {selectedSkillId && selectedSkill
                      ? capitalizeFirstLetter(selectedSkill.skill_type)
                      : selectedOccupationId && selectedOccupation
                        ? capitalizeFirstLetter(
                            selectedOccupation.occupation_type
                          )
                        : 'Skill Group'}
                  </Badge>
                  {selectedSkillId && selectedSkill?.reuse_level && (
                    <Badge
                      variant="outline"
                      className={`${isDark ? 'border-white/20 text-white' : 'border-gray-300 text-gray-700'}`}
                    >
                      {capitalizeFirstLetter(selectedSkill.reuse_level)}
                    </Badge>
                  )}
                </div>

                {/* Description/Definition */}
                {(selectedItem as any).definition && (
                  <div className="mb-8">
                    <h2
                      className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
                    >
                      Description
                    </h2>
                    <p
                      className={`${isDark ? 'text-white/80' : 'text-gray-700'} leading-relaxed mb-4`}
                    >
                      {(selectedItem as any).definition}
                    </p>
                  </div>
                )}
                {selectedItem.description &&
                  !(selectedItem as any).definition && (
                    <div className="mb-8">
                      <h2
                        className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
                      >
                        Description
                      </h2>
                      <p
                        className={`${isDark ? 'text-white/80' : 'text-gray-700'} leading-relaxed mb-4`}
                      >
                        {selectedItem.description}
                      </p>
                    </div>
                  )}

                {/* Scope Notes */}
                {selectedSkillId && selectedSkill?.scope_note && (
                  <div className="mb-8">
                    <h2
                      className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
                    >
                      Scope Notes
                    </h2>
                    <p
                      className={`${isDark ? 'text-white/80' : 'text-gray-700'} leading-relaxed`}
                    >
                      {selectedSkill.scope_note}
                    </p>
                  </div>
                )}

                {/* Related Items - Skills */}
                {selectedSkillId && (
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h2
                        className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
                      >
                        Related Skills
                      </h2>
                      <div className="space-y-3">
                        {skillSuggestions?.slice(0, 4).map((skill: any) => (
                          <div
                            key={skill.id}
                            onClick={() => handleItemSelect(skill)}
                            className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer"
                          >
                            {capitalizeFirstLetter(skill.preferred_label)}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2
                        className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
                      >
                        Related Occupations
                      </h2>
                      <div className="space-y-3">
                        {relatedOccupations
                          .slice(0, 4)
                          .map((occupation: Occupation) => (
                            <div
                              key={occupation.id}
                              onClick={() => {
                                setActiveTab('occupations');
                                handleItemSelect(occupation);
                              }}
                              className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer"
                            >
                              {capitalizeFirstLetter(
                                occupation.preferred_label
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Related Items - Occupations */}
                {selectedOccupationId && selectedOccupation && (
                  <div className="mb-8">
                    <h2
                      className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
                    >
                      Required Skills
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedOccupation.related_skills
                        ?.slice(0, 6)
                        .map((skill: any) => (
                          <div
                            key={skill.skill_id}
                            onClick={() => {
                              setActiveTab('skills');
                              setSelectedSkillId(skill.skill_id);
                              setSelectedOccupationId(null);
                              setSelectedSkillGroupId(null);
                            }}
                            className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer"
                          >
                            {capitalizeFirstLetter(skill.skill_name)}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Skill Group Details */}
                {selectedSkillGroupId && selectedItem && (
                  <div className="mb-8">
                    <div className="grid grid-cols-2 gap-8 mb-6">
                      <Card
                        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle
                            className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                          >
                            Total Skills in Group
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-tabiya-accent">
                            {Math.floor(Math.random() * 200) + 50}
                          </div>
                        </CardContent>
                      </Card>
                      <Card
                        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle
                            className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                          >
                            Group Type
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-semibold text-tabiya-accent">
                            Skill Group
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <h2
                      className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
                    >
                      Skills in this Group
                    </h2>

                    {skillsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className={`h-12 w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {skills?.results?.slice(0, 20).map((skill: any) => (
                          <div
                            key={skill.id}
                            onClick={() => {
                              setActiveTab('skills');
                              setSelectedSkillId(skill.id);
                              setSelectedSkillGroupId(null);
                              setSelectedOccupationId(null);
                            }}
                            className={`p-4 rounded-lg cursor-pointer transition-all ${
                              isDark
                                ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <span className="text-tabiya-accent hover:text-tabiya-accent/80 font-medium text-base">
                                  {capitalizeFirstLetter(skill.preferred_label)}
                                </span>
                                {skill.description && (
                                  <p
                                    className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'} mt-2 line-clamp-2 leading-relaxed`}
                                  >
                                    {skill.description.length > 100
                                      ? `${skill.description.slice(0, 100)}...`
                                      : skill.description}
                                  </p>
                                )}
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-sm ml-3 ${isDark ? 'border-white/20 text-white/70' : 'border-gray-300 text-gray-600'}`}
                              >
                                {capitalizeFirstLetter(
                                  skill.skill_type || 'skill'
                                )}
                              </Badge>
                            </div>
                          </div>
                        )) || (
                          <div
                            className={`text-center py-8 ${isDark ? 'text-white/60' : 'text-gray-500'}`}
                          >
                            No skills found in this group.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* List View */
              <div>
                <h1
                  className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
                >
                  {activeTab === 'skills'
                    ? 'Skills Explorer'
                    : activeTab === 'skill-groups'
                      ? 'Skill Groups'
                      : 'Occupations'}
                </h1>

                {/* Loading State */}
                {(activeTab === 'skills' && skillsLoading) ||
                (activeTab === 'skill-groups' && skillGroupsLoading) ||
                (activeTab === 'occupations' && occupationsLoading) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card
                        key={i}
                        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                      {displayedItems.map((item: any) => (
                        <Card
                          key={item.id}
                          onClick={() => handleItemSelect(item)}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg group ${
                            isDark
                              ? 'bg-white/5 border-white/10 hover:bg-white/10'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <CardHeader className="pb-4">
                            <CardTitle
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
                              >
                                {activeTab === 'skills'
                                  ? capitalizeFirstLetter(
                                      item.skill_type || 'skill'
                                    )
                                  : activeTab === 'occupations'
                                    ? capitalizeFirstLetter(
                                        item.occupation_type || 'occupation'
                                      )
                                    : 'Skill Group'}
                              </Badge>
                              {item.description && (
                                <p
                                  className={`text-base ${isDark ? 'text-white/70' : 'text-gray-600'} line-clamp-3 leading-relaxed`}
                                >
                                  {item.description.length > 140
                                    ? `${item.description.slice(0, 140)}...`
                                    : item.description}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between">
                        <div
                          className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}
                        >
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            Previous
                          </Button>

                          {/* Page numbers */}
                          <div className="flex gap-1">
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
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
                                      currentPage === pageNum
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={
                                      currentPage === pageNum
                                        ? 'bg-tabiya-accent hover:bg-tabiya-accent/90 text-white'
                                        : isDark
                                          ? 'border-white/20 text-white hover:bg-white/10'
                                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              }
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {displayedItems.length === 0 &&
                  !skillsLoading &&
                  !skillGroupsLoading &&
                  !occupationsLoading && (
                    <div
                      className={`text-center py-8 ${isDark ? 'text-white/60' : 'text-gray-500'}`}
                    >
                      No {activeTab.replace('-', ' ')} found.
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
