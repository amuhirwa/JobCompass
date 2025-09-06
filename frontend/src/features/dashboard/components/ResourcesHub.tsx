import { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BookOpen,
  Video,
  FileText,
  Award,
  Play,
  Clock,
  Search,
  ExternalLink,
  CheckCircle2,
  Circle,
  Plus,
  X,
} from 'lucide-react';
import type { Resource, Occupation } from '@/features/dashboard/types';

interface ResourcesHubProps {
  resources: Resource[];
  occupations: Occupation[];
  onUpdateProgress: (resourceId: string, progress: number) => void;
  onAddResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
}

export function ResourcesHub({
  resources,
  occupations,
  onUpdateProgress,
  onAddResource,
}: ResourcesHubProps) {
  const { isDark } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterOccupation, setFilterOccupation] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'course' as Resource['type'],
    description: '',
    progress: 0,
    estimatedTime: '',
    difficulty: 'Beginner',
    tags: [] as string[],
    url: '',
    assignedOccupation: '',
  });
  const [tagInput, setTagInput] = useState('');

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
    const matchesOccupation =
      filterOccupation === 'all' ||
      resource.assignedOccupation === filterOccupation;

    return (
      matchesSearch && matchesType && matchesDifficulty && matchesOccupation
    );
  });

  const completedResources = resources.filter((r) => r.progress === 100).length;
  const inProgressResources = resources.filter(
    (r) => r.progress > 0 && r.progress < 100
  ).length;

  const handleAddTag = () => {
    if (tagInput.trim() && !newResource.tags.includes(tagInput.trim())) {
      setNewResource((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewResource((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmitResource = () => {
    if (!newResource.title.trim() || !newResource.description.trim()) {
      return;
    }

    onAddResource(newResource);
    setNewResource({
      title: '',
      type: 'course',
      description: '',
      progress: 0,
      estimatedTime: '',
      difficulty: 'Beginner',
      tags: [],
      url: '',
      assignedOccupation: '',
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Resources Hub
          </h2>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            AI-generated learning resources tailored to your career path
          </p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-tabiya-accent hover:bg-tabiya-accent/90 text-white">
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-background">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Add a new learning resource and assign it to a specific
                  occupation.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter resource title"
                    value={newResource.title}
                    onChange={(e) =>
                      setNewResource((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newResource.type}
                      onValueChange={(value: Resource['type']) =>
                        setNewResource((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="certification">
                          Certification
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={newResource.difficulty}
                      onValueChange={(value) =>
                        setNewResource((prev) => ({
                          ...prev,
                          difficulty: value,
                        }))
                      }
                    >
                      <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the resource content and what learners will gain"
                    value={newResource.description}
                    onChange={(e) =>
                      setNewResource((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Estimated Time</Label>
                    <Input
                      id="estimatedTime"
                      placeholder="e.g., 2 hours, 1 week"
                      value={newResource.estimatedTime}
                      onChange={(e) =>
                        setNewResource((prev) => ({
                          ...prev,
                          estimatedTime: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL (Optional)</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={newResource.url}
                      onChange={(e) =>
                        setNewResource((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Assign to Occupation</Label>
                  <Select
                    value={newResource.assignedOccupation}
                    onValueChange={(value) =>
                      setNewResource((prev) => ({
                        ...prev,
                        assignedOccupation: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupations.map((occupation) => (
                        <SelectItem
                          key={occupation.id}
                          value={occupation.title}
                        >
                          {occupation.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newResource.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitResource}>Add Resource</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedResources}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Circle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressResources}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950">
                <Circle className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {resources.length - completedResources - inProgressResources}
                </p>
                <p className="text-sm text-muted-foreground">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Select
              value={filterDifficulty}
              onValueChange={setFilterDifficulty}
            >
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
            <Select
              value={filterOccupation}
              onValueChange={setFilterOccupation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by occupation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Occupations</SelectItem>
                {occupations.map((occupation) => (
                  <SelectItem key={occupation.id} value={occupation.title}>
                    {occupation.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources List */}
      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-sm">
                Try adjusting your filters or search terms, or add a new
                resource.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = getResourceIcon(resource.type);

            return (
              <Card key={resource.id} className="flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-6 truncate">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {resource.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{resource.progress}%</span>
                    </div>
                    <Progress value={resource.progress} className="h-2" />
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2">
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

                  {/* Assigned Occupation */}
                  {resource.assignedOccupation && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Assigned to:{' '}
                      </span>
                      <span className="font-medium">
                        {resource.assignedOccupation}
                      </span>
                    </div>
                  )}

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
                  <div className="flex gap-2 pt-2">
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
