import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, FolderOpen } from 'lucide-react';
import type { Skill, SkillGroup } from '@/features/dashboard/types';

interface SkillsManagementProps {
  skillGroups: SkillGroup[];
  onUpdateSkillGroups: (skillGroups: SkillGroup[]) => void;
}

export function SkillsManagement({
  skillGroups,
  onUpdateSkillGroups,
}: SkillsManagementProps) {
  const [newSkillName, setNewSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<
    'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  >('Beginner');

  const categories = [
    'JavaScript',
    'React',
    'Node.js',
    'Database Design',
    'Project Management',
    'Team Leadership',
    'Agile Methodology',
    'Technical',
    'Soft Skills',
    'Other',
  ];

  const addSkill = () => {
    if (!newSkillName.trim() || !selectedCategory) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      category: selectedCategory,
      level: selectedLevel,
    };

    const updatedGroups = [...skillGroups];
    const existingGroupIndex = updatedGroups.findIndex(
      (group) => group.name === selectedCategory
    );

    if (existingGroupIndex >= 0) {
      updatedGroups[existingGroupIndex].skills.push(newSkill);
    } else {
      updatedGroups.push({
        id: Date.now().toString(),
        name: selectedCategory,
        skills: [newSkill],
      });
    }

    onUpdateSkillGroups(updatedGroups);
    setNewSkillName('');
    setSelectedCategory('');
    setSelectedLevel('Beginner');
  };

  const removeSkill = (groupId: string, skillId: string) => {
    const updatedGroups = skillGroups
      .map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            skills: group.skills.filter((skill) => skill.id !== skillId),
          };
        }
        return group;
      })
      .filter((group) => group.skills.length > 0);

    onUpdateSkillGroups(updatedGroups);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Expert':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skills Management</CardTitle>
        <CardDescription>
          Add and organize your skills by category
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Skill */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
          <Input
            placeholder="Skill name"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedLevel}
            onValueChange={(value: any) => setSelectedLevel(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={addSkill}
            disabled={!newSkillName.trim() || !selectedCategory}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {/* Skills Groups */}
        {skillGroups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="h-8 w-8 mx-auto mb-2" />
            <p>No skills added yet. Start by adding your first skill above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {skillGroups.map((group) => (
              <div key={group.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  {group.name}
                  <Badge variant="secondary" className="ml-2">
                    {group.skills.length}
                  </Badge>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-1 bg-background border rounded-lg p-2"
                    >
                      <span className="text-sm font-medium">{skill.name}</span>
                      {skill.level && (
                        <Badge
                          className={`text-xs ${getLevelColor(skill.level)}`}
                        >
                          {skill.level}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(group.id, skill.id)}
                        className="h-5 w-5 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
