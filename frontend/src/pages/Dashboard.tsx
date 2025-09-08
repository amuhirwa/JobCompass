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
} from "lucide-react";

// Import sections
import { AnalyticsOverview } from "../features/dashboard/components/AnalyticsOverview";
import { ResourceDashboard } from "../features/dashboard/components/ResourceDashboard";
import { CommunityExplore } from "../features/dashboard/components/CommunityExplore";
import { SkillsPage } from "../features/dashboard/components/SkillsPage";
import BackendProfilePage from "@/components/BackendProfilePage";
import { Chatbot } from "@/components/custom/Chatbot";
// import { MapSection } from '../features/dashboard/components/MapSection';

import type {
  User as UserType,
  SkillGroup,
  Occupation,
  Resource,
  AnalyticsData,
} from "../features/dashboard/types";
import type { UserProfile, DashboardData, UserSkill } from "@/lib/types";

// Mock data - same as before but organized for the new structure
const mockSkillGroups: SkillGroup[] = [
  {
    id: "1",
    name: "JavaScript",
    skills: [
      { id: "1", name: "React", category: "JavaScript", level: "Advanced" },
      {
        id: "2",
        name: "Node.js",
        category: "JavaScript",
        level: "Intermediate",
      },
      {
        id: "3",
        name: "TypeScript",
        category: "JavaScript",
        level: "Intermediate",
      },
    ],
  },
  {
    id: "2",
    name: "Database Design",
    skills: [
      {
        id: "4",
        name: "PostgreSQL",
        category: "Database Design",
        level: "Intermediate",
      },
      {
        id: "5",
        name: "MongoDB",
        category: "Database Design",
        level: "Beginner",
      },
    ],
  },
];

const mockOccupations: Occupation[] = [
  {
    id: "1",
    title: "Full Stack Developer",
    matchPercentage: 92,
    requiredSkills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    salaryRange: { min: 75000, max: 120000 },
    location: "Remote",
  },
  {
    id: "2",
    title: "Technical Lead",
    matchPercentage: 87,
    requiredSkills: [
      "Team Leadership",
      "Architecture Design",
      "React",
      "Mentoring",
    ],
    salaryRange: { min: 90000, max: 150000 },
    location: "San Francisco, CA",
  },
  {
    id: "3",
    title: "Product Manager",
    matchPercentage: 75,
    requiredSkills: [
      "Market Research",
      "Data Analysis",
      "User Experience",
      "Agile",
    ],
    salaryRange: { min: 85000, max: 140000 },
    location: "New York, NY",
  },
  {
    id: "4",
    title: "Senior Developer",
    matchPercentage: 70,
    requiredSkills: ["React", "Node.js", "System Design", "Mentoring"],
    salaryRange: { min: 80000, max: 130000 },
    location: "Austin, TX",
  },
];

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Advanced React Patterns",
    type: "course",
    description:
      "Master advanced React patterns including render props, higher-order components, and hooks.",
    progress: 65,
    estimatedTime: "8 hours",
    difficulty: "Advanced",
    tags: ["React", "JavaScript", "Frontend"],
    createdAt: new Date("2024-01-15"),
    url: "https://example.com/course",
    assignedOccupation: "Full Stack Developer",
  },
  {
    id: "2",
    title: "Node.js Performance Optimization",
    type: "article",
    description:
      "Learn techniques to optimize Node.js applications for better performance.",
    progress: 100,
    estimatedTime: "2 hours",
    difficulty: "Intermediate",
    tags: ["Node.js", "Performance", "Backend"],
    createdAt: new Date("2024-01-10"),
    assignedOccupation: "Full Stack Developer",
  },
  {
    id: "3",
    title: "Database Design Fundamentals",
    type: "video",
    description:
      "Complete guide to designing efficient and scalable database schemas.",
    progress: 30,
    estimatedTime: "6 hours",
    difficulty: "Beginner",
    tags: ["Database", "SQL", "Design"],
    createdAt: new Date("2024-01-20"),
    assignedOccupation: "Technical Lead",
  },
  {
    id: "4",
    title: "Leadership in Tech",
    type: "book",
    description: "Essential leadership skills for technical professionals.",
    progress: 0,
    estimatedTime: "12 hours",
    difficulty: "Intermediate",
    tags: ["Leadership", "Management", "Career"],
    createdAt: new Date("2024-01-22"),
    assignedOccupation: "Technical Lead",
  },
];

const mockAnalytics: AnalyticsData = {
  totalOccupations: 12,
  totalSkills: 18,
  resourcesCompleted: 8,
  topOccupations: [
    { name: "Full Stack Developer", matchPercentage: 92 },
    { name: "Technical Lead", matchPercentage: 87 },
    { name: "Product Manager", matchPercentage: 75 },
    { name: "Senior Developer", matchPercentage: 70 },
  ],
  lastEngagedOccupation: "Full Stack Developer",
  skillsGrowth: [
    { month: "Sep", count: 8 },
    { month: "Oct", count: 12 },
    { month: "Nov", count: 15 },
    { month: "Dec", count: 15 },
    { month: "Jan", count: 18 },
  ],
  occupationTrends: [
    { name: "Full Stack Dev", demand: 95, growth: 15 },
    { name: "Data Scientist", demand: 88, growth: 22 },
    { name: "Product Manager", demand: 82, growth: 8 },
    { name: "DevOps Engineer", demand: 90, growth: 18 },
  ],
};

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
  // {
  //   id: 'map',
  //   label: 'Career Map',
  //   icon: MapPin,
  //   description: 'Explore career opportunities and paths',
  // },
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
  const { user: authUser, logout } = useAuth();
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
  const hasLoadedData = useRef(false);

  // Load backend data on component mount
  useEffect(() => {
    setIsLoading(true);
    if (!authUser) return;
    const loadBackendData = async () => {
      if (!authUser) {
        setIsLoading(false);
        return;
      }

      hasLoadedData.current = true;

      try {
        // Load user profile and dashboard data from backend
        const [
          profileResponse,
          dashboardResponse,
          occupationsResponse,
          goalsResponse,
        ] = await Promise.all([
          api.getUserProfile(),
          api.getDashboardData(),
          api.getOccupations({ page: 1, page_size: 20 }), // Get top 20 occupations
          api.getUserGoals().catch(() => []), // Goals might not exist yet
        ]);

        setUserProfile(profileResponse);
        setDashboardData(dashboardResponse);

        // Map auth user to dashboard user format
        setUser({
          id: authUser.id?.toString() || "1",
          firstName: authUser.first_name || authUser.username || "User",
          lastName: authUser.last_name || "",
          email: authUser.email || "",
          avatar: "/api/placeholder/150/150",
        });

        // Convert backend skills to dashboard format
        if (dashboardResponse.primary_skills) {
          const backendSkillGroups = convertSkillsToGroups(
            dashboardResponse.primary_skills
          );
          setSkillGroups(backendSkillGroups);
        }

        // Convert backend occupations to dashboard format
        if (occupationsResponse.results) {
          const formattedOccupations = occupationsResponse.results.map(
            (occ, index) => ({
              id: occ.id,
              title: occ.preferred_label,
              matchPercentage: Math.floor(85 + Math.random() * 15), // Generate realistic match %
              requiredSkills:
                occ.related_skills
                  ?.filter((skill) => skill.relation_type === "essential")
                  .map((skill) => skill.skill_name)
                  .slice(0, 4) || [],
              salaryRange: {
                min: 60000 + index * 5000,
                max: 120000 + index * 10000,
              },
              location:
                index % 3 === 0
                  ? "Remote"
                  : index % 3 === 1
                    ? "New York, NY"
                    : "San Francisco, CA",
            })
          );
          setOccupations(formattedOccupations);
        }

        // For now, keep mock data for resources
        // TODO: Implement backend endpoints for these
        setResources(mockResources);
      } catch (error) {
        console.error("Error loading backend data:", error);
        // Fall back to mock data if backend fails
        setUser({
          id: authUser.id?.toString() || "1",
          firstName: authUser.first_name || authUser.username || "User",
          lastName: authUser.last_name || "",
          email: authUser.email || "",
          avatar: "/api/placeholder/150/150",
        });
        // Use fallback mock data
        setSkillGroups(mockSkillGroups);
        setOccupations(mockOccupations);
        setResources(mockResources);
        hasLoadedData.current = false; // Allow retry on error
      } finally {
        setIsLoading(false);
      }
    };

    // Load data when authUser becomes available
    loadBackendData();
  }, [authUser]); // Only depend on authUser

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

    backendSkills.forEach((skill) => {
      const category = "Technical Skills"; // You might want to add category to backend
      const level: "Advanced" | "Beginner" | "Intermediate" | "Expert" =
        (skill.proficiency_level.charAt(0).toUpperCase() +
          skill.proficiency_level.slice(1)) as any;

      if (!skillMap.has(category)) {
        skillMap.set(category, []);
      }

      skillMap.get(category)!.push({
        id: skill.id,
        name: skill.skill.preferred_label,
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

  // Update analytics with backend data
  const getAnalyticsWithBackendData = (): AnalyticsData => {
    if (!dashboardData) return mockAnalytics;

    // Create analytics from real backend data
    const realOccupations = occupations.slice(0, 4).map((occ) => ({
      name: occ.title,
      matchPercentage: occ.matchPercentage,
    }));

    return {
      totalOccupations: occupations.length || mockAnalytics.totalOccupations,
      totalSkills: dashboardData.stats.skills_count || 0,
      resourcesCompleted: 0, // TODO: Add this to backend
      topOccupations:
        realOccupations.length > 0
          ? realOccupations
          : mockAnalytics.topOccupations,
      lastEngagedOccupation:
        userProfile?.current_occupation?.preferred_label ||
        realOccupations[0]?.name ||
        "Not specified",
      skillsGrowth: mockAnalytics.skillsGrowth, // TODO: Get real growth data from backend
      occupationTrends: mockAnalytics.occupationTrends, // TODO: Get real trends from backend
    };
  };

  const handleUpdateSkillGroups = (newSkillGroups: SkillGroup[]) => {
    setSkillGroups(newSkillGroups);
  };

  const handleUpdateResourceProgress = (
    resourceId: string,
    progress: number
  ) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === resourceId ? { ...resource, progress } : resource
      )
    );
  };

  console.log(authUser);

  const handleAddResource = (
    newResource: Omit<Resource, "id" | "createdAt">
  ) => {
    const resource: Resource = {
      ...newResource,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setResources((prev) => [resource, ...prev]);
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
        return (
          <SkillsPage
            skillGroups={skillGroups}
            occupations={occupations}
            onUpdateSkillGroups={handleUpdateSkillGroups}
          />
        );
      case "resources":
        return <ResourceDashboard />;
      case "community":
        return <CommunityExplore />;
      case "profile":
        return (
          <BackendProfilePage
            userProfile={userProfile}
            dashboardData={dashboardData}
            onRefresh={async () => {
              try {
                const [profileResponse, dashboardResponse] = await Promise.all([
                  api.getUserProfile(),
                  api.getDashboardData(),
                ]);
                setUserProfile(profileResponse);
                setDashboardData(dashboardResponse);
              } catch (error) {
                console.error("Error refreshing data:", error);
              }
            }}
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
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName} profile picture`}
                />
                <AvatarFallback className="bg-tabiya-accent text-white">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}
                  id="user-full-name"
                >
                  {user.firstName} {user.lastName}
                </p>
                <p
                  className={`text-sm truncate ${isDark ? "text-white/60" : "text-gray-500"}`}
                  aria-describedby="user-full-name"
                >
                  {user.email}
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
