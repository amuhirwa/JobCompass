// Dashboard related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SkillGroup {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Occupation {
  id: string;
  title: string;
  matchPercentage: number;
  requiredSkills: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  location?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'course' | 'article' | 'video' | 'book' | 'certification';
  description: string;
  url?: string;
  progress: number; // 0-100
  estimatedTime?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  createdAt: Date;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
}

export interface AnalyticsData {
  totalOccupations: number;
  totalSkills: number;
  resourcesCompleted: number;
  topOccupations: Array<{
    name: string;
    matchPercentage: number;
  }>;
  lastEngagedOccupation: string;
  skillsGrowth: Array<{
    month: string;
    count: number;
  }>;
  occupationTrends: Array<{
    name: string;
    demand: number;
    growth: number;
  }>;
}
