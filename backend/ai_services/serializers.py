from rest_framework import serializers
from .models import MarketInsight, CareerPath, CareerStep, CareerStepSkill, LearningResource
from taxonomy.serializers import SkillSerializer


class MarketInsightSerializer(serializers.ModelSerializer):
    """Serializer for market insights"""
    
    class Meta:
        model = MarketInsight
        fields = [
            'id', 'average_salary', 'growth_rate', 'remote_opportunities_percentage',
            'demand_level', 'market_trends', 'key_regions', 'industry_outlook',
            'created_at', 'updated_at'
        ]


class LearningResourceSerializer(serializers.ModelSerializer):
    """Serializer for learning resources"""
    
    class Meta:
        model = LearningResource
        fields = [
            'id', 'title', 'description', 'resource_type', 'url', 'provider',
            'duration', 'difficulty_level', 'is_free', 'rating', 'cost'
        ]


class CareerStepSkillSerializer(serializers.ModelSerializer):
    """Serializer for career step skills"""
    skill = SkillSerializer(read_only=True)
    learning_resources = LearningResourceSerializer(
        source='skill.learning_resources', 
        many=True, 
        read_only=True
    )
    
    class Meta:
        model = CareerStepSkill
        fields = [
            'id', 'skill', 'importance_level', 'proficiency_level', 
            'learning_resources'
        ]


class CareerStepSerializer(serializers.ModelSerializer):
    """Serializer for career steps"""
    required_skills = CareerStepSkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = CareerStep
        fields = [
            'id', 'step_number', 'title', 'description', 'estimated_duration',
            'requirements', 'typical_salary_range', 'required_skills'
        ]


class CareerPathSerializer(serializers.ModelSerializer):
    """Serializer for career paths"""
    steps = CareerStepSerializer(many=True, read_only=True)
    
    class Meta:
        model = CareerPath
        fields = [
            'id', 'path_name', 'description', 'estimated_duration',
            'difficulty_level', 'steps'
        ]


class SkillLearningResourcesSerializer(serializers.ModelSerializer):
    """Serializer for skill with learning resources"""
    learning_resources = LearningResourceSerializer(many=True, read_only=True)
    
    class Meta:
        model = LearningResource
        fields = ['learning_resources']
