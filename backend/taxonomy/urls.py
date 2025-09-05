from django.urls import path
from . import views

app_name = 'taxonomy'

urlpatterns = [
    # Model Info
    path('model-info/', views.ModelInfoListView.as_view(), name='model-info-list'),
    
    # Skills
    path('skills/', views.SkillListView.as_view(), name='skill-list'),
    path('skills/<str:pk>/', views.SkillDetailView.as_view(), name='skill-detail'),
    path('skill-groups/', views.SkillGroupListView.as_view(), name='skill-group-list'),
    path('skill-groups/<str:pk>/', views.SkillGroupDetailView.as_view(), name='skill-group-detail'),
    
    # Occupations
    path('occupations/', views.OccupationListView.as_view(), name='occupation-list'),
    path('occupations/<str:pk>/', views.OccupationDetailView.as_view(), name='occupation-detail'),
    path('occupation-groups/', views.OccupationGroupListView.as_view(), name='occupation-group-list'),
    path('occupation-groups/<str:pk>/', views.OccupationGroupDetailView.as_view(), name='occupation-group-detail'),
    
    # Relations
    path('skill-relations/', views.SkillToSkillRelationListView.as_view(), name='skill-relation-list'),
    path('occupation-skill-relations/', views.OccupationToSkillRelationListView.as_view(), name='occupation-skill-relation-list'),
    
    # Hierarchies
    path('skill-hierarchy/', views.SkillHierarchyListView.as_view(), name='skill-hierarchy-list'),
    path('occupation-hierarchy/', views.OccupationHierarchyListView.as_view(), name='occupation-hierarchy-list'),
    
    # Search and Mapping
    path('search/', views.search_view, name='search'),
    path('skill-mapping/', views.skill_mapping_data, name='skill-mapping'),
    path('stats/', views.taxonomy_stats, name='taxonomy-stats'),
    path('popular-skills/', views.popular_skills, name='popular-skills'),
    path('skill-suggestions/', views.skill_suggestions, name='skill-suggestions'),
]
