import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useDarkMode } from "@/contexts/DarkModeContext";
import {
  Plus,
  Target,
  Briefcase,
  Star,
  ArrowRight,
  Search,
  BookOpen,
  PlayCircle,
  FileText,
  Award,
  Clock,
  Save,
  Check,
  Loader2,
  Globe,
  X,
  Building,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import {
  useDebouncedSearch,
  useSkills,
  useSkill,
  useOccupations,
  useOccupation,
  useLearningResources,
  useGenerateLearningResources,
  useUserSkills,
  useAddUserSkill,
  useDeleteUserSkill,
  useMarketInsights,
  useGenerateMarketInsights,
  useCareerPaths,
  useGenerateCareerPaths,
  useCreateUserResource,
} from "@/lib/hooks";
import type {
  LearningResource,
  SkillSearchResult,
  CreateUserLearningResource,
} from "@/lib/types";

export function SkillsPage() {
  const { isDark } = useDarkMode();
  const { toast } = useToast();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedOccupationId, setSelectedOccupationId] = useState<
    string | null
  >(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isOccupationModalOpen, setIsOccupationModalOpen] = useState(false);
  const [savingResources, setSavingResources] = useState<Set<string>>(
    new Set()
  );

  // API hooks
  const { data: userSkills, isLoading: userSkillsLoading } = useUserSkills();
  const { data: searchResults, isLoading: searchLoading } =
    useDebouncedSearch(searchQuery);
  const { data: skills } = useSkills();
  const { data: occupations } = useOccupations();
  const { data: selectedSkill } = useSkill(selectedSkillId || "");
  const { data: selectedOccupation } = useOccupation(
    selectedOccupationId || ""
  );
  const { data: learningResources, isLoading: resourcesLoading } =
    useLearningResources(selectedSkillId || "");
  const { data: marketInsights, isLoading: marketInsightsLoading } =
    useMarketInsights(selectedOccupationId || "");
  const { data: careerPaths, isLoading: careerPathsLoading } = useCareerPaths(
    selectedOccupationId || ""
  );

  const addUserSkill = useAddUserSkill();
  const deleteUserSkill = useDeleteUserSkill();
  const createUserResource = useCreateUserResource();
  const generateResources = useGenerateLearningResources();
  const generateMarketInsights = useGenerateMarketInsights();
  const generateCareerPaths = useGenerateCareerPaths();

  // Get available skills for search
  const getAvailableSkills = () => {
    if (searchQuery.trim()) {
      return searchResults?.skills || [];
    } else {
      return skills?.results || [];
    }
  };

  // Calculate occupation matches based on user skills
  const getOccupationMatches = () => {
    if (!userSkills || !occupations?.results) return [];

    const userSkillIds = userSkills.map((us) => us.skill.id);

    return occupations.results
      .map((occupation) => {
        const relatedSkillIds =
          occupation.related_skills?.map((rs) => rs.skill_id) || [];
        const matchingSkills = relatedSkillIds.filter((skillId) =>
          userSkillIds.includes(skillId)
        );
        const matchPercentage =
          relatedSkillIds.length > 0
            ? Math.round((matchingSkills.length / relatedSkillIds.length) * 100)
            : 0;

        return {
          ...occupation,
          matchPercentage,
          matchingSkillsCount: matchingSkills.length,
          totalRequiredSkills: relatedSkillIds.length,
        };
      })
      .filter((occupation) => occupation.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  // Handle adding a skill to user profile
  const handleAddSkill = async (skill: SkillSearchResult) => {
    try {
      await addUserSkill.mutateAsync({
        skill_id: skill.id,
        proficiency_level: "beginner",
        years_of_experience: 0,
        is_primary: false,
      });
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  };

  // Handle removing a skill from user profile
  const handleRemoveSkill = async (userSkillId: string) => {
    try {
      await deleteUserSkill.mutateAsync(userSkillId);
    } catch (error) {
      console.error("Failed to remove skill:", error);
    }
  };

  // Handle skill card click to show resources
  const handleSkillClick = (skillId: string) => {
    setSelectedSkillId(skillId);
    setIsSkillModalOpen(true);
  };

  // Handle occupation card click to show details
  const handleOccupationClick = (occupationId: string) => {
    setSelectedOccupationId(occupationId);
    setIsOccupationModalOpen(true);
  };

  // Handle generating learning resources
  const handleGenerateResources = () => {
    if (selectedSkillId) {
      generateResources.mutate(selectedSkillId);
    }
  };

  // Handle generating market insights
  const handleGenerateMarketInsights = () => {
    if (selectedOccupationId) {
      generateMarketInsights.mutate(selectedOccupationId);
    }
  };

  // Handle generating career paths
  const handleGenerateCareerPaths = () => {
    if (selectedOccupationId) {
      generateCareerPaths.mutate(selectedOccupationId);
    }
  };

  // Handle saving a learning resource
  const handleSaveResource = async (resource: LearningResource) => {
    if (!selectedSkill) return;

    setSavingResources((prev) => new Set(prev).add(resource.id));

    try {
      // Map resource type to match CreateUserLearningResource type
      let mappedResourceType: CreateUserLearningResource["resource_type"];
      switch (resource.resource_type) {
        case "bootcamp":
          mappedResourceType = "course";
          break;
        case "workshop":
          mappedResourceType = "tutorial";
          break;
        case "course":
        case "book":
        case "tutorial":
        case "certification":
        case "documentation":
        case "practice":
          mappedResourceType = resource.resource_type;
          break;
        default:
          // Default to tutorial for any unmatched types
          mappedResourceType = "tutorial";
      }

      // Map LearningResource to CreateUserLearningResource
      const createData: CreateUserLearningResource = {
        title: resource.title,
        description: resource.description,
        url: resource.url,
        resource_type: mappedResourceType,
        difficulty_level: resource.difficulty_level,
        provider: resource.provider,
        duration: resource.duration,
        cost: parseFloat(resource.cost) || 0,
        is_free: resource.is_free,
        rating: resource.rating || 0,
        related_skill: selectedSkillId || "",
      };

      await createUserResource.mutateAsync(createData);

      toast({
        title: "Resource Saved",
        description: `"${resource.title}" has been added to your learning resources.`,
      });
    } catch (error) {
      console.error("Failed to save resource:", error);
      toast({
        title: "Error",
        description: "Failed to save resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingResources((prev) => {
        const updated = new Set(prev);
        updated.delete(resource.id);
        return updated;
      });
    }
  };

  // Get resource type icon
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "course":
        return <PlayCircle className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <PlayCircle className="h-4 w-4" />;
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "certification":
        return <Award className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Get proficiency level color
  const getProficiencyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const occupationMatches = getOccupationMatches();

  return (
    <div
      className="space-y-6 w-full"
      role="main"
      aria-labelledby="skills-page-heading"
    >
      <h2 id="skills-page-heading" className="sr-only">
        Your Skills & Career Matches
      </h2>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={
            isDark
              ? "border-tabiya-dark bg-tabiya-medium"
              : "border-gray-200 bg-white"
          }
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Your Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${isDark ? "text-tabiya-accent" : "text-primary"}`}
            >
              {userSkills?.length || 0}
            </div>
            <p
              className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
            >
              Skills in your profile
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            isDark
              ? "border-tabiya-dark bg-tabiya-medium"
              : "border-gray-200 bg-white"
          }
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Career Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${isDark ? "text-tabiya-accent" : "text-primary"}`}
            >
              {occupationMatches.length}
            </div>
            <p
              className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
            >
              Matching occupations
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            isDark
              ? "border-tabiya-dark bg-tabiya-medium"
              : "border-gray-200 bg-white"
          }
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Top Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${isDark ? "text-tabiya-accent" : "text-primary"}`}
            >
              {occupationMatches[0]?.matchPercentage || 0}%
            </div>
            <p
              className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
            >
              Best occupation match
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Skills Section */}
      <Card
        className={
          isDark
            ? "border-tabiya-dark bg-tabiya-medium"
            : "border-gray-200 bg-white"
        }
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-tabiya-accent" />
            <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
              Add Skills to Your Profile
            </CardTitle>
          </div>
          <CardDescription className={isDark ? "text-white/70" : ""}>
            Search and add skills to improve your career matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-3 h-4 w-4 ${isDark ? "text-white/60" : "text-gray-400"}`}
            />
            <Input
              placeholder="Search for skills to add to your profile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${isDark ? "border-tabiya-dark bg-tabiya-dark text-white placeholder:text-white/60" : ""}`}
            />
            {searchLoading && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-tabiya-accent rounded-full"></div>
              </div>
            )}
          </div>

          {searchQuery && (
            <div
              className={`border rounded-lg p-4 max-h-60 overflow-y-auto ${isDark ? "border-tabiya-dark bg-tabiya-dark/50" : "border-gray-200 bg-gray-50"}`}
            >
              {searchLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className={`h-12 w-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                    />
                  ))}
                </div>
              ) : getAvailableSkills().length > 0 ? (
                <div className="space-y-2">
                  {getAvailableSkills()
                    .slice(0, 10)
                    .map((skill) => {
                      const alreadyAdded = userSkills?.some(
                        (us) => us.skill.id === skill.id
                      );
                      return (
                        <div
                          key={skill.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isDark
                              ? "border-tabiya-dark bg-tabiya-medium"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex-1">
                            <h4
                              className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {skill.preferred_label}
                            </h4>
                            <p
                              className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                            >
                              {skill.description
                                ? skill.description.substring(0, 100) + "..."
                                : skill.skill_type}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            disabled={alreadyAdded || addUserSkill.isPending}
                            onClick={() => handleAddSkill(skill)}
                            className="ml-3"
                          >
                            {alreadyAdded ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Added
                              </>
                            ) : addUserSkill.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className={isDark ? "text-white/70" : "text-gray-600"}>
                  No skills found. Try a different search term.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Your Skills */}
      <Card
        className={
          isDark
            ? "border-tabiya-dark bg-tabiya-medium"
            : "border-gray-200 bg-white"
        }
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-tabiya-accent" />
            <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
              Your Skills Portfolio
            </CardTitle>
          </div>
          <CardDescription className={isDark ? "text-white/70" : ""}>
            Click on a skill card to explore learning resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userSkillsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-24 ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                />
              ))}
            </div>
          ) : userSkills && userSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSkills.map((userSkill) => (
                <div
                  key={userSkill.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-tabiya-accent ${
                    isDark
                      ? "border-tabiya-dark bg-tabiya-dark/30"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => handleSkillClick(userSkill.skill.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {userSkill.skill.preferred_label}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={getProficiencyColor(
                            userSkill.proficiency_level
                          )}
                        >
                          {userSkill.proficiency_level}
                        </Badge>
                        {userSkill.years_of_experience > 0 && (
                          <span
                            className={`text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}
                          >
                            {userSkill.years_of_experience} years
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSkill(userSkill.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <ChevronRight
                        className={`h-4 w-4 ${isDark ? "text-white/60" : "text-gray-400"}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target
                className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-white/60" : "text-gray-400"}`}
              />
              <p className={isDark ? "text-white/70" : "text-gray-600"}>
                No skills in your profile yet. Search and add skills above to
                get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Career Matches */}
      <Card
        className={
          isDark
            ? "border-tabiya-dark bg-tabiya-medium"
            : "border-gray-200 bg-white"
        }
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-tabiya-accent" />
            <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
              Career Matches Based on Your Skills
            </CardTitle>
          </div>
          <CardDescription className={isDark ? "text-white/70" : ""}>
            Click on an occupation to see required skills and market insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          {occupationMatches.length > 0 ? (
            <div className="space-y-4">
              {occupationMatches.slice(0, 10).map((occupation) => (
                <div
                  key={occupation.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-tabiya-accent ${
                    isDark
                      ? "border-tabiya-dark bg-tabiya-dark/30"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => handleOccupationClick(occupation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDark ? "bg-tabiya-accent/20" : "bg-primary/10"
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              isDark ? "text-tabiya-accent" : "text-primary"
                            }`}
                          >
                            {occupation.matchPercentage}%
                          </span>
                        </div>
                        <div>
                          <h3
                            className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {occupation.preferred_label}
                          </h3>
                          <p
                            className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                          >
                            {occupation.matchingSkillsCount} of{" "}
                            {occupation.totalRequiredSkills} required skills
                            matched
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={occupation.matchPercentage}
                        className="w-20"
                      />
                      <ChevronRight
                        className={`h-4 w-4 ${isDark ? "text-white/60" : "text-gray-400"}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase
                className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-white/60" : "text-gray-400"}`}
              />
              <p className={isDark ? "text-white/70" : "text-gray-600"}>
                No career matches yet. Add more skills to your profile to see
                matching occupations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skill Resources Modal */}
      <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
        <DialogContent
          className={`max-w-4xl max-h-[80vh] ${isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white"}`}
        >
          <DialogHeader>
            <DialogTitle className={isDark ? "text-white" : "text-gray-900"}>
              Learning Resources for {selectedSkill?.preferred_label}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {/* Generate Resources Button */}
              {(!learningResources || learningResources.length === 0) && (
                <div className="text-center py-8">
                  <BookOpen
                    className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-white/60" : "text-gray-400"}`}
                  />
                  <p
                    className={`mb-4 ${isDark ? "text-white/70" : "text-gray-600"}`}
                  >
                    No learning resources available yet for this skill.
                  </p>
                  <Button
                    onClick={handleGenerateResources}
                    disabled={generateResources.isPending}
                    className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                  >
                    {generateResources.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Resources...
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Generate Learning Resources
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {resourcesLoading && (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className={`h-24 w-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                    />
                  ))}
                </div>
              )}

              {/* Learning Resources List */}
              {learningResources && learningResources.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Available Resources
                    </h3>
                    <Button
                      size="sm"
                      onClick={handleGenerateResources}
                      disabled={generateResources.isPending}
                      variant="outline"
                    >
                      {generateResources.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Refresh Resources"
                      )}
                    </Button>
                  </div>

                  {learningResources.map((resource) => (
                    <div
                      key={resource.id}
                      className={`p-4 border rounded-lg ${
                        isDark
                          ? "border-tabiya-dark bg-tabiya-dark/30"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getResourceTypeIcon(resource.resource_type)}
                            <h4
                              className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {resource.title}
                            </h4>
                            <Badge
                              className={getDifficultyColor(
                                resource.difficulty_level || "beginner"
                              )}
                            >
                              {resource.difficulty_level || "beginner"}
                            </Badge>
                          </div>
                          <p
                            className={`text-sm mb-3 ${isDark ? "text-white/70" : "text-gray-600"}`}
                          >
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            {resource.duration && (
                              <span
                                className={`flex items-center gap-1 ${isDark ? "text-white/60" : "text-gray-500"}`}
                              >
                                <Clock className="h-3 w-3" />
                                {resource.duration}
                              </span>
                            )}
                            {resource.provider && (
                              <span
                                className={`flex items-center gap-1 ${isDark ? "text-white/60" : "text-gray-500"}`}
                              >
                                <Globe className="h-3 w-3" />
                                {resource.provider}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {resource.url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(resource.url, "_blank")
                              }
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              Visit
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleSaveResource(resource)}
                            disabled={savingResources.has(resource.id)}
                            className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                          >
                            {savingResources.has(resource.id) ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Occupation Details Modal */}
      <Dialog
        open={isOccupationModalOpen}
        onOpenChange={setIsOccupationModalOpen}
      >
        <DialogContent
          className={`max-w-6xl max-h-[80vh] ${isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white"}`}
        >
          <DialogHeader>
            <DialogTitle className={isDark ? "text-white" : "text-gray-900"}>
              {selectedOccupation?.preferred_label}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Occupation Description */}
              {selectedOccupation?.description && (
                <div>
                  <h3
                    className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Description
                  </h3>
                  <p
                    className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                  >
                    {selectedOccupation.description}
                  </p>
                </div>
              )}

              {/* Required Skills */}
              {selectedOccupation?.related_skills && (
                <div>
                  <h3
                    className={`font-medium mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Required Skills ({selectedOccupation.related_skills.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedOccupation.related_skills.map((relatedSkill) => {
                      const userHasSkill =
                        userSkills &&
                        userSkills?.some(
                          (us) => us.skill.id === relatedSkill.skill_id
                        );
                      return (
                        <div
                          key={relatedSkill.skill_id}
                          className={`p-3 border rounded-lg flex items-center justify-between ${
                            userHasSkill
                              ? isDark
                                ? "border-green-500/50 bg-green-500/10"
                                : "border-green-500 bg-green-50"
                              : isDark
                                ? "border-tabiya-dark bg-tabiya-dark/30"
                                : "border-gray-200 bg-white"
                          }`}
                        >
                          <div>
                            <h4
                              className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {relatedSkill.skill_name}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                relatedSkill.relation_type === "essential"
                                  ? "border-red-500 text-red-700"
                                  : "border-blue-500 text-blue-700"
                              }`}
                            >
                              {relatedSkill.relation_type}
                            </Badge>
                          </div>
                          {userHasSkill && (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Market Insights */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Market Insights
                  </h3>
                  {!marketInsights && (
                    <Button
                      size="sm"
                      onClick={handleGenerateMarketInsights}
                      disabled={generateMarketInsights.isPending}
                      variant="outline"
                    >
                      {generateMarketInsights.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Generate Insights
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {marketInsightsLoading ? (
                  <Skeleton
                    className={`h-32 w-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                  />
                ) : marketInsights ? (
                  <div
                    className={`p-4 border rounded-lg ${isDark ? "border-tabiya-dark bg-tabiya-dark/30" : "border-gray-200 bg-gray-50"}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4
                          className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          Average Salary
                        </h4>
                        <p
                          className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                        >
                          $
                          {marketInsights.average_salary
                            ? marketInsights.average_salary.toLocaleString()
                            : "Not available"}
                        </p>
                      </div>
                      <div>
                        <h4
                          className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          Growth Rate
                        </h4>
                        <p
                          className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                        >
                          {marketInsights.growth_rate
                            ? `${marketInsights.growth_rate}%`
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                    {marketInsights.market_trends && (
                      <div>
                        <h4
                          className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          Market Trends
                        </h4>
                        <p
                          className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                        >
                          {marketInsights.market_trends}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`p-4 border rounded-lg text-center ${isDark ? "border-tabiya-dark bg-tabiya-dark/30" : "border-gray-200 bg-gray-50"}`}
                  >
                    <Building
                      className={`h-8 w-8 mx-auto mb-2 ${isDark ? "text-white/60" : "text-gray-400"}`}
                    />
                    <p
                      className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                    >
                      No market insights available. Click "Generate Insights" to
                      create them.
                    </p>
                  </div>
                )}
              </div>

              {/* Career Paths */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Career Paths
                  </h3>
                  {!careerPaths && (
                    <Button
                      size="sm"
                      onClick={handleGenerateCareerPaths}
                      disabled={generateCareerPaths.isPending}
                      variant="outline"
                    >
                      {generateCareerPaths.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Generate Paths
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {careerPathsLoading ? (
                  <Skeleton
                    className={`h-32 w-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                  />
                ) : careerPaths && careerPaths.length > 0 ? (
                  <div className="space-y-4">
                    {careerPaths.map((path) => (
                      <div
                        key={path.id}
                        className={`p-4 border rounded-lg ${isDark ? "border-tabiya-dark bg-tabiya-dark/30" : "border-gray-200 bg-white"}`}
                      >
                        <h4
                          className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {path.path_name}
                        </h4>
                        <p
                          className={`text-sm mb-3 ${isDark ? "text-white/70" : "text-gray-600"}`}
                        >
                          {path.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <span
                            className={`flex items-center gap-1 ${isDark ? "text-white/60" : "text-gray-500"}`}
                          >
                            <Clock className="h-3 w-3" />
                            {path.estimated_duration}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${isDark ? "text-white/60" : "text-gray-500"}`}
                          >
                            <DollarSign className="h-3 w-3" />
                            {path.difficulty_level} level
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`p-4 border rounded-lg text-center ${isDark ? "border-tabiya-dark bg-tabiya-dark/30" : "border-gray-200 bg-gray-50"}`}
                  >
                    <ArrowRight
                      className={`h-8 w-8 mx-auto mb-2 ${isDark ? "text-white/60" : "text-gray-400"}`}
                    />
                    <p
                      className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                    >
                      No career paths available. Click "Generate Paths" to
                      create them.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
