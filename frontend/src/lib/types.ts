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
  related_occupations: RelatedOccupation[];
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
  relation_type: 'essential' | 'optional' | '';
  signalling_value?: number;
  signalling_value_label: 'low' | 'medium' | 'high' | '';
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
  skill_groups?: SkillGroupSearchResult[];
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

export interface SkillGroupSearchResult {
  id: string;
  preferred_label: string;
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
