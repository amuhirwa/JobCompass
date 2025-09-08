from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CommunityPost, CommunityComment, CommunityLike, CommunityGroup, CommunityGroupMembership


class AuthorSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar']
        
    def get_avatar(self, obj):
        return f"/api/placeholder/150/150"  # Placeholder avatar


class CommunityCommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityComment
        fields = ['id', 'author', 'content', 'parent', 'likes_count', 'created_at', 'updated_at', 'replies']
        read_only_fields = ['id', 'author', 'likes_count', 'created_at', 'updated_at']
        
    def get_replies(self, obj):
        if obj.parent is None:  # Only get replies for top-level comments
            replies = obj.replies.all()
            return CommunityCommentSerializer(replies, many=True, context=self.context).data
        return []


class CommunityPostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    comments = CommunityCommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityPost
        fields = [
            'id', 'author', 'title', 'content', 'post_type', 'tags',
            'likes_count', 'comments_count', 'views_count', 'is_pinned',
            'created_at', 'updated_at', 'comments', 'is_liked'
        ]
        read_only_fields = [
            'id', 'author', 'likes_count', 'comments_count', 'views_count',
            'created_at', 'updated_at'
        ]
        
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CommunityLike.objects.filter(
                user=request.user,
                post=obj,
                like_type='post'
            ).exists()
        return False


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityPost
        fields = ['title', 'content', 'post_type', 'tags']
        
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityComment
        fields = ['content', 'parent']
        
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        validated_data['post_id'] = self.context['post_id']
        return super().create(validated_data)


class CommunityGroupSerializer(serializers.ModelSerializer):
    creator = AuthorSerializer(read_only=True)
    members_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityGroup
        fields = [
            'id', 'name', 'description', 'creator', 'is_private', 'tags',
            'created_at', 'members_count', 'is_member'
        ]
        read_only_fields = ['id', 'creator', 'created_at']
        
    def get_members_count(self, obj):
        return obj.members.count()
        
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False
