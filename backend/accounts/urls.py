from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('refresh/', views.refresh_token, name='refresh_token'),
    path('profile/', views.profile, name='profile'),
    
    # User Profile Management
    path('profile/details/', views.UserProfileView.as_view(), name='user_profile'),
    path('profile/onboarding/step/', views.OnboardingStepView.as_view(), name='onboarding_step'),
    path('profile/onboarding/complete/', views.CompleteOnboardingView.as_view(), name='complete_onboarding'),
    
    # User Skills
    path('profile/skills/', views.UserSkillsView.as_view(), name='user_skills'),
    path('profile/skills/<uuid:pk>/', views.UserSkillDetailView.as_view(), name='user_skill_detail'),
    
    # User Goals
    path('profile/goals/', views.UserGoalsView.as_view(), name='user_goals'),
    path('profile/goals/<uuid:pk>/', views.UserGoalDetailView.as_view(), name='user_goal_detail'),
    
    # Dashboard
    path('dashboard/', views.dashboard_data, name='dashboard_data'),
    
    # Learning Resources
    path('resources/', views.UserLearningResourceListCreateView.as_view(), name='user_resources'),
    path('resources/<uuid:pk>/', views.UserLearningResourceDetailView.as_view(), name='user_resource_detail'),
    path('resources/<uuid:resource_id>/progress/', views.UpdateResourceProgressView.as_view(), name='update_resource_progress'),
    path('resources/<uuid:resource_id>/sessions/', views.UserResourceProgressListView.as_view(), name='resource_progress_list'),
    path('resources/stats/', views.ResourceStatsView.as_view(), name='resource_stats'),
]
