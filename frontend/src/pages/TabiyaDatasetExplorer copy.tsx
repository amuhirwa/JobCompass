import Navigation from "@/components/custom/Navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
} from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Skill, Occupation, SkillGroup } from "@/lib/types";

export default function TabiyaDatasetExplorer() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedOccupationId, setSelectedOccupationId] = useState<string | null>(null);
  const [selectedSkillGroupId, setSelectedSkillGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"skills" | "skill-groups" | "occupations">("skills");
  const [filters, setFilters] = useState({
    crossSectorOnly: false,
    localOccupationsOnly: false,
    emergingSkills: false,
  });

  // API calls
  const { data: skills, isLoading: skillsLoading } = useSkills({
    reuse_level: filters.crossSectorOnly ? "cross-sector" : undefined,
  });
  const { data: skillGroups, isLoading: skillGroupsLoading } = useSkillGroups();
  const { data: occupations, isLoading: occupationsLoading } = useOccupations({
    occupation_type: filters.localOccupationsOnly ? "localoccupation" : undefined,
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
  const { data: selectedSkill, isLoading: selectedSkillLoading } = useSkill(selectedSkillId || "");
  const { data: selectedOccupation, isLoading: selectedOccupationLoading } = useOccupation(selectedOccupationId || "");
  const { data: skillSuggestions } = useSkillSuggestions(selectedSkillId || "");

  // Get current selection based on active tab
  const selectedItem = selectedSkillId && selectedSkill ? selectedSkill :
                      selectedOccupationId && selectedOccupation ? selectedOccupation :
                      selectedSkillGroupId ? skillGroups?.results?.find(g => g.id === selectedSkillGroupId) :
                      null;

  // Get related occupations for selected skill
  const relatedOccupations = selectedSkillId && occupations?.results ? 
    occupations.results.filter(occupation =>
      occupation.related_skills?.some(skill => skill.skill_id === selectedSkillId)
    ) : [];

  // Filter and display items based on current tab and search
  const getDisplayedItems = () => {
    if (activeTab === "skills") {
      return searchQuery.trim() ? (searchResults?.skills || []) : (skills?.results || []);
    } else if (activeTab === "occupations") {
      return searchQuery.trim() ? (searchResults?.occupations || []) : (occupations?.results || []);
    } else if (activeTab === "skill-groups") {
      return skillGroups?.results || [];
    }
    return [];
  };

  const displayedItems = getDisplayedItems();

  const handleFilterChange = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  return (
    <div className="min-h-screen bg-tabiya-dark w-screen overflow-x-hidden">
      <div className="w-full overflow-hidden">
        <Navigation />
      </div>

      <div className="flex w-full">
        {/* Left Sidebar */}
        <div className="w-80 bg-white/5 border-r border-white/10 min-h-screen p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white/80"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">
                Tabiya Dataset Explorer
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search skills or occupations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/60 rounded-lg border border-white/20 focus:border-tabiya-accent focus:outline-none"
              />
              {searchLoading && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-tabiya-accent rounded-full"></div>
                </div>
              )}
            </div>

            <Button className="w-full bg-tabiya-accent hover:bg-tabiya-accent/90 text-white mb-6">
              My Bookmarks
            </Button>
          </div>

          {/* Filters Section */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.crossSectorOnly}
                  onChange={() => handleFilterChange("crossSectorOnly")}
                  className="rounded border-white/20 bg-white/10 text-tabiya-accent focus:ring-tabiya-accent"
                />
                <span className="text-sm text-white/80">
                  Cross-sector skills only
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.localOccupationsOnly}
                  onChange={() => handleFilterChange("localOccupationsOnly")}
                  className="rounded border-white/20 bg-white/10 text-tabiya-accent focus:ring-tabiya-accent"
                />
                <span className="text-sm text-white/80">
                  Local occupations only
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.emergingSkills}
                  onChange={() => handleFilterChange("emergingSkills")}
                  className="rounded border-white/20 bg-white/10 text-tabiya-accent focus:ring-tabiya-accent"
                />
                <span className="text-sm text-white/80">Emerging skills</span>
              </label>
            </div>
          </div>

          {/* Skill Groups */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">Skill Groups</h3>
            <div className="space-y-2">
              {skillGroupsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2"
                    >
                      <Skeleton className="h-4 w-24 bg-white/10" />
                      <Skeleton className="h-6 w-8 bg-white/10" />
                    </div>
                  ))
                : skillGroups?.results?.slice(0, 8).map((group) => (
                    <div
                      key={group.id}
                      className="flex justify-between items-center py-2 cursor-pointer hover:bg-white/5 rounded px-2 transition-colors"
                      onClick={() => {
                        setActiveTab("skill-groups");
                        setSelectedSkillGroupId(group.id);
                        setSelectedSkillId(null);
                        setSelectedOccupationId(null);
                      }}
                    >
                      <span className="text-sm text-white/80 hover:text-white">
                        {group.preferred_label}
                      </span>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                        {group.skills?.length || "N/A"}
                      </span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Occupation Groups */}
          <div>
            <h3 className="font-semibold text-white mb-4">Occupation Groups</h3>
            <div className="space-y-2">
              {occupationGroupsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2"
                    >
                      <Skeleton className="h-4 w-20 bg-white/10" />
                      <Skeleton className="h-6 w-8 bg-white/10" />
                    </div>
                  ))
                : occupationGroups?.results?.slice(0, 6).map((group) => (
                    <div
                      key={group.id}
                      className="flex justify-between items-center py-2 cursor-pointer hover:bg-white/5 rounded px-2 transition-colors"
                      onClick={() => {
                        setActiveTab("occupations");
                        setSelectedOccupationId(null);
                        setSelectedSkillId(null);
                        setSelectedSkillGroupId(null);
                        // You could filter occupations by group here if needed
                      }}
                    >
                      <span className="text-sm text-white/80 hover:text-white">
                        {group.preferred_label}
                      </span>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                        {group.occupations?.length || "N/A"}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 bg-tabiya-dark">
          {/* Stats Overview */}
          {taxonomyStats && (
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tabiya-accent">
                    {taxonomyStats.total_skills}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Occupations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tabiya-accent">
                    {taxonomyStats.total_occupations}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Skill Groups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tabiya-accent">
                    {taxonomyStats.total_skill_groups}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tabiya-accent">
                    {taxonomyStats.languages?.length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex gap-1 mb-8 border-b border-white/10">
            <button 
              onClick={() => {
                setActiveTab("skills");
                setSelectedSkillId(null);
                setSelectedOccupationId(null);
                setSelectedSkillGroupId(null);
              }}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "skills" 
                  ? "text-tabiya-accent border-b-2 border-tabiya-accent"
                  : "text-white/70 hover:text-tabiya-accent"
              }`}
            >
              Skills Explorer
            </button>
            <button 
              onClick={() => {
                setActiveTab("skill-groups");
                setSelectedSkillId(null);
                setSelectedOccupationId(null);
                setSelectedSkillGroupId(null);
              }}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "skill-groups"
                  ? "text-tabiya-accent border-b-2 border-tabiya-accent"
                  : "text-white/70 hover:text-tabiya-accent"
              }`}
            >
              Skill Groups
            </button>
            <button 
              onClick={() => {
                setActiveTab("occupations");
                setSelectedSkillId(null);
                setSelectedOccupationId(null);
                setSelectedSkillGroupId(null);
              }}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "occupations"
                  ? "text-tabiya-accent border-b-2 border-tabiya-accent"
                  : "text-white/70 hover:text-tabiya-accent"
              }`}
            >
              Occupations
            </button>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl">
            {searchQuery && (
              <div className="mb-4">
                <span className="text-white/60">Search results for: </span>
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
                    className="text-white/70 hover:text-white"
                  >
                    ← Back to {activeTab.replace("-", " ")} list
                  </Button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">
                  {selectedItem.preferred_label}
                </h1>

                {/* Item Tags */}
                <div className="flex gap-2 mb-6">
                  <Badge className="bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30">
                    {selectedSkillId && selectedSkill ? selectedSkill.skill_type :
                     selectedOccupationId && selectedOccupation ? selectedOccupation.occupation_type :
                     "Skill Group"}
                  </Badge>
                  {selectedSkillId && selectedSkill?.reuse_level && (
                    <Badge
                      variant="outline"
                      className="border-white/20 text-white"
                    >
                      {selectedSkill.reuse_level}
                    </Badge>
                  )}
                </div>

                {/* Description/Definition */}
                {selectedItem.definition && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">
                      Description
                    </h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      {selectedItem.definition}
                    </p>
                  </div>
                )}
                {selectedItem.description && !selectedItem.definition && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">
                      Description
                    </h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {/* Scope Notes */}
                {selectedSkillId && selectedSkill?.scope_note && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">
                      Scope Notes
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                      {selectedSkill.scope_note}
                    </p>
                  </div>
                )}

                {/* Related Items - Skills */}
                {selectedSkillId && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4">
                      Related Items
                    </h2>
                    
                    {/* Related Skills */}
                    {skillSuggestions && skillSuggestions.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-md font-medium text-white/90 mb-3">
                          Related Skills
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {skillSuggestions.slice(0, 4).map((skill) => (
                            <Card
                              key={skill.id}
                              className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                              onClick={() => {
                                setActiveTab("skills");
                                setSelectedSkillId(skill.id);
                                setSelectedOccupationId(null);
                                setSelectedSkillGroupId(null);
                              }}
                            >
                              <CardContent className="p-3">
                                <h4 className="text-sm font-medium text-white mb-1">
                                  {skill.preferred_label}
                                </h4>
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                  {skill.skill_type}
                                </Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Occupations */}
                    {relatedOccupations.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-md font-medium text-white/90 mb-3">
                          Related Occupations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {relatedOccupations.slice(0, 4).map((occupation) => (
                            <Card
                              key={occupation.id}
                              className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                              onClick={() => {
                                setActiveTab("occupations");
                                setSelectedOccupationId(occupation.id);
                                setSelectedSkillId(null);
                                setSelectedSkillGroupId(null);
                              }}
                            >
                              <CardContent className="p-3">
                                <h4 className="text-sm font-medium text-white mb-1">
                                  {occupation.preferred_label}
                                </h4>
                                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                                  {occupation.occupation_type}
                                </Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Skill Groups */}
                    {skillGroups?.results && (
                      <div className="mb-6">
                        <h3 className="text-md font-medium text-white/90 mb-3">
                          Skill Groups
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {skillGroups.results.slice(0, 4).map((group) => (
                            <Card
                              key={group.id}
                              className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                              onClick={() => {
                                setActiveTab("skill-groups");
                                setSelectedSkillGroupId(group.id);
                                setSelectedSkillId(null);
                                setSelectedOccupationId(null);
                              }}
                            >
                              <CardContent className="p-3">
                                <h4 className="text-sm font-medium text-white mb-1">
                                  {group.preferred_label}
                                </h4>
                                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                                  Skill Group
                                </Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Related Items - Occupations */}
                {selectedOccupationId && selectedOccupation?.related_skills && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4">
                      Required Skills
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedOccupation.related_skills.slice(0, 6).map((skill) => (
                        <Card
                          key={skill.skill_id}
                          className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                          onClick={() => {
                            setActiveTab("skills");
                            setSelectedSkillId(skill.skill_id);
                            setSelectedOccupationId(null);
                            setSelectedSkillGroupId(null);
                          }}
                        >
                          <CardContent className="p-3">
                            <h4 className="text-sm font-medium text-white mb-1">
                              {skill.skill_name}
                              {skill.relation_type === 'essential' && 
                                <span className="ml-1 text-red-400">●</span>
                              }
                            </h4>
                            <Badge className="bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30 text-xs">
                              {skill.relation_type}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternative Labels */}
                {selectedSkill?.alt_labels_list && selectedSkill.alt_labels_list.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">
                      Alternative Labels
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.alt_labels_list.map((label, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-white/20 text-white/80"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* List View */
              <div>
                <h1 className="text-2xl font-bold text-white mb-6">
                  {activeTab === "skills" ? "Skills" :
                   activeTab === "occupations" ? "Occupations" :
                   "Skill Groups"} ({
                    (skillsLoading || occupationsLoading || skillGroupsLoading) ? "..." :
                    activeTab === "skills" ? (skills?.count || 0) :
                    activeTab === "occupations" ? (occupations?.count || 0) :
                    (skillGroups?.count || 0)
                  })
                </h1>

                <div className="grid gap-4">
                  {(skillsLoading || occupationsLoading || skillGroupsLoading) ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <Skeleton className="h-5 w-3/4 mb-2 bg-white/10" />
                          <Skeleton className="h-4 w-full mb-2 bg-white/10" />
                          <Skeleton className="h-4 w-1/2 bg-white/10" />
                        </CardContent>
                      </Card>
                    ))
                  ) : displayedItems.length > 0 ? (
                    displayedItems.slice(0, 20).map((item: any) => (
                      <Card
                        key={item.id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => {
                          if (activeTab === "skills") {
                            setSelectedSkillId(item.id);
                          } else if (activeTab === "occupations") {
                            setSelectedOccupationId(item.id);
                          } else if (activeTab === "skill-groups") {
                            setSelectedSkillGroupId(item.id);
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {item.preferred_label}
                          </h3>
                          {(item.definition || item.description) && (
                            <p className="text-white/70 text-sm mb-3 line-clamp-2">
                              {item.definition || item.description}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Badge className="bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30 text-xs">
                              {activeTab === "skills" && item.skill_type ||
                               activeTab === "occupations" && item.occupation_type ||
                               "Skill Group"}
                            </Badge>
                            {activeTab === "skills" && item.reuse_level && (
                              <Badge
                                variant="outline"
                                className="border-white/20 text-white/80 text-xs"
                              >
                                {item.reuse_level}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : searchQuery ? (
                    <div className="text-center py-12">
                      <p className="text-white/60">
                        No {activeTab.replace("-", " ")} found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-white/60">No {activeTab.replace("-", " ")} available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
