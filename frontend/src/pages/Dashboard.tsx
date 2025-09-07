import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { NavigationLogo, IconLogo } from '@/components/ui/Logo';
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
} from 'lucide-react';

// Import sections
import { AnalyticsOverview } from '../features/dashboard/components/AnalyticsOverview';
import { ResourcesHub } from '../features/dashboard/components/ResourcesHub';
import { CommunityExplore } from '../features/dashboard/components/CommunityExplore';
import { SkillsPage } from '../features/dashboard/components/SkillsPage';
import { ProfilePage } from '../features/dashboard/components/ProfilePage';
// import { MapSection } from '../features/dashboard/components/MapSection';

import type {
  User as UserType,
  SkillGroup,
  Occupation,
  Resource,
  CommunityPost,
  AnalyticsData,
} from '../features/dashboard/types';

// Mock data - same as before but organized for the new structure
const mockUser: UserType = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@example.com',
  avatar: '/api/placeholder/150/150',
};

const mockSkillGroups: SkillGroup[] = [
  {
    id: '1',
    name: 'JavaScript',
    skills: [
      { id: '1', name: 'React', category: 'JavaScript', level: 'Advanced' },
      {
        id: '2',
        name: 'Node.js',
        category: 'JavaScript',
        level: 'Intermediate',
      },
      {
        id: '3',
        name: 'TypeScript',
        category: 'JavaScript',
        level: 'Intermediate',
      },
    ],
  },
  {
    id: '2',
    name: 'Database Design',
    skills: [
      {
        id: '4',
        name: 'PostgreSQL',
        category: 'Database Design',
        level: 'Intermediate',
      },
      {
        id: '5',
        name: 'MongoDB',
        category: 'Database Design',
        level: 'Beginner',
      },
    ],
  },
];

const mockOccupations: Occupation[] = [
  {
    id: '1',
    title: 'Full Stack Developer',
    matchPercentage: 92,
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    salaryRange: { min: 75000, max: 120000 },
    location: 'Remote',
  },
  {
    id: '2',
    title: 'Technical Lead',
    matchPercentage: 87,
    requiredSkills: [
      'Team Leadership',
      'Architecture Design',
      'React',
      'Mentoring',
    ],
    salaryRange: { min: 90000, max: 150000 },
    location: 'San Francisco, CA',
  },
  {
    id: '3',
    title: 'Product Manager',
    matchPercentage: 75,
    requiredSkills: [
      'Market Research',
      'Data Analysis',
      'User Experience',
      'Agile',
    ],
    salaryRange: { min: 85000, max: 140000 },
    location: 'New York, NY',
  },
  {
    id: '4',
    title: 'Senior Developer',
    matchPercentage: 70,
    requiredSkills: ['React', 'Node.js', 'System Design', 'Mentoring'],
    salaryRange: { min: 80000, max: 130000 },
    location: 'Austin, TX',
  },
];

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    type: 'course',
    description:
      'Master advanced React patterns including render props, higher-order components, and hooks.',
    progress: 65,
    estimatedTime: '8 hours',
    difficulty: 'Advanced',
    tags: ['React', 'JavaScript', 'Frontend'],
    createdAt: new Date('2024-01-15'),
    url: 'https://example.com/course',
    assignedOccupation: 'Full Stack Developer',
  },
  {
    id: '2',
    title: 'Node.js Performance Optimization',
    type: 'article',
    description:
      'Learn techniques to optimize Node.js applications for better performance.',
    progress: 100,
    estimatedTime: '2 hours',
    difficulty: 'Intermediate',
    tags: ['Node.js', 'Performance', 'Backend'],
    createdAt: new Date('2024-01-10'),
    assignedOccupation: 'Full Stack Developer',
  },
  {
    id: '3',
    title: 'Database Design Fundamentals',
    type: 'video',
    description:
      'Complete guide to designing efficient and scalable database schemas.',
    progress: 30,
    estimatedTime: '6 hours',
    difficulty: 'Beginner',
    tags: ['Database', 'SQL', 'Design'],
    createdAt: new Date('2024-01-20'),
    assignedOccupation: 'Technical Lead',
  },
  {
    id: '4',
    title: 'Leadership in Tech',
    type: 'book',
    description: 'Essential leadership skills for technical professionals.',
    progress: 0,
    estimatedTime: '12 hours',
    difficulty: 'Intermediate',
    tags: ['Leadership', 'Management', 'Career'],
    createdAt: new Date('2024-01-22'),
    assignedOccupation: 'Technical Lead',
  },
];

const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    author: { name: 'Alex Thompson', avatar: '/api/placeholder/40/40' },
    title: 'Transitioning from Frontend to Full Stack',
    content:
      'After 3 years as a frontend developer, I successfully transitioned to full stack. Here are the key skills that made the difference...',
    tags: ['career-transition', 'full-stack', 'advice'],
    likes: 24,
    comments: [
      {
        id: '1',
        author: { name: 'Maria Garcia', avatar: '/api/placeholder/40/40' },
        content: 'This is really helpful! Thanks for sharing your experience.',
        createdAt: new Date('2024-01-19'),
      },
      {
        id: '2',
        author: { name: 'John Doe', avatar: '/api/placeholder/40/40' },
        content: 'What resources did you use to learn backend development?',
        createdAt: new Date('2024-01-19'),
      },
    ],
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '2',
    author: { name: 'Maria Garcia', avatar: '/api/placeholder/40/40' },
    title: 'Learning Database Design: My Journey',
    content:
      'Database design seemed overwhelming at first, but breaking it down into these core concepts helped me master it step by step...',
    tags: ['database', 'learning', 'beginner-friendly'],
    likes: 18,
    comments: [],
    createdAt: new Date('2024-01-16'),
  },
];

const mockAnalytics: AnalyticsData = {
  totalOccupations: 12,
  totalSkills: 18,
  resourcesCompleted: 8,
  topOccupations: [
    { name: 'Full Stack Developer', matchPercentage: 92 },
    { name: 'Technical Lead', matchPercentage: 87 },
    { name: 'Product Manager', matchPercentage: 75 },
    { name: 'Senior Developer', matchPercentage: 70 },
  ],
  lastEngagedOccupation: 'Full Stack Developer',
  skillsGrowth: [
    { month: 'Sep', count: 8 },
    { month: 'Oct', count: 12 },
    { month: 'Nov', count: 15 },
    { month: 'Dec', count: 15 },
    { month: 'Jan', count: 18 },
  ],
  occupationTrends: [
    { name: 'Full Stack Dev', demand: 95, growth: 15 },
    { name: 'Data Scientist', demand: 88, growth: 22 },
    { name: 'Product Manager', demand: 82, growth: 8 },
    { name: 'DevOps Engineer', demand: 90, growth: 18 },
  ],
};

const sidebarItems = [
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'View career insights and progress tracking',
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Target,
    description: 'Manage and develop your professional skills',
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: BookOpen,
    description: 'Access learning materials and courses',
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    description: 'Connect with other professionals',
  },
  // {
  //   id: 'map',
  //   label: 'Career Map',
  //   icon: MapPin,
  //   description: 'Explore career opportunities and paths',
  // },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Manage your personal information',
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { isDark, changeMode } = useDarkMode();
  const [activeSection, setActiveSection] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserType>(mockUser);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(mockSkillGroups);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [communityPosts, setCommunityPosts] =
    useState<CommunityPost[]>(mockCommunityPosts);

  const handleUpdateUser = (updates: Partial<UserType>) => {
    setUser((prev) => ({ ...prev, ...updates }));
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

  const handleAddResource = (
    newResource: Omit<Resource, 'id' | 'createdAt'>
  ) => {
    const resource: Resource = {
      ...newResource,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setResources((prev) => [resource, ...prev]);
  };

  const handleCreateCommunityPost = (
    post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments'>
  ) => {
    const newPost: CommunityPost = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      comments: [],
      createdAt: new Date(),
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'analytics':
        return (
          <AnalyticsOverview
            analytics={mockAnalytics}
            occupations={mockOccupations}
            skills={skillGroups.flatMap((g) => g.skills)}
            resources={resources}
          />
        );
      case 'skills':
        return (
          <SkillsPage
            skillGroups={skillGroups}
            occupations={mockOccupations}
            onUpdateSkillGroups={handleUpdateSkillGroups}
          />
        );
      case 'resources':
        return (
          <ResourcesHub
            resources={resources}
            occupations={mockOccupations}
            onUpdateProgress={handleUpdateResourceProgress}
            onAddResource={handleAddResource}
          />
        );
      case 'community':
        return (
          <CommunityExplore
            posts={communityPosts}
            onCreatePost={handleCreateCommunityPost}
            onLikePost={handleLikePost}
          />
        );
      // case 'map':
      //   return <MapSection />;
      case 'profile':
        return (
          <ProfilePage
            user={user}
            onUpdateUser={handleUpdateUser}
            skillGroups={skillGroups}
            onUpdateSkillGroups={handleUpdateSkillGroups}
          />
        );
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div
      className={`flex h-screen dashboard-container ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'}`}
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
          `fixed inset-y-0 left-0 z-50 w-64 ${isDark ? 'bg-tabiya-medium border-tabiya-dark' : 'bg-white border-gray-200'} border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex-shrink-0`,
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!sidebarOpen ? 'true' : undefined}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <header
            className={`flex items-center justify-between px-6 py-6 border-b ${isDark ? 'border-tabiya-dark' : 'border-gray-200'}`}
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 rounded"
              aria-label="Go to JobCompass homepage"
            >
              <NavigationLogo />
            </button>
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden ${isDark ? 'hover:bg-tabiya-dark/50' : 'hover:bg-gray-100'} focus:ring-2 focus:ring-tabiya-accent/20`}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
            >
              <X
                className={`h-4 w-4 ${isDark ? 'text-white' : 'text-gray-600'}`}
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
                                        ? 'bg-tabiya-accent/20 text-tabiya-accent hover:bg-tabiya-accent/25 border-r-2 border-tabiya-accent'
                                        : ''
                                    }`
                                  : `text-gray-700 hover:bg-gray-100 ${
                                      isActive
                                        ? 'bg-tabiya-accent/10 text-tabiya-accent hover:bg-tabiya-accent/15 border-r-2 border-tabiya-accent'
                                        : ''
                                    }`
                              }`
                            )}
                            onClick={() => {
                              setActiveSection(item.id);
                              setSidebarOpen(false);
                            }}
                            aria-current={isActive ? 'page' : undefined}
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
                              ? 'bg-tabiya-medium text-white border-tabiya-dark'
                              : 'bg-white text-gray-900 border-gray-200'
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
            className={`px-6 py-4 border-t ${isDark ? 'border-tabiya-dark' : 'border-gray-200'}`}
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
                  className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}
                  id="user-full-name"
                >
                  {user.firstName} {user.lastName}
                </p>
                <p
                  className={`text-sm truncate ${isDark ? 'text-white/60' : 'text-gray-500'}`}
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
                    ? 'text-white/80 hover:text-tabiya-accent hover:bg-tabiya-accent/10'
                    : 'text-gray-700 hover:text-tabiya-accent hover:bg-orange-50'
                }`}
                onClick={() => navigate('/')}
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
                    ? 'text-white/80 hover:text-yellow-400 hover:bg-yellow-400/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => changeMode()}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Button>

              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                  isDark
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10'
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
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
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          } lg:hidden`}
          role="banner"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className={`focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 ${
                isDark ? 'hover:bg-tabiya-dark/50' : 'hover:bg-gray-100'
              }`}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
            >
              <Menu
                className={`h-4 w-4 ${isDark ? 'text-white' : 'text-gray-600'}`}
                aria-hidden="true"
              />
            </Button>
            <button
              onClick={() => navigate('/')}
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
            className={`focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 ${isDark ? 'hover:bg-tabiya-dark/50' : 'hover:bg-gray-100'}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <Sun
                className={`h-4 w-4 ${isDark ? 'text-white' : 'text-gray-600'}`}
                aria-hidden="true"
              />
            ) : (
              <Moon
                className={`h-4 w-4 ${isDark ? 'text-white' : 'text-gray-600'}`}
                aria-hidden="true"
              />
            )}
          </Button>
        </header>

        {/* Content area */}
        <main
          className={`flex-1 overflow-auto w-full ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'}`}
          role="main"
          aria-labelledby="main-heading"
        >
          <div className="w-full h-full">
            <div className="p-6 w-full">
              <div className="mb-6 hidden lg:flex lg:items-center lg:justify-between">
                <div>
                  <h1
                    id="main-heading"
                    className={`text-3xl font-bold tracking-tight capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {activeSection}
                  </h1>
                  <p
                    className={`mt-1 ${isDark ? 'text-white/70' : 'text-gray-600'}`}
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
                      ? 'text-white/80 hover:text-yellow-400 hover:bg-yellow-400/10'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
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
    </div>
  );
}

export default Dashboard;
