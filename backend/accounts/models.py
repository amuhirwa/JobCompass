from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from taxonomy.models import Skill, Occupation

class UserProfile(models.Model):
    """Extended user profile with onboarding and career information"""
    EXPERIENCE_LEVELS = [
        ('entry', 'Entry Level (0-2 years)'),
        ('junior', 'Junior (2-5 years)'),
        ('mid', 'Mid Level (5-8 years)'),
        ('senior', 'Senior (8-12 years)'),
        ('lead', 'Lead/Principal (12+ years)'),
    ]
    
    CAREER_GOALS = [
        ('switch_career', 'Switch Career'),
        ('advance_current', 'Advance in Current Career'),
        ('skill_development', 'Develop New Skills'),
        ('leadership', 'Move into Leadership'),
        ('entrepreneurship', 'Start Own Business'),
        ('freelance', 'Become Freelancer'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Onboarding completion tracking
    onboarding_completed = models.BooleanField(default=False)
    onboarding_step = models.IntegerField(default=1)  # Track current onboarding step
    
    # Personal information
    bio = models.TextField(blank=True, null=True, help_text="Brief professional bio")
    location = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    
    # Career information
    current_occupation = models.ForeignKey(
        Occupation, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='current_professionals'
    )
    target_occupation = models.ForeignKey(
        Occupation, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='aspiring_professionals'
    )
    experience_level = models.CharField(
        max_length=20, 
        choices=EXPERIENCE_LEVELS, 
        blank=True, 
        null=True
    )
    career_goal = models.CharField(
        max_length=20, 
        choices=CAREER_GOALS, 
        blank=True, 
        null=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

class UserSkill(models.Model):
    """User's skills with proficiency levels"""
    PROFICIENCY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    proficiency_level = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS)
    years_of_experience = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(50)],
        help_text="Years of experience with this skill"
    )
    is_primary = models.BooleanField(default=False, help_text="Is this a primary/core skill?")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user_profile', 'skill']
        verbose_name = "User Skill"
        verbose_name_plural = "User Skills"
        ordering = ['-is_primary', '-proficiency_level', 'skill__preferred_label']
    
    def __str__(self):
        return f"{self.user_profile.user.username} - {self.skill.preferred_label} ({self.proficiency_level})"

class UserGoal(models.Model):
    """User's learning and career goals"""
    GOAL_TYPES = [
        ('skill', 'Learn New Skill'),
        ('certification', 'Get Certification'),
        ('career_change', 'Change Career'),
        ('promotion', 'Get Promotion'),
        ('salary_increase', 'Increase Salary'),
        ('project', 'Complete Project'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPES)
    target_skill = models.ForeignKey(Skill, on_delete=models.SET_NULL, null=True, blank=True)
    target_occupation = models.ForeignKey(Occupation, on_delete=models.SET_NULL, null=True, blank=True)
    target_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress_percentage = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User Goal"
        verbose_name_plural = "User Goals"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user_profile.user.username} - {self.title}"


class UserLearningResource(models.Model):
    """Track user progress on learning resources"""
    RESOURCE_TYPES = [
        ('course', 'Course'),
        ('book', 'Book'),
        ('certification', 'Certification'),
        ('practice', 'Practice'),
        ('documentation', 'Documentation'),
        ('workshop', 'Workshop'),
        ('video', 'Video'),
        ('article', 'Article'),
        ('tutorial', 'Tutorial'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='learning_resources')
    
    # Resource details
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, default='course')
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='beginner')
    provider = models.CharField(max_length=255, blank=True, null=True)
    duration = models.CharField(max_length=100, blank=True, null=True)  # e.g., "4 hours", "2 weeks"
    cost = models.CharField(max_length=50, blank=True, null=True)
    is_free = models.BooleanField(default=True)
    rating = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5)])
    
    # Progress tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress_percentage = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    time_spent_minutes = models.IntegerField(default=0)  # Total time spent in minutes
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Associations
    related_skill = models.ForeignKey(Skill, on_delete=models.CASCADE, null=True, blank=True)
    related_goal = models.ForeignKey(UserGoal, on_delete=models.SET_NULL, null=True, blank=True)
    
    # AI-generated flag
    ai_generated = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User Learning Resource"
        verbose_name_plural = "User Learning Resources"
        ordering = ['-updated_at']
        unique_together = ['user_profile', 'title', 'url']  # Prevent duplicates
    
    def __str__(self):
        return f"{self.user_profile.user.username} - {self.title}"
    
    @property
    def is_completed(self):
        return self.status == 'completed'
    
    @property
    def time_spent_hours(self):
        return round(self.time_spent_minutes / 60, 2) if self.time_spent_minutes > 0 else 0


class UserResourceProgress(models.Model):
    """Track detailed progress sessions for learning resources"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resource = models.ForeignKey(UserLearningResource, on_delete=models.CASCADE, related_name='progress_sessions')
    
    # Session details
    session_date = models.DateTimeField(auto_now_add=True)
    session_duration_minutes = models.IntegerField(default=0)
    progress_before = models.IntegerField(default=0)
    progress_after = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Resource Progress Session"
        verbose_name_plural = "Resource Progress Sessions"
        ordering = ['-session_date']
    
    def __str__(self):
        return f"{self.resource.title} - {self.session_date.date()}"
