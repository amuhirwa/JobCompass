from rest_framework import serializers
from .models import (
    ModelInfo, SkillGroup, Skill, OccupationGroup, Occupation,
    SkillToSkillRelation, OccupationToSkillRelation, 
    SkillHierarchy, OccupationHierarchy
)


class ModelInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelInfo
        fields = '__all__'


class SkillGroupSerializer(serializers.ModelSerializer):
    alt_labels_list = serializers.SerializerMethodField()
    uuid_history_list = serializers.SerializerMethodField()

    class Meta:
        model = SkillGroup
        fields = [
            'id', 'uuid_history', 'uuid_history_list', 'origin_uri', 
            'code', 'preferred_label', 'alt_labels', 'alt_labels_list',
            'description', 'scope_note', 'created_at', 'updated_at'
        ]

    def get_alt_labels_list(self, obj):
        return obj.get_alt_labels_list()

    def get_uuid_history_list(self, obj):
        return obj.get_uuid_history_list()


class SkillSerializer(serializers.ModelSerializer):
    alt_labels_list = serializers.SerializerMethodField()
    uuid_history_list = serializers.SerializerMethodField()
    related_skills = serializers.SerializerMethodField()
    related_occupations = serializers.SerializerMethodField()

    class Meta:
        model = Skill
        fields = [
            'id', 'uuid_history', 'uuid_history_list', 'origin_uri',
            'skill_type', 'reuse_level', 'preferred_label', 'alt_labels', 'alt_labels_list',
            'description', 'definition', 'scope_note', 'is_localized',
            'created_at', 'updated_at', 'related_skills', 'related_occupations'
        ]

    def get_alt_labels_list(self, obj):
        return obj.get_alt_labels_list()

    def get_uuid_history_list(self, obj):
        return obj.get_uuid_history_list()

    def get_related_skills(self, obj):
        # Get skills that this skill requires
        required_relations = SkillToSkillRelation.objects.filter(requiring_skill=obj)
        return [
            {
                'skill_id': rel.required_skill.id,
                'skill_name': rel.required_skill.preferred_label,
                'relation_type': rel.relation_type
            }
            for rel in required_relations
        ]

    def get_related_occupations(self, obj):
        # Get occupations that use this skill
        occupation_relations = OccupationToSkillRelation.objects.filter(skill=obj)[:10]
        return [
            {
                'occupation_id': rel.occupation.id,
                'occupation_name': rel.occupation.preferred_label,
                'occupation_type': rel.occupation.occupation_type,
                'occupation_description': rel.occupation.description,
                'relation_type': rel.relation_type,
                'signalling_value': rel.signalling_value,
                'signalling_value_label': rel.signalling_value_label
            }
            for rel in occupation_relations
        ]


class OccupationGroupSerializer(serializers.ModelSerializer):
    alt_labels_list = serializers.SerializerMethodField()
    uuid_history_list = serializers.SerializerMethodField()

    class Meta:
        model = OccupationGroup
        fields = [
            'id', 'uuid_history', 'uuid_history_list', 'origin_uri',
            'code', 'group_type', 'preferred_label', 'alt_labels', 'alt_labels_list',
            'description', 'created_at', 'updated_at'
        ]

    def get_alt_labels_list(self, obj):
        return obj.get_alt_labels_list()

    def get_uuid_history_list(self, obj):
        return obj.get_uuid_history_list()


class OccupationSerializer(serializers.ModelSerializer):
    alt_labels_list = serializers.SerializerMethodField()
    uuid_history_list = serializers.SerializerMethodField()
    related_skills = serializers.SerializerMethodField()

    class Meta:
        model = Occupation
        fields = [
            'id', 'uuid_history', 'uuid_history_list', 'origin_uri',
            'occupation_group_code', 'code', 'preferred_label', 'alt_labels', 'alt_labels_list',
            'description', 'definition', 'scope_note', 'regulated_profession_note',
            'occupation_type', 'is_localized', 'created_at', 'updated_at', 'related_skills'
        ]

    def get_alt_labels_list(self, obj):
        return obj.get_alt_labels_list()

    def get_uuid_history_list(self, obj):
        return obj.get_uuid_history_list()

    def get_related_skills(self, obj):
        # Get skills related to this occupation
        skill_relations = OccupationToSkillRelation.objects.filter(occupation=obj)
        return [
            {
                'skill_id': rel.skill.id,
                'skill_name': rel.skill.preferred_label,
                'relation_type': rel.relation_type,
                'signalling_value': rel.signalling_value,
                'signalling_value_label': rel.signalling_value_label
            }
            for rel in skill_relations
        ]


class SkillToSkillRelationSerializer(serializers.ModelSerializer):
    requiring_skill_name = serializers.CharField(source='requiring_skill.preferred_label', read_only=True)
    required_skill_name = serializers.CharField(source='required_skill.preferred_label', read_only=True)

    class Meta:
        model = SkillToSkillRelation
        fields = [
            'requiring_skill', 'requiring_skill_name', 'required_skill', 'required_skill_name',
            'relation_type', 'created_at', 'updated_at'
        ]


class OccupationToSkillRelationSerializer(serializers.ModelSerializer):
    occupation_name = serializers.CharField(source='occupation.preferred_label', read_only=True)
    skill_name = serializers.CharField(source='skill.preferred_label', read_only=True)

    class Meta:
        model = OccupationToSkillRelation
        fields = [
            'occupation', 'occupation_name', 'skill', 'skill_name',
            'relation_type', 'signalling_value_label', 'signalling_value',
            'created_at', 'updated_at'
        ]


class SkillHierarchySerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillHierarchy
        fields = [
            'parent_object_type', 'parent_id', 'child_object_type', 'child_id',
            'created_at', 'updated_at'
        ]


class OccupationHierarchySerializer(serializers.ModelSerializer):
    class Meta:
        model = OccupationHierarchy
        fields = [
            'parent_object_type', 'parent_id', 'child_object_type', 'child_id',
            'created_at', 'updated_at'
        ]


# Special serializers for the frontend needs
class SkillSearchSerializer(serializers.ModelSerializer):
    """Lightweight serializer for search results"""
    class Meta:
        model = Skill
        fields = ['id', 'preferred_label', 'skill_type', 'reuse_level', 'description']


class OccupationSearchSerializer(serializers.ModelSerializer):
    """Lightweight serializer for search results"""
    class Meta:
        model = Occupation
        fields = ['id', 'preferred_label', 'occupation_type', 'description']


class SkillMappingSerializer(serializers.Serializer):
    """Serializer for skill mapping data that the frontend visualization needs"""
    nodes = serializers.ListField()
    edges = serializers.ListField()


class TaxonomyStatsSerializer(serializers.Serializer):
    """Serializer for taxonomy statistics"""
    total_skills = serializers.IntegerField()
    total_occupations = serializers.IntegerField()
    total_skill_groups = serializers.IntegerField()
    total_occupation_groups = serializers.IntegerField()
    total_skill_relations = serializers.IntegerField()
    total_occupation_skill_relations = serializers.IntegerField()
