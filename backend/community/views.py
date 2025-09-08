from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, F
from django.db import transaction
from .models import CommunityPost, CommunityComment, CommunityLike, CommunityGroup
from .serializers import (
    CommunityPostSerializer, CreatePostSerializer, CreateCommentSerializer,
    CommunityCommentSerializer, CommunityGroupSerializer
)


class CommunityPostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class CommunityPostListCreateView(generics.ListCreateAPIView):
    queryset = CommunityPost.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CommunityPostPagination
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreatePostSerializer
        return CommunityPostSerializer
    
    def get_queryset(self):
        queryset = CommunityPost.objects.select_related('author').prefetch_related('comments__author')
        
        # Search functionality
        search = self.request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(content__icontains=search) |
                Q(tags__icontains=search)
            )
        
        # Filter by post type
        post_type = self.request.query_params.get('type', '')
        if post_type:
            queryset = queryset.filter(post_type=post_type)
        
        # Filter by tags
        tags = self.request.query_params.get('tags', '')
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            for tag in tag_list:
                queryset = queryset.filter(tags__icontains=tag)
        
        # Sort options
        sort_by = self.request.query_params.get('sort', 'recent')
        if sort_by == 'popular':
            queryset = queryset.order_by('-likes_count', '-created_at')
        elif sort_by == 'trending':
            # Simple trending algorithm: posts with recent activity
            queryset = queryset.order_by('-comments_count', '-likes_count', '-created_at')
        else:  # recent
            queryset = queryset.order_by('-is_pinned', '-created_at')
        
        return queryset


class CommunityPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommunityPost.objects.all()
    serializer_class = CommunityPostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def retrieve(self, request, *args, **kwargs):
        # Increment view count
        post = self.get_object()
        CommunityPost.objects.filter(id=post.id).update(views_count=F('views_count') + 1)
        return super().retrieve(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author != request.user:
            return Response(
                {'error': 'You can only edit your own posts'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author != request.user:
            return Response(
                {'error': 'You can only delete your own posts'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_post(request, post_id):
    try:
        post = CommunityPost.objects.get(id=post_id)
    except CommunityPost.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    like, created = CommunityLike.objects.get_or_create(
        user=request.user,
        post=post,
        like_type='post'
    )
    
    if not created:
        # Unlike the post
        like.delete()
        CommunityPost.objects.filter(id=post_id).update(likes_count=F('likes_count') - 1)
        return Response({'liked': False, 'likes_count': post.likes_count - 1})
    else:
        # Like the post
        CommunityPost.objects.filter(id=post_id).update(likes_count=F('likes_count') + 1)
        return Response({'liked': True, 'likes_count': post.likes_count + 1})


class CommunityCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunityCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return CommunityComment.objects.filter(
            post_id=post_id, 
            parent__isnull=True  # Only top-level comments
        ).select_related('author').prefetch_related('replies__author')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateCommentSerializer
        return CommunityCommentSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['post_id'] = self.kwargs['post_id']
        return context
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        try:
            post = CommunityPost.objects.get(id=post_id)
        except CommunityPost.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        comment = serializer.save(post=post)
        # Update comment count
        CommunityPost.objects.filter(id=post_id).update(comments_count=F('comments_count') + 1)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_comment(request, comment_id):
    try:
        comment = CommunityComment.objects.get(id=comment_id)
    except CommunityComment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    like, created = CommunityLike.objects.get_or_create(
        user=request.user,
        comment=comment,
        like_type='comment'
    )
    
    if not created:
        # Unlike the comment
        like.delete()
        CommunityComment.objects.filter(id=comment_id).update(likes_count=F('likes_count') - 1)
        return Response({'liked': False, 'likes_count': comment.likes_count - 1})
    else:
        # Like the comment
        CommunityComment.objects.filter(id=comment_id).update(likes_count=F('likes_count') + 1)
        return Response({'liked': True, 'likes_count': comment.likes_count + 1})


class CommunityGroupListCreateView(generics.ListCreateAPIView):
    queryset = CommunityGroup.objects.all()
    serializer_class = CommunityGroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        group = serializer.save(creator=self.request.user)
        # Automatically add creator as admin member
        from .models import CommunityGroupMembership
        CommunityGroupMembership.objects.create(
            user=self.request.user,
            group=group,
            role='admin'
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def trending_topics(request):
    """Get trending topics based on recent post activity"""
    from django.db.models import Count
    from datetime import datetime, timedelta
    
    # Get tags from posts created in the last 7 days
    week_ago = datetime.now() - timedelta(days=7)
    
    # This is a simplified version - in production you might want to use a proper text processing library
    trending_tags = []
    recent_posts = CommunityPost.objects.filter(created_at__gte=week_ago)
    
    tag_counts = {}
    for post in recent_posts:
        for tag in post.tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
    
    # Sort by count and take top 10
    trending_tags = [
        {'tag': tag, 'count': count} 
        for tag, count in sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    ]
    
    return Response({'trending_topics': trending_tags})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def community_stats(request):
    """Get overall community statistics"""
    total_posts = CommunityPost.objects.count()
    total_comments = CommunityComment.objects.count()
    total_users = CommunityPost.objects.values('author').distinct().count()
    
    # Recent activity (last 7 days)
    from datetime import datetime, timedelta
    week_ago = datetime.now() - timedelta(days=7)
    
    recent_posts = CommunityPost.objects.filter(created_at__gte=week_ago).count()
    recent_comments = CommunityComment.objects.filter(created_at__gte=week_ago).count()
    
    return Response({
        'total_posts': total_posts,
        'total_comments': total_comments,
        'total_users': total_users,
        'recent_posts': recent_posts,
        'recent_comments': recent_comments,
    })
