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
import {
  BookOpen,
  Video,
  FileText,
  Award,
  Play,
  Clock,
  Filter,
  Search,
  ExternalLink,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import type { Resource } from '@/features/dashboard/types';

interface ResourcesHubProps {
  resources: Resource[];
  onUpdateProgress: (resourceId: string, progress: number) => void;
}

export function ResourcesHub({
  resources,
  onUpdateProgress,
}: ResourcesHubProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'course':
        return BookOpen;
      case 'video':
        return Video;
      case 'article':
        return FileText;
      case 'book':
        return BookOpen;
      case 'certification':
        return Award;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'course':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'video':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'article':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'book':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'certification':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesDifficulty =
      filterDifficulty === 'all' || resource.difficulty === filterDifficulty;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  const completedResources = resources.filter((r) => r.progress === 100).length;
  const inProgressResources = resources.filter(
    (r) => r.progress > 0 && r.progress < 100
  ).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resources Hub</CardTitle>
        <CardDescription>
          AI-generated learning resources tailored to your career path
        </CardDescription>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>{completedResources} Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-blue-600" />
            <span>{inProgressResources} In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-gray-400" />
            <span>
              {resources.length - completedResources - inProgressResources} Not
              Started
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="book">Books</SelectItem>
              <SelectItem value="certification">Certifications</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resources List */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No resources found</p>
            <p className="text-sm">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredResources.map((resource) => {
              const Icon = getResourceIcon(resource.type);

              return (
                <div
                  key={resource.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{resource.progress}%</span>
                    </div>
                    <Progress value={resource.progress} className="h-2" />
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge className={getTypeColor(resource.type)}>
                      {resource.type}
                    </Badge>
                    {resource.difficulty && (
                      <Badge
                        className={getDifficultyColor(resource.difficulty)}
                      >
                        {resource.difficulty}
                      </Badge>
                    )}
                    {resource.estimatedTime && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        {resource.estimatedTime}
                      </Badge>
                    )}
                  </div>

                  {/* Tags */}
                  {resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        if (resource.progress < 100) {
                          onUpdateProgress(
                            resource.id,
                            Math.min(100, resource.progress + 10)
                          );
                        }
                      }}
                    >
                      <Play className="h-3 w-3 mr-2" />
                      {resource.progress === 0
                        ? 'Start'
                        : resource.progress === 100
                          ? 'Completed'
                          : 'Continue'}
                    </Button>
                    {resource.url && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
