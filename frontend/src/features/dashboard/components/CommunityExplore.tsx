import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/lib/auth-context";
import {
  MessageSquare,
  Heart,
  Share2,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Users,
  Eye,
  Pin,
  Send,
  X,
} from "lucide-react";
import api from "@/lib/api";
import type { CommunityPost, CreateCommunityPost } from "@/lib/types";

interface CommunityExploreProps {
  // Remove the old props as we'll fetch data directly from backend
}

export function CommunityExplore({}: CommunityExploreProps) {
  const { isDark } = useDarkMode();
  const { user: authUser } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState<CreateCommunityPost>({
    title: "",
    content: "",
    post_type: "discussion",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">(
    "recent"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trendingTopics, setTrendingTopics] = useState<
    { tag: string; count: number }[]
  >([]);

  // Load posts and trending topics
  useEffect(() => {
    loadPosts();
  }, [sortBy, searchTerm, currentPage]);

  useEffect(() => {
    loadTrendingTopics();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await api.getCommunityPosts({
        page: currentPage,
        page_size: 10,
        search: searchTerm || undefined,
        sort: sortBy,
      });
      setPosts(response.results);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingTopics = async () => {
    try {
      const response = await api.getTrendingTopics();
      setTrendingTopics(response.trending_topics);
    } catch (error) {
      console.error("Error loading trending topics:", error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !newPost.tags.includes(newTag.trim())) {
      setNewPost((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleCreatePost = async () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      try {
        const createdPost = await api.createCommunityPost(newPost);

        // Create a complete post object with author information
        const postWithAuthor: CommunityPost = {
          ...createdPost,
          author: {
            id: authUser?.id?.toString() || "1",
            username: authUser?.username || "Unknown",
            first_name: authUser?.first_name || "",
            last_name: authUser?.last_name || "",
            avatar: "/api/placeholder/150/150",
          },
          comments: [],
          is_liked: false,
        };

        setPosts((prev) => [postWithAuthor, ...prev]);
        setNewPost({
          title: "",
          content: "",
          post_type: "discussion",
          tags: [],
        });
        setIsCreating(false);
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const result = await api.likeCommunityPost(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes_count: result.likes_count,
                is_liked: result.liked,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadPosts();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "question":
        return "bg-blue-100 text-blue-800";
      case "discussion":
        return "bg-green-100 text-green-800";
      case "resource":
        return "bg-purple-100 text-purple-800";
      case "achievement":
        return "bg-yellow-100 text-yellow-800";
      case "tip":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header with Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Community</h1>
            <p className="text-muted-foreground">
              Connect, share, and learn with fellow professionals
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value: any) => setSortBy(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create Post Form */}
        {isCreating && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Post</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Post title..."
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />

              <Select
                value={newPost.post_type}
                onValueChange={(value: any) =>
                  setNewPost({ ...newPost, post_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discussion">Discussion</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="resource">Resource Share</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="tip">Tip</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                rows={4}
              />

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    className="flex-1"
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
                {newPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newPost.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost} className="gap-2">
                  <Send className="h-4 w-4" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a conversation!
              </p>
              <Button onClick={() => setIsCreating(true)}>Create Post</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post?.author?.avatar} />
                        <AvatarFallback>
                          {post.author.first_name?.[0] ||
                            post.author.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {post.author.first_name && post.author.last_name
                              ? `${post.author.first_name} ${post.author.last_name}`
                              : post.author.username}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getPostTypeColor(post.post_type)}
                          >
                            {post.post_type}
                          </Badge>
                          {post.is_pinned && (
                            <Pin className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(post.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-muted-foreground">{post.content}</p>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikePost(post.id)}
                        className={`gap-2 ${post.is_liked ? "text-red-500" : ""}`}
                      >
                        <Heart
                          className={`h-4 w-4 ${post.is_liked ? "fill-current" : ""}`}
                        />
                        {post.likes_count}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments_count}
                      </Button>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {post.views_count}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:w-80 space-y-6">
        {/* Trending Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendingTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No trending topics yet
              </p>
            ) : (
              <div className="space-y-2">
                {trendingTopics.slice(0, 5).map((topic) => (
                  <div
                    key={topic.tag}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setSearchTerm(topic.tag);
                      handleSearch();
                    }}
                  >
                    <span className="text-sm font-medium">#{topic.tag}</span>
                    <span className="text-xs text-muted-foreground">
                      {topic.count} posts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setNewPost({ ...newPost, post_type: "question" });
                setIsCreating(true);
              }}
            >
              Ask a Question
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setNewPost({ ...newPost, post_type: "resource" });
                setIsCreating(true);
              }}
            >
              Share Resource
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setNewPost({ ...newPost, post_type: "achievement" });
                setIsCreating(true);
              }}
            >
              Share Achievement
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
