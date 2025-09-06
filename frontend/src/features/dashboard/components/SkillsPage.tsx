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
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your Skills Profile */}
        <Card
          className={`lg:col-span-2 ${isDark ? 'border-tabiya-dark bg-tabiya-medium' : 'border-gray-200 bg-white'}`}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-tabiya-accent" />
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Your Skills Profile
              </CardTitle>
            </div>
            <div
              className={`flex items-center gap-4 text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}
            >
              <span className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                {allSkills.length} Skills
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {skillGroups.length} Categories
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Skill */}
            <div
              className={`border rounded-lg p-4 ${
                isDark
                  ? 'border-tabiya-dark bg-tabiya-dark/50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <h4
                className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Add New Skill
              </h4>
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
                  >
                    <SelectValue />
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
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </Button>
              </div>
            </div>

            {/* Skills Groups */}
            <div className="space-y-4">
              {skillGroups.map((group) => (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-primary">{group.name}</h4>
                    <Badge variant="outline">
                      {group.skills.length} skills
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.name}</span>
                          <Select
                            value={skill.level}
                            onValueChange={(value) =>
                              handleUpdateSkillLevel(skill.id, value)
                            }
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
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
                            >
                              {skill.level || 'Beginner'}
                            </Badge>
                            <span className="text-muted-foreground">
                              {getLevelProgress(skill.level || 'Beginner')}%
                            </span>
                          </div>
                          <Progress
                            value={getLevelProgress(skill.level || 'Beginner')}
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Match Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Top Match</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topOccupationMatch && (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {topOccupationMatch.matchPercentage}%
                  </div>
                  <h3 className="font-semibold">{topOccupationMatch.title}</h3>
                  <p className="text-sm text-muted-foreground">Match Score</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Skill Match</span>
                    <span className="font-medium">
                      {getSkillMatchForOccupation(topOccupationMatch)}%
                    </span>
                  </div>
                  <Progress
                    value={getSkillMatchForOccupation(topOccupationMatch)}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{topOccupationMatch.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salary Range:</span>
                    <span>
                      {topOccupationMatch.salaryRange
                        ? `$${topOccupationMatch.salaryRange.min.toLocaleString()} - 
                        $${topOccupationMatch.salaryRange.max.toLocaleString()}`
                        : 'Not specified'}
                    </span>
                  </div>
                </div>

                <Button className="w-full gap-2" variant="outline">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Occupation Matches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle>Top Occupation Matches</CardTitle>
            </div>
            <Badge variant="outline">All Industries</Badge>
          </div>
          <CardDescription>
            Career opportunities ranked by skill compatibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {occupations.slice(0, 5).map((occupation, index) => (
              <div
                key={occupation.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{occupation.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {occupation.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {occupation.matchPercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {occupation.salaryRange
                        ? `$${Math.round((occupation.salaryRange.min + occupation.salaryRange.max) / 2 / 1000)}k`
                        : 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg Salary
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Enhancement & Career Pathways */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Enhancement */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle>Skill Enhancement</CardTitle>
            </div>
            <CardDescription>
              Recommended skills to improve your matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{item.skill}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.priority}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        item.growth === 'High'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {item.growth}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      Learn Now
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Pathways */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-600" />
              <CardTitle>Career Pathways</CardTitle>
            </div>
            <CardDescription>
              Potential career progression paths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                <div key={index} className="relative">
                  {index > 0 && (
                    <div className="absolute left-4 -top-2 w-0.5 h-4 bg-border" />
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{pathway.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {pathway.level}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
                        {pathway.match}
                      </div>
                      <div className="text-xs text-muted-foreground">
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
