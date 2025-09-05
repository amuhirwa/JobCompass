import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, ExternalLink, Briefcase } from 'lucide-react';
import type { Skill, Occupation } from '@/features/dashboard/types';

interface SkillsMatchingProps {
  selectedSkills: Skill[];
  relatedOccupations: Occupation[];
  relatedSkills: Skill[];
}

export function SkillsMatching({
  selectedSkills,
  relatedOccupations,
  relatedSkills,
}: SkillsMatchingProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Your Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Skills Profile
          </CardTitle>
          <CardDescription>
            Skills you've added to your profile ({selectedSkills.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedSkills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No skills selected yet</p>
              <p className="text-sm">
                Add skills in the Skills Management section
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Skills by Category */}
              {Object.entries(
                selectedSkills.reduce(
                  (acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  },
                  {} as Record<string, Skill[]>
                )
              ).map(([category, skills]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill.name}
                        {skill.level && (
                          <span className="ml-1 opacity-70">
                            ({skill.level})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Occupations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Top Occupation Matches
          </CardTitle>
          <CardDescription>
            Career paths that match your skill profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {relatedOccupations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No occupation matches yet</p>
              <p className="text-sm">Add more skills to see matching careers</p>
            </div>
          ) : (
            <div className="space-y-4">
              {relatedOccupations.slice(0, 5).map((occupation) => (
                <div
                  key={occupation.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{occupation.title}</h4>
                      {occupation.location && (
                        <p className="text-sm text-muted-foreground">
                          {occupation.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${getMatchColor(occupation.matchPercentage)}`}
                      >
                        {occupation.matchPercentage}%
                      </div>
                      <p className="text-xs text-muted-foreground">match</p>
                    </div>
                  </div>

                  <Progress
                    value={occupation.matchPercentage}
                    className="h-2"
                  />

                  {occupation.salaryRange && (
                    <p className="text-sm text-muted-foreground">
                      ${occupation.salaryRange.min.toLocaleString()} - $
                      {occupation.salaryRange.max.toLocaleString()}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {occupation.requiredSkills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {occupation.requiredSkills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{occupation.requiredSkills.length - 4} more
                      </Badge>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Explore Career Path
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Skills - Full Width */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommended Skills
          </CardTitle>
          <CardDescription>
            Skills that complement your current profile and boost career
            opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {relatedSkills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No skill recommendations yet</p>
              <p className="text-sm">
                Add more skills to get personalized recommendations
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Group by category */}
              {Object.entries(
                relatedSkills.reduce(
                  (acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  },
                  {} as Record<string, Skill[]>
                )
              ).map(([category, skills]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{category}</h4>
                    <Badge variant="outline" className="text-xs">
                      {skills.length} skills
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Button
                        key={skill.id}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        {skill.name}
                        <span className="ml-1 opacity-70">+</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
