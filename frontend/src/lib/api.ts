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
  MarketInsight,
  CareerPath,
  LearningResource,
  GenerateAllInsightsResponse,
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
        if (error.response?.status === 401 && this.accessToken) {
          // Try to refresh token
          try {
            await this.refreshToken();
            // Retry the original request
            return this.client.request(error.config);
          } catch (refreshError) {
            // Refresh failed, redirect to login
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

  // Pagination helper
  async getPaginatedData<T>(url: string): Promise<PaginatedResponse<T>> {
    const response = await this.client.get<PaginatedResponse<T>>(url);
    return response.data;
  }
}

// Create singleton instance
export const api = new JobCompassAPI();
export default api;
