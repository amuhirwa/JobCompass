// Frontend API Integration Examples for JobCompass

// Base API URL - update this for production
const API_BASE_URL = "http://127.0.0.1:8000/api";

// API Client Class
class JobCompassAPI {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("access_token");
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication Methods
  async register(userData) {
    return this.apiCall("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(username, password) {
    const response = await this.apiCall("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (response.tokens) {
      this.setToken(response.tokens.access);
    }

    return response;
  }

  async refreshToken(refreshToken) {
    return this.apiCall("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async getProfile() {
    return this.apiCall("/auth/profile/");
  }

  // Search Methods
  async universalSearch(query) {
    return this.apiCall(`/taxonomy/search/?q=${encodeURIComponent(query)}`);
  }

  async searchSkills(query, filters = {}) {
    let url = "/taxonomy/skills/";
    const params = new URLSearchParams();

    if (query) params.append("search", query);
    if (filters.skill_type) params.append("skill_type", filters.skill_type);
    if (filters.reuse_level) params.append("reuse_level", filters.reuse_level);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.apiCall(url);
  }

  async searchOccupations(query, filters = {}) {
    let url = "/taxonomy/occupations/";
    const params = new URLSearchParams();

    if (query) params.append("search", query);
    if (filters.occupation_type)
      params.append("occupation_type", filters.occupation_type);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.apiCall(url);
  }

  // Skill Mapping Methods
  async getSkillMappingData(skillId) {
    return this.apiCall(`/taxonomy/skill-mapping/?skill_id=${skillId}`);
  }

  async getSkillSuggestions(skillId) {
    return this.apiCall(`/taxonomy/skill-suggestions/?skill_id=${skillId}`);
  }

  // Statistics and Analytics
  async getTaxonomyStats() {
    return this.apiCall("/taxonomy/stats/");
  }

  async getPopularSkills() {
    return this.apiCall("/taxonomy/popular-skills/");
  }

  // Individual Entity Methods
  async getSkill(skillId) {
    return this.apiCall(`/taxonomy/skills/${skillId}/`);
  }

  async getOccupation(occupationId) {
    return this.apiCall(`/taxonomy/occupations/${occupationId}/`);
  }

  async getSkillGroups() {
    return this.apiCall("/taxonomy/skill-groups/");
  }

  async getOccupationGroups() {
    return this.apiCall("/taxonomy/occupation-groups/");
  }

  // Relations
  async getSkillRelations() {
    return this.apiCall("/taxonomy/skill-relations/");
  }

  async getOccupationSkillRelations() {
    return this.apiCall("/taxonomy/occupation-skill-relations/");
  }
}

// Usage Examples

// Initialize the API client
const api = new JobCompassAPI();

// Example 1: Search functionality for the frontend
async function handleSearch(query) {
  try {
    const results = await api.universalSearch(query);
    console.log("Search results:", results);

    // Update UI with results
    displaySearchResults(results.skills, results.occupations);
  } catch (error) {
    console.error("Search failed:", error);
    showErrorMessage("Search failed. Please try again.");
  }
}

// Example 2: Load skill mapping data for visualization
async function loadSkillMapping(skillId) {
  try {
    const mappingData = await api.getSkillMappingData(skillId);
    console.log("Skill mapping data:", mappingData);

    // Use this data to create network visualization
    createSkillNetworkVisualization(mappingData.nodes, mappingData.edges);
  } catch (error) {
    console.error("Failed to load skill mapping:", error);
  }
}

// Example 3: Load dashboard statistics
async function loadDashboardStats() {
  try {
    const [stats, popularSkills] = await Promise.all([
      api.getTaxonomyStats(),
      api.getPopularSkills(),
    ]);

    console.log("Taxonomy stats:", stats);
    console.log("Popular skills:", popularSkills);

    // Update dashboard UI
    updateStatsDisplay(stats);
    displayPopularSkills(popularSkills);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
}

// Example 4: Advanced skill search with filters
async function advancedSkillSearch(query, filters) {
  try {
    const results = await api.searchSkills(query, {
      skill_type: filters.skillType,
      reuse_level: filters.reuseLevel,
    });

    console.log("Filtered skill results:", results);
    displaySkillResults(results.results);
  } catch (error) {
    console.error("Advanced search failed:", error);
  }
}

// Example 5: User authentication flow
async function handleLogin(username, password) {
  try {
    const response = await api.login(username, password);
    console.log("Login successful:", response.user);

    // Redirect to dashboard or update UI
    window.location.href = "/dashboard";
  } catch (error) {
    console.error("Login failed:", error);
    showErrorMessage("Invalid credentials");
  }
}

// React Hook Examples

// Custom hook for search functionality
function useSearch() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.universalSearch(query);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}

// Custom hook for skill mapping
function useSkillMapping(skillId) {
  const [mappingData, setMappingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!skillId) return;

    const loadMapping = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await api.getSkillMappingData(skillId);
        setMappingData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMapping();
  }, [skillId]);

  return { mappingData, loading, error };
}

// Export the API client for use in other modules
export default JobCompassAPI;
