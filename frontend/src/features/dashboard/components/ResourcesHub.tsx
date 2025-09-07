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
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
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
      difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
      tags: [],
      url: '',
      assignedOccupation: '',
    });
    setShowAddModal(false);
  };

  return (
    <div
      className="space-y-6 w-full"
      role="main"
      aria-labelledby="resources-hub-heading"
    >
      <h2 id="resources-hub-heading" className="sr-only">
        Learning Resources Hub
      </h2>

      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
              aria-label="Add a new learning resource"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-2xl max-h-[80vh] overflow-y-auto"
            aria-labelledby="add-resource-title"
            aria-describedby="add-resource-description"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-background">
              <DialogHeader>
                <DialogTitle id="add-resource-title">
                  Add New Resource
                </DialogTitle>
                <DialogDescription id="add-resource-description">
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
                      onValueChange={(
                        value: 'Beginner' | 'Intermediate' | 'Advanced'
                      ) =>
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
      <section
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        role="region"
        aria-labelledby="resources-stats-heading"
      >
        <h3 id="resources-stats-heading" className="sr-only">
          Learning Progress Statistics
        </h3>

        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
          role="group"
          aria-labelledby="completed-stats"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-lg bg-green-50 dark:bg-green-950"
                aria-hidden="true"
              >
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                  aria-label={`${completedResources} resources completed`}
                >
                  {completedResources}
                </p>
                <p
                  id="completed-stats"
                  className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
                >
                  Completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
          role="group"
          aria-labelledby="progress-stats"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950"
                aria-hidden="true"
              >
                <Circle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                  aria-label={`${inProgressResources} resources in progress`}
                >
                  {inProgressResources}
                </p>
                <p
                  id="progress-stats"
                  className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
                >
                  In Progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
          role="group"
          aria-labelledby="not-started-stats"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950"
                aria-hidden="true"
              >
                <Circle className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                  aria-label={`${resources.length - completedResources - inProgressResources} resources not started`}
                >
                  {resources.length - completedResources - inProgressResources}
                </p>
                <p
                  id="not-started-stats"
                  className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
                >
                  Not Started
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Filters */}
      <Card
        className={
          isDark
            ? 'border-tabiya-dark bg-tabiya-medium'
            : 'border-gray-200 bg-white'
        }
        role="region"
        aria-labelledby="resource-filters-heading"
      >
        <CardHeader>
          <CardTitle
            id="resource-filters-heading"
            className={isDark ? 'text-white' : 'text-gray-900'}
          >
            Filter Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            role="group"
            aria-labelledby="resource-filters-heading"
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${
                  isDark
                    ? 'bg-tabiya-medium border-tabiya-dark text-white placeholder:text-white/60'
                    : ''
                }`}
                aria-label="Search through learning resources"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger
                className={
                  isDark ? 'border-tabiya-dark bg-tabiya-medium text-white' : ''
                }
                aria-label="Filter resources by type"
              >
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent
                className={isDark ? 'border-tabiya-dark bg-tabiya-medium' : ''}
              >
                <SelectItem
                  value="all"
                  className={
                    isDark
                      ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                      : ''
                  }
                >
                  All Types
                </SelectItem>
                <SelectItem
                  value="course"
                  className={
                    isDark
                      ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                      : ''
                  }
                >
                  Courses
                </SelectItem>
                <SelectItem
                  value="video"
                  className={
                    isDark
                      ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                      : ''
                  }
                >
                  Videos
                </SelectItem>
                <SelectItem
                  value="article"
                  className={
                    isDark
                      ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                      : ''
                  }
                >
                  Articles
                </SelectItem>
                <SelectItem
                  value="book"
                  className={
                    isDark
                      ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                      : ''
                  }
                >
                  Books
                </SelectItem>
                <SelectItem
                  value="certification"
                  className={
                    isDark
                      ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                      : ''
                  }
                >
                  Certifications
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterDifficulty}
              onValueChange={setFilterDifficulty}
            >
              <SelectTrigger
                className={
                  isDark ? 'border-tabiya-dark bg-tabiya-medium text-white' : ''
                }
                aria-label="Filter resources by difficulty level"
              >
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent
                className={isDark ? 'border-tabiya-dark bg-tabiya-medium' : ''}
              >
                <SelectItem
                  value="all"
                  className={
                    isDark
                      ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                      : ''
                  }
                >
                  All Levels
                </SelectItem>
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
            <Select
              value={filterOccupation}
              onValueChange={setFilterOccupation}
            >
              <SelectTrigger
                className={
                  isDark ? 'border-tabiya-dark bg-tabiya-medium text-white' : ''
                }
                aria-label="Filter resources by assigned occupation"
              >
                <SelectValue placeholder="Filter by occupation" />
              </SelectTrigger>
              <SelectContent
                className={isDark ? 'border-tabiya-dark bg-tabiya-medium' : ''}
              >
                <SelectItem
                  value="all"
                  className={
                    isDark
                      ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                      : ''
                  }
                >
                  All Occupations
                </SelectItem>
                {occupations.map((occupation) => (
                  <SelectItem
                    key={occupation.id}
                    value={occupation.title}
                    className={
                      isDark
                        ? 'text-white hover:bg-tabiya-dark focus:bg-tabiya-dark'
                        : ''
                    }
                  >
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
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
          role="status"
          aria-live="polite"
        >
          <CardContent className="p-12">
            <div
              className={`text-center ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}
            >
              <BookOpen
                className="h-12 w-12 mx-auto mb-4 opacity-50"
                aria-hidden="true"
              />
              <h3
                className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                id="no-resources-heading"
              >
                No resources found
              </h3>
              <p className="text-sm" aria-describedby="no-resources-heading">
                Try adjusting your filters or search terms, or add a new
                resource.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <section
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          role="region"
          aria-labelledby="resources-list-heading"
          aria-live="polite"
        >
          <h3 id="resources-list-heading" className="sr-only">
            Learning Resources ({filteredResources.length} resources found)
          </h3>
          {filteredResources.map((resource) => {
            const Icon = getResourceIcon(resource.type);

            return (
              <Card
                key={resource.id}
                className={`flex flex-col ${isDark ? 'border-tabiya-dark bg-tabiya-medium' : 'border-gray-200 bg-white'} rounded-2xl border transition-all duration-300 group shadow-lg hover:shadow-xl`}
                role="article"
                aria-labelledby={`resource-${resource.id}-title`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${isDark ? 'bg-tabiya-dark' : 'bg-muted'}`}
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle
                        className={`text-lg leading-6 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}
                        id={`resource-${resource.id}-title`}
                      >
                        {resource.title}
                      </CardTitle>
                      <CardDescription
                        className={`line-clamp-2 mt-1 ${isDark ? 'text-white/70' : ''}`}
                        aria-describedby={`resource-${resource.id}-title`}
                      >
                        {resource.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={
                          isDark ? 'text-white/70' : 'text-muted-foreground'
                        }
                      >
                        Progress
                      </span>
                      <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                        aria-live="polite"
                      >
                        {resource.progress}%
                      </span>
                    </div>
                    <Progress
                      value={resource.progress}
                      className="h-2"
                      aria-label={`Progress for ${resource.title}: ${resource.progress}%`}
                    />
                  </div>

                  {/* Metadata */}
                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label="Resource metadata"
                  >
                    <Badge
                      className={getTypeColor(resource.type)}
                      aria-label={`Resource type: ${resource.type}`}
                    >
                      {resource.type}
                    </Badge>
                    {resource.difficulty && (
                      <Badge
                        className={getDifficultyColor(resource.difficulty)}
                        aria-label={`Difficulty level: ${resource.difficulty}`}
                      >
                        {resource.difficulty}
                      </Badge>
                    )}
                    {resource.estimatedTime && (
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 ${
                          isDark ? 'border-white/20 text-white' : ''
                        }`}
                        aria-label={`Estimated time: ${resource.estimatedTime}`}
                      >
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {resource.estimatedTime}
                      </Badge>
                    )}
                  </div>

                  {/* Assigned Occupation */}
                  {resource.assignedOccupation && (
                    <div className="text-sm">
                      <span
                        className={
                          isDark ? 'text-white/70' : 'text-muted-foreground'
                        }
                      >
                        Assigned to:{' '}
                      </span>
                      <span
                        className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                        aria-label={`Assigned to ${resource.assignedOccupation} occupation`}
                      >
                        {resource.assignedOccupation}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {resource.tags.length > 0 && (
                    <div
                      className="flex flex-wrap gap-1"
                      role="group"
                      aria-label="Resource tags"
                    >
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={`text-xs ${
                            isDark ? 'bg-tabiya-dark text-white' : ''
                          }`}
                          aria-label={`Tag: ${tag}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            isDark ? 'bg-tabiya-dark text-white' : ''
                          }`}
                          aria-label={`${resource.tags.length - 3} more tags`}
                        >
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div
                    className="flex gap-2 pt-2"
                    role="group"
                    aria-label="Resource actions"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${
                        isDark
                          ? 'border-tabiya-dark text-white hover:bg-tabiya-dark'
                          : ''
                      }`}
                      onClick={() => {
                        if (resource.progress < 100) {
                          onUpdateProgress(
                            resource.id,
                            Math.min(100, resource.progress + 10)
                          );
                        }
                      }}
                      disabled={resource.progress === 100}
                      aria-label={
                        resource.progress === 0
                          ? `Start learning ${resource.title}`
                          : resource.progress === 100
                            ? `${resource.title} completed`
                            : `Continue learning ${resource.title}`
                      }
                    >
                      <Play className="h-3 w-3 mr-2" aria-hidden="true" />
                      {resource.progress === 0
                        ? 'Start'
                        : resource.progress === 100
                          ? 'Completed'
                          : 'Continue'}
                    </Button>
                    {resource.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          isDark
                            ? 'border-tabiya-dark text-white hover:bg-tabiya-dark'
                            : ''
                        }
                        onClick={() =>
                          window.open(
                            resource.url,
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                        aria-label={`Open external link for ${resource.title}`}
                      >
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}
