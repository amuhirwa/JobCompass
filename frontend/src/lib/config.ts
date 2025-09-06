// Environment variables configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  API_TIMEOUT: 300000, // 5 minutes for AI operations
  ENABLE_DEVTOOLS: import.meta.env.DEV,
} as const;

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    refresh: '/auth/refresh/',
    profile: '/auth/profile/',
  },
  // Taxonomy
  taxonomy: {
    // Core entities
    skills: '/taxonomy/skills/',
    skillDetail: (id: string) => `/taxonomy/skills/${id}/`,
    skillGroups: '/taxonomy/skill-groups/',
    skillGroupDetail: (id: string) => `/taxonomy/skill-groups/${id}/`,
    occupations: '/taxonomy/occupations/',
    occupationDetail: (id: string) => `/taxonomy/occupations/${id}/`,
    occupationGroups: '/taxonomy/occupation-groups/',
    occupationGroupDetail: (id: string) => `/taxonomy/occupation-groups/${id}/`,
    
    // Relations
    skillRelations: '/taxonomy/skill-relations/',
    occupationSkillRelations: '/taxonomy/occupation-skill-relations/',
    
    // Hierarchies
    skillHierarchy: '/taxonomy/skill-hierarchy/',
    occupationHierarchy: '/taxonomy/occupation-hierarchy/',
    
    // Search and analytics
    search: '/taxonomy/search/',
    skillMapping: '/taxonomy/skill-mapping/',
    stats: '/taxonomy/stats/',
    popularSkills: '/taxonomy/popular-skills/',
    skillSuggestions: '/taxonomy/skill-suggestions/',
    
    // Model info
    modelInfo: '/taxonomy/model-info/',
  },
} as const;
