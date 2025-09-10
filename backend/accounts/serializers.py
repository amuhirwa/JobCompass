from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, UserSkill, UserGoal, UserLearningResource, UserResourceProgress
from taxonomy.models import Skill, Occupation, OccupationToSkillRelation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']

class SkillSummarySerializer(serializers.ModelSerializer):
    """Simplified skill serializer for nested use"""
    related_occupations = serializers.SerializerMethodField()
    
    class Meta:
        model = Skill
        fields = ['id', 'preferred_label', 'skill_type', 'related_occupations']

    def get_related_occupations(self, obj):
        # Get occupations that use this skill
        occupation_relations = OccupationToSkillRelation.objects.filter(skill=obj)[:10]
        
        related_occupations = []
        for rel in occupation_relations:
            # Get total skills required for this occupation
            total_skills_for_occupation = OccupationToSkillRelation.objects.filter(
                occupation=rel.occupation
            ).count()
            
            related_occupations.append({
                'occupation_id': rel.occupation.id,
                'occupation_name': rel.occupation.preferred_label,
                'occupation_type': rel.occupation.occupation_type,
                'occupation_description': rel.occupation.description,
                'relation_type': rel.relation_type,
                'signalling_value': rel.signalling_value,
                'signalling_value_label': rel.signalling_value_label,
                'total_skills_required': total_skills_for_occupation
            })
        
        return related_occupations

class OccupationSummarySerializer(serializers.ModelSerializer):
    """Simplified occupation serializer for nested use"""
    class Meta:
        model = Occupation
        fields = ['id', 'preferred_label', 'occupation_type']

class UserSkillSerializer(serializers.ModelSerializer):
    skill = SkillSummarySerializer(read_only=True)
    skill_id = serializers.CharField(max_length=100, write_only=True)
    
    class Meta:
        model = UserSkill
        fields = [
            'id', 'skill', 'skill_id', 'proficiency_level', 
            'years_of_experience', 'is_primary', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class UserGoalSerializer(serializers.ModelSerializer):
    target_skill = SkillSummarySerializer(read_only=True)
    target_occupation = OccupationSummarySerializer(read_only=True)
    target_skill_id = serializers.CharField(max_length=100, write_only=True, required=False, allow_null=True)
    target_occupation_id = serializers.CharField(max_length=100, write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = UserGoal
        fields = [
            'id', 'title', 'description', 'goal_type', 'target_skill', 'target_occupation',
            'target_skill_id', 'target_occupation_id', 'target_date', 'status', 
            'progress_percentage', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    current_occupation = OccupationSummarySerializer(read_only=True)
    target_occupation = OccupationSummarySerializer(read_only=True)
    current_occupation_id = serializers.CharField(max_length=100, write_only=True, required=False, allow_null=True)
    target_occupation_id = serializers.CharField(max_length=100, write_only=True, required=False, allow_null=True)
    skills = UserSkillSerializer(many=True, read_only=True)
    goals = UserGoalSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'onboarding_completed', 'onboarding_step',
            'bio', 'location', 'phone', 'linkedin_url', 'github_url', 'portfolio_url',
            'current_occupation', 'target_occupation', 'current_occupation_id', 'target_occupation_id',
            'experience_level', 'career_goal', 'skills', 'goals', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class OnboardingStepSerializer(serializers.Serializer):
    """Serializer for onboarding step data"""
    step = serializers.IntegerField()
    data = serializers.DictField()

class CompleteOnboardingSerializer(serializers.Serializer):
    """Serializer for completing onboarding"""
    # Basic info (step 1)
    bio = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    
    # Career info (step 2)
    current_occupation_id = serializers.CharField(max_length=100, required=False, allow_null=True)
    target_occupation_id = serializers.CharField(max_length=100, required=False, allow_null=True)
    experience_level = serializers.ChoiceField(choices=UserProfile.EXPERIENCE_LEVELS, required=False)
    career_goal = serializers.ChoiceField(choices=UserProfile.CAREER_GOALS, required=False)
    
    # Skills (step 3)
    skills = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        ),
        required=False
    )
    
    # Goals (step 4)
    goals = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        ),
        required=False
    )


class UserLearningResourceSerializer(serializers.ModelSerializer):
    related_skill_name = serializers.CharField(source='related_skill.preferred_label', read_only=True)
    related_goal_title = serializers.CharField(source='related_goal.title', read_only=True)
    time_spent_hours = serializers.ReadOnlyField()
    is_completed = serializers.ReadOnlyField()
    
    class Meta:
        model = UserLearningResource
        fields = [
            'id', 'title', 'description', 'url', 'resource_type', 'difficulty_level',
            'provider', 'duration', 'cost', 'is_free', 'rating', 'status',
            'progress_percentage', 'time_spent_minutes', 'time_spent_hours',
            'started_at', 'completed_at', 'related_skill', 'related_skill_name',
            'related_goal', 'related_goal_title', 'ai_generated', 'is_completed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'ai_generated']


class CreateUserLearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLearningResource
        fields = [
            'title', 'description', 'url', 'resource_type', 'difficulty_level',
            'provider', 'duration', 'cost', 'is_free', 'rating', 'related_skill', 'related_goal'
        ]
    
    def create(self, validated_data):
        # Get user profile from context
        user_profile = self.context['request'].user.profile
        validated_data['user_profile'] = user_profile
        return super().create(validated_data)


class UpdateResourceProgressSerializer(serializers.ModelSerializer):
    session_duration_minutes = serializers.IntegerField(required=False, min_value=0)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = UserLearningResource
        fields = ['progress_percentage', 'status', 'time_spent_minutes', 'session_duration_minutes', 'notes']
    
    def update(self, instance, validated_data):
        from django.utils import timezone
        session_duration = validated_data.pop('session_duration_minutes', 0)
        notes = validated_data.pop('notes', '')
        
        # Track progress before update
        progress_before = instance.progress_percentage
        
        # Update the resource
        instance = super().update(instance, validated_data)
        
        # Auto-set completed_at if progress reaches 100%
        if instance.progress_percentage == 100 and instance.status != 'completed':
            instance.status = 'completed'
            instance.completed_at = timezone.now()
            instance.save()
        
        # Auto-set started_at if not set and progress > 0
        if instance.progress_percentage > 0 and not instance.started_at:
            instance.started_at = timezone.now()
            instance.save()
        
        # Create progress session record if session duration provided
        if session_duration > 0:
            from .models import UserResourceProgress
            UserResourceProgress.objects.create(
                resource=instance,
                session_duration_minutes=session_duration,
                progress_before=progress_before,
                progress_after=instance.progress_percentage,
                notes=notes
            )
            
            # Add session time to total time spent
            instance.time_spent_minutes += session_duration
            instance.save()
        
        return instance


class UserResourceProgressSerializer(serializers.ModelSerializer):
    resource_title = serializers.CharField(source='resource.title', read_only=True)
    progress_change = serializers.SerializerMethodField()
    
    class Meta:
        model = UserResourceProgress
        fields = [
            'id', 'resource', 'resource_title', 'session_date', 'session_duration_minutes',
            'progress_before', 'progress_after', 'progress_change', 'notes'
        ]
        read_only_fields = ['id', 'session_date']
    
    def get_progress_change(self, obj):
        return obj.progress_after - obj.progress_before
