import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User,
  Target,
  Zap,
  BookOpen,
  MapPin,
  Users,
  BarChart3,
  Home,
} from 'lucide-react';

import {
  ProfileSection,
  SkillsManagement,
  SkillsMatching,
  ResourcesHub,
  MapSection,
  CommunityExplore,
  AnalyticsSection,
} from './components';

import type {
  User as UserType,
  SkillGroup,
  Occupation,
  Skill,
  Resource,
  CommunityPost,
  AnalyticsData,
} from './types';

// Mock data - in a real app, this would come from your API/state management
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
    ],
  },
  {
    id: '2',
    name: 'Database Design',
    skills: [
      {
        id: '3',
        name: 'PostgreSQL',
        category: 'Database Design',
        level: 'Intermediate',
      },
      {
        id: '4',
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
];

const mockRelatedSkills: Skill[] = [
  {
    id: '5',
    name: 'TypeScript',
    category: 'JavaScript',
    level: 'Intermediate',
  },
  { id: '6', name: 'Docker', category: 'DevOps', level: 'Beginner' },
  { id: '7', name: 'AWS', category: 'Cloud', level: 'Beginner' },
  { id: '8', name: 'GraphQL', category: 'API Design', level: 'Intermediate' },
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
    comments: [],
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
  totalSkills: 15,
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

export function Dashboard() {
  const [user, setUser] = useState<UserType>(mockUser);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(mockSkillGroups);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [communityPosts, setCommunityPosts] =
    useState<CommunityPost[]>(mockCommunityPosts);

  // Get all selected skills
  const selectedSkills = skillGroups.flatMap((group) => group.skills);

  // Handlers
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

  const tabItems = [
    {
      value: 'overview',
      label: 'Overview',
      icon: Home,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome back, {user.firstName}!
              </CardTitle>
              <CardDescription>
                Here's what's happening with your career development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">
                    {selectedSkills.length} Skills
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    In your profile
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold">
                    {mockOccupations[0]?.matchPercentage}% Match
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Top career match
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold">
                    {resources.filter((r) => r.progress === 100).length}{' '}
                    Completed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Learning resources
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <SkillsMatching
            selectedSkills={selectedSkills}
            relatedOccupations={mockOccupations}
            relatedSkills={mockRelatedSkills}
          />
        </div>
      ),
    },
    {
      value: 'profile',
      label: 'Profile',
      icon: User,
      content: <ProfileSection user={user} onUpdateUser={handleUpdateUser} />,
    },
    {
      value: 'skills',
      label: 'Skills',
      icon: Target,
      content: (
        <div className="space-y-6">
          <SkillsManagement
            skillGroups={skillGroups}
            onUpdateSkillGroups={handleUpdateSkillGroups}
          />
          <SkillsMatching
            selectedSkills={selectedSkills}
            relatedOccupations={mockOccupations}
            relatedSkills={mockRelatedSkills}
          />
        </div>
      ),
    },
    {
      value: 'resources',
      label: 'Resources',
      icon: BookOpen,
      content: (
        <ResourcesHub
          resources={resources}
          onUpdateProgress={handleUpdateResourceProgress}
        />
      ),
    },
    {
      value: 'map',
      label: 'Job Map',
      icon: MapPin,
      content: <MapSection />,
    },
    {
      value: 'community',
      label: 'Community',
      icon: Users,
      content: (
        <CommunityExplore
          posts={communityPosts}
          onCreatePost={handleCreateCommunityPost}
          onLikePost={handleLikePost}
        />
      ),
    },
    {
      value: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      content: <AnalyticsSection analytics={mockAnalytics} />,
    },
  ];

  return (
    <div className="w-full min-h-screen py-6 px-4 lg:px-6 xl:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your skills, explore careers, and accelerate your professional
            growth
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-3 py-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabItems.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default Dashboard;
