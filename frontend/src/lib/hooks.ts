import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import type {
  SkillFilters,
  OccupationFilters,
  OccupationGroupFilters,
  LoginRequest,
  RegisterRequest,
  MarketInsight,
  CareerPath,
  LearningResource,
  UserLearningResource,
  CreateUserLearningResource,
  UserSkill,
  GenerateAllInsightsResponse,
  PaginatedResponse,
} from './types';

// Query Keys
export const queryKeys = {
  // Auth
  profile: ['auth', 'profile'] as const,
  
  // Taxonomy
  skills: (filters?: SkillFilters) => ['taxonomy', 'skills', filters] as const,
  skill: (id: string) => ['taxonomy', 'skill', id] as const,
  skillGroups: () => ['taxonomy', 'skillGroups'] as const,
  skillGroup: (id: string) => ['taxonomy', 'skillGroup', id] as const,
  
  occupations: (filters?: OccupationFilters) => ['taxonomy', 'occupations', filters] as const,
  occupation: (id: string) => ['taxonomy', 'occupation', id] as const,
  occupationGroups: (filters?: OccupationGroupFilters) => ['taxonomy', 'occupationGroups', filters] as const,
  occupationGroup: (id: string) => ['taxonomy', 'occupationGroup', id] as const,
  
  // Search and Analytics
  search: (query: string) => ['taxonomy', 'search', query] as const,
  stats: () => ['taxonomy', 'stats'] as const,
  popularSkills: () => ['taxonomy', 'popularSkills'] as const,
  skillSuggestions: (skillId: string) => ['taxonomy', 'skillSuggestions', skillId] as const,
  skillMapping: (skillId: string) => ['taxonomy', 'skillMapping', skillId] as const,
  
  // Model Info
  modelInfo: () => ['taxonomy', 'modelInfo'] as const,
} as const;

// Authentication Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => api.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: RegisterRequest) => api.register(userData),
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => api.getProfile(),
    enabled: !!localStorage.getItem('access_token'), // Only fetch if logged in
    retry: false,
  });
};

// Skills Hooks
export const useSkills = (filters?: SkillFilters) => {
  return useQuery({
    queryKey: queryKeys.skills(filters),
    queryFn: () => api.getSkills(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSkill = (id: string) => {
  return useQuery({
    queryKey: queryKeys.skill(id),
    queryFn: () => api.getSkill(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSkillGroups = () => {
  return useQuery({
    queryKey: queryKeys.skillGroups(),
    queryFn: () => api.getSkillGroups(),
    staleTime: 30 * 60 * 1000, // 30 minutes - skill groups change rarely
  });
};

export const useSkillGroup = (id: string) => {
  return useQuery({
    queryKey: queryKeys.skillGroup(id),
    queryFn: () => api.getSkillGroup(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
};

// Occupations Hooks
export const useOccupations = (filters?: OccupationFilters) => {
  return useQuery({
    queryKey: queryKeys.occupations(filters),
    queryFn: () => api.getOccupations(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOccupation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.occupation(id),
    queryFn: () => api.getOccupation(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useOccupationGroups = (filters?: OccupationGroupFilters) => {
  return useQuery({
    queryKey: queryKeys.occupationGroups(filters),
    queryFn: () => api.getOccupationGroups(filters),
    staleTime: 30 * 60 * 1000,
  });
};

export const useOccupationGroup = (id: string) => {
  return useQuery({
    queryKey: queryKeys.occupationGroup(id),
    queryFn: () => api.getOccupationGroup(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
};

// Search Hooks
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => api.universalSearch(query),
    enabled: !!query && query.length >= 2, // Only search if query is at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Analytics Hooks
export const useTaxonomyStats = () => {
  return useQuery({
    queryKey: queryKeys.stats(),
    queryFn: () => api.getTaxonomyStats(),
    staleTime: 60 * 60 * 1000, // 1 hour - stats don't change frequently
  });
};

export const usePopularSkills = () => {
  return useQuery({
    queryKey: queryKeys.popularSkills(),
    queryFn: () => api.getPopularSkills(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useSkillSuggestions = (skillId: string) => {
  return useQuery({
    queryKey: queryKeys.skillSuggestions(skillId),
    queryFn: () => api.getSkillSuggestions(skillId),
    enabled: !!skillId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Skill Mapping Hook
export const useSkillMapping = (skillId: string) => {
  return useQuery({
    queryKey: queryKeys.skillMapping(skillId),
    queryFn: () => api.getSkillMappingData(skillId),
    enabled: !!skillId,
    staleTime: 10 * 60 * 1000,
  });
};

// Model Info Hook
export const useModelInfo = () => {
  return useQuery({
    queryKey: queryKeys.modelInfo(),
    queryFn: () => api.getModelInfo(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Custom hook for debounced search
import { useState, useEffect } from 'react';

export const useDebouncedSearch = (initialQuery = '', delay = 300) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // keep query in sync if initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
    setDebouncedQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  const searchResults = useSearch(debouncedQuery);

  return {
    query,
    setQuery,
    debouncedQuery,
    ...searchResults,
  };
};

// Custom hook for infinite scroll (for pagination)
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteSkills = (filters?: SkillFilters) => {
  return useInfiniteQuery<PaginatedResponse<any>, Error>({
    queryKey: ['taxonomy', 'skills', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => 
      api.getSkills({ ...filters, page: pageParam as number }),
    getNextPageParam: (lastPage: PaginatedResponse<any>) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const page = url.searchParams.get('page');
        return page ? parseInt(page, 10) : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteOccupations = (filters?: OccupationFilters) => {
  return useInfiniteQuery<PaginatedResponse<any>, Error>({
    queryKey: ['taxonomy', 'occupations', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => 
      api.getOccupations({ ...filters, page: pageParam as number }),
    getNextPageParam: (lastPage: PaginatedResponse<any>) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const page = url.searchParams.get('page');
        return page ? parseInt(page, 10) : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// AI Services Hooks
export const aiQueryKeys = {
  marketInsights: (occupationId: string) => ['ai', 'marketInsights', occupationId] as const,
  careerPaths: (occupationId: string) => ['ai', 'careerPaths', occupationId] as const,
  learningResources: (skillId: string) => ['ai', 'learningResources', skillId] as const,
} as const;

export const useMarketInsights = (occupationId: string) => {
  return useQuery<MarketInsight, Error>({
    queryKey: aiQueryKeys.marketInsights(occupationId),
    queryFn: () => api.getMarketInsights(occupationId),
    enabled: !!occupationId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useGenerateMarketInsights = () => {
  const queryClient = useQueryClient();
  
  return useMutation<MarketInsight, Error, string>({
    mutationFn: (occupationId: string) => api.generateMarketInsights(occupationId),
    onSuccess: (_, occupationId) => {
      // Invalidate to trigger refetch and update UI
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.marketInsights(occupationId) });
    },
  });
};

export const useCareerPaths = (occupationId: string) => {
  return useQuery<CareerPath[], Error>({
    queryKey: aiQueryKeys.careerPaths(occupationId),
    queryFn: () => api.getCareerPaths(occupationId),
    enabled: !!occupationId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useGenerateCareerPaths = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CareerPath[], Error, string>({
    mutationFn: (occupationId: string) => api.generateCareerPaths(occupationId),
    onSuccess: (_, occupationId) => {
      // Invalidate to trigger refetch and update UI
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.careerPaths(occupationId) });
    },
  });
};

export const useLearningResources = (skillId: string) => {
  return useQuery<LearningResource[], Error>({
    queryKey: aiQueryKeys.learningResources(skillId),
    queryFn: () => api.getLearningResources(skillId),
    enabled: !!skillId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useGenerateLearningResources = () => {
  const queryClient = useQueryClient();
  
  return useMutation<LearningResource[], Error, string>({
    mutationFn: (skillId: string) => api.generateLearningResources(skillId),
    onSuccess: (_, skillId) => {
      // Invalidate to trigger refetch and update UI
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.learningResources(skillId) });
    },
  });
};

export const useGenerateAllInsights = () => {
  const queryClient = useQueryClient();
  
  return useMutation<GenerateAllInsightsResponse, Error, string>({
    mutationFn: (occupationId: string) => api.generateAllInsights(occupationId),
    onSuccess: (_, occupationId) => {
      // Invalidate to trigger refetch and update UI
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.marketInsights(occupationId) });
      queryClient.invalidateQueries({ queryKey: aiQueryKeys.careerPaths(occupationId) });
    },
  });
};

// User Learning Resources Hooks
export const useUserResources = (params?: {
  status?: string;
  skill?: string;
  goal?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['userResources', params],
    queryFn: () => api.getUserResources(params),
  });
};

export const useCreateUserResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserLearningResource) => api.createUserResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userResources'] });
    },
  });
};

export const useUpdateUserResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ resourceId, data }: { resourceId: string; data: Partial<UserLearningResource> }) => 
      api.updateUserResource(resourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userResources'] });
    },
  });
};

export const useDeleteUserResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (resourceId: string) => api.deleteUserResource(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userResources'] });
    },
  });
};

export const useResourceStats = () => {
  return useQuery({
    queryKey: ['resourceStats'],
    queryFn: () => api.getResourceStats(),
  });
};

// User Skills Hooks
export const useUserSkills = () => {
  return useQuery({
    queryKey: ['userSkills'],
    queryFn: () => api.getUserSkills(),
  });
};

export const useAddUserSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (skillData: Partial<UserSkill> & { skill_id: string }) => api.addUserSkill(skillData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
    },
  });
};

export const useUpdateUserSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ skillId, data }: { skillId: string; data: Partial<UserSkill> }) => 
      api.updateUserSkill(skillId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
    },
  });
};

export const useDeleteUserSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (skillId: string) => api.deleteUserSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
    },
  });
};
