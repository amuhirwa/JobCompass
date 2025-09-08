import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useDebouncedSearch } from "@/lib/hooks";
import { X, Plus, Search } from "lucide-react";

interface SkillsStepProps {
  onComplete: (data: Record<string, any>) => void;
  onSkip: () => void;
}

interface SelectedSkill {
  skill_id: string;
  skill_name: string;
  proficiency_level: string;
  years_of_experience: number;
  is_primary: boolean;
}

const SkillsStep: React.FC<SkillsStepProps> = ({ onComplete, onSkip }) => {
  const { isDark } = useDarkMode();
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [currentSkill, setCurrentSkill] = useState({
    skill_id: "",
    proficiency_level: "intermediate",
    years_of_experience: 1,
    is_primary: false,
  });

  // Use debounced search instead of fetching all skills
  const {
    query: searchTerm,
    setQuery: setSearchTerm,
    data: searchData,
    isLoading: isSearching,
  } = useDebouncedSearch("", 300);

  const proficiencyLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];

  // Get skills from search results
  const searchSkills = searchData?.skills || [];
  const hasSearchResults = searchTerm.length >= 2 && searchSkills.length > 0;

  const addSkill = () => {
    if (!currentSkill.skill_id) return;

    const skill = searchSkills.find((s) => s.id === currentSkill.skill_id);
    if (!skill) return;

    // Check if skill already added
    if (selectedSkills.some((s) => s.skill_id === currentSkill.skill_id))
      return;

    const newSkill: SelectedSkill = {
      skill_id: currentSkill.skill_id,
      skill_name: skill.preferred_label,
      proficiency_level: currentSkill.proficiency_level,
      years_of_experience: currentSkill.years_of_experience,
      is_primary: currentSkill.is_primary,
    };

    setSelectedSkills([...selectedSkills, newSkill]);
    setCurrentSkill({
      skill_id: "",
      proficiency_level: "intermediate",
      years_of_experience: 1,
      is_primary: false,
    });
    setSearchTerm("");
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s.skill_id !== skillId));
  };

  const togglePrimary = (skillId: string) => {
    setSelectedSkills(
      selectedSkills.map((skill) =>
        skill.skill_id === skillId
          ? { ...skill, is_primary: !skill.is_primary }
          : skill
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ skills: selectedSkills });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          What are your skills?
        </h2>
        <p className={`${isDark ? "text-white/70" : "text-gray-600"}`}>
          Add your key skills and indicate your proficiency level
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        {/* Add Skill Section */}
        <div
          className={`p-6 rounded-lg ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"}`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Add a Skill
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <Label className={isDark ? "text-white" : "text-gray-900"}>
                Skill
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for a skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-white/60" : "bg-white border-gray-300"}`}
                />
              </div>

              {/* Show loading state */}
              {isSearching && searchTerm.length >= 2 && (
                <div
                  className={`mt-2 p-2 text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}
                >
                  Searching...
                </div>
              )}

              {/* Show no results message */}
              {searchTerm.length >= 2 &&
                !isSearching &&
                searchSkills.length === 0 && (
                  <div
                    className={`mt-2 p-2 text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}
                  >
                    No skills found for "{searchTerm}". Try a different search
                    term.
                  </div>
                )}

              {/* Show search help message */}
              {searchTerm.length > 0 && searchTerm.length < 2 && (
                <div
                  className={`mt-2 p-2 text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}
                >
                  Type at least 2 characters to search for skills.
                </div>
              )}

              {/* Show search results */}
              {hasSearchResults && (
                <div
                  className={`mt-2 max-h-40 overflow-y-auto rounded-md border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                >
                  {searchSkills.slice(0, 10).map((skill) => (
                    <div
                      key={skill.id}
                      onClick={() => {
                        setCurrentSkill((prev) => ({
                          ...prev,
                          skill_id: skill.id,
                        }));
                        setSearchTerm(skill.preferred_label);
                      }}
                      className={`p-3 cursor-pointer border-b last:border-b-0 hover:${isDark ? "bg-gray-700" : "bg-gray-50"} transition-colors ${
                        currentSkill.skill_id === skill.id
                          ? isDark
                            ? "bg-gray-700"
                            : "bg-gray-100"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {skill.preferred_label}
                      </div>
                      <div
                        className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-gray-600"}`}
                      >
                        {skill.skill_type} • {skill.reuse_level}
                      </div>
                      {skill.description && (
                        <div
                          className={`text-xs mt-1 ${isDark ? "text-white/50" : "text-gray-500"} line-clamp-2`}
                        >
                          {skill.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className={isDark ? "text-white" : "text-gray-900"}>
                Proficiency
              </Label>
              <Select
                value={currentSkill.proficiency_level}
                onValueChange={(value) =>
                  setCurrentSkill((prev) => ({
                    ...prev,
                    proficiency_level: value,
                  }))
                }
              >
                <SelectTrigger
                  className={
                    isDark
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300"
                  }
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className={
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-300"
                  }
                >
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={addSkill}
              disabled={!currentSkill.skill_id}
              className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Selected Skills */}
        {selectedSkills.length > 0 && (
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Your Skills ({selectedSkills.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSkills.map((skill) => (
                <div
                  key={skill.skill_id}
                  className={`p-4 rounded-lg border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4
                          className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {skill.skill_name}
                        </h4>
                        {skill.is_primary && (
                          <Badge
                            variant="outline"
                            className="text-xs border-tabiya-accent text-tabiya-accent"
                          >
                            Primary
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <Badge
                          variant="secondary"
                          className={isDark ? "bg-white/10" : "bg-gray-100"}
                        >
                          {skill.proficiency_level}
                        </Badge>
                        <span
                          className={isDark ? "text-white/60" : "text-gray-600"}
                        >
                          {skill.years_of_experience} years
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => togglePrimary(skill.skill_id)}
                        className={`p-0 h-auto mt-2 text-xs ${isDark ? "text-white/70" : "text-gray-600"}`}
                      >
                        {skill.is_primary
                          ? "Remove from primary"
                          : "Mark as primary skill"}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill.skill_id)}
                      className={`p-1 ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`p-4 rounded-lg ${isDark ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-yellow-50 border border-yellow-200"}`}
        >
          <p
            className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-700"}`}
          >
            💡 <strong>Tip:</strong> Mark your strongest or most relevant skills
            as "primary" to get better recommendations. You can add more skills
            later from your profile.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className={
              isDark
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }
          >
            Skip for now
          </Button>
          <Button
            type="submit"
            className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
          >
            {selectedSkills.length > 0
              ? `Continue with ${selectedSkills.length} skills`
              : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SkillsStep;
