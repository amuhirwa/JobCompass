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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  MessageSquare,
  Heart,
  Share2,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react';
import type { CommunityPost } from '@/features/dashboard/types';

interface CommunityExploreProps {
  posts: CommunityPost[];
  onCreatePost: (
    post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments'>
  ) => void;
  onLikePost: (postId: string) => void;
}

export function CommunityExplore({
  posts,
  onCreatePost,
  onLikePost,
}: CommunityExploreProps) {
  const { isDark } = useDarkMode();
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const addTag = () => {
    if (newTag.trim() && !newPost.tags.includes(newTag.trim())) {
      setNewPost((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleCreatePost = () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      onCreatePost({
        author: { name: 'You' }, // This would come from user context
        title: newPost.title,
        content: newPost.content,
        tags: newPost.tags,
      });
      setNewPost({ title: '', content: '', tags: [] });
      setIsCreating(false);
    }
  };

  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      className={`w-full border-gray-200 ${
        isDark ? 'bg-tabiya-dark border-gray-700' : 'bg-white'
      }`}
    >
      <CardHeader>
        <CardTitle
          className={`flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          <Users className="h-5 w-5 text-tabiya-accent" />
          Community Explore
        </CardTitle>
        <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
          Share insights and learn from other professionals in your field
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Post Button */}
        {!isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Share Your Insights
          </Button>
        )}

        {/* Create Post Form */}
        {isCreating && (
          <Card
            className={`border-2 border-tabiya-accent/20 ${
              isDark ? 'bg-tabiya-dark' : 'bg-white'
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Create New Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Post title..."
                value={newPost.title}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, title: e.target.value }))
                }
                className={
                  isDark
                    ? 'bg-tabiya-medium border-gray-600 text-white placeholder:text-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }
              />
              <Textarea
                placeholder="Share your insights, experiences, or questions..."
                value={newPost.content}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={4}
                className={
                  isDark
                    ? 'bg-tabiya-medium border-gray-600 text-white placeholder:text-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }
              />

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tags..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className={
                      isDark
                        ? 'bg-tabiya-medium border-gray-600 text-white placeholder:text-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                    }
                  />
                  <Button
                    onClick={addTag}
                    variant="outline"
                    className={
                      isDark
                        ? 'border-gray-600 text-white hover:bg-tabiya-medium'
                        : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                    }
                  >
                    Add
                  </Button>
                </div>
                {newPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newPost.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={`cursor-pointer ${
                          isDark
                            ? 'bg-tabiya-medium text-white hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                  className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                >
                  Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  className={
                    isDark
                      ? 'border-gray-600 text-white hover:bg-tabiya-medium'
                      : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                  }
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDark ? 'text-gray-400' : 'text-muted-foreground'
              }`}
            />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${
                isDark
                  ? 'bg-tabiya-medium border-gray-600 text-white placeholder:text-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value: any) => setSortBy(value)}
          >
            <SelectTrigger
              className={`w-full sm:w-[200px] ${
                isDark
                  ? 'bg-tabiya-medium border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className={
                isDark
                  ? 'bg-tabiya-medium border-gray-600'
                  : 'bg-white border-gray-200'
              }
            >
              <SelectItem
                value="recent"
                className={
                  isDark
                    ? 'text-white hover:bg-gray-600'
                    : 'text-gray-900 hover:bg-gray-50'
                }
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Most Recent
                </div>
              </SelectItem>
              <SelectItem
                value="popular"
                className={
                  isDark
                    ? 'text-white hover:bg-gray-600'
                    : 'text-gray-900 hover:bg-gray-50'
                }
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Most Popular
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div
            className={`text-center py-8 ${
              isDark ? 'text-gray-400' : 'text-muted-foreground'
            }`}
          >
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No posts found</p>
            <p className="text-sm">Be the first to share your insights!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className={`hover:shadow-md transition-shadow ${
                  isDark
                    ? 'bg-tabiya-dark border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Author and timestamp */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback
                        className={
                          isDark
                            ? 'bg-tabiya-medium text-white'
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {post.author.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p
                        className={`font-medium text-sm ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {post.author.name}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-muted-foreground'
                        }`}
                      >
                        {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3
                      className={`font-semibold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {post.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-muted-foreground'
                      }`}
                    >
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={`text-xs ${
                            isDark
                              ? 'border-gray-600 text-gray-300'
                              : 'border-gray-300 text-gray-700'
                          }`}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div
                    className={`flex items-center gap-4 pt-2 border-t ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-2 hover:text-red-600 ${
                        isDark ? 'text-gray-400' : 'text-muted-foreground'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      {post.likes > 0 && <span>{post.likes}</span>}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-2 ${
                        isDark ? 'text-gray-400' : 'text-muted-foreground'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      {post.comments.length > 0 && (
                        <span>{post.comments.length}</span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-2 ${
                        isDark ? 'text-gray-400' : 'text-muted-foreground'
                      }`}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
