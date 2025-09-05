from django.contrib import admin
from .models import (
    ModelInfo, SkillGroup, Skill, OccupationGroup, Occupation,
    SkillToSkillRelation, OccupationToSkillRelation, 
    SkillHierarchy, OccupationHierarchy
)


@admin.register(ModelInfo)
class ModelInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'version', 'locale', 'released', 'created_at']
    list_filter = ['released', 'locale', 'created_at']
    search_fields = ['name', 'description']


@admin.register(SkillGroup)
class SkillGroupAdmin(admin.ModelAdmin):
    list_display = ['code', 'preferred_label', 'created_at']
    list_filter = ['created_at']
    search_fields = ['code', 'preferred_label', 'description']
    ordering = ['code']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['preferred_label', 'skill_type', 'reuse_level', 'is_localized', 'created_at']
    list_filter = ['skill_type', 'reuse_level', 'is_localized', 'created_at']
    search_fields = ['preferred_label', 'description', 'alt_labels']
    ordering = ['preferred_label']


@admin.register(OccupationGroup)
class OccupationGroupAdmin(admin.ModelAdmin):
    list_display = ['code', 'preferred_label', 'group_type', 'created_at']
    list_filter = ['group_type', 'created_at']
    search_fields = ['code', 'preferred_label', 'description']
    ordering = ['code']


@admin.register(Occupation)
class OccupationAdmin(admin.ModelAdmin):
    list_display = ['preferred_label', 'code', 'occupation_type', 'is_localized', 'created_at']
    list_filter = ['occupation_type', 'is_localized', 'created_at']
    search_fields = ['preferred_label', 'code', 'description', 'alt_labels']
    ordering = ['preferred_label']


@admin.register(SkillToSkillRelation)
class SkillToSkillRelationAdmin(admin.ModelAdmin):
    list_display = ['requiring_skill', 'required_skill', 'relation_type', 'created_at']
    list_filter = ['relation_type', 'created_at']
    search_fields = ['requiring_skill__preferred_label', 'required_skill__preferred_label']


@admin.register(OccupationToSkillRelation)
class OccupationToSkillRelationAdmin(admin.ModelAdmin):
    list_display = ['occupation', 'skill', 'relation_type', 'signalling_value_label', 'signalling_value', 'created_at']
    list_filter = ['relation_type', 'signalling_value_label', 'created_at']
    search_fields = ['occupation__preferred_label', 'skill__preferred_label']


@admin.register(SkillHierarchy)
class SkillHierarchyAdmin(admin.ModelAdmin):
    list_display = ['parent_object_type', 'parent_id', 'child_object_type', 'child_id', 'created_at']
    list_filter = ['parent_object_type', 'child_object_type', 'created_at']


@admin.register(OccupationHierarchy)
class OccupationHierarchyAdmin(admin.ModelAdmin):
    list_display = ['parent_object_type', 'parent_id', 'child_object_type', 'child_id', 'created_at']
    list_filter = ['parent_object_type', 'child_object_type', 'created_at']
