from django.urls import path
from . import views

urlpatterns = [
    # Posts
    path('posts/', views.CommunityPostListCreateView.as_view(), name='community_posts'),
    path('posts/<uuid:pk>/', views.CommunityPostDetailView.as_view(), name='community_post_detail'),
    path('posts/<uuid:post_id>/like/', views.like_post, name='like_post'),
    
    # Comments
    path('posts/<uuid:post_id>/comments/', views.CommunityCommentListCreateView.as_view(), name='post_comments'),
    path('comments/<uuid:comment_id>/like/', views.like_comment, name='like_comment'),
    
    # Groups
    path('groups/', views.CommunityGroupListCreateView.as_view(), name='community_groups'),
    
    # Trending and stats
    path('trending/', views.trending_topics, name='trending_topics'),
    path('stats/', views.community_stats, name='community_stats'),
]
