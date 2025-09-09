import { useState, useEffect } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Building,
  DollarSign,
  Clock,
  Search,
  Filter,
  ExternalLink,
  Briefcase,
  Users,
  Star,
  Calendar,
  Award,
  TrendingUp,
} from "lucide-react";
import api from "@/lib/api";
import { jobApiService } from "@/lib/jobApiService";
import type { UserSkill, PaginatedResponse } from "@/lib/types";

interface JobListing {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  company_industry?: string;
  company_size?: string;
  location: string;
  description: string;
  requirements: string[];
  nice_to_have?: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  employment_type: string;
  experience_level?: string;
  posted_date: string;
  application_deadline?: string;
  apply_url: string;
  skills_match_percentage: number;
  matched_skills: string[];
  source: string;
  remote_allowed?: boolean;
  benefits?: string[];
  team_size?: number;
  department?: string;
}

export function Jobs() {
  const { isDark } = useDarkMode();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isUsingRealData, setIsUsingRealData] = useState(false);

  useEffect(() => {
    loadUserSkillsAndJobs();
  }, []);

  const loadUserSkillsAndJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load user skills first
      const skillsResponse = await api.getUserSkills();
      const skills = skillsResponse.results || [];
      setUserSkills(skills);

      // Generate job search queries based on user skills and matching occupations
      if (skills.length > 0) {
        await searchJobsBasedOnSkills(skills);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error loading user skills and jobs:", error);
      setError("Failed to load job recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const searchJobsBasedOnSkills = async (skills: UserSkill[]) => {
    try {
      // Get top skills for job search
      const topSkills = skills
        .slice(0, 5)
        .map((skill) => skill.skill.preferred_label);

      // Also get matching occupations from backend
      const occupationsResponse = await api.getOccupations({
        page: 1,
        page_size: 20,
      });
      const matchingOccupations = getMatchingOccupations(
        skills,
        occupationsResponse.results || []
      );

      // Search for jobs using skills and occupations
      const jobSearchQueries = [
        ...topSkills,
        ...matchingOccupations.slice(0, 3).map((occ) => occ.title),
      ];

      const allJobs: JobListing[] = [];

      // Search jobs for each query (simulate multiple API calls)
      for (const query of jobSearchQueries.slice(0, 3)) {
        // Limit to 3 queries to avoid rate limits
        const jobResults = await searchJobsAPI(query, locationFilter);
        allJobs.push(...jobResults);
      }

      // Remove duplicates and calculate skill matches
      const uniqueJobs = removeDuplicateJobs(allJobs);
      const jobsWithMatches = calculateSkillMatches(uniqueJobs, skills);

      // Sort by skill match percentage
      jobsWithMatches.sort(
        (a, b) => b.skills_match_percentage - a.skills_match_percentage
      );

      setJobs(jobsWithMatches.slice(0, 50)); // Limit to 50 jobs
      setTotalJobs(jobsWithMatches.length);
    } catch (error) {
      console.error("Error searching jobs:", error);
      setError("Failed to search for jobs");
    }
  };

  const getMatchingOccupations = (skills: UserSkill[], occupations: any[]) => {
    const userSkillIds = skills.map((s) => s.skill.id);

    return occupations
      .map((occ) => {
        const requiredSkillIds =
          occ.related_skills
            ?.filter((skill: any) => skill.relation_type === "essential")
            .map((skill: any) => skill.skill_id) || [];

        const matchedSkills = requiredSkillIds.filter((skillId: string) =>
          userSkillIds.includes(skillId)
        );

        const matchPercentage =
          requiredSkillIds.length > 0
            ? (matchedSkills.length / requiredSkillIds.length) * 100
            : 0;

        return {
          ...occ,
          title: occ.preferred_label,
          matchPercentage,
        };
      })
      .filter((occ) => occ.matchPercentage > 30) // Only include occupations with >30% match
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  const searchJobsAPI = async (
    query: string,
    location: string
  ): Promise<JobListing[]> => {
    try {
      const response = await jobApiService.searchJobs({
        query,
        location,
        page: 1,
        pageSize: 20,
      });

      // Check if we're using real data based on API key presence
      const hasApiKey = import.meta.env.VITE_SERPAPI_KEY;
      setIsUsingRealData(!!hasApiKey);

      return response.jobs;
    } catch (error) {
      console.error("Error calling job API:", error);
      setIsUsingRealData(false);
      return [];
    }
  };

  const removeDuplicateJobs = (jobs: JobListing[]): JobListing[] => {
    const seen = new Set();
    return jobs.filter((job) => {
      const key = `${job.title}-${job.company}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const calculateSkillMatches = (
    jobs: JobListing[],
    userSkills: UserSkill[]
  ): JobListing[] => {
    const userSkillNames = userSkills.map((s) =>
      s.skill.preferred_label.toLowerCase()
    );

    return jobs.map((job) => {
      const jobRequirements = job.requirements.map((req) => req.toLowerCase());
      const matchedSkills = jobRequirements.filter((req) =>
        userSkillNames.some(
          (userSkill) =>
            userSkill.includes(req) ||
            req.includes(userSkill) ||
            userSkill
              .split(" ")
              .some((word) => req.includes(word) && word.length > 2)
        )
      );

      const matchPercentage =
        jobRequirements.length > 0
          ? Math.round((matchedSkills.length / jobRequirements.length) * 100)
          : 0;

      return {
        ...job,
        skills_match_percentage: matchPercentage,
        matched_skills: matchedSkills,
      };
    });
  };

  const handleSearch = async () => {
    if (userSkills.length > 0) {
      setIsLoading(true);
      await searchJobsBasedOnSkills(userSkills);
      setIsLoading(false);
    }
  };

  const formatSalary = (
    min?: number,
    max?: number,
    currency: string = "USD"
  ) => {
    if (!min && !max) return "Salary not specified";
    const symbol = currency === "USD" ? "$" : currency;
    if (min && max)
      return `${symbol}${(min / 1000).toFixed(0)}k - ${symbol}${(max / 1000).toFixed(0)}k`;
    if (min) return `${symbol}${(min / 1000).toFixed(0)}k+`;
    return "Competitive salary";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-tabiya-dark" : "bg-gray-50"} p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Recommended Jobs
              </h1>
              <p
                className={`mt-2 ${isDark ? "text-white/70" : "text-gray-600"}`}
              >
                Jobs matching your skills and career interests
              </p>
            </div>

            {/* Data Source Indicator */}
            <div className="flex items-center gap-2">
              <Badge
                variant={isUsingRealData ? "default" : "secondary"}
                className={`${isUsingRealData ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
              >
                {isUsingRealData ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Live Data (SerpApi)
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Demo Data
                  </div>
                )}
              </Badge>
              {!isUsingRealData && (
                <Button size="sm" variant="outline" asChild className="text-xs">
                  <a
                    href="https://serpapi.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get SerpApi Key
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card
          className={`mb-6 ${isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white"}`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs by keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Location (e.g., San Francisco, Remote)"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {!isLoading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card
              className={
                isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white"
              }
            >
              <CardContent className="p-4 text-center">
                <Briefcase
                  className={`h-8 w-8 mx-auto mb-2 ${isDark ? "text-tabiya-accent" : "text-primary"}`}
                />
                <div
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {jobs.length}
                </div>
                <p
                  className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}
                >
                  Jobs Found
                </p>
              </CardContent>
            </Card>
            <Card
              className={
                isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white"
              }
            >
              <CardContent className="p-4 text-center">
                <Star
                  className={`h-8 w-8 mx-auto mb-2 ${isDark ? "text-tabiya-accent" : "text-primary"}`}
                />
                <div
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {Math.round(
                    jobs.reduce(
                      (sum, job) => sum + job.skills_match_percentage,
                      0
                    ) / jobs.length
                  ) || 0}
                  %
                </div>
                <p
                  className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}
                >
                  Avg Match
                </p>
              </CardContent>
            </Card>
            <Card
              className={
                isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white"
              }
            >
              <CardContent className="p-4 text-center">
                <Users
                  className={`h-8 w-8 mx-auto mb-2 ${isDark ? "text-tabiya-accent" : "text-primary"}`}
                />
                <div
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {userSkills.length}
                </div>
                <p
                  className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}
                >
                  Your Skills
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card
            className={`mb-6 border-red-200 ${isDark ? "bg-red-900/20" : "bg-red-50"}`}
          >
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-2">{error}</p>
              {error.includes("SerpApi") && (
                <div className="text-sm text-red-500 space-y-2">
                  <p>This might be due to:</p>
                  <ul className="text-left max-w-md mx-auto space-y-1">
                    <li>
                      • API key not configured (add VITE_SERPAPI_KEY to .env)
                    </li>
                    <li>• Monthly API limit reached</li>
                    <li>• Network connectivity issues</li>
                  </ul>
                </div>
              )}
              <div className="flex gap-2 justify-center mt-4">
                <Button onClick={loadUserSkillsAndJobs}>Try Again</Button>
                {!isUsingRealData && (
                  <Button variant="outline" asChild>
                    <a
                      href="https://serpapi.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get SerpApi Key
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className={
                  isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white"
                }
              >
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Jobs List */}
        {!isLoading && jobs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`${isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white"} hover:shadow-lg transition-shadow`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      {job.company_logo && (
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={job.company_logo}
                            alt={`${job.company} logo`}
                          />
                          <AvatarFallback className="bg-tabiya-accent text-white text-xs">
                            {job.company.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle
                          className={`text-lg ${isDark ? "text-white" : "text-gray-900"} line-clamp-2`}
                        >
                          {job.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span
                            className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                          >
                            {job.company}
                          </span>
                          {job.company_industry && (
                            <Badge variant="outline" className="text-xs">
                              {job.company_industry}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span
                            className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                          >
                            {job.location}
                          </span>
                          {job.remote_allowed && (
                            <Badge variant="secondary" className="text-xs">
                              Remote OK
                            </Badge>
                          )}
                        </div>
                        {job.experience_level && (
                          <div className="flex items-center gap-2 mt-1">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <span
                              className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                            >
                              {job.experience_level}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        job.skills_match_percentage > 70
                          ? "default"
                          : job.skills_match_percentage > 40
                            ? "secondary"
                            : "outline"
                      }
                      className="ml-2"
                    >
                      {job.skills_match_percentage}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"} mb-4 line-clamp-3`}
                  >
                    {job.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span
                        className={isDark ? "text-white/70" : "text-gray-600"}
                      >
                        {formatSalary(
                          job.salary_min,
                          job.salary_max,
                          job.salary_currency
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span
                        className={isDark ? "text-white/70" : "text-gray-600"}
                      >
                        {formatDate(job.posted_date)}
                      </span>
                    </div>
                    {job.team_size && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span
                          className={isDark ? "text-white/70" : "text-gray-600"}
                        >
                          Team of {job.team_size}
                        </span>
                      </div>
                    )}
                    {job.department && (
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span
                          className={isDark ? "text-white/70" : "text-gray-600"}
                        >
                          {job.department}
                        </span>
                      </div>
                    )}
                  </div>

                  {job.matched_skills.length > 0 && (
                    <div className="mb-4">
                      <p
                        className={`text-xs font-medium mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}
                      >
                        Your Matching Skills:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.matched_skills.slice(0, 4).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="default"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.matched_skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.matched_skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {job.benefits && job.benefits.length > 0 && (
                    <div className="mb-4">
                      <p
                        className={`text-xs font-medium mb-2 ${isDark ? "text-white/80" : "text-gray-700"}`}
                      >
                        Benefits:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.benefits.slice(0, 3).map((benefit, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {benefit}
                          </Badge>
                        ))}
                        {job.benefits.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.benefits.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{job.employment_type}</Badge>
                      {job.application_deadline && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          Apply by{" "}
                          {new Date(
                            job.application_deadline
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <Button size="sm" asChild>
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply Now
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && jobs.length === 0 && !error && (
          <Card
            className={
              isDark ? "bg-tabiya-medium border-tabiya-dark" : "bg-white"
            }
          >
            <CardContent className="p-12 text-center">
              <Briefcase
                className={`h-16 w-16 mx-auto mb-4 ${isDark ? "text-white/30" : "text-gray-300"}`}
              />
              <h3
                className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                No jobs found
              </h3>
              <p
                className={`${isDark ? "text-white/60" : "text-gray-500"} mb-4`}
              >
                {userSkills.length === 0
                  ? "Add some skills to your profile to get personalized job recommendations."
                  : "Try adjusting your search criteria or location."}
              </p>
              {userSkills.length === 0 && (
                <Button onClick={() => (window.location.href = "/dashboard")}>
                  Add Skills to Profile
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Jobs;
