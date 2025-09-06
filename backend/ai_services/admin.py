from django.contrib import admin
from .models import MarketInsight, CareerPath, CareerStep, CareerStepSkill, LearningResource


@admin.register(MarketInsight)
class MarketInsightAdmin(admin.ModelAdmin):
    list_display = ['occupation', 'average_salary', 'growth_rate', 'demand_level', 'created_at']
    list_filter = ['demand_level', 'created_at']
    search_fields = ['occupation__preferred_label']
    readonly_fields = ['created_at', 'updated_at']


class CareerStepSkillInline(admin.TabularInline):
    model = CareerStepSkill
    extra = 0
    raw_id_fields = ['skill']


class CareerStepInline(admin.TabularInline):
    model = CareerStep
    extra = 0
    show_change_link = True


@admin.register(CareerPath)
class CareerPathAdmin(admin.ModelAdmin):
    list_display = ['path_name', 'occupation', 'difficulty_level', 'estimated_duration']
    list_filter = ['difficulty_level', 'created_at']
    search_fields = ['path_name', 'occupation__preferred_label']
    inlines = [CareerStepInline]


@admin.register(CareerStep)
class CareerStepAdmin(admin.ModelAdmin):
    list_display = ['title', 'career_path', 'step_number', 'estimated_duration']
    list_filter = ['career_path__difficulty_level']
    search_fields = ['title', 'career_path__path_name']
    inlines = [CareerStepSkillInline]


@admin.register(CareerStepSkill)
class CareerStepSkillAdmin(admin.ModelAdmin):
    list_display = ['skill', 'career_step', 'importance_level', 'proficiency_level']
    list_filter = ['importance_level', 'proficiency_level']
    search_fields = ['skill__preferred_label', 'career_step__title']
    raw_id_fields = ['skill', 'career_step']


@admin.register(LearningResource)
class LearningResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'skill', 'resource_type', 'difficulty_level', 'is_free', 'rating']
    list_filter = ['resource_type', 'difficulty_level', 'is_free']
    search_fields = ['title', 'skill__preferred_label', 'provider']
    raw_id_fields = ['skill']
