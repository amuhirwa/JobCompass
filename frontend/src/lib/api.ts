import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { config } from './config';
import type {
  PaginatedResponse,
  SearchResults,
  TaxonomyStats,
  PopularSkill,
  SkillSuggestion,
  SkillMappingData,
  Skill,
  Occupation,
  SkillGroup,
  OccupationGroup,
  ModelInfo,
  SkillFilters,
  OccupationFilters,
  OccupationGroupFilters,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenResponse,
  User,
  UserProfile,
  UserSkill,
  UserGoal,
  OnboardingStepData,
  DashboardData,
  MarketInsight,
  CareerPath,
  LearningResource,
  GenerateAllInsightsResponse,
  CommunityPost,
  CreateCommunityPost,
  CommunityComment,
  CreateCommunityComment,
  CommunityGroup,
  UserLearningResource,
  CreateUserLearningResource,
  UserResourceProgress,
  ResourceStats,
  ChatbotResponse,
} from './types';

class JobCompassAPI {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    this.accessToken = localStorage.getItem('access_token');

    // Request interceptor to add auth header
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Prevent infinite retry loops
        if (error.response?.status === 401 && this.accessToken && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Don't try to refresh if the failing request was already a refresh attempt
          if (originalRequest.url?.includes('/auth/refresh/')) {
            this.clearAuth();
            throw error;
          }
          
          // Try to refresh token
          try {
            await this.refreshToken();
            // Update the authorization header for the retry
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            // Retry the original request
            return this.client.request(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear auth
            this.clearAuth();
            throw refreshError;
          }
        }
        throw error;
      }
    );
  }

  // Authentication methods
  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }

  clearAuth() {
    this.accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login/', credentials);
    const { tokens } = response.data;
    this.setToken(tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register/', userData);
    const { tokens } = response.data;
    this.setToken(tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    return response.data;
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.client.post<RefreshTokenResponse>('/auth/refresh/', {
      refresh: refreshToken,
    });
    
    this.setToken(response.data.access);
    return response.data;
  }

  async getProfile(): Promise<{ user: User }> {
    const response = await this.client.get<{ user: User }>('/auth/profile/');
    return response.data;
  }

  // Search methods
  async universalSearch(query: string): Promise<SearchResults> {
    const response = await this.client.get<SearchResults>('/taxonomy/search/', {
      params: { q: query },
    });
    return response.data;
  }

  // Skills API
  async getSkills(filters: SkillFilters = {}): Promise<PaginatedResponse<Skill>> {
    const response = await this.client.get<PaginatedResponse<Skill>>('/taxonomy/skills/', {
      params: filters,
    });
    return response.data;
  }

  async getSkill(id: string): Promise<Skill> {
    const response = await this.client.get<Skill>(`/taxonomy/skills/${id}/`);
    return response.data;
  }

  async getSkillGroups(): Promise<PaginatedResponse<SkillGroup>> {
    const response = await this.client.get<PaginatedResponse<SkillGroup>>('/taxonomy/skill-groups/');
    return response.data;
  }

  async getSkillGroup(id: string): Promise<SkillGroup> {
    const response = await this.client.get<SkillGroup>(`/taxonomy/skill-groups/${id}/`);
    return response.data;
  }

  // Occupations API
  async getOccupations(filters: OccupationFilters = {}): Promise<PaginatedResponse<Occupation>> {
    const response = await this.client.get<PaginatedResponse<Occupation>>('/taxonomy/occupations/', {
      params: filters,
    });
    return response.data;
  }

  async getOccupation(id: string): Promise<Occupation> {
    const response = await this.client.get<Occupation>(`/taxonomy/occupations/${id}/`);
    return response.data;
  }

  async getOccupationGroups(filters: OccupationGroupFilters = {}): Promise<PaginatedResponse<OccupationGroup>> {
    const response = await this.client.get<PaginatedResponse<OccupationGroup>>('/taxonomy/occupation-groups/', {
      params: filters,
    });
    return response.data;
  }

  async getOccupationGroup(id: string): Promise<OccupationGroup> {
    const response = await this.client.get<OccupationGroup>(`/taxonomy/occupation-groups/${id}/`);
    return response.data;
  }

  // Analytics API
  async getTaxonomyStats(): Promise<TaxonomyStats> {
    const response = await this.client.get<TaxonomyStats>('/taxonomy/stats/');
    return response.data;
  }

  async getPopularSkills(): Promise<PopularSkill[]> {
    const response = await this.client.get<PopularSkill[]>('/taxonomy/popular-skills/');
    return response.data;
  }

  async getSkillSuggestions(skillId: string): Promise<SkillSuggestion[]> {
    const response = await this.client.get<SkillSuggestion[]>('/taxonomy/skill-suggestions/', {
      params: { skill_id: skillId },
    });
    return response.data;
  }

  // Skill mapping API
  async getSkillMappingData(skillId: string): Promise<SkillMappingData> {
    const response = await this.client.get<SkillMappingData>('/taxonomy/skill-mapping/', {
      params: { skill_id: skillId },
    });
    return response.data;
  }

  // Model info API
  async getModelInfo(): Promise<ModelInfo[]> {
    const response = await this.client.get<ModelInfo[]>('/taxonomy/model-info/');
    return response.data;
  }

  // User Profile API
  async getUserProfile(): Promise<UserProfile> {
    const response = await this.client.get<UserProfile>('/auth/profile/details/');
    return response.data;
  }

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.client.put<UserProfile>('/auth/profile/details/', data);
    return response.data;
  }

  async submitOnboardingStep(stepData: OnboardingStepData): Promise<any> {
    const response = await this.client.post('/auth/profile/onboarding/step/', stepData);
    return response.data;
  }

  async completeOnboarding(): Promise<any> {
    const response = await this.client.post('/auth/profile/onboarding/complete/');
    return response.data;
  }

  async getUserSkills(): Promise<PaginatedResponse<UserSkill>> {
    const response = await this.client.get<PaginatedResponse<UserSkill>>('/auth/profile/skills/');
    return response.data;
  }

  async addUserSkill(skillData: Partial<UserSkill> & { skill_id: string }): Promise<UserSkill> {
    const response = await this.client.post<UserSkill>('/auth/profile/skills/', skillData);
    return response.data;
  }

  async updateUserSkill(skillId: string, skillData: Partial<UserSkill>): Promise<UserSkill> {
    const response = await this.client.put<UserSkill>(`/auth/profile/skills/${skillId}/`, skillData);
    return response.data;
  }

  async deleteUserSkill(skillId: string): Promise<void> {
    await this.client.delete(`/auth/profile/skills/${skillId}/`);
  }

  async getUserGoals(): Promise<UserGoal[]> {
    const response = await this.client.get<UserGoal[]>('/auth/profile/goals/');
    return response.data;
  }

  async addUserGoal(goalData: Partial<UserGoal>): Promise<UserGoal> {
    const response = await this.client.post<UserGoal>('/auth/profile/goals/', goalData);
    return response.data;
  }

  async updateUserGoal(goalId: string, goalData: Partial<UserGoal>): Promise<UserGoal> {
    const response = await this.client.put<UserGoal>(`/auth/profile/goals/${goalId}/`, goalData);
    return response.data;
  }

  async deleteUserGoal(goalId: string): Promise<void> {
    await this.client.delete(`/auth/profile/goals/${goalId}/`);
  }

  async getDashboardData(): Promise<DashboardData> {
    const response = await this.client.get<DashboardData>('/auth/dashboard/');
    return response.data;
  }

  // AI Services API
  async getMarketInsights(occupationId: string): Promise<MarketInsight> {
    const response = await this.client.get<MarketInsight>(`/ai/occupations/${occupationId}/market-insights/`);
    return response.data;
  }

  async generateMarketInsights(occupationId: string): Promise<MarketInsight> {
    const response = await this.client.post<MarketInsight>(`/ai/occupations/${occupationId}/market-insights/`);
    return response.data;
  }

  async getCareerPaths(occupationId: string): Promise<CareerPath[]> {
    const response = await this.client.get<CareerPath[]>(`/ai/occupations/${occupationId}/career-paths/`);
    return response.data;
  }

  async generateCareerPaths(occupationId: string): Promise<CareerPath[]> {
    const response = await this.client.post<CareerPath[]>(`/ai/occupations/${occupationId}/career-paths/`);
    return response.data;
  }

  async getLearningResources(skillId: string): Promise<LearningResource[]> {
    const response = await this.client.get<LearningResource[]>(`/ai/skills/${skillId}/learning-resources/`);
    return response.data;
  }

  async generateLearningResources(skillId: string): Promise<LearningResource[]> {
    const response = await this.client.post<LearningResource[]>(`/ai/skills/${skillId}/learning-resources/`);
    return response.data;
  }

  async generateAllInsights(occupationId: string): Promise<GenerateAllInsightsResponse> {
    const response = await this.client.post<GenerateAllInsightsResponse>(`/ai/occupations/${occupationId}/generate-all/`);
    return response.data;
  }

  // Community API methods
  async getCommunityPosts(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    type?: string;
    tags?: string;
    sort?: 'recent' | 'popular' | 'trending';
  }): Promise<PaginatedResponse<CommunityPost>> {
    const response = await this.client.get<PaginatedResponse<CommunityPost>>('/community/posts/', {
      params
    });
    return response.data;
  }

  async getCommunityPost(id: string): Promise<CommunityPost> {
    const response = await this.client.get<CommunityPost>(`/community/posts/${id}/`);
    return response.data;
  }

  async createCommunityPost(post: CreateCommunityPost): Promise<CommunityPost> {
    const response = await this.client.post<CommunityPost>('/community/posts/', post);
    return response.data;
  }

  async updateCommunityPost(id: string, post: Partial<CreateCommunityPost>): Promise<CommunityPost> {
    const response = await this.client.patch<CommunityPost>(`/community/posts/${id}/`, post);
    return response.data;
  }

  async deleteCommunityPost(id: string): Promise<void> {
    await this.client.delete(`/community/posts/${id}/`);
  }

  async likeCommunityPost(id: string): Promise<{ liked: boolean; likes_count: number }> {
    const response = await this.client.post<{ liked: boolean; likes_count: number }>(`/community/posts/${id}/like/`);
    return response.data;
  }

  async getCommunityComments(postId: string): Promise<CommunityComment[]> {
    const response = await this.client.get<CommunityComment[]>(`/community/posts/${postId}/comments/`);
    return response.data;
  }

  async createCommunityComment(postId: string, comment: CreateCommunityComment): Promise<CommunityComment> {
    const response = await this.client.post<CommunityComment>(`/community/posts/${postId}/comments/`, comment);
    return response.data;
  }

  async likeCommunityComment(id: string): Promise<{ liked: boolean; likes_count: number }> {
    const response = await this.client.post<{ liked: boolean; likes_count: number }>(`/community/comments/${id}/like/`);
    return response.data;
  }

  async getTrendingTopics(): Promise<{ trending_topics: { tag: string; count: number }[] }> {
    const response = await this.client.get<{ trending_topics: { tag: string; count: number }[] }>('/community/trending/');
    return response.data;
  }

  async getCommunityStats(): Promise<{
    total_posts: number;
    total_comments: number;
    total_users: number;
    recent_posts: number;
    recent_comments: number;
  }> {
    const response = await this.client.get<{
      total_posts: number;
      total_comments: number;
      total_users: number;
      recent_posts: number;
      recent_comments: number;
    }>('/community/stats/');
    return response.data;
  }

  // Pagination helper
  async getPaginatedData<T>(url: string): Promise<PaginatedResponse<T>> {
    const response = await this.client.get<PaginatedResponse<T>>(url);
    return response.data;
  }

  // Learning Resources
  async getUserResources(params?: {
    status?: string;
    skill?: string;
    goal?: string;
    search?: string;
  }): Promise<PaginatedResponse<UserLearningResource>> {
    const response = await this.client.get<PaginatedResponse<UserLearningResource>>('/auth/resources/', { params });
    return response.data;
  }

  async createUserResource(data: CreateUserLearningResource): Promise<UserLearningResource> {
    const response = await this.client.post('/auth/resources/', data);
    return response.data;
  }

  async getUserResource(resourceId: string): Promise<UserLearningResource> {
    const response = await this.client.get(`/auth/resources/${resourceId}/`);
    return response.data;
  }

  async updateUserResource(resourceId: string, data: Partial<UserLearningResource>): Promise<UserLearningResource> {
    const response = await this.client.patch(`/auth/resources/${resourceId}/`, data);
    return response.data;
  }

  async deleteUserResource(resourceId: string): Promise<void> {
    await this.client.delete(`/auth/resources/${resourceId}/`);
  }

  async updateResourceProgress(
    resourceId: string, 
    data: {
      progress_percentage?: number;
      status?: string;
      time_spent_minutes?: number;
      session_duration_minutes?: number;
      notes?: string;
    }
  ): Promise<UserLearningResource> {
    const response = await this.client.post(`/auth/resources/${resourceId}/progress/`, data);
    return response.data;
  }

  async getResourceProgress(resourceId: string): Promise<UserResourceProgress[]> {
    const response = await this.client.get(`/auth/resources/${resourceId}/sessions/`);
    return response.data;
  }

  async getResourceStats(): Promise<ResourceStats> {
    const response = await this.client.get('/auth/resources/stats/');
    return response.data;
  }

  // Chatbot
  async sendChatMessage(
    message: string,
    contextType: string = 'general',
    contextData: any = {}
  ): Promise<ChatbotResponse> {
    const response = await this.client.post('/ai/chatbot/', {
      message,
      context_type: contextType,
      context_data: contextData,
    });
    return response.data;
  }
}

// Create singleton instance
export const api = new JobCompassAPI();
export default api;
