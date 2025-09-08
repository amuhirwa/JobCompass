import uuid
from django.db import models
from django.contrib.auth.models import User


class CommunityPost(models.Model):
    POST_TYPES = [
        ('question', 'Question'),
        ('discussion', 'Discussion'),
        ('resource', 'Resource Share'),
        ('achievement', 'Achievement'),
        ('tip', 'Tip'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_posts')
    title = models.CharField(max_length=200)
    content = models.TextField()
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default='discussion')
    tags = models.JSONField(default=list, blank=True)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_pinned', '-created_at']
        
    def __str__(self):
        return f"{self.title} by {self.author.username}"


class CommunityComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_comments')
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    likes_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
        
    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"


class CommunityLike(models.Model):
    LIKE_TYPES = [
        ('post', 'Post'),
        ('comment', 'Comment'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    like_type = models.CharField(max_length=10, choices=LIKE_TYPES)
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(CommunityComment, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = [
            ('user', 'post'),
            ('user', 'comment'),
        ]
        
    def __str__(self):
        if self.post:
            return f"{self.user.username} likes post: {self.post.title}"
        return f"{self.user.username} likes comment by {self.comment.author.username}"


class CommunityGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')
    members = models.ManyToManyField(User, through='CommunityGroupMembership', related_name='community_groups')
    is_private = models.BooleanField(default=False)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class CommunityGroupMembership(models.Model):
    MEMBER_ROLES = [
        ('member', 'Member'),
        ('moderator', 'Moderator'),
        ('admin', 'Admin'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(CommunityGroup, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=MEMBER_ROLES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'group']
        
    def __str__(self):
        return f"{self.user.username} in {self.group.name} as {self.role}"
