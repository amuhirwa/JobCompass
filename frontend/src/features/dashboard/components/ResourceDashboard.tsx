import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  PlayCircle,
  Plus,
  BarChart3,
  Trophy,
  Flame,
} from "lucide-react";
import api from "@/lib/api";
import type { UserLearningResource, ResourceStats } from "@/lib/types";
import { ResourceLearningHub } from "./ResourceLearningHub";
import { useDarkMode } from "@/contexts/DarkModeContext";

export function ResourceDashboard() {
  const { isDark } = useDarkMode();
  const [resources, setResources] = useState<UserLearningResource[]>([]);
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHub, setShowHub] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resourcesData, statsData] = await Promise.all([
        api.getUserResources({ status: "in_progress" }),
        api.getResourceStats(),
      ]);

      setResources(resourcesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load resource data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakDays = () => {
    // Simple calculation - in a real app, you'd track daily learning activity
    return Math.floor(Math.random() * 30) + 1; // Mock data
  };

  const getWeeklyGoalProgress = () => {
    if (!stats) return 0;
    const weeklyGoal = 10; // 10 hours per week goal
    return Math.min((stats.time_stats.weekly_hours / weeklyGoal) * 100, 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"} animate-pulse`}
            >
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_resources || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.status_breakdown.in_progress || 0} in progress
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.time_stats.total_hours || 0}h
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.time_stats.weekly_hours || 0}h this week
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.progress.completion_rate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.status_breakdown.completed || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Learning Streak
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStreakDays()}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Weekly Learning Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Progress: {stats?.time_stats.weekly_hours || 0}h / 10h
              </span>
              <span>{Math.round(getWeeklyGoalProgress())}%</span>
            </div>
            <Progress value={getWeeklyGoalProgress()} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {stats?.time_stats.weekly_sessions || 0} learning sessions this
              week
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Learning Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-blue-500" />
              Currently Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.slice(0, 3).map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <h4
                      className={`${isDark ? "text-white" : "text-gray-900"} font-medium`}
                    >
                      {resource.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {resource.resource_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {resource.time_spent_hours}h spent
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{resource.progress_percentage}%</span>
                      </div>
                      <Progress
                        value={resource.progress_percentage}
                        className="h-1"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {resources.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <PlayCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active learning resources</p>
                  <p className="text-sm">
                    Start learning to see your progress here
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setShowHub(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                View All Resources
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Learning Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Average Completion</span>
                  <span>{stats?.progress.average_completion || 0}%</span>
                </div>
                <Progress
                  value={stats?.progress.average_completion || 0}
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">
                    Resource Types
                  </div>
                  <div className="space-y-1">
                    {stats?.breakdown.by_type.slice(0, 3).map((item) => (
                      <div
                        key={item.resource_type}
                        className="flex justify-between"
                      >
                        <span className="capitalize">{item.resource_type}</span>
                        <span>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1">Difficulty</div>
                  <div className="space-y-1">
                    {stats?.breakdown.by_difficulty.map((item) => (
                      <div
                        key={item.difficulty_level}
                        className="flex justify-between"
                      >
                        <span className="capitalize">
                          {item.difficulty_level}
                        </span>
                        <span>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowHub(true)}
                className="w-full"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Stats
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resources
              .filter((r) => r.status === "completed")
              .slice(0, 3)
              .map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                >
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 dark:text-green-100">
                      Completed: {resource.title}
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {resource.time_spent_hours}h total •{" "}
                      {resource.resource_type}
                    </p>
                  </div>
                  {resource.completed_at && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      {new Date(resource.completed_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}

            {resources.filter((r) => r.status === "completed").length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No completed resources yet</p>
                <p className="text-sm">
                  Complete your first resource to see achievements here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resource Learning Hub Modal */}
      <ResourceLearningHub
        isOpen={showHub}
        onClose={() => setShowHub(false)}
        skillInfo={null}
        goalInfo={null}
      />
    </div>
  );
}
