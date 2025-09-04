import Navigation from "@/components/custom/Navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  useSkills,
  useSkill,
  useOccupations,
  useOccupation,
  useSkillGroups,
  useSkillGroup,
  useDebouncedSearch,
  useSkillSuggestions,
} from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Occupation, Skill, SkillGroup } from "@/lib/types";

export default function SkillMapping() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedOccupationId, setSelectedOccupationId] = useState<
    string | null
  >(null);
  const [selectedSkillGroupId, setSelectedSkillGroupId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "skills" | "occupations" | "groups"
  >("skills");

  // API calls
  const {
    debouncedQuery,
    data: searchResults,
    isLoading: searchLoading,
  } = useDebouncedSearch(searchQuery);

  const { data: selectedSkill, isLoading: skillLoading } = useSkill(
    selectedSkillId || ""
  );
  const { data: selectedOccupation, isLoading: occupationLoading } =
    useOccupation(selectedOccupationId || "");
  const { data: selectedSkillGroup, isLoading: skillGroupLoading } =
    useSkillGroup(selectedSkillGroupId || "");

  const { data: skillSuggestions, isLoading: suggestionsLoading } =
    useSkillSuggestions(selectedSkillId || "");
  const { data: occupations } = useOccupations();
  const { data: skills } = useSkills();
  const { data: skillGroups } = useSkillGroups();

  // Get items based on active tab and search results
  const getAvailableItems = () => {
    if (searchQuery.trim()) {
      // Use search results if available
      if (activeTab === "skills") {
        return searchResults?.skills || [];
      } else if (activeTab === "occupations") {
        return searchResults?.occupations || [];
      } else if (activeTab === "groups") {
        return searchResults?.skill_groups || [];
      }
      return [];
    } else {
      // Use default data when no search
      if (activeTab === "skills") {
        return skills?.results?.slice(0, 10) || [];
      } else if (activeTab === "occupations") {
        return occupations?.results?.slice(0, 10) || [];
      } else if (activeTab === "groups") {
        return skillGroups?.results?.slice(0, 10) || [];
      }
      return [];
    }
  };

  const availableItems = getAvailableItems();

  // Handle item selection based on active tab
  const handleItemSelect = (item: any) => {
    if (activeTab === "skills") {
      setSelectedSkillId(item.id);
      setSelectedOccupationId(null);
      setSelectedSkillGroupId(null);
    } else if (activeTab === "occupations") {
      setSelectedOccupationId(item.id);
      setSelectedSkillId(null);
      setSelectedSkillGroupId(null);
    } else if (activeTab === "groups") {
      setSelectedSkillGroupId(item.id);
      setSelectedSkillId(null);
      setSelectedOccupationId(null);
    }
    setSearchQuery("");
  };

  // Get the currently selected item
  const getSelectedItem = () => {
    if (selectedSkillId && selectedSkill) return selectedSkill;
    if (selectedOccupationId && selectedOccupation) return selectedOccupation;
    if (selectedSkillGroupId && selectedSkillGroup) return selectedSkillGroup;
    return null;
  };

  const selectedItem = getSelectedItem();

  // Get related occupations for the selected skill
  const relatedOccupations =
    occupations?.results?.filter((occupation) =>
      occupation.related_skills?.some(
        (skill) => skill.skill_id === selectedSkillId
      )
    ) || [];

  // Calculate match percentages (simplified calculation based on shared skills)
  const calculateMatchPercentage = (occupation: Occupation): number => {
    if (!selectedSkill) return 0;

    const totalSkills = occupation.related_skills?.length || 0;
    if (totalSkills === 0) return 0;

    const hasSelectedSkill = occupation.related_skills?.some(
      (skill) => skill.skill_id === selectedSkillId
    );

    // Base percentage if the skill is present, with some randomization for demo
    return hasSelectedSkill
      ? Math.floor(60 + Math.random() * 30)
      : Math.floor(Math.random() * 40);
  };

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkillId(skillId);
    setSearchQuery(""); // Clear search when skill is selected
  };

  return (
    <div className="min-h-screen bg-tabiya-dark w-screen overflow-x-hidden">
      <div className="w-full overflow-hidden">
        <Navigation />
      </div>

      {/* Header */}
      <div className="px-6 py-6 bg-tabiya-dark w-full">
        <h1 className="text-white font-sans text-4xl md:text-5xl font-bold mb-2">
          Skill Mapping
        </h1>
        <p className="text-white/70 font-medium text-lg mb-6 max-w-4xl">
          Explore the interconnected world of skills and careers through our
          interactive graph visualization. Discover how skills connect to
          various occupations, related competencies, and career pathways in a
          dynamic network view.
        </p>
      </div>

      {/* Main Content - Full Width Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-200px)] w-screen">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 bg-white/5 border-r border-white/10 p-4 space-y-4 overflow-y-auto">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search skills or industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-lg border border-white/20 focus:border-tabiya-accent focus:outline-none"
            />
            <svg
              className="absolute right-3 top-3 w-5 h-5 text-white/60"
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
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-48 overflow-y-auto">
              <h3 className="text-white font-semibold mb-3 text-sm">
                Search Results ({activeTab})
              </h3>
              {searchLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full bg-white/10" />
                  ))}
                </div>
              ) : availableItems.length > 0 ? (
                <div className="space-y-2">
                  {availableItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className="p-2 bg-white/5 rounded cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="text-white text-sm font-medium">
                        {item.preferred_label}
                      </div>
                      <div className="text-white/60 text-xs">
                        {activeTab === "skills"
                          ? item.skill_type
                          : activeTab === "occupations"
                            ? item.occupation_type
                            : "Skill Group"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-white/60 text-sm">
                  No {activeTab} found for "{debouncedQuery}"
                </div>
              ) : null}
            </div>
          )}

          {/* Tab Buttons */}
          <div className="flex gap-1">
            <Button
              variant={activeTab === "skills" ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setActiveTab("skills")}
            >
              Skills
            </Button>
            <Button
              variant={activeTab === "occupations" ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setActiveTab("occupations")}
            >
              Occupations
            </Button>
            <Button
              variant={activeTab === "groups" ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setActiveTab("groups")}
            >
              Groups
            </Button>
          </div>

          {/* Current Selection */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3 text-lg">
              Current Selection
            </h3>
            {skillLoading || occupationLoading || skillGroupLoading ? (
              <div className="bg-white/5 rounded-lg p-3">
                <Skeleton className="h-6 w-24 mb-2 bg-white/10" />
                <Skeleton className="h-4 w-32 bg-white/10" />
              </div>
            ) : selectedItem ? (
              <div className="bg-tabiya-accent/20 rounded-lg p-3 border border-tabiya-accent/30">
                <div className="text-tabiya-accent font-medium text-lg">
                  {selectedItem.preferred_label}
                </div>
                <div className="text-white/70 text-sm mt-1">
                  {selectedSkillId
                    ? selectedSkill?.skill_type
                    : selectedOccupationId
                      ? selectedOccupation?.occupation_type
                      : "Skill Group"}
                </div>
                {selectedSkillId && selectedSkill?.reuse_level && (
                  <Badge
                    variant="outline"
                    className="mt-2 border-white/20 text-white/80 text-xs"
                  >
                    {selectedSkill.reuse_level}
                  </Badge>
                )}
              </div>
            ) : (
              <div className="text-white/60 text-sm">
                Select a {activeTab.slice(0, -1)} to see details
              </div>
            )}
          </div>

          {/* Related Career Paths */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-lg">
              Related Career Paths
            </h3>
            {selectedSkill ? (
              <div className="space-y-3">
                {relatedOccupations.slice(0, 4).map((occupation) => {
                  const matchPercentage = calculateMatchPercentage(occupation);
                  return (
                    <div
                      key={occupation.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-white font-medium text-sm">
                          {occupation.preferred_label}
                        </div>
                        <div className="text-white/60 text-xs">
                          {occupation.occupation_type}
                        </div>
                      </div>
                      <div className="text-tabiya-accent font-medium text-sm">
                        {matchPercentage}% match
                      </div>
                    </div>
                  );
                })}
                {relatedOccupations.length === 0 && (
                  <div className="text-white/60 text-sm">
                    No related occupations found
                  </div>
                )}
              </div>
            ) : (
              <div className="text-white/60 text-sm">
                Select a skill to see related careers
              </div>
            )}
          </div>

          {/* Related Items */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-lg">
              {activeTab === "skills"
                ? "Related Skills"
                : activeTab === "occupations"
                  ? "Required Skills"
                  : "Related Items"}
            </h3>
            {activeTab === "skills" && suggestionsLoading ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-6 w-16 bg-white/10 rounded-full"
                  />
                ))}
              </div>
            ) : activeTab === "skills" && skillSuggestions?.length ? (
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.slice(0, 8).map((skill, index) => {
                  const colors = [
                    "bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30",
                    "bg-blue-500/20 text-blue-300 border-blue-500/30",
                    "bg-green-500/20 text-green-300 border-green-500/30",
                    "bg-purple-500/20 text-purple-300 border-purple-500/30",
                    "bg-orange-500/20 text-orange-300 border-orange-500/30",
                  ];
                  const colorClass = colors[index % colors.length];

                  return (
                    <span
                      key={skill.id}
                      onClick={() => handleItemSelect(skill)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer hover:scale-105 transition-transform ${colorClass}`}
                    >
                      {skill.preferred_label}
                    </span>
                  );
                })}
              </div>
            ) : activeTab === "occupations" &&
              selectedOccupation?.related_skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {selectedOccupation.related_skills
                  .slice(0, 8)
                  .map((skill, index) => {
                    const colors = [
                      "bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30",
                      "bg-blue-500/20 text-blue-300 border-blue-500/30",
                      "bg-green-500/20 text-green-300 border-green-500/30",
                      "bg-purple-500/20 text-purple-300 border-purple-500/30",
                      "bg-orange-500/20 text-orange-300 border-orange-500/30",
                    ];
                    const colorClass = colors[index % colors.length];

                    return (
                      <span
                        key={skill.skill_id}
                        onClick={() => {
                          setActiveTab("skills");
                          setSelectedSkillId(skill.skill_id);
                          setSelectedOccupationId(null);
                          setSelectedSkillGroupId(null);
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer hover:scale-105 transition-transform ${colorClass}`}
                      >
                        {skill.skill_name}
                      </span>
                    );
                  })}
              </div>
            ) : selectedItem ? (
              <div className="text-white/60 text-sm">
                No related {activeTab} found
              </div>
            ) : (
              <div className="text-white/60 text-sm">
                Select a {activeTab.slice(0, -1)} to see related {activeTab}
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Graph Area */}
        <div className="lg:col-span-2 bg-tabiya-dark p-4">
          <div className="bg-white/5 rounded-lg border border-white/10 h-full flex flex-col">
            {/* Graph Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">
                  {activeTab === "skills"
                    ? "Skill Network Visualization"
                    : activeTab === "occupations"
                      ? "Occupation Network Visualization"
                      : "Skill Group Network Visualization"}
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-white/20 text-white"
                  >
                    Center View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-white/20 text-white"
                  >
                    Zoom Fit
                  </Button>
                </div>
              </div>
              {selectedItem && (
                <p className="text-white/70 text-sm mt-2">
                  Showing connections for:{" "}
                  <span className="text-tabiya-accent font-medium">
                    {selectedItem.preferred_label}
                  </span>
                </p>
              )}
            </div>

            {/* Graph Content */}
            <div className="flex-1 flex items-center justify-center p-8">
              {selectedItem ? (
                <div className="text-center space-y-6">
                  {/* Central Node */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-tabiya-accent/30 rounded-full border-4 border-tabiya-accent flex items-center justify-center mx-auto">
                      <span className="text-tabiya-accent font-bold text-lg">
                        {selectedItem.preferred_label.slice(0, 2)}
                      </span>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <span className="text-white font-medium text-sm bg-tabiya-dark px-2 py-1 rounded">
                        {selectedItem.preferred_label}
                      </span>
                    </div>
                  </div>

                  {/* Connection Lines and Nodes */}
                  <div className="relative mt-16">
                    <div className="grid grid-cols-3 gap-8 items-center">
                      {/* Show related skills only for skills */}
                      {activeTab === "skills" &&
                        skillSuggestions?.slice(0, 6).map((skill, index) => {
                          const positions = [
                            "transform -translate-x-16 -translate-y-8",
                            "transform translate-y-12",
                            "transform translate-x-16 -translate-y-8",
                            "transform -translate-x-16 translate-y-8",
                            "transform translate-y-12",
                            "transform translate-x-16 translate-y-8",
                          ];
                          const colors = [
                            "bg-blue-500/30 border-blue-500",
                            "bg-green-500/30 border-green-500",
                            "bg-purple-500/30 border-purple-500",
                          ];
                          const colorClass = colors[index % colors.length];

                          return (
                            <div
                              key={skill.id}
                              className={`relative ${positions[index] || ""}`}
                            >
                              <div
                                className={`w-12 h-12 ${colorClass} rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
                                onClick={() => handleItemSelect(skill)}
                              >
                                <span className="text-white font-medium text-xs">
                                  {skill.preferred_label.slice(0, 2)}
                                </span>
                              </div>
                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-max">
                                <span className="text-white/70 text-xs bg-tabiya-dark px-1 py-0.5 rounded">
                                  {skill.preferred_label.length > 12
                                    ? skill.preferred_label.slice(0, 12) + "..."
                                    : skill.preferred_label}
                                </span>
                              </div>
                              {/* Connection line to center */}
                              <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                                <line
                                  x1="50%"
                                  y1="50%"
                                  x2="50%"
                                  y2="50%"
                                  stroke="rgba(255, 255, 255, 0.2)"
                                  strokeWidth="1"
                                  strokeDasharray="2,2"
                                />
                              </svg>
                            </div>
                          );
                        })}

                      {/* Show related occupations for occupations */}
                      {activeTab === "occupations" &&
                        relatedOccupations
                          .slice(0, 6)
                          .map((occupation, index) => {
                            const positions = [
                              "transform -translate-x-16 -translate-y-8",
                              "transform translate-y-12",
                              "transform translate-x-16 -translate-y-8",
                              "transform -translate-x-16 translate-y-8",
                              "transform translate-y-12",
                              "transform translate-x-16 translate-y-8",
                            ];
                            const colors = [
                              "bg-orange-500/30 border-orange-500",
                              "bg-cyan-500/30 border-cyan-500",
                              "bg-pink-500/30 border-pink-500",
                            ];
                            const colorClass = colors[index % colors.length];

                            return (
                              <div
                                key={occupation.id}
                                className={`relative ${positions[index] || ""}`}
                              >
                                <div
                                  className={`w-12 h-12 ${colorClass} rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
                                  onClick={() => handleItemSelect(occupation)}
                                >
                                  <span className="text-white font-medium text-xs">
                                    {occupation.preferred_label.slice(0, 2)}
                                  </span>
                                </div>
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-max">
                                  <span className="text-white/70 text-xs bg-tabiya-dark px-1 py-0.5 rounded">
                                    {occupation.preferred_label.length > 12
                                      ? occupation.preferred_label.slice(
                                          0,
                                          12
                                        ) + "..."
                                      : occupation.preferred_label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  </div>

                  {/* Graph Statistics */}
                  <div className="mt-8 flex justify-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-tabiya-accent font-bold text-lg">
                        {activeTab === "skills"
                          ? skillSuggestions?.length || 0
                          : activeTab === "occupations"
                            ? relatedOccupations.length
                            : 0}
                      </div>
                      <div className="text-white/60">
                        {activeTab === "skills"
                          ? "Connected Skills"
                          : activeTab === "occupations"
                            ? "Related Jobs"
                            : "Related Groups"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-tabiya-accent font-bold text-lg">
                        {relatedOccupations.length}
                      </div>
                      <div className="text-white/60">Related Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-tabiya-accent font-bold text-lg">
                        {selectedSkillId &&
                        selectedSkill?.skill_type === "knowledge"
                          ? "Knowledge"
                          : selectedSkillId &&
                              selectedSkill?.skill_type === "skill/competence"
                            ? "Skill"
                            : selectedSkillId &&
                                selectedSkill?.skill_type === "attitude"
                              ? "Attitude"
                              : selectedSkillId &&
                                  selectedSkill?.skill_type === "language"
                                ? "Language"
                                : selectedOccupationId &&
                                    selectedOccupation?.occupation_type
                                  ? selectedOccupation.occupation_type
                                  : activeTab === "groups"
                                    ? "Group"
                                    : "Type"}
                      </div>
                      <div className="text-white/60">
                        {activeTab === "skills"
                          ? "Skill Type"
                          : activeTab === "occupations"
                            ? "Occupation Type"
                            : "Group Type"}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-white/60 text-xl mb-4">
                    Interactive Network Visualization
                  </div>
                  <div className="text-white/40 text-sm mb-8">
                    Select a {activeTab.slice(0, -1)} from the sidebar to
                    visualize its connections
                  </div>
                  <div className="w-16 h-16 bg-tabiya-accent/20 rounded-full mx-auto animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 bg-white/5 border-l border-white/10 p-4 space-y-4 overflow-y-auto">
          {/* Market Insights - Keep as static for now */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-lg">
              Market Insights
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-white/70 text-sm">Avg Salary</div>
                <div className="text-tabiya-accent font-bold text-xl">
                  $95,000
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Growth Rate</div>
                <div className="text-green-400 font-bold text-xl">+22%</div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Remote Jobs</div>
                <div className="text-blue-400 font-bold text-xl">68%</div>
              </div>
            </div>
          </div>

          {/* Item Details */}
          {selectedItem && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4 text-lg">
                {activeTab === "skills"
                  ? "Skill Details"
                  : activeTab === "occupations"
                    ? "Occupation Details"
                    : "Skill Group Details"}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-white/70 text-sm">Type</div>
                  <div className="text-white font-medium capitalize">
                    {selectedSkillId && selectedSkill
                      ? selectedSkill.skill_type
                      : selectedOccupationId && selectedOccupation
                        ? selectedOccupation.occupation_type
                        : "Skill Group"}
                  </div>
                </div>
                {selectedSkillId && selectedSkill?.reuse_level && (
                  <div>
                    <div className="text-white/70 text-sm">Reuse Level</div>
                    <div className="text-white font-medium">
                      {selectedSkill.reuse_level}
                    </div>
                  </div>
                )}
                {(selectedSkillId && selectedSkill?.definition) ||
                (selectedOccupationId && selectedOccupation?.definition) ? (
                  <div>
                    <div className="text-white/70 text-sm">Definition</div>
                    <div className="text-white/90 text-sm leading-relaxed">
                      {(() => {
                        const definition =
                          (selectedSkillId && selectedSkill?.definition) ||
                          (selectedOccupationId &&
                            selectedOccupation?.definition) ||
                          "";
                        return definition.length > 150
                          ? `${definition.slice(0, 150)}...`
                          : definition;
                      })()}
                    </div>
                  </div>
                ) : null}
                {selectedItem.description &&
                  !(selectedSkillId && selectedSkill?.definition) &&
                  !(selectedOccupationId && selectedOccupation?.definition) && (
                    <div>
                      <div className="text-white/70 text-sm">Description</div>
                      <div className="text-white/90 text-sm leading-relaxed">
                        {selectedItem.description.length > 150
                          ? `${selectedItem.description.slice(0, 150)}...`
                          : selectedItem.description}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Career Path Info - Keep as static for now */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-lg">
              Career Path
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white/90 text-sm">
                  Junior Developer (2-3 years)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-tabiya-accent rounded-full"></div>
                <span className="text-white/90 text-sm">
                  Senior Developer (4-6 years)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-white/90 text-sm">
                  Tech Lead (7+ years)
                </span>
              </div>
            </div>
          </div>

          {/* Connection Info */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-center space-y-4">
              <div>
                <div className="text-white/70 text-sm">
                  {activeTab === "skills"
                    ? "Connected Skills"
                    : activeTab === "occupations"
                      ? "Related Skills"
                      : "Related Items"}
                </div>
                <div className="text-white font-bold text-2xl">
                  {activeTab === "skills"
                    ? skillSuggestions?.length || 0
                    : activeTab === "occupations"
                      ? selectedOccupation?.related_skills?.length || 0
                      : 0}
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Related Jobs</div>
                <div className="text-white font-bold text-2xl">
                  {relatedOccupations.length}
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 text-xs bg-tabiya-accent hover:bg-tabiya-accent/90"
                  disabled={!selectedItem}
                >
                  Explore Path
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs border-white/20 text-white"
                  disabled={!selectedItem}
                >
                  Save View
                </Button>
              </div>
              <Button
                variant="default"
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-xs"
                disabled={!selectedItem}
              >
                Share Mapping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
