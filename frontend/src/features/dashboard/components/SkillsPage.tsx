import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Plus,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  ExternalLink,
  Star,
  ArrowRight,
} from 'lucide-react';
import type { SkillGroup, Occupation, Skill } from '@/features/dashboard/types';

interface SkillsPageProps {
  skillGroups: SkillGroup[];
  occupations: Occupation[];
  onUpdateSkillGroups: (skillGroups: SkillGroup[]) => void;
}

export function SkillsPage({
  skillGroups,
  occupations,
  onUpdateSkillGroups,
}: SkillsPageProps) {
  const { isDark } = useDarkMode();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<
    'Beginner' | 'Intermediate' | 'Advanced'
  >('Beginner');

  const allSkills = skillGroups.flatMap((group) => group.skills);
  const topOccupationMatch = occupations[0]; // Assuming first is highest match

  const handleAddSkill = () => {
    if (!newSkillName.trim() || !newSkillCategory.trim()) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      category: newSkillCategory.trim(),
      level: newSkillLevel,
    };

    // Find existing group or create new one
    const existingGroupIndex = skillGroups.findIndex(
      (group) => group.name === newSkillCategory.trim()
    );

    if (existingGroupIndex >= 0) {
      const updatedGroups = [...skillGroups];
      updatedGroups[existingGroupIndex] = {
        ...updatedGroups[existingGroupIndex],
        skills: [...updatedGroups[existingGroupIndex].skills, newSkill],
      };
      onUpdateSkillGroups(updatedGroups);
    } else {
      const newGroup: SkillGroup = {
        id: Date.now().toString(),
        name: newSkillCategory.trim(),
        skills: [newSkill],
      };
      onUpdateSkillGroups([...skillGroups, newGroup]);
    }

    // Reset form
    setNewSkillName('');
    setNewSkillCategory('');
    setNewSkillLevel('Beginner');
  };

  const handleUpdateSkillLevel = (skillId: string, newLevel: string) => {
    const updatedGroups = skillGroups.map((group) => ({
      ...group,
      skills: group.skills.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              level: newLevel as 'Beginner' | 'Intermediate' | 'Advanced',
            }
          : skill
      ),
    }));
    onUpdateSkillGroups(updatedGroups);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLevelProgress = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 33;
      case 'Intermediate':
        return 66;
      case 'Advanced':
        return 100;
      default:
        return 0;
    }
  };

  // Enhanced skill match calculations
  const getSkillMatchForOccupation = (occupation: Occupation) => {
    const requiredSkills = occupation.requiredSkills || [];
    const matchingSkills = allSkills.filter((skill) =>
      requiredSkills.some(
        (required) =>
          required.toLowerCase().includes(skill.name.toLowerCase()) ||
          skill.name.toLowerCase().includes(required.toLowerCase())
      )
    );
    return Math.min(
      100,
      Math.round((matchingSkills.length / requiredSkills.length) * 100)
    );
  };

  return (
    <div
      className="space-y-6 w-full"
      role="main"
      aria-labelledby="skills-page-heading"
    >
      <h2 id="skills-page-heading" className="sr-only">
        Skills Management
      </h2>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your Skills Profile */}
        <Card
          className={`lg:col-span-2 ${isDark ? 'border-tabiya-dark bg-tabiya-medium' : 'border-gray-200 bg-white'}`}
          role="region"
          aria-labelledby="skills-profile-heading"
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target
                className="h-5 w-5 text-tabiya-accent"
                aria-hidden="true"
              />
              <CardTitle
                id="skills-profile-heading"
                className={isDark ? 'text-white' : 'text-gray-900'}
              >
                Your Skills Profile
              </CardTitle>
            </div>
            <div
              className={`flex items-center gap-4 text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}
              role="list"
              aria-label="Skills statistics"
            >
              <span
                className="flex items-center gap-1"
                role="listitem"
                aria-label={`${allSkills.length} total skills`}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {allSkills.length} Skills
              </span>
              <span
                className="flex items-center gap-1"
                role="listitem"
                aria-label={`${skillGroups.length} skill categories`}
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                {skillGroups.length} Categories
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Skill */}
            <section
              className={`border rounded-lg p-4 ${
                isDark
                  ? 'border-tabiya-dark bg-tabiya-dark/50'
                  : 'border-gray-200 bg-gray-50'
              }`}
              role="form"
              aria-labelledby="add-skill-heading"
            >
              <h3
                id="add-skill-heading"
                className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Add New Skill
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Skill name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className={
                    isDark
                      ? 'border-tabiya-dark bg-tabiya-medium text-white placeholder:text-white/60'
                      : ''
                  }
                  aria-label="Skill name"
                />
                <Input
                  placeholder="Category"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className={
                    isDark
                      ? 'border-tabiya-dark bg-tabiya-medium text-white placeholder:text-white/60'
                      : ''
                  }
                  aria-label="Skill category"
                />
                <Select
                  value={newSkillLevel}
                  onValueChange={(value: any) => setNewSkillLevel(value)}
                >
                  <SelectTrigger
                    className={
                      isDark
                        ? 'border-tabiya-dark bg-tabiya-medium text-white'
                        : ''
                    }
                    aria-label="Skill level"
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDark ? 'border-tabiya-dark bg-tabiya-medium' : ''
                    }
                  >
                    <SelectItem
                      value="Beginner"
                      className={
                        isDark
                          ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                          : ''
                      }
                    >
                      Beginner
                    </SelectItem>
                    <SelectItem
                      value="Intermediate"
                      className={
                        isDark
                          ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                          : ''
                      }
                    >
                      Intermediate
                    </SelectItem>
                    <SelectItem
                      value="Advanced"
                      className={
                        isDark
                          ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                          : ''
                      }
                    >
                      Advanced
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddSkill}
                  className="gap-2 bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                  aria-label="Add skill to profile"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add Skill
                </Button>
              </div>
            </section>

            {/* Skills Groups */}
            <section
              className="space-y-4"
              role="region"
              aria-labelledby="skills-groups-heading"
            >
              <h3 id="skills-groups-heading" className="sr-only">
                Skills by Category
              </h3>
              {skillGroups.map((group) => (
                <article
                  key={group.id}
                  className="space-y-3"
                  role="group"
                  aria-labelledby={`group-${group.id}-heading`}
                >
                  <header className="flex items-center gap-2">
                    <h4
                      id={`group-${group.id}-heading`}
                      className={`font-medium ${isDark ? 'text-tabiya-accent' : 'text-primary'}`}
                    >
                      {group.name}
                    </h4>
                    <Badge
                      variant="outline"
                      className={isDark ? 'border-white/20 text-white' : ''}
                      aria-label={`${group.skills.length} skills in ${group.name} category`}
                    >
                      {group.skills.length} skills
                    </Badge>
                  </header>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    role="list"
                    aria-labelledby={`group-${group.id}-heading`}
                  >
                    {group.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`border rounded-lg p-3 space-y-2 ${
                          isDark
                            ? 'border-tabiya-dark bg-tabiya-medium/50'
                            : 'border-gray-200 bg-white'
                        }`}
                        role="listitem"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                            id={`skill-${skill.id}-name`}
                          >
                            {skill.name}
                          </span>
                          <Select
                            value={skill.level}
                            onValueChange={(value) =>
                              handleUpdateSkillLevel(skill.id, value)
                            }
                          >
                            <SelectTrigger
                              className={`w-32 h-8 ${
                                isDark
                                  ? 'border-tabiya-dark bg-tabiya-medium text-white'
                                  : ''
                              }`}
                              aria-label={`Change level for ${skill.name}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              className={
                                isDark
                                  ? 'border-tabiya-dark bg-tabiya-medium'
                                  : ''
                              }
                            >
                              <SelectItem
                                value="Beginner"
                                className={
                                  isDark
                                    ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                                    : ''
                                }
                              >
                                Beginner
                              </SelectItem>
                              <SelectItem
                                value="Intermediate"
                                className={
                                  isDark
                                    ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                                    : ''
                                }
                              >
                                Intermediate
                              </SelectItem>
                              <SelectItem
                                value="Advanced"
                                className={
                                  isDark
                                    ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                                    : ''
                                }
                              >
                                Advanced
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <Badge
                              className={getLevelColor(
                                skill.level || 'Beginner'
                              )}
                              variant="secondary"
                              aria-label={`Skill level: ${skill.level || 'Beginner'}`}
                            >
                              {skill.level || 'Beginner'}
                            </Badge>
                            <span
                              className={`${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
                              aria-live="polite"
                              aria-label={`Progress: ${getLevelProgress(skill.level || 'Beginner')}%`}
                            >
                              {getLevelProgress(skill.level || 'Beginner')}%
                            </span>
                          </div>
                          <Progress
                            value={getLevelProgress(skill.level || 'Beginner')}
                            className="h-2"
                            aria-labelledby={`skill-${skill.id}-name`}
                            aria-label={`Progress for ${skill.name}: ${getLevelProgress(skill.level || 'Beginner')}%`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          </CardContent>
        </Card>

        {/* Top Match Card */}
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
          role="region"
          aria-labelledby="top-match-heading"
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" aria-hidden="true" />
              <CardTitle
                id="top-match-heading"
                className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Top Match
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topOccupationMatch && (
              <article aria-labelledby="match-title">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold mb-1 ${
                      isDark ? 'text-tabiya-accent' : 'text-primary'
                    }`}
                    aria-label={`${topOccupationMatch.matchPercentage} percent match`}
                  >
                    {topOccupationMatch.matchPercentage}%
                  </div>
                  <h3
                    id="match-title"
                    className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {topOccupationMatch.title}
                  </h3>
                  <p
                    className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
                    aria-label="This is your overall match score"
                  >
                    Match Score
                  </p>
                </div>

                <div
                  className="space-y-2"
                  role="group"
                  aria-labelledby="skill-match-details"
                >
                  <h4 id="skill-match-details" className="sr-only">
                    Skill Match Details
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span
                      className={isDark ? 'text-white/70' : 'text-gray-600'}
                    >
                      Skill Match
                    </span>
                    <span
                      className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                      aria-label={`${getSkillMatchForOccupation(topOccupationMatch)}% skill match`}
                    >
                      {getSkillMatchForOccupation(topOccupationMatch)}%
                    </span>
                  </div>
                  <Progress
                    value={getSkillMatchForOccupation(topOccupationMatch)}
                    className="h-2"
                    aria-label={`Skill match progress: ${getSkillMatchForOccupation(topOccupationMatch)}%`}
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span
                      className={
                        isDark ? 'text-white/70' : 'text-muted-foreground'
                      }
                    >
                      Location:
                    </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {topOccupationMatch.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={
                        isDark ? 'text-white/70' : 'text-muted-foreground'
                      }
                    >
                      Salary Range:
                    </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {topOccupationMatch.salaryRange
                        ? `$${topOccupationMatch.salaryRange.min.toLocaleString()} - 
                        $${topOccupationMatch.salaryRange.max.toLocaleString()}`
                        : 'Not specified'}
                    </span>
                  </div>
                </div>

                <Button
                  className={`w-full gap-2 ${
                    isDark
                      ? 'border-tabiya-dark text-white hover:bg-tabiya-dark'
                      : ''
                  }`}
                  variant="outline"
                  aria-label={`View details for ${topOccupationMatch.title}`}
                >
                  View Details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </article>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Occupation Matches */}
      <Card
        className={
          isDark
            ? 'border-tabiya-dark bg-tabiya-medium'
            : 'border-gray-200 bg-white'
        }
        role="region"
        aria-labelledby="occupation-matches-heading"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase
                className="h-5 w-5 text-tabiya-accent"
                aria-hidden="true"
              />
              <CardTitle
                id="occupation-matches-heading"
                className={isDark ? 'text-white' : 'text-gray-900'}
              >
                Top Occupation Matches
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className={isDark ? 'border-white/20 text-white' : ''}
              aria-label="Showing results for all industries"
            >
              All Industries
            </Badge>
          </div>
          <CardDescription className={isDark ? 'text-white/70' : ''}>
            Career opportunities ranked by skill compatibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="space-y-4"
            role="list"
            aria-label="Top occupation matches ranked by compatibility"
          >
            {occupations.slice(0, 5).map((occupation, index) => (
              <article
                key={occupation.id}
                className={`flex items-center gap-4 p-4 border rounded-lg ${
                  isDark
                    ? 'border-tabiya-dark bg-tabiya-dark/30'
                    : 'border-gray-200 bg-white'
                }`}
                role="listitem"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-tabiya-accent/20' : 'bg-primary/10'
                    }`}
                    aria-label={`Rank ${index + 1}`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isDark ? 'text-tabiya-accent' : 'text-primary'
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                      id={`occupation-${occupation.id}-title`}
                    >
                      {occupation.title}
                    </h3>
                    <p
                      className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
                      aria-label={`Location: ${occupation.location}`}
                    >
                      {occupation.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="text-right"
                    role="group"
                    aria-labelledby={`occupation-${occupation.id}-title`}
                  >
                    <div
                      className={`text-lg font-bold ${
                        isDark ? 'text-tabiya-accent' : 'text-primary'
                      }`}
                      aria-label={`${occupation.matchPercentage}% compatibility match`}
                    >
                      {occupation.matchPercentage}%
                    </div>
                    <div
                      className={`text-xs ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}
                      aria-hidden="true"
                    >
                      Match
                    </div>
                  </div>
                  <div
                    className="text-right"
                    role="group"
                    aria-labelledby={`occupation-${occupation.id}-title`}
                  >
                    <div
                      className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                      aria-label={`Average salary: ${
                        occupation.salaryRange
                          ? `$${Math.round((occupation.salaryRange.min + occupation.salaryRange.max) / 2 / 1000)} thousand`
                          : 'Not available'
                      }`}
                    >
                      {occupation.salaryRange
                        ? `$${Math.round((occupation.salaryRange.min + occupation.salaryRange.max) / 2 / 1000)}k`
                        : 'N/A'}
                    </div>
                    <div
                      className={`text-xs ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}
                      aria-hidden="true"
                    >
                      Avg Salary
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className={
                      isDark
                        ? 'border-tabiya-dark text-white hover:bg-tabiya-dark'
                        : ''
                    }
                    aria-label={`View external details for ${occupation.title}`}
                  >
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Enhancement & Career Pathways */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Enhancement */}
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
          role="region"
          aria-labelledby="skill-enhancement-heading"
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp
                className="h-5 w-5 text-green-600"
                aria-hidden="true"
              />
              <CardTitle
                id="skill-enhancement-heading"
                className={isDark ? 'text-white' : 'text-gray-900'}
              >
                Skill Enhancement
              </CardTitle>
            </div>
            <CardDescription className={isDark ? 'text-white/70' : ''}>
              Recommended skills to improve your matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-3"
              role="list"
              aria-label="Recommended skills for enhancement"
            >
              {[
                { skill: 'Docker', priority: 'High Priority', growth: 'High' },
                {
                  skill: 'System Architecture',
                  priority: 'Medium Priority',
                  growth: 'Medium',
                },
                {
                  skill: 'Data Analysis',
                  priority: 'Growth Skill',
                  growth: 'High',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    isDark
                      ? 'border-tabiya-dark bg-tabiya-dark/30'
                      : 'border-gray-200 bg-white'
                  }`}
                  role="listitem"
                >
                  <div>
                    <div
                      className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                      id={`enhance-skill-${index}`}
                    >
                      {item.skill}
                    </div>
                    <div
                      className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
                      aria-describedby={`enhance-skill-${index}`}
                    >
                      {item.priority}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        item.growth === 'High'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }
                      aria-label={`${item.growth} growth potential for ${item.skill}`}
                    >
                      {item.growth}
                    </Badge>
                    <div
                      className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}
                      aria-hidden="true"
                    >
                      Learn Now
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Pathways */}
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
          role="region"
          aria-labelledby="career-pathways-heading"
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowRight
                className="h-5 w-5 text-blue-600"
                aria-hidden="true"
              />
              <CardTitle
                id="career-pathways-heading"
                className={isDark ? 'text-white' : 'text-gray-900'}
              >
                Career Pathways
              </CardTitle>
            </div>
            <CardDescription className={isDark ? 'text-white/70' : ''}>
              Potential career progression paths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-4"
              role="list"
              aria-label="Career progression pathway options"
            >
              {[
                {
                  title: 'Software Developer',
                  level: 'Your Current Profile',
                  match: '92%',
                  timeframe: '6 months',
                },
                {
                  title: 'Senior Developer',
                  level: '+DevOps +System Design',
                  match: '78%',
                  timeframe: '2 years',
                },
                {
                  title: 'Tech Lead',
                  level: '+Architecture +Mentoring',
                  match: '65%',
                  timeframe: '4+ years',
                },
                {
                  title: 'Product Manager',
                  level: '+Market Research +Analytics',
                  match: '45%',
                  timeframe: '3+ years',
                },
              ].map((pathway, index) => (
                <div key={index} className="relative" role="listitem">
                  {index > 0 && (
                    <div
                      className={`absolute left-4 -top-2 w-0.5 h-4 ${
                        isDark ? 'bg-tabiya-dark' : 'bg-border'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-tabiya-accent/20' : 'bg-primary/10'
                      }`}
                      aria-hidden="true"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isDark ? 'bg-tabiya-accent' : 'bg-primary'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                        id={`pathway-${index}-title`}
                      >
                        {pathway.title}
                      </div>
                      <div
                        className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
                        aria-describedby={`pathway-${index}-title`}
                      >
                        {pathway.level}
                      </div>
                    </div>
                    <div
                      className="text-right"
                      role="group"
                      aria-labelledby={`pathway-${index}-title`}
                    >
                      <div
                        className={`text-sm font-medium ${
                          isDark ? 'text-tabiya-accent' : 'text-primary'
                        }`}
                        aria-label={`${pathway.match} match for ${pathway.title}`}
                      >
                        {pathway.match}
                      </div>
                      <div
                        className={`text-xs ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}
                        aria-label={`Estimated timeframe: ${pathway.timeframe}`}
                      >
                        {pathway.timeframe}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
