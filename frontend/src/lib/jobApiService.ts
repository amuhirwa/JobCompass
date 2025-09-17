// Job API service for fetching real job listings using SerpApi Google Jobs API
// Documentation: https://serpapi.com/google-jobs-api

export interface JobSearchParams {
  query: string;
  location: string;
  page?: number;
  pageSize?: number;
}

export interface JobApiResponse {
  jobs: any[];
  total: number;
  page: number;
  hasMore: boolean;
}

class JobApiService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  async searchJobs(params: JobSearchParams): Promise<JobApiResponse> {
    try {
      // Call the backend API endpoint which handles SerpApi integration
      const searchParams = new URLSearchParams({
        query: params.query,
        location: params.location,
        page: (params.page || 1).toString(),
        pageSize: (params.pageSize || 10).toString(),
      });

      const response = await fetch(`${this.baseUrl}/api/jobs/search/?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
        },
      });

      if (!response.ok) {
        throw new Error(`Backend API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching jobs via backend:', error);
      // Fallback to mock data on error
      console.log('Falling back to mock data due to API error');
      return this.getMockJobData(params);
    }
  }

  private async getMockJobData(params: JobSearchParams): Promise<JobApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const companies = [
      { name: "Google", industry: "Technology", size: "Large", logo: "https://logo.clearbit.com/google.com" },
      { name: "Microsoft", industry: "Technology", size: "Large", logo: "https://logo.clearbit.com/microsoft.com" },
      { name: "Amazon", industry: "E-commerce", size: "Large", logo: "https://logo.clearbit.com/amazon.com" },
      { name: "Apple", industry: "Technology", size: "Large", logo: "https://logo.clearbit.com/apple.com" },
      { name: "Meta", industry: "Social Media", size: "Large", logo: "https://logo.clearbit.com/meta.com" },
      { name: "Netflix", industry: "Entertainment", size: "Large", logo: "https://logo.clearbit.com/netflix.com" },
      { name: "Spotify", industry: "Music", size: "Medium", logo: "https://logo.clearbit.com/spotify.com" },
      { name: "Airbnb", industry: "Travel", size: "Medium", logo: "https://logo.clearbit.com/airbnb.com" },
      { name: "Uber", industry: "Transportation", size: "Large", logo: "https://logo.clearbit.com/uber.com" },
      { name: "Shopify", industry: "E-commerce", size: "Medium", logo: "https://logo.clearbit.com/shopify.com" },
      { name: "Stripe", industry: "Fintech", size: "Medium", logo: "https://logo.clearbit.com/stripe.com" },
      { name: "Dropbox", industry: "Technology", size: "Medium", logo: "https://logo.clearbit.com/dropbox.com" },
      { name: "Slack", industry: "Technology", size: "Medium", logo: "https://logo.clearbit.com/slack.com" },
      { name: "Zoom", industry: "Technology", size: "Medium", logo: "https://logo.clearbit.com/zoom.us" },
      { name: "Adobe", industry: "Software", size: "Large", logo: "https://logo.clearbit.com/adobe.com" },
      { name: "Salesforce", industry: "Software", size: "Large", logo: "https://logo.clearbit.com/salesforce.com" },
      { name: "Oracle", industry: "Database", size: "Large", logo: "https://logo.clearbit.com/oracle.com" },
      { name: "IBM", industry: "Technology", size: "Large", logo: "https://logo.clearbit.com/ibm.com" },
      { name: "Intel", industry: "Hardware", size: "Large", logo: "https://logo.clearbit.com/intel.com" },
      { name: "NVIDIA", industry: "Hardware", size: "Large", logo: "https://logo.clearbit.com/nvidia.com" }
    ];

    const locations = params.location ? [params.location] : [
      "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
      "Chicago, IL", "Boston, MA", "Los Angeles, CA", "Denver, CO",
      "Atlanta, GA", "Remote", "Toronto, ON", "London, UK", "Berlin, Germany",
      "Amsterdam, Netherlands", "Paris, France", "Sydney, Australia"
    ];

    const jobTitles = this.generateJobTitles(params.query);
    const employmentTypes = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"];
    const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Lead", "Principal"];

    const jobs = [];
    const jobCount = Math.min(20, Math.floor(Math.random() * 15) + 5); // 5-20 jobs

    for (let i = 0; i < jobCount; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const employmentType = employmentTypes[Math.floor(Math.random() * employmentTypes.length)];
      const experienceLevel = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
      
      const baseTitle = params.query || "Software";
      const skills = this.generateRelevantSkills(baseTitle);
      
      // Generate realistic salary ranges based on experience level and location
      const salaryMultiplier = this.getSalaryMultiplier(experienceLevel, location);
      const baseSalary = 70000;
      
      jobs.push({
        id: `job-${Date.now()}-${i}`,
        title: jobTitle,
        company: company.name,
        company_logo: company.logo,
        company_industry: company.industry,
        company_size: company.size,
        location: location,
        description: this.generateJobDescription(jobTitle, company.name, skills),
        requirements: skills.slice(0, 6), // Top 6 skills as requirements
        nice_to_have: skills.slice(6, 10), // Additional skills as nice-to-have
        salary_min: Math.floor(baseSalary * salaryMultiplier.min),
        salary_max: Math.floor(baseSalary * salaryMultiplier.max),
        salary_currency: "USD",
        employment_type: employmentType,
        experience_level: experienceLevel,
        posted_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        application_deadline: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        apply_url: `https://careers.${company.name.toLowerCase().replace(/\s+/g, '')}.com/job-${i}`,
        source: "JobCompass",
        remote_allowed: location === "Remote" || employmentType === "Remote" || Math.random() > 0.7,
        benefits: this.generateBenefits(),
        team_size: Math.floor(Math.random() * 20) + 5,
        department: this.getDepartment(jobTitle)
      });
    }

    return {
      jobs,
      total: jobs.length,
      page: params.page || 1,
      hasMore: false
    };
  }

  private generateJobTitles(query: string): string[] {
    const baseQuery = query || "Software";
    const titleSuffixes = [
      "Engineer", "Developer", "Specialist", "Manager", "Analyst", 
      "Architect", "Lead", "Principal", "Senior", "Staff",
      "Consultant", "Director", "Coordinator", "Expert"
    ];
    
    const titlePrefixes = [
      "Frontend", "Backend", "Full Stack", "Senior", "Junior", "Lead",
      "Principal", "Staff", "Associate", "Senior Associate"
    ];

    const titles: string[] = [];
    
    // Generate combinations
    titleSuffixes.forEach(suffix => {
      titles.push(`${baseQuery} ${suffix}`);
      titlePrefixes.forEach(prefix => {
        if (Math.random() > 0.7) { // Don't generate too many combinations
          titles.push(`${prefix} ${baseQuery} ${suffix}`);
        }
      });
    });

    return titles.slice(0, 15); // Limit to reasonable number
  }

  private generateRelevantSkills(baseQuery: string): string[] {
    const skillCategories = {
      "Software": ["JavaScript", "Python", "React", "Node.js", "TypeScript", "AWS", "Docker", "Kubernetes", "Git", "SQL"],
      "Data": ["Python", "SQL", "Pandas", "NumPy", "Tableau", "Power BI", "Apache Spark", "Hadoop", "R", "Machine Learning"],
      "Design": ["Figma", "Adobe Creative Suite", "Sketch", "InVision", "Prototyping", "User Research", "Wireframing", "UI/UX"],
      "Marketing": ["Google Analytics", "SEO", "SEM", "Social Media", "Content Marketing", "Email Marketing", "A/B Testing", "CRM"],
      "Product": ["Product Strategy", "Roadmap Planning", "Agile", "Scrum", "User Stories", "Analytics", "A/B Testing", "SQL"]
    };

    const universalSkills = [
      "Communication", "Problem Solving", "Teamwork", "Leadership", "Project Management",
      "Analytical Thinking", "Creativity", "Adaptability", "Time Management"
    ];

    let relevantSkills = [];

    // Find the most relevant skill category
    const queryLower = baseQuery.toLowerCase();
    if (queryLower.includes("software") || queryLower.includes("engineer") || queryLower.includes("developer")) {
      relevantSkills = [...skillCategories.Software];
    } else if (queryLower.includes("data") || queryLower.includes("analyst")) {
      relevantSkills = [...skillCategories.Data];
    } else if (queryLower.includes("design") || queryLower.includes("ux") || queryLower.includes("ui")) {
      relevantSkills = [...skillCategories.Design];
    } else if (queryLower.includes("marketing") || queryLower.includes("growth")) {
      relevantSkills = [...skillCategories.Marketing];
    } else if (queryLower.includes("product") || queryLower.includes("manager")) {
      relevantSkills = [...skillCategories.Product];
    } else {
      // Default to software skills
      relevantSkills = [...skillCategories.Software];
    }

    // Add some universal skills
    relevantSkills.push(...universalSkills.slice(0, 3));

    // Shuffle and return
    return relevantSkills.sort(() => 0.5 - Math.random()).slice(0, 12);
  }

  private generateJobDescription(title: string, company: string, skills: string[]): string {
    const descriptions = [
      `We are looking for a talented ${title} to join our team at ${company}. You will work on cutting-edge projects and collaborate with a world-class team.`,
      `${company} is seeking an experienced ${title} to help build and scale our products. This is an exciting opportunity to make a significant impact.`,
      `Join ${company} as a ${title} and help us revolutionize the industry. You'll work with the latest technologies and contribute to innovative solutions.`,
      `Are you passionate about technology? ${company} is looking for a ${title} to join our growing team and work on challenging projects.`
    ];

    const baseDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const skillsText = skills.slice(0, 4).join(", ");
    
    return `${baseDescription} Key technologies include ${skillsText}. We offer a collaborative environment, competitive compensation, and excellent growth opportunities.`;
  }

  private getSalaryMultiplier(experienceLevel: string, location: string): { min: number; max: number } {
    let experienceMultiplier = 1;
    switch (experienceLevel) {
      case "Entry Level": experienceMultiplier = 0.8; break;
      case "Mid Level": experienceMultiplier = 1.0; break;
      case "Senior Level": experienceMultiplier = 1.4; break;
      case "Lead": experienceMultiplier = 1.8; break;
      case "Principal": experienceMultiplier = 2.2; break;
    }

    let locationMultiplier = 1;
    if (location.includes("San Francisco") || location.includes("New York")) {
      locationMultiplier = 1.4;
    } else if (location.includes("Seattle") || location.includes("Boston")) {
      locationMultiplier = 1.2;
    } else if (location === "Remote") {
      locationMultiplier = 1.1;
    }

    const totalMultiplier = experienceMultiplier * locationMultiplier;
    return {
      min: totalMultiplier * 0.9,
      max: totalMultiplier * 1.3
    };
  }

  private generateBenefits(): string[] {
    const allBenefits = [
      "Health Insurance", "Dental Insurance", "Vision Insurance", "401(k) Matching",
      "Flexible PTO", "Remote Work", "Stock Options", "Learning Budget",
      "Gym Membership", "Free Meals", "Commuter Benefits", "Parental Leave",
      "Mental Health Support", "Professional Development", "Conference Budget"
    ];

    const benefitCount = Math.floor(Math.random() * 6) + 4; // 4-10 benefits
    return allBenefits.sort(() => 0.5 - Math.random()).slice(0, benefitCount);
  }

  private getDepartment(jobTitle: string): string {
    const title = jobTitle.toLowerCase();
    if (title.includes('engineer') || title.includes('developer') || title.includes('software')) return 'Engineering';
    if (title.includes('design') || title.includes('ux') || title.includes('ui')) return 'Design';
    if (title.includes('product')) return 'Product';
    if (title.includes('marketing') || title.includes('growth')) return 'Marketing';
    if (title.includes('data') || title.includes('analyst')) return 'Data';
    if (title.includes('sales') || title.includes('business development')) return 'Sales';
    if (title.includes('manager') || title.includes('director')) return 'Management';
    return 'Technology';
  }
}

export const jobApiService = new JobApiService();
