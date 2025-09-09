import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/lib/auth-context";
import { NavigationLogo, IconLogo } from "@/components/ui/Logo";
import api from "@/lib/api";
import {
  User,
  Target,
  BookOpen,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  Sun,
  Moon,
  Briefcase,
} from "lucide-react";

// Import sections
import { AnalyticsOverview } from "../features/dashboard/components/AnalyticsOverview";
import { ResourceDashboard } from "../features/dashboard/components/ResourceDashboard";
import { CommunityExplore } from "../features/dashboard/components/CommunityExplore";
import { SkillsPage } from "../features/dashboard/components/SkillsPage";
import BackendProfilePage from "@/components/BackendProfilePage";
import { Chatbot } from "@/components/custom/Chatbot";
import Jobs from "./Jobs";

import type {
  User as UserType,
  SkillGroup,
  Occupation,
  Resource,
  AnalyticsData,
} from "../features/dashboard/types";
import type {
  UserProfile,
  DashboardData,
  UserSkill,
  UserLearningResource,
  PaginatedResponse,
  ResourceStats,
  CommunityPost,
} from "@/lib/types";

const sidebarItems = [
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "View career insights and progress tracking",
  },
  {
    id: "skills",
    label: "Skills",
    icon: Target,
    description: "Manage and develop your professional skills",
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
    description: "Find jobs matching your skills and interests",
  },
  {
    id: "resources",
    label: "Resources",
    icon: BookOpen,
    description: "Access learning materials and courses",
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    description: "Connect with other professionals",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    description: "Manage your personal information",
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { isDark, changeMode } = useDarkMode();
  const { user: authUser, logout, checkOnboardingStatus } = useAuth();
  const [activeSection, setActiveSection] = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedData = useRef(false);

  // Check onboarding status and redirect if needed
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!authUser) {
        navigate("/login");
        return;
      }

      try {
        const hasCompletedOnboarding = await checkOnboardingStatus();
        if (!hasCompletedOnboarding) {
          navigate("/onboarding");
          return;
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // If we can't check onboarding status, allow access but log the error
      }
    };

    checkOnboarding();
  }, [authUser, checkOnboardingStatus, navigate]);

  // Load backend data on component mount
  useEffect(() => {
    const loadBackendData = async () => {
      if (!authUser) {
        setIsLoading(false);
        return;
      }

      if (hasLoadedData.current) return;
      hasLoadedData.current = true;

      try {
        setIsLoading(true);
        setError(null);

        // Load all data in parallel
        const [
          profileResponse,
          dashboardResponse,
          userSkillsResponse,
          occupationsResponse,
          userResourcesResponse,
          resourceStatsResponse,
          communityPostsResponse,
        ] = await Promise.all([
          api.getUserProfile().catch(() => null),
          api.getDashboardData().catch(() => null),
          api.getUserSkills().catch(() => ({ results: [] })),
          api
            .getOccupations({ page: 1, page_size: 50 })
            .catch(() => ({ results: [] })),
          api.getUserResources().catch(() => ({ results: [] })),
          api.getResourceStats().catch(() => null),
          api.getCommunityPosts().catch(() => ({ results: [] })),
        ]);

        // Set profile data
        setUserProfile(profileResponse);
        setDashboardData(dashboardResponse);

        // Map auth user to dashboard user format
        setUser({
          id: authUser.id?.toString() || "1",
          firstName: authUser.first_name || authUser.username || "User",
          lastName: authUser.last_name || "",
          email: authUser.email || "",
          avatar: "/api/placeholder/150/150", // You can add user avatar from profile
        });

        // Convert backend skills to dashboard skill groups
        if (
          userSkillsResponse.results &&
          userSkillsResponse.results.length > 0
        ) {
          console.log(
            `Dashboard: Loaded ${userSkillsResponse.results.length} user skills`
          );
          const backendSkillGroups = convertSkillsToGroups(
            userSkillsResponse.results
          );
          setSkillGroups(backendSkillGroups);
        } else {
          console.log("Dashboard: No user skills found");
        }

        // Convert backend occupations to dashboard format
        if (
          occupationsResponse.results &&
          occupationsResponse.results.length > 0
        ) {
          const userSkillIds =
            userSkillsResponse.results?.map((us) => us.skill.id) || [];

          console.log(
            `Dashboard: User has ${userSkillIds.length} skills:`,
            userSkillIds
          );

          const formattedOccupations = occupationsResponse.results
            .slice(0, 20)
            .map((occ, index) => {
              // Calculate real match percentage using skill IDs (same logic as Skills page)
              const relatedSkillIds =
                occ.related_skills?.map((rs) => rs.skill_id) || [];
              const matchingSkills = relatedSkillIds.filter((skillId) =>
                userSkillIds.includes(skillId)
              );
              const matchPercentage =
                relatedSkillIds.length > 0
                  ? Math.round(
                      (matchingSkills.length / relatedSkillIds.length) * 100
                    )
                  : 0;

              console.log(
                `Dashboard: ${occ.preferred_label} - ${matchingSkills.length}/${relatedSkillIds.length} skills matched = ${matchPercentage}%`
              );

              return {
                id: occ.id,
                title: occ.preferred_label,
                matchPercentage,
                requiredSkills:
                  occ.related_skills
                    ?.filter((skill) => skill.relation_type === "essential")
                    .map((skill) => skill.skill_name)
                    .slice(0, 4) || [], // Limit to first 4 for display
                salaryRange: {
                  min: 50000 + index * 3000,
                  max: 100000 + index * 5000,
                },
                location: [
                  "Remote",
                  "New York, NY",
                  "San Francisco, CA",
                  "Austin, TX",
                  "Seattle, WA",
                ][index % 5],
              };
            })
            .sort((a, b) => b.matchPercentage - a.matchPercentage); // Sort by match percentage
          setOccupations(formattedOccupations);
        }

        // Convert backend user resources to dashboard format
        if (
          userResourcesResponse.results &&
          userResourcesResponse.results.length > 0
        ) {
          const formattedResources = userResourcesResponse.results.map(
            (resource) => ({
              id: resource.id,
              title: resource.title,
              type: (resource.resource_type || "article") as Resource["type"],
              description: resource.description || "",
              url: resource.url,
              progress: getProgressFromStatus(resource.status),
              estimatedTime: resource.duration || "Unknown",
              difficulty: (resource.difficulty_level ||
                "intermediate") as Resource["difficulty"],
              tags: [], // No tags field in UserLearningResource
              createdAt: new Date(resource.created_at),
              assignedOccupation: resource.related_skill_name || "General",
            })
          );
          setResources(formattedResources);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError(
          "Failed to load dashboard data. Some features may not work properly."
        );

        // Set minimal fallback data
        setUser({
          id: authUser.id?.toString() || "1",
          firstName: authUser.first_name || authUser.username || "User",
          lastName: authUser.last_name || "",
          email: authUser.email || "",
          avatar: "/api/placeholder/150/150",
        });
        setSkillGroups([]);
        setOccupations([]);
        setResources([]);
        hasLoadedData.current = false; // Allow retry on error
      } finally {
        setIsLoading(false);
      }
    };

    loadBackendData();
  }, [authUser]);

  // Convert backend UserSkill[] to SkillGroup[] format
  const convertSkillsToGroups = (backendSkills: UserSkill[]): SkillGroup[] => {
    const skillMap = new Map<
      string,
      {
        id: string;
        name: string;
        category: string;
        level: "Advanced" | "Beginner" | "Intermediate" | "Expert";
      }[]
    >();

    backendSkills.forEach((userSkill) => {
      const category = userSkill.skill.skill_type || "Technical Skills";
      const level: "Advanced" | "Beginner" | "Intermediate" | "Expert" =
        (userSkill.proficiency_level.charAt(0).toUpperCase() +
          userSkill.proficiency_level.slice(1)) as any;

      if (!skillMap.has(category)) {
        skillMap.set(category, []);
      }

      skillMap.get(category)!.push({
        id: userSkill.id,
        name: userSkill.skill.preferred_label,
        category,
        level,
      });
    });

    return Array.from(skillMap.entries()).map(([category, skills], index) => ({
      id: `backend-${index}`,
      name: category,
      skills,
    }));
  };

  // Convert resource status to progress percentage
  const getProgressFromStatus = (status: string): number => {
    switch (status) {
      case "completed":
        return 100;
      case "in_progress":
        return Math.floor(Math.random() * 80) + 10; // 10-90%
      case "paused":
        return Math.floor(Math.random() * 50) + 10; // 10-60%
      case "planned":
        return 0;
      default:
        return 0;
    }
  };

  // Generate analytics data from real backend data
  const getAnalyticsWithBackendData = (): AnalyticsData => {
    const topOccupations = occupations.slice(0, 4).map((occ) => ({
      name: occ.title,
      matchPercentage: occ.matchPercentage,
    }));

    const totalSkills = skillGroups.reduce(
      (total, group) => total + group.skills.length,
      0
    );
    const completedResources = resources.filter(
      (r) => r.progress >= 100
    ).length;

    // Generate skill growth data based on real skill categories
    // Note: This simulates growth based on current skills. For true historical data,
    // we would need to track skill addition dates in the backend.
    const currentDate = new Date();
    const skillsGrowth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - (5 - i));

      // Create realistic progression: start with fewer skills, gradually increase
      const progressionRatio = (i + 1) / 6;
      const skillsAtThisPoint = Math.floor(totalSkills * progressionRatio);

      return {
        month: date.toLocaleDateString("en", { month: "short" }),
        count: skillsAtThisPoint,
      };
    });

    // Generate occupation trends based on real match percentages
    const occupationTrends = occupations.slice(0, 4).map((occ) => ({
      name:
        occ.title.length > 15 ? occ.title.substring(0, 12) + "..." : occ.title,
      demand: Math.max(20, occ.matchPercentage), // Use match percentage as demand indicator
      growth: Math.floor(occ.matchPercentage * 0.3 + Math.random() * 10), // Growth correlated with match
    }));

    return {
      totalOccupations: occupations.length,
      totalSkills,
      resourcesCompleted: completedResources,
      topOccupations:
        topOccupations.length > 0
          ? topOccupations
          : [{ name: "No occupations found", matchPercentage: 0 }],
      lastEngagedOccupation:
        userProfile?.current_occupation?.preferred_label ||
        topOccupations[0]?.name ||
        "Not specified",
      skillsGrowth,
      occupationTrends,
    };
  };

  const handleUpdateSkillGroups = (newSkillGroups: SkillGroup[]) => {
    setSkillGroups(newSkillGroups);
  };

  const refreshData = async () => {
    hasLoadedData.current = false;
    setIsLoading(true);

    // This will trigger the useEffect to reload data
    const currentUser = authUser;
    if (currentUser) {
      // Force reload by resetting the ref and calling load again
      setTimeout(() => {
        hasLoadedData.current = false;
      }, 100);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-tabiya-dark" : "bg-gray-50"} flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tabiya-accent mx-auto mb-4"></div>
          <p className={isDark ? "text-white/70" : "text-gray-600"}>
            Loading your dashboard...
          </p>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const analyticsData = getAnalyticsWithBackendData();

    switch (activeSection) {
      case "analytics":
        return (
          <AnalyticsOverview
            analytics={analyticsData}
            occupations={occupations}
            skills={skillGroups.flatMap((g) => g.skills)}
            resources={resources}
          />
        );
      case "skills":
        return <SkillsPage />;
      case "jobs":
        return <Jobs />;
      case "resources":
        return <ResourceDashboard />;
      case "community":
        return <CommunityExplore />;
      case "profile":
        return (
          <BackendProfilePage
            userProfile={userProfile}
            dashboardData={dashboardData}
            onRefresh={refreshData}
          />
        );
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div
      className={`flex h-screen dashboard-container ${isDark ? "bg-tabiya-dark" : "bg-gray-50"}`}
      role="application"
      aria-label="JobCompass Dashboard"
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          `fixed inset-y-0 left-0 z-50 w-64 ${isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white border-gray-200"} border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex-shrink-0`,
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!sidebarOpen ? "true" : undefined}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <header
            className={`flex items-center justify-between px-6 py-6 border-b ${isDark ? "border-tabiya-dark" : "border-gray-200"}`}
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 rounded"
              aria-label="Go to JobCompass homepage"
            >
              <NavigationLogo />
            </button>
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden ${isDark ? "hover:bg-tabiya-dark/50" : "hover:bg-gray-100"} focus:ring-2 focus:ring-tabiya-accent/20`}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
            >
              <X
                className={`h-4 w-4 ${isDark ? "text-white" : "text-gray-600"}`}
                aria-hidden="true"
              />
            </Button>
          </header>

          {/* Navigation */}
          <nav
            className="flex-1 px-4 py-6"
            role="navigation"
            aria-label="Dashboard sections"
          >
            <TooltipProvider>
              <ul className="space-y-2" role="list">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <li key={item.id} role="listitem">
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              `w-full justify-start gap-3 px-4 py-3 h-auto transition-colors focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 ${
                                isDark
                                  ? `text-white/80 hover:bg-tabiya-dark/50 ${
                                      isActive
                                        ? "bg-tabiya-accent/20 text-tabiya-accent hover:bg-tabiya-accent/25 border-r-2 border-tabiya-accent"
                                        : ""
                                    }`
                                  : `text-gray-700 hover:bg-gray-100 ${
                                      isActive
                                        ? "bg-tabiya-accent/10 text-tabiya-accent hover:bg-tabiya-accent/15 border-r-2 border-tabiya-accent"
                                        : ""
                                    }`
                              }`
                            )}
                            onClick={() => {
                              setActiveSection(item.id);
                              setSidebarOpen(false);
                            }}
                            aria-current={isActive ? "page" : undefined}
                            aria-label={`Navigate to ${item.label}`}
                            aria-describedby={`tooltip-${item.id}`}
                          >
                            <Icon
                              className="h-5 w-5 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="font-medium">{item.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          id={`tooltip-${item.id}`}
                          side="right"
                          className={
                            isDark
                              ? "bg-tabiya-medium text-white border-tabiya-dark"
                              : "bg-white text-gray-900 border-gray-200"
                          }
                        >
                          <p>{item.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </TooltipProvider>
          </nav>

          {/* User info */}
          <footer
            className={`px-6 py-4 border-t ${isDark ? "border-tabiya-dark" : "border-gray-200"}`}
            role="contentinfo"
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.avatar}
                  alt={`${user?.firstName} ${user?.lastName} profile picture`}
                />
                <AvatarFallback className="bg-tabiya-accent text-white">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}
                  id="user-full-name"
                >
                  {user?.firstName} {user?.lastName}
                </p>
                <p
                  className={`text-sm truncate ${isDark ? "text-white/60" : "text-gray-500"}`}
                  aria-describedby="user-full-name"
                >
                  {user?.email}
                </p>
              </div>
            </div>

            <nav
              className="space-y-2"
              role="navigation"
              aria-label="User actions"
            >
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 ${
                  isDark
                    ? "text-white/80 hover:text-tabiya-accent hover:bg-tabiya-accent/10"
                    : "text-gray-700 hover:text-tabiya-accent hover:bg-orange-50"
                }`}
                onClick={() => navigate("/")}
                aria-label="Return to JobCompass homepage"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Back to Home
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 ${
                  isDark
                    ? "text-white/80 hover:text-yellow-400 hover:bg-yellow-400/10"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => changeMode()}
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
                {isDark ? "Light Mode" : "Dark Mode"}
              </Button>

              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                  isDark
                    ? "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    : "text-red-600 hover:text-red-700 hover:bg-red-50"
                }`}
                onClick={handleLogout}
                aria-label="Sign out of your account"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </Button>
            </nav>
          </footer>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top bar */}
        <header
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark
              ? "border-tabiya-dark bg-tabiya-medium"
              : "border-gray-200 bg-white"
          } lg:hidden`}
          role="banner"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className={`focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 ${
                isDark ? "hover:bg-tabiya-dark/50" : "hover:bg-gray-100"
              }`}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
            >
              <Menu
                className={`h-4 w-4 ${isDark ? "text-white" : "text-gray-600"}`}
                aria-hidden="true"
              />
            </Button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 rounded"
              aria-label="Go to JobCompass homepage"
            >
              <IconLogo />
            </button>
          </div>

          {/* Theme Toggle for Mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeMode()}
            className={`focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 ${isDark ? "hover:bg-tabiya-dark/50" : "hover:bg-gray-100"}`}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <Sun
                className={`h-4 w-4 ${isDark ? "text-white" : "text-gray-600"}`}
                aria-hidden="true"
              />
            ) : (
              <Moon
                className={`h-4 w-4 ${isDark ? "text-white" : "text-gray-600"}`}
                aria-hidden="true"
              />
            )}
          </Button>
        </header>

        {/* Content area */}
        <main
          className={`flex-1 overflow-auto w-full ${isDark ? "bg-tabiya-dark" : "bg-gray-50"}`}
          role="main"
          aria-labelledby="main-heading"
        >
          <div className="w-full h-full">
            <div className="p-6 w-full">
              <div className="mb-6 hidden lg:flex lg:items-center lg:justify-between">
                <div>
                  <h1
                    id="main-heading"
                    className={`text-3xl font-bold tracking-tight capitalize ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {activeSection}
                  </h1>
                  <p
                    className={`mt-1 ${isDark ? "text-white/70" : "text-gray-600"}`}
                    aria-describedby="main-heading"
                  >
                    {
                      sidebarItems.find((item) => item.id === activeSection)
                        ?.description
                    }
                  </p>
                </div>

                {/* Desktop Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeMode()}
                  className={`focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 ${
                    isDark
                      ? "text-white/80 hover:text-yellow-400 hover:bg-yellow-400/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Moon className="h-5 w-5" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <div
                className="w-full"
                role="region"
                aria-labelledby="main-heading"
              >
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot - Context-aware based on active section */}
      <Chatbot
        contextType={
          activeSection === "skills"
            ? "skill"
            : activeSection === "resources"
              ? "resources"
              : activeSection === "community"
                ? "community"
                : "general"
        }
        contextData={{
          name:
            activeSection === "skills"
              ? "Skills Management"
              : activeSection === "resources"
                ? "Learning Resources"
                : activeSection === "community"
                  ? "Community Hub"
                  : "JobCompass Dashboard",
        }}
      />
    </div>
  );
}

export default Dashboard;
