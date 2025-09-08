import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useOccupations } from "@/lib/hooks";

interface CareerInfoStepProps {
  onComplete: (data: Record<string, any>) => void;
  onSkip: () => void;
}

const CareerInfoStep: React.FC<CareerInfoStepProps> = ({
  onComplete,
  onSkip,
}) => {
  const { isDark } = useDarkMode();
  const { data: occupations, isLoading } = useOccupations();
  const [formData, setFormData] = useState({
    current_occupation_id: "",
    target_occupation_id: "",
    experience_level: "",
    career_goal: "",
  });

  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "junior", label: "Junior (2-5 years)" },
    { value: "mid", label: "Mid Level (5-8 years)" },
    { value: "senior", label: "Senior (8-12 years)" },
    { value: "lead", label: "Lead/Principal (12+ years)" },
  ];

  const careerGoals = [
    { value: "switch_career", label: "Switch Career" },
    { value: "advance_current", label: "Advance in Current Career" },
    { value: "skill_development", label: "Develop New Skills" },
    { value: "leadership", label: "Move into Leadership" },
    { value: "entrepreneurship", label: "Start Own Business" },
    { value: "freelance", label: "Become Freelancer" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Your Career Journey
        </h2>
        <p className={`${isDark ? "text-white/70" : "text-gray-600"}`}>
          Help us understand your current position and where you want to go
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className={isDark ? "text-white" : "text-gray-900"}>
              Current Occupation
            </Label>
            <Select
              value={formData.current_occupation_id}
              onValueChange={(value) =>
                updateField("current_occupation_id", value)
              }
            >
              <SelectTrigger
                className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white" : "bg-white border-gray-300"}`}
              >
                <SelectValue placeholder="Select your current role" />
              </SelectTrigger>
              <SelectContent
                className={
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-300"
                }
              >
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading occupations...
                  </SelectItem>
                ) : (
                  occupations?.results?.slice(0, 50).map((occupation) => (
                    <SelectItem key={occupation.id} value={occupation.id}>
                      {occupation.preferred_label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={isDark ? "text-white" : "text-gray-900"}>
              Target Occupation
            </Label>
            <Select
              value={formData.target_occupation_id}
              onValueChange={(value) =>
                updateField("target_occupation_id", value)
              }
            >
              <SelectTrigger
                className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white" : "bg-white border-gray-300"}`}
              >
                <SelectValue placeholder="Where do you want to be?" />
              </SelectTrigger>
              <SelectContent
                className={
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-300"
                }
              >
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading occupations...
                  </SelectItem>
                ) : (
                  occupations?.results?.slice(0, 50).map((occupation) => (
                    <SelectItem key={occupation.id} value={occupation.id}>
                      {occupation.preferred_label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className={isDark ? "text-white" : "text-gray-900"}>
              Experience Level
            </Label>
            <Select
              value={formData.experience_level}
              onValueChange={(value) => updateField("experience_level", value)}
            >
              <SelectTrigger
                className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white" : "bg-white border-gray-300"}`}
              >
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent
                className={
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-300"
                }
              >
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={isDark ? "text-white" : "text-gray-900"}>
              Primary Career Goal
            </Label>
            <Select
              value={formData.career_goal}
              onValueChange={(value) => updateField("career_goal", value)}
            >
              <SelectTrigger
                className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white" : "bg-white border-gray-300"}`}
              >
                <SelectValue placeholder="What's your main goal?" />
              </SelectTrigger>
              <SelectContent
                className={
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-300"
                }
              >
                {careerGoals.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg ${isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200"}`}
        >
          <p
            className={`text-sm ${isDark ? "text-blue-400" : "text-blue-700"}`}
          >
            💡 <strong>Tip:</strong> This information helps us suggest relevant
            career paths, skills to develop, and learning resources tailored to
            your goals.
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
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CareerInfoStep;
