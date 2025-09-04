import Navigation from "@/components/custom/Navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  useSkills,
  useSkillGroups,
  useOccupationGroups,
  useDebouncedSearch,
  useTaxonomyStats,
} from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TabiyaDatasetExplorer() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    crossSectorOnly: false,
    localOccupationsOnly: false,
    emergingSkills: false,
  });

  // API calls
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: skillGroups, isLoading: skillGroupsLoading } = useSkillGroups();
  const { data: occupationGroups, isLoading: occupationGroupsLoading } =
    useOccupationGroups();
  const { data: taxonomyStats } = useTaxonomyStats();
  const {
    debouncedQuery,
    data: searchResults,
    isLoading: searchLoading,
  } = useDebouncedSearch(searchQuery);

  // Get selected skill details
  const selectedSkill = selectedSkillId
    ? skills?.results?.find((skill) => skill.id === selectedSkillId)
    : null;

  // Filter skills based on current filters and search
  const displayedSkills = searchQuery.trim()
    ? searchResults?.skills || []
    : skills?.results || [];

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
                : skillGroups?.results?.map((group) => (
                    <div
                      key={group.id}
                      className="flex justify-between items-center py-2"
                    >
                      <span className="text-sm text-white/80">
                        {group.preferred_label}
                      </span>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                        {group.skills?.length || 0}
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
                      className="flex justify-between items-center py-2"
                    >
                      <span className="text-sm text-white/80">
                        {group.preferred_label}
                      </span>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                        {group.occupations?.length || 0}
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
            <button className="px-4 py-2 text-sm font-medium text-tabiya-accent border-b-2 border-tabiya-accent">
              Skills Explorer
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white/70 hover:text-tabiya-accent">
              Skill Groups
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white/70 hover:text-tabiya-accent">
              Occupations
            </button>
          </div>

          {/* Skills List */}
          <div className="max-w-4xl">
            {searchQuery && (
              <div className="mb-4">
                <span className="text-white/60">Search results for: </span>
                <span className="text-tabiya-accent font-medium">
                  "{debouncedQuery}"
                </span>
              </div>
            )}

            {selectedSkill ? (
              /* Skill Detail View */
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedSkillId(null)}
                    className="text-white/70 hover:text-white"
                  >
                    ← Back to skills list
                  </Button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">
                  {selectedSkill.preferred_label}
                </h1>

                {/* Skill Tags */}
                <div className="flex gap-2 mb-6">
                  <Badge className="bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30">
                    {selectedSkill.skill_type}
                  </Badge>
                  {selectedSkill.reuse_level && (
                    <Badge
                      variant="outline"
                      className="border-white/20 text-white"
                    >
                      {selectedSkill.reuse_level}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {selectedSkill.definition && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">
                      Description
                    </h2>
                    <p className="text-white/80 leading-relaxed mb-4">
                      {selectedSkill.definition}
                    </p>
                  </div>
                )}

                {/* Scope Notes */}
                {selectedSkill.scope_note && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">
                      Scope Notes
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                      {selectedSkill.scope_note}
                    </p>
                  </div>
                )}

                {/* Alternative Labels */}
                {selectedSkill.alternative_labels?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">
                      Alternative Labels
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.alternative_labels.map((label, index) => (
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
              /* Skills List View */
              <div>
                <h1 className="text-2xl font-bold text-white mb-6">
                  Skills ({skillsLoading ? "..." : skills?.count || 0})
                </h1>

                <div className="grid gap-4">
                  {skillsLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <Skeleton className="h-5 w-3/4 mb-2 bg-white/10" />
                          <Skeleton className="h-4 w-full mb-2 bg-white/10" />
                          <Skeleton className="h-4 w-1/2 bg-white/10" />
                        </CardContent>
                      </Card>
                    ))
                  ) : displayedSkills.length > 0 ? (
                    displayedSkills.slice(0, 20).map((skill) => (
                      <Card
                        key={skill.id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => setSelectedSkillId(skill.id)}
                      >
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {skill.preferred_label}
                          </h3>
                          {skill.definition && (
                            <p className="text-white/70 text-sm mb-3 line-clamp-2">
                              {skill.definition}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Badge className="bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30 text-xs">
                              {skill.skill_type}
                            </Badge>
                            {skill.reuse_level && (
                              <Badge
                                variant="outline"
                                className="border-white/20 text-white/80 text-xs"
                              >
                                {skill.reuse_level}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : searchQuery ? (
                    <div className="text-center py-12">
                      <p className="text-white/60">
                        No skills found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-white/60">No skills available</p>
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
