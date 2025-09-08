import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExternalLink,
  BookOpen,
  Play,
  Award,
  Code,
  FileText,
  Target,
  Star,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Calendar,
  Plus,
  Save,
  Timer,
} from "lucide-react";
import api from "@/lib/api";
import type {
  UserLearningResource,
  CreateUserLearningResource,
  ResourceStats,
} from "@/lib/types";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useToast } from "@/hooks/use-toast";

interface ResourceLearningHubProps {
  isOpen: boolean;
  onClose: () => void;
  skillInfo?: {
    skill: {
      id: string;
      preferred_label: string;
      description?: string;
    };
    importance_level?: string;
    proficiency_level?: string;
  } | null;
  goalInfo?: {
    id: string;
    title: string;
    description?: string;
  } | null;
}

const getResourceIcon = (type: string) => {
  const icons = {
    course: <Play className="w-4 h-4" />,
    video: <Play className="w-4 h-4" />,
    article: <FileText className="w-4 h-4" />,
    book: <BookOpen className="w-4 h-4" />,
    podcast: <Play className="w-4 h-4" />,
    tutorial: <Code className="w-4 h-4" />,
    documentation: <FileText className="w-4 h-4" />,
    practice: <Code className="w-4 h-4" />,
    certification: <Award className="w-4 h-4" />,
  };
  return icons[type as keyof typeof icons] || <Target className="w-4 h-4" />;
};

const getStatusIcon = (status: string) => {
  const icons = {
    planned: <Calendar className="w-4 h-4" />,
    in_progress: <PlayCircle className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    paused: <PauseCircle className="w-4 h-4" />,
  };
  return (
    icons[status as keyof typeof icons] || <Calendar className="w-4 h-4" />
  );
};

const getStatusColor = (status: string, isDark: boolean) => {
  const colors = {
    planned: isDark ? "text-blue-400" : "text-blue-600",
    in_progress: isDark ? "text-yellow-400" : "text-yellow-600",
    completed: isDark ? "text-green-400" : "text-green-600",
    paused: isDark ? "text-gray-400" : "text-gray-600",
  };
  return (
    colors[status as keyof typeof colors] ||
    (isDark ? "text-gray-400" : "text-gray-600")
  );
};

export function ResourceLearningHub({
  isOpen,
  onClose,
  skillInfo,
  goalInfo,
}: ResourceLearningHubProps) {
  const { isDark } = useDarkMode();
  const { toast } = useToast();

  const [resources, setResources] = useState<UserLearningResource[]>([]);
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resources");
  const [filter, setFilter] = useState({
    status: "all",
    search: "",
  });

  // Add Resource Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState<CreateUserLearningResource>({
    title: "",
    description: "",
    url: "",
    resource_type: "course",
    difficulty_level: "beginner",
    provider: "",
    duration: "",
    cost: 0,
    is_free: true,
    rating: 0,
    related_skill: skillInfo?.skill.id || "",
    related_goal: goalInfo?.id || "",
  });

  // Progress Tracking
  const [progressModal, setProgressModal] = useState<{
    resource: UserLearningResource | null;
    show: boolean;
    progress: number;
    sessionMinutes: number;
    notes: string;
  }>({
    resource: null,
    show: false,
    progress: 0,
    sessionMinutes: 0,
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, skillInfo, goalInfo]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (skillInfo?.skill.id) params.skill = skillInfo.skill.id;
      if (goalInfo?.id) params.goal = goalInfo.id;
      if (filter.search) params.search = filter.search;
      if (filter.status !== "all") params.status = filter.status;

      const [resourcesData, statsData] = await Promise.all([
        api.getUserResources(params),
        api.getResourceStats(),
      ]);

      setResources(resourcesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load resources:", error);
      toast({
        title: "Error",
        description: "Failed to load learning resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) => {
    if (filter.status !== "all" && resource.status !== filter.status)
      return false;
    if (
      filter.search &&
      !resource.title.toLowerCase().includes(filter.search.toLowerCase()) &&
      !resource.description.toLowerCase().includes(filter.search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleAddResource = async () => {
    try {
      const resource = await api.createUserResource(newResource);
      setResources((prev) => [resource, ...prev]);
      setShowAddForm(false);
      setNewResource({
        title: "",
        description: "",
        url: "",
        resource_type: "course",
        difficulty_level: "beginner",
        provider: "",
        duration: "",
        cost: 0,
        is_free: true,
        rating: 0,
        related_skill: skillInfo?.skill.id || "",
        related_goal: goalInfo?.id || "",
      });
      toast({
        title: "Success",
        description: "Resource added successfully",
      });
    } catch (error) {
      console.error("Failed to add resource:", error);
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProgress = async () => {
    if (!progressModal.resource) return;

    try {
      const updatedResource = await api.updateResourceProgress(
        progressModal.resource.id,
        {
          progress_percentage: progressModal.progress,
          session_duration_minutes: progressModal.sessionMinutes,
          notes: progressModal.notes,
        }
      );

      setResources((prev) =>
        prev.map((r) => (r.id === updatedResource.id ? updatedResource : r))
      );

      setProgressModal({
        resource: null,
        show: false,
        progress: 0,
        sessionMinutes: 0,
        notes: "",
      });
      loadData(); // Refresh stats

      toast({
        title: "Progress Updated",
        description: "Learning progress saved successfully",
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const startLearningSession = (resource: UserLearningResource) => {
    setProgressModal({
      resource,
      show: true,
      progress: resource.progress_percentage,
      sessionMinutes: 0,
      notes: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-white"} max-w-6xl h-[90vh]`}
      >
        <DialogHeader>
          <DialogTitle
            className={`${isDark ? "text-white" : "text-gray-900"} text-xl flex items-center gap-3`}
          >
            <span>Learning Resource Hub</span>
            {(skillInfo || goalInfo) && (
              <div className="flex gap-2">
                {skillInfo && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${isDark ? "border-blue-500 text-blue-400" : "border-blue-500 text-blue-600"}`}
                  >
                    {skillInfo.skill.preferred_label}
                  </Badge>
                )}
                {goalInfo && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${isDark ? "border-green-500 text-green-400" : "border-green-500 text-green-600"}`}
                  >
                    {goalInfo.title}
                  </Badge>
                )}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent
            value="resources"
            className="flex-1 space-y-4 overflow-auto"
          >
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-4 flex-1">
                <Input
                  placeholder="Search resources..."
                  value={filter.search}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="max-w-sm"
                />
                <Select
                  value={filter.status}
                  onValueChange={(value) =>
                    setFilter((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={loadData}>
                  Refresh
                </Button>
              </div>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <Card
                    key={resource.id}
                    className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {getResourceIcon(resource.resource_type)}
                          <div>
                            <CardTitle
                              className={`${isDark ? "text-white" : "text-gray-900"} text-lg`}
                            >
                              {resource.title}
                            </CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {resource.resource_type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {resource.difficulty_level}
                              </Badge>
                              <div
                                className={`flex items-center gap-1 ${getStatusColor(resource.status, isDark)}`}
                              >
                                {getStatusIcon(resource.status)}
                                <span className="text-xs capitalize">
                                  {resource.status.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startLearningSession(resource)}
                          >
                            <Timer className="w-4 h-4 mr-1" />
                            Track Progress
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={`${isDark ? "text-white/80" : "text-gray-700"} text-sm mb-3`}
                      >
                        {resource.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span
                            className={
                              isDark ? "text-white/70" : "text-gray-600"
                            }
                          >
                            Progress: {resource.progress_percentage}%
                          </span>
                          <span
                            className={
                              isDark ? "text-white/70" : "text-gray-600"
                            }
                          >
                            Time: {resource.time_spent_hours}h
                          </span>
                        </div>
                        <Progress
                          value={resource.progress_percentage}
                          className="w-full"
                        />
                      </div>

                      <div className="flex justify-between items-center mt-3 text-sm">
                        <div className="flex gap-4">
                          <span
                            className={
                              isDark ? "text-white/70" : "text-gray-600"
                            }
                          >
                            Provider: {resource.provider}
                          </span>
                          {resource.duration && (
                            <span
                              className={
                                isDark ? "text-white/70" : "text-gray-600"
                              }
                            >
                              Duration: {resource.duration}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {resource.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span
                                className={
                                  isDark ? "text-white/70" : "text-gray-600"
                                }
                              >
                                {resource.rating}
                              </span>
                            </div>
                          )}
                          {resource.is_free ? (
                            <Badge variant="secondary" className="text-xs">
                              Free
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              ${resource.cost}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredResources.length === 0 && !loading && (
                  <div
                    className={`${isDark ? "text-white/60" : "text-gray-600"} text-center py-8`}
                  >
                    <div className="space-y-3">
                      <div className="text-lg font-medium">
                        No resources found
                      </div>
                      <div className="text-sm">
                        Add some learning resources to track your progress
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="progress"
            className="flex-1 space-y-4 overflow-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources
                .filter(
                  (r) => r.status === "in_progress" || r.status === "completed"
                )
                .map((resource) => (
                  <Card
                    key={resource.id}
                    className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle
                        className={`${isDark ? "text-white" : "text-gray-900"} text-base`}
                      >
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{resource.progress_percentage}%</span>
                          </div>
                          <Progress value={resource.progress_percentage} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div
                              className={`${isDark ? "text-white/70" : "text-gray-600"} mb-1`}
                            >
                              Time Spent
                            </div>
                            <div
                              className={`${isDark ? "text-white" : "text-gray-900"} font-medium`}
                            >
                              {resource.time_spent_hours}h
                            </div>
                          </div>
                          <div>
                            <div
                              className={`${isDark ? "text-white/70" : "text-gray-600"} mb-1`}
                            >
                              Status
                            </div>
                            <Badge
                              variant={
                                resource.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {resource.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startLearningSession(resource)}
                          className="w-full"
                        >
                          Update Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="flex-1 space-y-4 overflow-auto">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                  className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.total_resources}
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.progress.completion_rate}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stats.status_breakdown.completed} completed
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.time_stats.total_hours}h
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stats.time_stats.weekly_hours}h this week
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Weekly Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.time_stats.weekly_sessions}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Learning sessions
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"} md:col-span-2`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Status Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Completed</span>
                        <span>{stats.status_breakdown.completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress</span>
                        <span>{stats.status_breakdown.in_progress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Planned</span>
                        <span>{stats.status_breakdown.planned}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"} md:col-span-2`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Resource Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.breakdown.by_type.map((item) => (
                        <div
                          key={item.resource_type}
                          className="flex justify-between"
                        >
                          <span className="capitalize">
                            {item.resource_type}
                          </span>
                          <span>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add Resource Modal */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent
            className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-white"} max-w-2xl`}
          >
            <DialogHeader>
              <DialogTitle>Add Learning Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Resource title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newResource.description}
                  onChange={(e) =>
                    setNewResource((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Resource description"
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newResource.url}
                  onChange={(e) =>
                    setNewResource((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newResource.resource_type}
                    onValueChange={(value: any) =>
                      setNewResource((prev) => ({
                        ...prev,
                        resource_type: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="documentation">
                        Documentation
                      </SelectItem>
                      <SelectItem value="practice">Practice</SelectItem>
                      <SelectItem value="certification">
                        Certification
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={newResource.difficulty_level}
                    onValueChange={(value: any) =>
                      setNewResource((prev) => ({
                        ...prev,
                        difficulty_level: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    value={newResource.provider}
                    onChange={(e) =>
                      setNewResource((prev) => ({
                        ...prev,
                        provider: e.target.value,
                      }))
                    }
                    placeholder="Coursera, YouTube, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newResource.duration}
                    onChange={(e) =>
                      setNewResource((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="2 hours, 4 weeks, etc."
                  />
                </div>
              </div>

              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newResource.cost}
                    onChange={(e) =>
                      setNewResource((prev) => ({
                        ...prev,
                        cost: Number(e.target.value),
                      }))
                    }
                    disabled={newResource.is_free}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_free"
                    checked={newResource.is_free}
                    onChange={(e) =>
                      setNewResource((prev) => ({
                        ...prev,
                        is_free: e.target.checked,
                        cost: e.target.checked ? 0 : prev.cost,
                      }))
                    }
                  />
                  <Label htmlFor="is_free">Free</Label>
                </div>

                <div className="flex-1">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={newResource.rating}
                    onChange={(e) =>
                      setNewResource((prev) => ({
                        ...prev,
                        rating: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddResource} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Progress Tracking Modal */}
        <Dialog
          open={progressModal.show}
          onOpenChange={(open) =>
            setProgressModal((prev) => ({ ...prev, show: open }))
          }
        >
          <DialogContent
            className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-white"}`}
          >
            <DialogHeader>
              <DialogTitle>Update Learning Progress</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={progressModal.progress}
                  onChange={(e) =>
                    setProgressModal((prev) => ({
                      ...prev,
                      progress: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="session">Session Duration (minutes)</Label>
                <Input
                  id="session"
                  type="number"
                  min="0"
                  value={progressModal.sessionMinutes}
                  onChange={(e) =>
                    setProgressModal((prev) => ({
                      ...prev,
                      sessionMinutes: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={progressModal.notes}
                  onChange={(e) =>
                    setProgressModal((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="What did you learn? Any challenges?"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateProgress} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Progress
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setProgressModal((prev) => ({ ...prev, show: false }))
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
