import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLink,
  BookOpen,
  Play,
  Award,
  Code,
  FileText,
  Users,
  Target,
  Plus,
  Timer,
} from "lucide-react";
import {
  useLearningResources,
  useGenerateLearningResources,
} from "@/lib/hooks";
import type { CareerStepSkill } from "@/lib/types";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { ResourceLearningHub } from "@/features/dashboard/components/ResourceLearningHub";
import { useState } from "react";

interface SkillLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillInfo: CareerStepSkill | null;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case "course":
      return <Play className="w-4 h-4" />;
    case "book":
      return <BookOpen className="w-4 h-4" />;
    case "certification":
      return <Award className="w-4 h-4" />;
    case "practice":
      return <Code className="w-4 h-4" />;
    case "documentation":
      return <FileText className="w-4 h-4" />;
    case "workshop":
      return <Users className="w-4 h-4" />;
    default:
      return <Target className="w-4 h-4" />;
  }
};

const getDifficultyColor = (level: string, isDark: boolean) => {
  switch (level) {
    case "beginner":
      return isDark
        ? "border-green-400 text-green-400"
        : "border-green-600 text-green-600";
    case "intermediate":
      return isDark
        ? "border-yellow-400 text-yellow-400"
        : "border-yellow-600 text-yellow-600";
    case "advanced":
      return isDark
        ? "border-red-400 text-red-400"
        : "border-red-600 text-red-600";
    default:
      return isDark
        ? "border-white/30 text-white/70"
        : "border-gray-300 text-gray-600";
  }
};

export default function SkillLearningModal({
  isOpen,
  onClose,
  skillInfo,
}: SkillLearningModalProps) {
  const { isDark } = useDarkMode();
  const [showResourceHub, setShowResourceHub] = useState(false);

  const { data: learningResources, isLoading } = useLearningResources(
    skillInfo?.skill.id || ""
  );

  const generateResources = useGenerateLearningResources();

  const handleGenerateResources = () => {
    if (skillInfo?.skill.id) {
      generateResources.mutate(skillInfo.skill.id);
    }
  };

  if (!skillInfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-4xl max-h-[80vh] overflow-y-auto ${
          isDark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`${isDark ? "text-white" : "text-gray-900"} text-xl flex items-center gap-3`}
          >
            <span>
              Learning Resources for {skillInfo.skill.preferred_label}
            </span>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  skillInfo.importance_level === "essential"
                    ? "border-red-500 text-red-500"
                    : skillInfo.importance_level === "important"
                      ? "border-orange-500 text-orange-500"
                      : isDark
                        ? "border-white/30 text-white/70"
                        : "border-gray-300 text-gray-600"
                }`}
              >
                {skillInfo.importance_level}
              </Badge>
              <Badge
                variant="secondary"
                className={`text-xs ${isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"}`}
              >
                {skillInfo.proficiency_level} level
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {skillInfo.skill.description && (
            <div
              className={`${isDark ? "text-white/80" : "text-gray-700"} text-sm`}
            >
              {skillInfo.skill.description}
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3
              className={`${isDark ? "text-white" : "text-gray-900"} font-medium text-lg`}
            >
              Learning Resources
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResourceHub(true)}
                className={`${isDark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
              >
                <Timer className="w-4 h-4 mr-1" />
                Track Progress
              </Button>
              {(!learningResources || learningResources.length === 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateResources}
                  disabled={generateResources.isPending}
                  className={`${isDark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                >
                  {generateResources.isPending
                    ? "Generating..."
                    : "Generate Resources"}
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-32 ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                />
              ))}
            </div>
          ) : learningResources && learningResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningResources.map((resource) => (
                <div
                  key={resource.id}
                  className={`${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  } rounded-lg p-4 border transition-colors`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      {getResourceIcon(resource.resource_type)}
                      <h4
                        className={`${isDark ? "text-white" : "text-gray-900"} font-medium text-sm line-clamp-2`}
                      >
                        {resource.title}
                      </h4>
                    </div>
                    {resource.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  <p
                    className={`${isDark ? "text-white/70" : "text-gray-600"} text-xs mb-3 line-clamp-3`}
                  >
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getDifficultyColor(resource.difficulty_level, isDark)}`}
                    >
                      {resource.difficulty_level}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      {resource.resource_type}
                    </Badge>
                    {resource.is_free && (
                      <Badge
                        variant="outline"
                        className="text-xs border-green-500 text-green-500"
                      >
                        Free
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div
                      className={`${isDark ? "text-white/60" : "text-gray-500"}`}
                    >
                      {resource.provider && <span>{resource.provider}</span>}
                      {resource.provider && resource.duration && " • "}
                      {resource.duration && <span>{resource.duration}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.rating && (
                        <span
                          className={`${isDark ? "text-yellow-400" : "text-yellow-600"}`}
                        >
                          ★ {resource.rating.toFixed(1)}
                        </span>
                      )}
                      {resource.cost && !resource.is_free && (
                        <span
                          className={`${isDark ? "text-white/70" : "text-gray-600"}`}
                        >
                          {resource.cost}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`${isDark ? "text-white/60" : "text-gray-600"} text-center py-8`}
            >
              <div className="space-y-3">
                <div className="text-lg font-medium">
                  No learning resources available
                </div>
                <div className="text-sm">
                  Click "Generate Resources" to get AI-curated learning
                  materials for this skill.
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Resource Learning Hub Modal */}
      <ResourceLearningHub
        isOpen={showResourceHub}
        onClose={() => setShowResourceHub(false)}
        skillInfo={
          skillInfo
            ? {
                skill: skillInfo.skill,
                importance_level: skillInfo.importance_level,
                proficiency_level: skillInfo.proficiency_level,
              }
            : null
        }
        goalInfo={null}
      />
    </Dialog>
  );
}
