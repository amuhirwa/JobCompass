from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import transaction
from decimal import Decimal
import logging
import time

from taxonomy.models import Occupation, Skill
from .models import MarketInsight, CareerPath, CareerStep, CareerStepSkill, LearningResource
from .serializers import (
    MarketInsightSerializer, 
    CareerPathSerializer, 
    LearningResourceSerializer
)
from .gemini_service import GeminiService

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def occupation_market_insights(request, occupation_id):
    """Get or generate market insights for an occupation"""
    occupation = get_object_or_404(Occupation, id=occupation_id)
    
    if request.method == 'GET':
        try:
            market_insight = MarketInsight.objects.get(occupation=occupation)
            serializer = MarketInsightSerializer(market_insight)
            return Response(serializer.data)
        except MarketInsight.DoesNotExist:
            return Response(
                {'detail': 'Market insights not available. Use POST to generate.'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    elif request.method == 'POST':
        # Generate market insights using Gemini AI
        gemini_service = GeminiService()
        
        try:
            # Generate insights
            insights_data = gemini_service.generate_market_insights(
                occupation.preferred_label,
                occupation.description or occupation.definition
            )
            
            # Create or update market insight
            market_insight, created = MarketInsight.objects.update_or_create(
                occupation=occupation,
                defaults={
                    'average_salary': Decimal(str(insights_data['average_salary'])),
                    'growth_rate': insights_data['growth_rate'],
                    'remote_opportunities_percentage': insights_data['remote_opportunities_percentage'],
                    'demand_level': insights_data['demand_level'],
                    'market_trends': insights_data['market_trends'],
                    'key_regions': insights_data['key_regions'],
                    'industry_outlook': insights_data['industry_outlook'],
                }
            )
            
            serializer = MarketInsightSerializer(market_insight)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Error generating market insights: {str(e)}")
            return Response(
                {'detail': 'Error generating market insights. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def occupation_career_paths(request, occupation_id):
    """Get or generate career paths for an occupation"""
    occupation = get_object_or_404(Occupation, id=occupation_id)
    
    if request.method == 'GET':
        career_paths = CareerPath.objects.filter(occupation=occupation).prefetch_related(
            'steps__required_skills__skill',
            'steps__required_skills__skill__learning_resources'
        )
        serializer = CareerPathSerializer(career_paths, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check if we should force regeneration
        force_regenerate = request.data.get('force', True)
        
        # Check if recent career paths already exist (within last 24 hours)
        from django.utils import timezone
        from datetime import timedelta
        
        if not force_regenerate:
            recent_paths = CareerPath.objects.filter(
                occupation=occupation,
                created_at__gte=timezone.now() - timedelta(hours=24)
            ).exists()
            
            if recent_paths:
                # Return existing paths instead of regenerating
                career_paths = CareerPath.objects.filter(occupation=occupation).prefetch_related(
                    'steps__required_skills__skill',
                    'steps__required_skills__skill__learning_resources'
                )
                serializer = CareerPathSerializer(career_paths, many=True)
                return Response({
                    'message': 'Recent career paths found, returning existing data. Use force=true to regenerate.',
                    'data': serializer.data
                })
        
        # Generate career paths using Gemini AI
        gemini_service = GeminiService()
        
        try:
            logger.info(f"Starting career path generation for occupation: {occupation.preferred_label}")
            start_time = time.time()
            print(f"Generating career paths for {occupation.preferred_label}")
            
            # Clear existing career paths for this occupation
            CareerPath.objects.filter(occupation=occupation).delete()
            
            # Generate new career paths with timeout handling
            career_paths_data = gemini_service.generate_career_paths(
                occupation.preferred_label,
                occupation.description or occupation.definition
            )
            
            generation_time = time.time() - start_time
            logger.info(f"Career path generation completed in {generation_time:.2f} seconds")
            
            if not career_paths_data:
                logger.warning(f"No career paths generated for {occupation.preferred_label}")
                return Response(
                    {'detail': 'No career paths could be generated for this occupation.'},
                    status=status.HTTP_204_NO_CONTENT
                )
            
            print("Got response")
            created_paths = []
            
            # Pre-fetch all skills that might be needed to reduce database queries
            all_skill_names = set()
            for path_data in career_paths_data:
                for step_data in path_data.get('steps', []):
                    for skill_data in step_data.get('required_skills', []):
                        skill_name = skill_data.get('skill_name', '').strip()
                        if skill_name:
                            all_skill_names.add(skill_name.lower())
            
            # Bulk lookup existing skills
            existing_skills = {}
            if all_skill_names:
                skills_queryset = Skill.objects.filter(
                    preferred_label__iregex=r'^(' + '|'.join(all_skill_names) + r')$'
                )
                for skill in skills_queryset:
                    existing_skills[skill.preferred_label.lower()] = skill
            
            print(f"Found {len(existing_skills)} existing skills out of {len(all_skill_names)} requested")
            
            with transaction.atomic():
                for path_data in career_paths_data:
                    try:
                        print("Doing career path:", path_data.get('path_name', 'Unknown'))
                        
                        # Create career path
                        career_path = CareerPath.objects.create(
                            occupation=occupation,
                            path_name=path_data.get('path_name', 'Career Path'),
                            description=path_data.get('description', ''),
                            estimated_duration=path_data.get('estimated_duration', 'N/A'),
                            difficulty_level=path_data.get('difficulty_level', 'intermediate')
                        )
                        
                        # Batch create career steps
                        steps_to_create = []
                        for step_data in path_data.get('steps', []):
                            try:
                                career_step = CareerStep.objects.create(
                                    career_path=career_path,
                                    step_number=step_data.get('step_number', 1),
                                    title=step_data.get('title', 'Career Step'),
                                    description=step_data.get('description', ''),
                                    estimated_duration=step_data.get('estimated_duration', 'N/A'),
                                    requirements=step_data.get('requirements', ''),
                                    typical_salary_range=step_data.get('typical_salary_range', 'N/A')
                                )
                                
                                # Batch create career step skills
                                skills_to_create = []
                                for skill_data in step_data.get('required_skills', []):
                                    skill_name = skill_data.get('skill_name', '').strip()
                                    if skill_name:
                                        skill = existing_skills.get(skill_name.lower())
                                        if skill:
                                            skills_to_create.append(CareerStepSkill(
                                                career_step=career_step,
                                                skill=skill,
                                                importance_level=skill_data.get('importance_level', 'important'),
                                                proficiency_level=skill_data.get('proficiency_level', 'intermediate')
                                            ))
                                
                                # Bulk create the skills for this step
                                if skills_to_create:
                                    CareerStepSkill.objects.bulk_create(skills_to_create, ignore_conflicts=True)
                                        
                            except Exception as step_error:
                                logger.warning(f"Error creating career step: {step_error}")
                                continue
                        
                        created_paths.append(career_path)
                        
                    except Exception as path_error:
                        logger.warning(f"Error creating career path: {path_error}")
                        continue
            
            # Return the created career paths
            career_paths = CareerPath.objects.filter(occupation=occupation).prefetch_related(
                'steps__required_skills__skill',
                'steps__required_skills__skill__learning_resources'
            )
            serializer = CareerPathSerializer(career_paths, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error generating career paths: {str(e)}")
            return Response(
                {'detail': 'Error generating career paths. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def skill_learning_resources(request, skill_id):
    """Get or generate learning resources for a skill"""
    skill = get_object_or_404(Skill, id=skill_id)
    
    if request.method == 'GET':
        resources = LearningResource.objects.filter(skill=skill)
        serializer = LearningResourceSerializer(resources, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Generate learning resources using Gemini AI
        gemini_service = GeminiService()
        
        try:
            # Clear existing resources for this skill
            LearningResource.objects.filter(skill=skill).delete()
            
            # Generate new resources
            resources_data = gemini_service.generate_learning_resources(
                skill.preferred_label,
                skill.description or skill.definition
            )

            
            created_resources = []
            
            for resource_data in resources_data:
                resource = LearningResource.objects.create(
                    skill=skill,
                    title=resource_data['title'],
                    description=resource_data['description'],
                    resource_type=resource_data['resource_type'],
                    url=resource_data.get('url', ''),
                    provider=resource_data.get('provider', ''),
                    duration=resource_data.get('duration', ''),
                    difficulty_level=resource_data['difficulty_level'],
                    is_free=resource_data['is_free'],
                    rating=resource_data.get('rating'),
                    cost=resource_data.get('cost', '')
                )
                created_resources.append(resource)
            serializer = LearningResourceSerializer(created_resources, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error generating learning resources: {str(e)}")
            return Response(
                {'detail': 'Error generating learning resources. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


def _find_or_create_skill(skill_name: str):
    """Find existing skill by name or return None"""
    try:
        # Try exact match first
        return Skill.objects.filter(preferred_label__iexact=skill_name).first()
    except Exception:
        return None


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_all_insights(request, occupation_id):
    """Generate both market insights and career paths for an occupation"""
    occupation = get_object_or_404(Occupation, id=occupation_id)
    gemini_service = GeminiService()
    
    try:
        results = {}
        
        # Generate market insights
        insights_data = gemini_service.generate_market_insights(
            occupation.preferred_label,
            occupation.description or occupation.definition
        )
        
        market_insight, _ = MarketInsight.objects.update_or_create(
            occupation=occupation,
            defaults={
                'average_salary': Decimal(str(insights_data['average_salary'])),
                'growth_rate': insights_data['growth_rate'],
                'remote_opportunities_percentage': insights_data['remote_opportunities_percentage'],
                'demand_level': insights_data['demand_level'],
                'market_trends': insights_data['market_trends'],
                'key_regions': insights_data['key_regions'],
                'industry_outlook': insights_data['industry_outlook'],
            }
        )
        
        results['market_insights'] = MarketInsightSerializer(market_insight).data
        
        # Generate career paths
        CareerPath.objects.filter(occupation=occupation).delete()
        career_paths_data = gemini_service.generate_career_paths(
            occupation.preferred_label,
            occupation.description or occupation.definition
        )
        
        created_paths = []
        with transaction.atomic():
            for path_data in career_paths_data:
                career_path = CareerPath.objects.create(
                    occupation=occupation,
                    path_name=path_data['path_name'],
                    description=path_data['description'],
                    estimated_duration=path_data['estimated_duration'],
                    difficulty_level=path_data['difficulty_level']
                )
                
                for step_data in path_data.get('steps', []):
                    career_step = CareerStep.objects.create(
                        career_path=career_path,
                        step_number=step_data['step_number'],
                        title=step_data['title'],
                        description=step_data['description'],
                        estimated_duration=step_data['estimated_duration'],
                        requirements=step_data['requirements'],
                        typical_salary_range=step_data['typical_salary_range']
                    )
                    
                    for skill_data in step_data.get('required_skills', []):
                        skill = _find_or_create_skill(skill_data['skill_name'])
                        if skill:
                            CareerStepSkill.objects.create(
                                career_step=career_step,
                                skill=skill,
                                importance_level=skill_data['importance_level'],
                                proficiency_level=skill_data['proficiency_level']
                            )
                
                created_paths.append(career_path)
        
        career_paths = CareerPath.objects.filter(occupation=occupation).prefetch_related(
            'steps__required_skills__skill'
        )
        results['career_paths'] = CareerPathSerializer(career_paths, many=True).data
        
        return Response(results, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error generating all insights: {str(e)}")
        return Response(
            {'detail': 'Error generating insights. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
