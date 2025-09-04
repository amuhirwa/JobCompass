// Example React components showing how to integrate with the JobCompass backend

import React, { useState, useEffect } from "react";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Custom hook for API calls
function useAPI() {
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    return response.json();
  };

  return { apiCall };
}

// 1. Search Component for Universal Search
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { apiCall } = useAPI();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await apiCall(
        `/taxonomy/search/?q=${encodeURIComponent(query)}`
      );
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-component">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills or occupations..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {results && (
        <div className="results">
          <div className="skills-section mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Skills ({results.skills?.length || 0})
            </h3>
            <div className="grid gap-2">
              {results.skills?.map((skill) => (
                <div key={skill.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{skill.preferred_label}</h4>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                  <div className="flex gap-2 mt-2">
                    {skill.skill_type && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {skill.skill_type}
                      </span>
                    )}
                    {skill.reuse_level && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {skill.reuse_level}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="occupations-section">
            <h3 className="text-lg font-semibold mb-2">
              Occupations ({results.occupations?.length || 0})
            </h3>
            <div className="grid gap-2">
              {results.occupations?.map((occupation) => (
                <div key={occupation.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{occupation.preferred_label}</h4>
                  <p className="text-sm text-gray-600">
                    {occupation.description}
                  </p>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded mt-2 inline-block">
                    {occupation.occupation_type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Statistics Dashboard Component
function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [popularSkills, setPopularSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useAPI();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, skillsData] = await Promise.all([
          apiCall("/taxonomy/stats/"),
          apiCall("/taxonomy/popular-skills/"),
        ]);
        setStats(statsData);
        setPopularSkills(skillsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="stats-dashboard">
      <h2 className="text-2xl font-bold mb-6">Taxonomy Overview</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-blue-600">
            {stats?.total_skills || 0}
          </h3>
          <p className="text-gray-600">Total Skills</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-green-600">
            {stats?.total_occupations || 0}
          </h3>
          <p className="text-gray-600">Total Occupations</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-purple-600">
            {stats?.total_skill_groups || 0}
          </h3>
          <p className="text-gray-600">Skill Groups</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-orange-600">
            {stats?.total_occupation_skill_relations || 0}
          </h3>
          <p className="text-gray-600">Relations</p>
        </div>
      </div>

      {/* Popular Skills */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Most Popular Skills</h3>
        <div className="grid gap-3">
          {popularSkills.slice(0, 10).map((skill) => (
            <div
              key={skill.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium">{skill.preferred_label}</h4>
                <p className="text-sm text-gray-600">{skill.description}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold text-blue-600">
                  {skill.occupation_count}
                </span>
                <p className="text-xs text-gray-500">occupations</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Types Distribution */}
      {stats?.skills_by_type && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Skills by Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(stats.skills_by_type).map(([type, count]) => (
              <div key={type} className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">
                  {type || "Not Specified"}
                </h4>
                <p className="text-2xl font-bold text-gray-700">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Skill Detail Component with Suggestions
function SkillDetail({ skillId }) {
  const [skill, setSkill] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useAPI();

  useEffect(() => {
    if (!skillId) return;

    const loadSkillData = async () => {
      try {
        const [skillData, suggestionsData] = await Promise.all([
          apiCall(`/taxonomy/skills/${skillId}/`),
          apiCall(`/taxonomy/skill-suggestions/?skill_id=${skillId}`),
        ]);
        setSkill(skillData);
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error("Failed to load skill data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSkillData();
  }, [skillId]);

  if (loading) {
    return <div>Loading skill details...</div>;
  }

  if (!skill) {
    return <div>Skill not found</div>;
  }

  return (
    <div className="skill-detail">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{skill.preferred_label}</h1>
        <p className="text-gray-600 mb-4">{skill.description}</p>

        <div className="flex gap-2 mb-4">
          {skill.skill_type && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {skill.skill_type}
            </span>
          )}
          {skill.reuse_level && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {skill.reuse_level}
            </span>
          )}
        </div>

        {skill.alt_labels_list && skill.alt_labels_list.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Alternative Labels:</h3>
            <div className="flex flex-wrap gap-2">
              {skill.alt_labels_list.map((label, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Occupations */}
      {skill.related_occupations && skill.related_occupations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Related Occupations</h3>
          <div className="grid gap-3">
            {skill.related_occupations.map((rel) => (
              <div key={rel.occupation_id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{rel.occupation_name}</h4>
                <div className="flex gap-2 mt-2">
                  {rel.relation_type && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {rel.relation_type}
                    </span>
                  )}
                  {rel.signalling_value_label && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      {rel.signalling_value_label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3">
            Suggested Related Skills
          </h3>
          <div className="grid gap-3">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{suggestion.preferred_label}</h4>
                <p className="text-sm text-gray-600">
                  {suggestion.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Found together in {suggestion.common_occupation_count}{" "}
                  occupations
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 4. Skill Network Visualization Component (pseudo-code)
function SkillNetworkVisualization({ skillId }) {
  const [networkData, setNetworkData] = useState(null);
  const { apiCall } = useAPI();

  useEffect(() => {
    if (!skillId) return;

    const loadNetworkData = async () => {
      try {
        const data = await apiCall(
          `/taxonomy/skill-mapping/?skill_id=${skillId}`
        );
        setNetworkData(data);
      } catch (error) {
        console.error("Failed to load network data:", error);
      }
    };

    loadNetworkData();
  }, [skillId]);

  // This would integrate with a visualization library like D3.js, vis.js, or Cytoscape.js
  const renderNetwork = () => {
    if (!networkData) return null;

    // Pseudo-code for network visualization
    // You would use a library like vis.js here:
    /*
    const nodes = new vis.DataSet(networkData.nodes);
    const edges = new vis.DataSet(networkData.edges);
    const network = new vis.Network(container, { nodes, edges }, options);
    */

    return (
      <div className="network-container h-96 border rounded-lg p-4">
        <h3 className="text-center mb-4">
          Skill Network for: {networkData.center_skill?.name}
        </h3>
        <div className="text-center text-gray-500">
          Network visualization would go here
          <br />({networkData.nodes?.length} nodes, {networkData.edges?.length}{" "}
          connections)
        </div>
      </div>
    );
  };

  return <div className="skill-network">{renderNetwork()}</div>;
}

// 5. Advanced Search Component with Filters
function AdvancedSkillSearch() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    skill_type: "",
    reuse_level: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { apiCall } = useAPI();

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = "/taxonomy/skills/";
      const params = new URLSearchParams();

      if (query) params.append("search", query);
      if (filters.skill_type) params.append("skill_type", filters.skill_type);
      if (filters.reuse_level)
        params.append("reuse_level", filters.reuse_level);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const data = await apiCall(url);
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advanced-search">
      <div className="filters-section mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-4">Search Skills</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills..."
            className="px-3 py-2 border rounded-lg"
          />

          <select
            value={filters.skill_type}
            onChange={(e) =>
              setFilters({ ...filters, skill_type: e.target.value })
            }
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Skill Types</option>
            <option value="skill/competence">Skill/Competence</option>
            <option value="knowledge">Knowledge</option>
            <option value="language">Language</option>
            <option value="attitude">Attitude</option>
          </select>

          <select
            value={filters.reuse_level}
            onChange={(e) =>
              setFilters({ ...filters, reuse_level: e.target.value })
            }
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Reuse Levels</option>
            <option value="sector-specific">Sector Specific</option>
            <option value="occupation-specific">Occupation Specific</option>
            <option value="cross-sector">Cross Sector</option>
            <option value="transversal">Transversal</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search Skills"}
        </button>
      </div>

      {results && (
        <div className="results-section">
          <h3 className="text-lg font-semibold mb-4">
            Found {results.count} skills
            {results.next && (
              <span className="text-sm text-gray-500">
                {" "}
                (showing first {results.results?.length})
              </span>
            )}
          </h3>

          <div className="grid gap-3">
            {results.results?.map((skill) => (
              <div key={skill.id} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{skill.preferred_label}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {skill.description}
                </p>

                <div className="flex gap-2">
                  {skill.skill_type && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {skill.skill_type}
                    </span>
                  )}
                  {skill.reuse_level && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {skill.reuse_level}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {results.next && (
            <div className="text-center mt-6">
              <button className="px-4 py-2 border rounded-lg text-blue-600 hover:bg-blue-50">
                Load More Results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export {
  SearchComponent,
  StatsDashboard,
  SkillDetail,
  SkillNetworkVisualization,
  AdvancedSkillSearch,
};
