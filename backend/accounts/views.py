from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.db import transaction, models
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.views import APIView

from .models import UserProfile, UserSkill, UserGoal, UserLearningResource, UserResourceProgress
from .serializers import (
    UserProfileSerializer, 
    UserSkillSerializer, 
    UserGoalSerializer,
    OnboardingStepSerializer,
    CompleteOnboardingSerializer,
    UserLearningResourceSerializer,
    CreateUserLearningResourceSerializer,
    UpdateResourceProgressSerializer,
    UserResourceProgressSerializer
)
from taxonomy.models import Skill, Occupation
import json


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user
    """
    try:
        data = json.loads(request.body) if request.body else request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')

        # Validate required fields
        if not username or not email or not password:
            return Response({
                'error': 'Username, email, and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return Response({
                'error': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate password
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({
                'error': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'access': str(access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'error': 'An error occurred during registration'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user and return JWT tokens
    """
    try:
        data = json.loads(request.body) if request.body else request.data
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user
        user = authenticate(username=username, password=password)
        
        if user is not None:
            if user.is_active:
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                return Response({
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    },
                    'tokens': {
                        'access': str(access_token),
                        'refresh': str(refresh),
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Account is disabled'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response({
            'error': 'An error occurred during login'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """
    Refresh JWT access token
    """
    try:
        data = json.loads(request.body) if request.body else request.data
        refresh_token = data.get('refresh')

        if not refresh_token:
            return Response({
                'error': 'Refresh token is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = refresh.access_token

            return Response({
                'access': str(access_token)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': 'Invalid refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response({
            'error': 'An error occurred during token refresh'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    Get user profile information
    """
    user = request.user
    profile, created = UserProfile.objects.get_or_create(
        user=user,
        defaults={'onboarding_step': 1}
    )
    
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined,
            'last_login': user.last_login,
        },
        'profile': UserProfileSerializer(profile).data,
    }, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    """Get or update user profile"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'onboarding_step': 1}
        )
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    def put(self, request):
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'onboarding_step': 1}
        )
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OnboardingStepView(APIView):
    """Handle onboarding step progression"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'onboarding_step': 1}
        )
        
        serializer = OnboardingStepSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        step = serializer.validated_data['step']
        data = serializer.validated_data['data']
        
        try:
            with transaction.atomic():
                # Update profile based on step
                if step == 1:  # Basic info
                    profile.bio = data.get('bio', profile.bio)
                    profile.location = data.get('location', profile.location)
                    profile.phone = data.get('phone', profile.phone)
                    profile.linkedin_url = data.get('linkedin_url', profile.linkedin_url)
                    profile.github_url = data.get('github_url', profile.github_url)
                    profile.portfolio_url = data.get('portfolio_url', profile.portfolio_url)
                
                elif step == 2:  # Career info
                    if data.get('current_occupation_id'):
                        try:
                            profile.current_occupation = Occupation.objects.get(
                                id=data['current_occupation_id']
                            )
                        except Occupation.DoesNotExist:
                            pass
                    
                    if data.get('target_occupation_id'):
                        try:
                            profile.target_occupation = Occupation.objects.get(
                                id=data['target_occupation_id']
                            )
                        except Occupation.DoesNotExist:
                            pass
                    
                    profile.experience_level = data.get('experience_level', profile.experience_level)
                    profile.career_goal = data.get('career_goal', profile.career_goal)
                
                elif step == 3:  # Skills
                    skills_data = data.get('skills', [])
                    # Clear existing skills
                    UserSkill.objects.filter(user_profile=profile).delete()
                    
                    for skill_data in skills_data:
                        try:
                            skill = Skill.objects.get(id=skill_data['skill_id'])
                            UserSkill.objects.create(
                                user_profile=profile,
                                skill=skill,
                                proficiency_level=skill_data.get('proficiency_level', 'beginner'),
                                years_of_experience=skill_data.get('years_of_experience', 0),
                                is_primary=skill_data.get('is_primary', False)
                            )
                        except (Skill.DoesNotExist, KeyError):
                            continue
                
                elif step == 4:  # Goals
                    goals_data = data.get('goals', [])
                    # Clear existing goals
                    UserGoal.objects.filter(user_profile=profile).delete()
                    
                    for goal_data in goals_data:
                        goal_kwargs = {
                            'user_profile': profile,
                            'title': goal_data.get('title', ''),
                            'description': goal_data.get('description', ''),
                            'goal_type': goal_data.get('goal_type', 'other'),
                            'target_date': goal_data.get('target_date'),
                        }
                        
                        # Add target skill if provided
                        if goal_data.get('target_skill_id'):
                            try:
                                goal_kwargs['target_skill'] = Skill.objects.get(
                                    id=goal_data['target_skill_id']
                                )
                            except Skill.DoesNotExist:
                                pass
                        
                        # Add target occupation if provided
                        if goal_data.get('target_occupation_id'):
                            try:
                                goal_kwargs['target_occupation'] = Occupation.objects.get(
                                    id=goal_data['target_occupation_id']
                                )
                            except Occupation.DoesNotExist:
                                pass
                        
                        UserGoal.objects.create(**goal_kwargs)
                
                # Update onboarding step
                profile.onboarding_step = max(profile.onboarding_step, step)
                profile.save()
                
                return Response({
                    'message': f'Step {step} completed successfully',
                    'current_step': profile.onboarding_step,
                    'onboarding_completed': profile.onboarding_completed
                })
        
        except Exception as e:
            return Response(
                {'error': f'Error updating step {step}: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class CompleteOnboardingView(APIView):
    """Complete the onboarding process"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'onboarding_step': 1}
        )
        
        # Mark onboarding as completed
        profile.onboarding_completed = True
        profile.onboarding_step = 5  # All steps completed
        profile.save()
        
        serializer = UserProfileSerializer(profile)
        return Response({
            'message': 'Onboarding completed successfully!',
            'profile': serializer.data
        })

class UserSkillsView(generics.ListCreateAPIView):
    """List and create user skills"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSkillSerializer
    
    def get_queryset(self):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'onboarding_step': 1}
        )
        return UserSkill.objects.filter(user_profile=profile)
    
    def perform_create(self, serializer):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'onboarding_step': 1}
        )
        serializer.save(user_profile=profile)

class UserSkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a user skill"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSkillSerializer
    
    def get_queryset(self):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'onboarding_step': 1}
        )
        return UserSkill.objects.filter(user_profile=profile)

class UserGoalsView(generics.ListCreateAPIView):
    """List and create user goals"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserGoalSerializer
    
    def get_queryset(self):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'onboarding_step': 1}
        )
        return UserGoal.objects.filter(user_profile=profile)
    
    def perform_create(self, serializer):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'onboarding_step': 1}
        )
        serializer.save(user_profile=profile)

class UserGoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a user goal"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserGoalSerializer
    
    def get_queryset(self):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'onboarding_step': 1}
        )
        return UserGoal.objects.filter(user_profile=profile)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    """Get dashboard data for authenticated user"""
    profile, created = UserProfile.objects.get_or_create(
        user=request.user,
        defaults={'onboarding_step': 1}
    )
    
    # Get user stats
    skills_count = UserSkill.objects.filter(user_profile=profile).count()
    goals_count = UserGoal.objects.filter(user_profile=profile).count()
    completed_goals = UserGoal.objects.filter(
        user_profile=profile, 
        status='completed'
    ).count()
    in_progress_goals = UserGoal.objects.filter(
        user_profile=profile, 
        status='in_progress'
    ).count()
    
    # Get recent goals
    recent_goals = UserGoal.objects.filter(user_profile=profile).order_by('-updated_at')[:5]
    
    # Get primary skills
    primary_skills = UserSkill.objects.filter(
        user_profile=profile, 
        is_primary=True
    ).order_by('-proficiency_level')[:5]
    
    return Response({
        'profile': UserProfileSerializer(profile).data,
        'stats': {
            'skills_count': skills_count,
            'goals_count': goals_count,
            'completed_goals': completed_goals,
            'in_progress_goals': in_progress_goals,
        },
        'recent_goals': UserGoalSerializer(recent_goals, many=True).data,
        'primary_skills': UserSkillSerializer(primary_skills, many=True).data,
    })


# Learning Resources Views
class UserLearningResourceListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = UserLearningResource.objects.filter(user_profile=self.request.user.profile)
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by skill
        skill_id = self.request.query_params.get('skill')
        if skill_id:
            queryset = queryset.filter(related_skill_id=skill_id)
        
        # Filter by goal
        goal_id = self.request.query_params.get('goal')
        if goal_id:
            queryset = queryset.filter(related_goal_id=goal_id)
        
        # Search in title and description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) | 
                models.Q(description__icontains=search)
            )
        
        return queryset.order_by('-updated_at')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateUserLearningResourceSerializer
        return UserLearningResourceSerializer


class UserLearningResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserLearningResourceSerializer
    
    def get_queryset(self):
        return UserLearningResource.objects.filter(user_profile=self.request.user.profile)


class UpdateResourceProgressView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, resource_id):
        try:
            resource = UserLearningResource.objects.get(
                id=resource_id, 
                user_profile=request.user.profile
            )
        except UserLearningResource.DoesNotExist:
            return Response(
                {'error': 'Resource not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = UpdateResourceProgressSerializer(
            resource, 
            data=request.data, 
            partial=True
        )
        
        if serializer.is_valid():
            resource = serializer.save()
            return Response(UserLearningResourceSerializer(resource).data)
        
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )


class UserResourceProgressListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserResourceProgressSerializer
    
    def get_queryset(self):
        # Get progress for a specific resource
        resource_id = self.kwargs.get('resource_id')
        if resource_id:
            return UserResourceProgress.objects.filter(
                resource_id=resource_id,
                resource__user_profile=self.request.user.profile
            ).order_by('-session_date')
        
        # Get all progress for user's resources
        return UserResourceProgress.objects.filter(
            resource__user_profile=self.request.user.profile
        ).order_by('-session_date')


class ResourceStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from django.db.models import Count, Sum, Avg
        from django.utils import timezone
        from datetime import timedelta
        
        user_profile = request.user.profile
        
        # Total resources by status
        resources = UserLearningResource.objects.filter(user_profile=user_profile)
        total_resources = resources.count()
        completed_resources = resources.filter(status='completed').count()
        in_progress_resources = resources.filter(status='in_progress').count()
        planned_resources = resources.filter(status='planned').count()
        
        # Time spent
        total_time_minutes = resources.aggregate(Sum('time_spent_minutes'))['time_spent_minutes__sum'] or 0
        total_time_hours = round(total_time_minutes / 60, 1)
        
        # Average progress
        avg_progress = resources.aggregate(Avg('progress_percentage'))['progress_percentage__avg'] or 0
        avg_progress = round(avg_progress, 1)
        
        # Recent activity (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        recent_sessions = UserResourceProgress.objects.filter(
            resource__user_profile=user_profile,
            session_date__gte=week_ago
        )
        weekly_sessions = recent_sessions.count()
        weekly_time_minutes = recent_sessions.aggregate(Sum('session_duration_minutes'))['session_duration_minutes__sum'] or 0
        weekly_time_hours = round(weekly_time_minutes / 60, 1)
        
        # Resources by difficulty
        difficulty_stats = resources.values('difficulty_level').annotate(count=Count('id'))
        
        # Resources by type
        type_stats = resources.values('resource_type').annotate(count=Count('id'))
        
        return Response({
            'total_resources': total_resources,
            'status_breakdown': {
                'completed': completed_resources,
                'in_progress': in_progress_resources,
                'planned': planned_resources,
            },
            'time_stats': {
                'total_hours': total_time_hours,
                'total_minutes': total_time_minutes,
                'weekly_hours': weekly_time_hours,
                'weekly_sessions': weekly_sessions,
            },
            'progress': {
                'average_completion': avg_progress,
                'completion_rate': round((completed_resources / total_resources) * 100, 1) if total_resources > 0 else 0,
            },
            'breakdown': {
                'by_difficulty': list(difficulty_stats),
                'by_type': list(type_stats),
            }
        })
