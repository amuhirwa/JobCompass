// TypeScript types for the API responses

export interface BaseEntity {
  id: string;
  uuid_history: string;
  uuid_history_list: string[];
  origin_uri?: string;
  created_at: string;
  updated_at: string;
}

export interface ModelInfo {
  uuid_history: string;
  name: string;
  locale: string;
  description: string;
  version: string;
  released: boolean;
  release_notes: string;
  created_at: string;
  updated_at: string;
}

export interface SkillGroup extends BaseEntity {
  code: string;
  preferred_label: string;
  alt_labels: string;
  alt_labels_list: string[];
  description: string;
  scope_note: string;
}

export interface Skill extends BaseEntity {
  skill_type: 'skill/competence' | 'knowledge' | 'language' | 'attitude' | '';
  reuse_level: 'sector-specific' | 'occupation-specific' | 'cross-sector' | 'transversal' | '';
  preferred_label: string;
  alt_labels: string;
  alt_labels_list: string[];
  description: string;
  definition: string;
  scope_note: string;
  is_localized: boolean;
  related_skills: RelatedSkill[];
  related_occupations: Occupation[];
}

export interface OccupationGroup extends BaseEntity {
  code: string;
  group_type: 'iscogroup' | 'localgroup';
  preferred_label: string;
  alt_labels: string;
  alt_labels_list: string[];
  description: string;
}

export interface Occupation extends BaseEntity {
  occupation_group_code: string;
  code: string;
  preferred_label: string;
  alt_labels: string;
  alt_labels_list: string[];
  description: string;
  definition: string;
  scope_note: string;
  regulated_profession_note: string;
  occupation_type: 'escooccupation' | 'localoccupation';
  is_localized: boolean;
  related_skills: RelatedSkillFromOccupation[];
}

export interface RelatedSkill {
  skill_id: string;
  skill_name: string;
  relation_type: 'essential' | 'optional';
}

export interface RelatedOccupation {
  occupation_id: string;
  occupation_name: string;
  occupation_type?: string;
  occupation_description?: string;
  relation_type: 'essential' | 'optional' | '';
  signalling_value?: number;
  signalling_value_label: 'low' | 'medium' | 'high' | '';
  total_skills_required?: number;
}

export interface RelatedSkillFromOccupation {
  skill_id: string;
  skill_name: string;
  relation_type: 'essential' | 'optional' | '';
  signalling_value?: number;
  signalling_value_label: 'low' | 'medium' | 'high' | '';
}

export interface SkillToSkillRelation {
  requiring_skill: string;
  requiring_skill_name: string;
  required_skill: string;
  required_skill_name: string;
  relation_type: 'essential' | 'optional';
  created_at: string;
  updated_at: string;
}

export interface OccupationToSkillRelation {
  occupation: string;
  occupation_name: string;
  skill: string;
  skill_name: string;
  relation_type: 'essential' | 'optional' | '';
  signalling_value_label: 'low' | 'medium' | 'high' | '';
  signalling_value?: number;
  created_at: string;
  updated_at: string;
}

export interface SkillHierarchy {
  parent_object_type: 'skill' | 'skillgroup';
  parent_id: string;
  child_object_type: 'skill' | 'skillgroup';
  child_id: string;
  created_at: string;
  updated_at: string;
}

export interface OccupationHierarchy {
  parent_object_type: 'occupationgroup' | 'escooccupation' | 'localoccupation';
  parent_id: string;
  child_object_type: 'occupationgroup' | 'escooccupation' | 'localoccupation';
  child_id: string;
  created_at: string;
  updated_at: string;
}

// Search and analytics types
export interface SearchResults {
  skills: SkillSearchResult[];
  occupations: OccupationSearchResult[];
}

export interface SkillSearchResult {
  id: string;
  preferred_label: string;
  skill_type: string;
  reuse_level: string;
  description: string;
}

export interface OccupationSearchResult {
  id: string;
  preferred_label: string;
  occupation_type: string;
  description: string;
}

export interface TaxonomyStats {
  total_skills: number;
  total_occupations: number;
  total_skill_groups: number;
  total_occupation_groups: number;
  total_skill_relations: number;
  total_occupation_skill_relations: number;
  skills_by_type: Record<string, number>;
  skills_by_reuse_level: Record<string, number>;
  occupations_by_type: Record<string, number>;
}

export interface PopularSkill {
  id: string;
  preferred_label: string;
  skill_type: string;
  reuse_level: string;
  occupation_count: number;
  description: string;
}

export interface SkillSuggestion {
  id: string;
  preferred_label: string;
  skill_type: string;
  reuse_level: string;
  common_occupation_count: number;
  description: string;
}

// Skill mapping visualization types
export interface SkillMappingData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  center_skill: {
    id: string;
    name: string;
    description: string;
  };
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'skill' | 'occupation';
  group: 'central' | 'related_skill' | 'related_occupation';
  skill_type?: string;
  reuse_level?: string;
  occupation_type?: string;
}

export interface NetworkEdge {
  from: string;
  to: string;
  label: string;
  type: 'skill_relation' | 'occupation_skill_relation';
  signalling_value?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Authentication types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined?: string;
  last_login?: string;
}

export interface UserProfile {
  id: string;
  user: User;
  onboarding_completed: boolean;
  onboarding_step: number;
  bio?: string;
  location?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  current_occupation?: OccupationSummary;
  target_occupation?: OccupationSummary;
  experience_level?: 'entry' | 'junior' | 'mid' | 'senior' | 'lead';
  career_goal?: 'switch_career' | 'advance_current' | 'skill_development' | 'leadership' | 'entrepreneurship' | 'freelance' | 'other';
  skills: UserSkill[];
  goals: UserGoal[];
  created_at: string;
  updated_at: string;
}

export interface UserSkill {
  id: string;
  skill: SkillSummary;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserGoal {
  id: string;
  title: string;
  description?: string;
  goal_type: 'skill' | 'certification' | 'career_change' | 'promotion' | 'salary_increase' | 'project' | 'other';
  target_skill?: SkillSummary;
  target_occupation?: OccupationSummary;
  target_date?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface SkillSummary {
  id: string;
  preferred_label: string;
  skill_type: string;
  related_occupations?: RelatedOccupation[];
}

export interface OccupationSummary {
  id: string;
  preferred_label: string;
  occupation_type: string;
}

export interface OnboardingStepData {
  step: number;
  data: Record<string, any>;
}

export interface DashboardData {
  profile: UserProfile;
  stats: {
    skills_count: number;
    goals_count: number;
    completed_goals: number;
    in_progress_goals: number;
  };
  recent_goals: UserGoal[];
  primary_skills: UserSkill[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  profile?: UserProfile;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

// API Error types
export interface APIError {
  error: string;
  details?: Record<string, any>;
}

// Search filters
export interface SkillFilters {
  search?: string;
  skill_type?: string;
  reuse_level?: string;
  page?: number;
  page_size?: number;
}

export interface OccupationFilters {
  search?: string;
  occupation_type?: string;
  page?: number;
  page_size?: number;
}

export interface OccupationGroupFilters {
  search?: string;
  group_type?: string;
  page?: number;
  page_size?: number;
}

// AI Services Types
export interface MarketInsight {
  id: string;
  average_salary: number;
  growth_rate: number;
  remote_opportunities_percentage: number;
  demand_level: 'low' | 'medium' | 'high' | 'very_high';
  market_trends: string;
  key_regions: string[];
  industry_outlook: string;
  created_at: string;
  updated_at: string;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  resource_type: 'course' | 'book' | 'tutorial' | 'certification' | 'bootcamp' | 'workshop' | 'documentation' | 'practice';
  url: string;
  provider: string;
  duration: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_free: boolean;
  rating: number | null;
  cost: string;
}

export interface CareerStepSkill {
  id: string;
  skill: Skill;
  importance_level: 'essential' | 'important' | 'helpful' | 'optional';
  proficiency_level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  learning_resources: LearningResource[];
}

export interface CareerStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  estimated_duration: string;
  requirements: string;
  typical_salary_range: string;
  required_skills: CareerStepSkill[];
}

export interface CareerPath {
  id: string;
  path_name: string;
  description: string;
  estimated_duration: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  steps: CareerStep[];
}

export interface GenerateAllInsightsResponse {
  market_insights: MarketInsight;
  career_paths: CareerPath[];
}

// Community types
export interface CommunityAuthor {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

export interface CommunityComment {
  id: string;
  author: CommunityAuthor;
  content: string;
  parent?: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  replies?: CommunityComment[];
}

export interface CommunityPost {
  id: string;
  author: CommunityAuthor;
  title: string;
  content: string;
  post_type: 'question' | 'discussion' | 'resource' | 'achievement' | 'tip';
  tags: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  comments?: CommunityComment[];
  is_liked?: boolean;
}

export interface CreateCommunityPost {
  title: string;
  content: string;
  post_type: 'question' | 'discussion' | 'resource' | 'achievement' | 'tip';
  tags: string[];
}

export interface CreateCommunityComment {
  content: string;
  parent?: string | null;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  creator: CommunityAuthor;
  is_private: boolean;
  tags: string[];
  created_at: string;
  members_count: number;
  is_member: boolean;
}

// Learning Resources Types
export interface UserLearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  resource_type: 'course' | 'video' | 'article' | 'book' | 'podcast' | 'tutorial' | 'documentation' | 'practice' | 'certification';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  provider: string;
  duration: string;
  cost: number;
  is_free: boolean;
  rating: number;
  status: 'planned' | 'in_progress' | 'completed' | 'paused';
  progress_percentage: number;
  time_spent_minutes: number;
  time_spent_hours: number;
  started_at: string | null;
  completed_at: string | null;
  related_skill: string | null;
  related_skill_name: string | null;
  related_goal: string | null;
  related_goal_title: string | null;
  ai_generated: boolean;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserLearningResource {
  title: string;
  description: string;
  url: string;
  resource_type: UserLearningResource['resource_type'];
  difficulty_level: UserLearningResource['difficulty_level'];
  provider: string;
  duration: string;
  cost: number;
  is_free: boolean;
  rating: number;
  related_skill?: string;
  related_goal?: string;
}

export interface UserResourceProgress {
  id: string;
  resource: string;
  resource_title: string;
  session_date: string;
  session_duration_minutes: number;
  progress_before: number;
  progress_after: number;
  progress_change: number;
  notes: string;
}

export interface ResourceStats {
  total_resources: number;
  status_breakdown: {
    completed: number;
    in_progress: number;
    planned: number;
  };
  time_stats: {
    total_hours: number;
    total_minutes: number;
    weekly_hours: number;
    weekly_sessions: number;
  };
  progress: {
    average_completion: number;
    completion_rate: number;
  };
  breakdown: {
    by_difficulty: Array<{ difficulty_level: string; count: number }>;
    by_type: Array<{ resource_type: string; count: number }>;
  };
}

// Chatbot Types
export interface ChatbotResponse {
  message: string;
  response: string;
  context_type: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: number;
  isUser: boolean;
}
