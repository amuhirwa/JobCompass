from django.urls import path
from . import views

urlpatterns = [
    # Market insights endpoints
    path('occupations/<str:occupation_id>/market-insights/', 
         views.occupation_market_insights, 
         name='occupation-market-insights'),
    
    # Career paths endpoints
    path('occupations/<str:occupation_id>/career-paths/', 
         views.occupation_career_paths, 
         name='occupation-career-paths'),
    
    # Learning resources endpoints
    path('skills/<str:skill_id>/learning-resources/', 
         views.skill_learning_resources, 
         name='skill-learning-resources'),
    
    # Generate all insights at once
    path('occupations/<str:occupation_id>/generate-all/', 
         views.generate_all_insights, 
         name='generate-all-insights'),
    
    # Chatbot endpoint
    path('chatbot/', 
         views.chatbot, 
         name='chatbot'),
]
