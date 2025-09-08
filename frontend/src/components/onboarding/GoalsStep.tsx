import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useSkills, useOccupations } from "@/lib/hooks";
import { X, Plus, Search, Target, Clock, Trophy } from "lucide-react";

interface GoalsStepProps {
  onComplete: (data: Record<string, any>) => void;
  onSkip: () => void;
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  target_skill_id?: string;
  target_occupation_id?: string;
  target_completion_date: string;
  priority: string;
  goal_type: string;
}

const GoalsStep: React.FC<GoalsStepProps> = ({ onComplete, onSkip }) => {
  const { isDark } = useDarkMode();
  const { data: skills } = useSkills();
  const { data: occupations } = useOccupations();
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [occupationSearchTerm, setOccupationSearchTerm] = useState("");
  const [currentGoal, setCurrentGoal] = useState({
    title: "",
    description: "",
    target_skill_id: "",
    target_occupation_id: "",
    target_completion_date: "",
    priority: "medium",
    goal_type: "skill_development",
  });

  const goalTypes = [
    { value: "skill_development", label: "Skill Development", icon: Target },
    { value: "career_transition", label: "Career Transition", icon: Trophy },
    { value: "certification", label: "Certification", icon: Trophy },
    { value: "promotion", label: "Promotion", icon: Trophy },
  ];

  const priorities = [
    { value: "low", label: "Low Priority", color: "bg-gray-500" },
    { value: "medium", label: "Medium Priority", color: "bg-yellow-500" },
    { value: "high", label: "High Priority", color: "bg-red-500" },
  ];

  const timeframes = [
    { value: "3months", label: "3 months" },
    { value: "6months", label: "6 months" },
    { value: "1year", label: "1 year" },
    { value: "2years", label: "2 years" },
    { value: "custom", label: "Custom date" },
  ];

  const filteredSkills =
    skills?.results
      ?.filter((skill) =>
        skill.preferred_label
          .toLowerCase()
          .includes(skillSearchTerm.toLowerCase())
      )
      .slice(0, 10) || [];

  const filteredOccupations =
    occupations?.results
      ?.filter((occupation) =>
        occupation.preferred_label
          .toLowerCase()
          .includes(occupationSearchTerm.toLowerCase())
      )
      .slice(0, 10) || [];

  const addGoal = () => {
    if (!currentGoal.title.trim()) return;

    const newGoal: LearningGoal = {
      id: Date.now().toString(),
      ...currentGoal,
    };

    setGoals([...goals, newGoal]);
    setCurrentGoal({
      title: "",
      description: "",
      target_skill_id: "",
      target_occupation_id: "",
      target_completion_date: "",
      priority: "medium",
      goal_type: "skill_development",
    });
    setSkillSearchTerm("");
    setOccupationSearchTerm("");
    setShowAddGoal(false);
  };

  const removeGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
  };

  const getTargetCompletionDate = (timeframe: string): string => {
    const now = new Date();
    switch (timeframe) {
      case "3months":
        return new Date(now.setMonth(now.getMonth() + 3))
          .toISOString()
          .split("T")[0];
      case "6months":
        return new Date(now.setMonth(now.getMonth() + 6))
          .toISOString()
          .split("T")[0];
      case "1year":
        return new Date(now.setFullYear(now.getFullYear() + 1))
          .toISOString()
          .split("T")[0];
      case "2years":
        return new Date(now.setFullYear(now.getFullYear() + 2))
          .toISOString()
          .split("T")[0];
      default:
        return "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ goals: goals.map(({ id, ...goal }) => goal) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          What are your learning goals?
        </h2>
        <p className={`${isDark ? "text-white/70" : "text-gray-600"}`}>
          Set specific goals to guide your learning journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {/* Add Goal Button */}
        {!showAddGoal && (
          <div className="text-center">
            <Button
              type="button"
              onClick={() => setShowAddGoal(true)}
              className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Learning Goal
            </Button>
          </div>
        )}

        {/* Add Goal Form */}
        {showAddGoal && (
          <div
            className={`p-6 rounded-lg ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Add a New Goal
            </h3>

            <div className="space-y-4">
              {/* Goal Type */}
              <div>
                <Label className={isDark ? "text-white" : "text-gray-900"}>
                  Goal Type
                </Label>
                <Select
                  value={currentGoal.goal_type}
                  onValueChange={(value) =>
                    setCurrentGoal((prev) => ({ ...prev, goal_type: value }))
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
                    {goalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <Label className={isDark ? "text-white" : "text-gray-900"}>
                  Goal Title
                </Label>
                <Input
                  placeholder="e.g., Learn React Development, Get AWS Certification"
                  value={currentGoal.title}
                  onChange={(e) =>
                    setCurrentGoal((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className={
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder-white/60"
                      : "bg-white border-gray-300"
                  }
                />
              </div>

              {/* Description */}
              <div>
                <Label className={isDark ? "text-white" : "text-gray-900"}>
                  Description (Optional)
                </Label>
                <Textarea
                  placeholder="Describe what you want to achieve and why..."
                  value={currentGoal.description}
                  onChange={(e) =>
                    setCurrentGoal((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder-white/60"
                      : "bg-white border-gray-300"
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Skill */}
                {(currentGoal.goal_type === "skill_development" ||
                  currentGoal.goal_type === "certification") && (
                  <div>
                    <Label className={isDark ? "text-white" : "text-gray-900"}>
                      Target Skill (Optional)
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search for a skill..."
                        value={skillSearchTerm}
                        onChange={(e) => setSkillSearchTerm(e.target.value)}
                        className={`pl-10 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-white/60" : "bg-white border-gray-300"}`}
                      />
                    </div>

                    {skillSearchTerm && filteredSkills.length > 0 && (
                      <div
                        className={`mt-2 max-h-32 overflow-y-auto rounded-md border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                      >
                        {filteredSkills.map((skill) => (
                          <div
                            key={skill.id}
                            onClick={() => {
                              setCurrentGoal((prev) => ({
                                ...prev,
                                target_skill_id: skill.id,
                              }));
                              setSkillSearchTerm(skill.preferred_label);
                            }}
                            className={`p-2 cursor-pointer hover:${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                          >
                            <div
                              className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {skill.preferred_label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Target Occupation */}
                {(currentGoal.goal_type === "career_transition" ||
                  currentGoal.goal_type === "promotion") && (
                  <div>
                    <Label className={isDark ? "text-white" : "text-gray-900"}>
                      Target Role (Optional)
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search for a role..."
                        value={occupationSearchTerm}
                        onChange={(e) =>
                          setOccupationSearchTerm(e.target.value)
                        }
                        className={`pl-10 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-white/60" : "bg-white border-gray-300"}`}
                      />
                    </div>

                    {occupationSearchTerm && filteredOccupations.length > 0 && (
                      <div
                        className={`mt-2 max-h-32 overflow-y-auto rounded-md border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                      >
                        {filteredOccupations.map((occupation) => (
                          <div
                            key={occupation.id}
                            onClick={() => {
                              setCurrentGoal((prev) => ({
                                ...prev,
                                target_occupation_id: occupation.id,
                              }));
                              setOccupationSearchTerm(
                                occupation.preferred_label
                              );
                            }}
                            className={`p-2 cursor-pointer hover:${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                          >
                            <div
                              className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {occupation.preferred_label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <Label className={isDark ? "text-white" : "text-gray-900"}>
                    Priority
                  </Label>
                  <Select
                    value={currentGoal.priority}
                    onValueChange={(value) =>
                      setCurrentGoal((prev) => ({ ...prev, priority: value }))
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
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${priority.color}`}
                            />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeframe */}
                <div>
                  <Label className={isDark ? "text-white" : "text-gray-900"}>
                    Target Timeframe
                  </Label>
                  <Select
                    value={
                      currentGoal.target_completion_date ? "custom" : "6months"
                    }
                    onValueChange={(value) => {
                      setCurrentGoal((prev) => ({
                        ...prev,
                        target_completion_date: getTargetCompletionDate(value),
                      }));
                    }}
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
                      {timeframes.map((timeframe) => (
                        <SelectItem
                          key={timeframe.value}
                          value={timeframe.value}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {timeframe.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddGoal(false)}
                  className={
                    isDark
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={addGoal}
                  disabled={!currentGoal.title.trim()}
                  className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                >
                  Add Goal
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        {goals.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Your Learning Goals ({goals.length})
              </h3>
              {!showAddGoal && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddGoal(true)}
                  className={
                    isDark
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {goals.map((goal) => {
                const goalType = goalTypes.find(
                  (type) => type.value === goal.goal_type
                );
                const priority = priorities.find(
                  (p) => p.value === goal.priority
                );
                const IconComponent = goalType?.icon || Target;

                return (
                  <div
                    key={goal.id}
                    className={`p-4 rounded-lg border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent
                            className={`w-5 h-5 ${isDark ? "text-white/70" : "text-gray-600"}`}
                          />
                          <h4
                            className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {goal.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${priority?.color} border-current`}
                          >
                            {priority?.label}
                          </Badge>
                        </div>

                        {goal.description && (
                          <p
                            className={`text-sm mb-2 ${isDark ? "text-white/70" : "text-gray-600"}`}
                          >
                            {goal.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <Badge
                            variant="secondary"
                            className={isDark ? "bg-white/10" : "bg-gray-100"}
                          >
                            {goalType?.label}
                          </Badge>
                          {goal.target_completion_date && (
                            <span
                              className={`flex items-center gap-1 ${isDark ? "text-white/60" : "text-gray-600"}`}
                            >
                              <Clock className="w-3 h-3" />
                              Target:{" "}
                              {new Date(
                                goal.target_completion_date
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGoal(goal.id)}
                        className={`p-1 ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          className={`p-4 rounded-lg ${isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200"}`}
        >
          <p
            className={`text-sm ${isDark ? "text-blue-400" : "text-blue-700"}`}
          >
            🎯 <strong>Tip:</strong> Set specific, measurable goals with
            realistic timeframes. You can always add more goals or adjust them
            later from your dashboard.
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
            {goals.length > 0
              ? `Complete Setup with ${goals.length} goals`
              : "Complete Setup"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GoalsStep;
