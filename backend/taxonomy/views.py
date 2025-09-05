from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q, Count
from django.http import JsonResponse
import csv
import io

from .models import (
    ModelInfo, SkillGroup, Skill, OccupationGroup, Occupation,
    SkillToSkillRelation, OccupationToSkillRelation, 
    SkillHierarchy, OccupationHierarchy
)
from .serializers import (
    ModelInfoSerializer, SkillGroupSerializer, SkillSerializer,
    OccupationGroupSerializer, OccupationSerializer,
    SkillToSkillRelationSerializer, OccupationToSkillRelationSerializer,
    SkillHierarchySerializer, OccupationHierarchySerializer,
    SkillSearchSerializer, OccupationSearchSerializer,
    SkillMappingSerializer, TaxonomyStatsSerializer
)


# Model Info Views
class ModelInfoListView(generics.ListAPIView):
    queryset = ModelInfo.objects.all()
    serializer_class = ModelInfoSerializer
    permission_classes = [AllowAny]


# Skill Views
class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Skill.objects.all()
        search = self.request.query_params.get('search', None)
        skill_type = self.request.query_params.get('skill_type', None)
        reuse_level = self.request.query_params.get('reuse_level', None)

        if search:
            queryset = queryset.filter(
                Q(preferred_label__icontains=search) |
                Q(description__icontains=search) |
                Q(alt_labels__icontains=search)
            )
        
        if skill_type:
            queryset = queryset.filter(skill_type=skill_type)
        
        if reuse_level:
            queryset = queryset.filter(reuse_level=reuse_level)

        return queryset.order_by('preferred_label')


class SkillDetailView(generics.RetrieveAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]


class SkillGroupListView(generics.ListAPIView):
    queryset = SkillGroup.objects.all()
    serializer_class = SkillGroupSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = SkillGroup.objects.all()
        search = self.request.query_params.get('search', None)

        if search:
            queryset = queryset.filter(
                Q(preferred_label__icontains=search) |
                Q(description__icontains=search) |
                Q(code__icontains=search)
            )

        return queryset.order_by('code')


class SkillGroupDetailView(generics.RetrieveAPIView):
    queryset = SkillGroup.objects.all()
    serializer_class = SkillGroupSerializer
    permission_classes = [AllowAny]


# Occupation Views
class OccupationListView(generics.ListAPIView):
    queryset = Occupation.objects.all()
    serializer_class = OccupationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Occupation.objects.all()
        search = self.request.query_params.get('search', None)
        occupation_type = self.request.query_params.get('occupation_type', None)

        if search:
            queryset = queryset.filter(
                Q(preferred_label__icontains=search) |
                Q(description__icontains=search) |
                Q(alt_labels__icontains=search)
            )
        
        if occupation_type:
            queryset = queryset.filter(occupation_type=occupation_type)

        return queryset.order_by('preferred_label')


class OccupationDetailView(generics.RetrieveAPIView):
    queryset = Occupation.objects.all()
    serializer_class = OccupationSerializer
    permission_classes = [AllowAny]


class OccupationGroupListView(generics.ListAPIView):
    queryset = OccupationGroup.objects.all()
    serializer_class = OccupationGroupSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = OccupationGroup.objects.all()
        search = self.request.query_params.get('search', None)
        group_type = self.request.query_params.get('group_type', None)

        if search:
            queryset = queryset.filter(
                Q(preferred_label__icontains=search) |
                Q(description__icontains=search) |
                Q(code__icontains=search)
            )
        
        if group_type:
            queryset = queryset.filter(group_type=group_type)

        return queryset.order_by('code')


class OccupationGroupDetailView(generics.RetrieveAPIView):
    queryset = OccupationGroup.objects.all()
    serializer_class = OccupationGroupSerializer
    permission_classes = [AllowAny]


# Relation Views
class SkillToSkillRelationListView(generics.ListAPIView):
    queryset = SkillToSkillRelation.objects.all()
    serializer_class = SkillToSkillRelationSerializer
    permission_classes = [AllowAny]


class OccupationToSkillRelationListView(generics.ListAPIView):
    queryset = OccupationToSkillRelation.objects.all()
    serializer_class = OccupationToSkillRelationSerializer
    permission_classes = [AllowAny]


# Hierarchy Views
class SkillHierarchyListView(generics.ListAPIView):
    queryset = SkillHierarchy.objects.all()
    serializer_class = SkillHierarchySerializer
    permission_classes = [AllowAny]


class OccupationHierarchyListView(generics.ListAPIView):
    queryset = OccupationHierarchy.objects.all()
    serializer_class = OccupationHierarchySerializer
    permission_classes = [AllowAny]


# Search Views
@api_view(['GET'])
@permission_classes([AllowAny])
def search_view(request):
    """
    Universal search endpoint for skills and occupations
    """
    query = request.GET.get('q', '').strip()
    if not query:
        return Response({'error': 'Search query is required'}, status=400)

    # Search skills
    skills = Skill.objects.filter(
        Q(preferred_label__icontains=query) |
        Q(description__icontains=query) |
        Q(alt_labels__icontains=query)
    )[:10]

    # Search occupations
    occupations = Occupation.objects.filter(
        Q(preferred_label__icontains=query) |
        Q(description__icontains=query) |
        Q(alt_labels__icontains=query)
    )[:10]

    return Response({
        'skills': SkillSearchSerializer(skills, many=True).data,
        'occupations': OccupationSearchSerializer(occupations, many=True).data
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def skill_mapping_data(request):
    """
    Returns data for the skill mapping visualization
    """
    skill_id = request.GET.get('skill_id')
    if not skill_id:
        return Response({'error': 'skill_id is required'}, status=400)

    try:
        skill = Skill.objects.get(id=skill_id)
    except Skill.DoesNotExist:
        return Response({'error': 'Skill not found'}, status=404)

    # Build nodes and edges for visualization
    nodes = []
    edges = []

    # Add the main skill as central node
    nodes.append({
        'id': skill.id,
        'label': skill.preferred_label,
        'type': 'skill',
        'group': 'central',
        'skill_type': skill.skill_type,
        'reuse_level': skill.reuse_level
    })

    # Add related skills
    skill_relations = SkillToSkillRelation.objects.filter(requiring_skill=skill)
    for relation in skill_relations:
        related_skill = relation.required_skill
        nodes.append({
            'id': related_skill.id,
            'label': related_skill.preferred_label,
            'type': 'skill',
            'group': 'related_skill',
            'skill_type': related_skill.skill_type,
            'reuse_level': related_skill.reuse_level
        })
        edges.append({
            'from': skill.id,
            'to': related_skill.id,
            'label': relation.relation_type,
            'type': 'skill_relation'
        })

    # Add related occupations
    occupation_relations = OccupationToSkillRelation.objects.filter(skill=skill)[:10]
    for relation in occupation_relations:
        occupation = relation.occupation
        nodes.append({
            'id': occupation.id,
            'label': occupation.preferred_label,
            'type': 'occupation',
            'group': 'related_occupation',
            'occupation_type': occupation.occupation_type
        })
        edges.append({
            'from': occupation.id,
            'to': skill.id,
            'label': relation.relation_type or relation.signalling_value_label,
            'type': 'occupation_skill_relation',
            'signalling_value': str(relation.signalling_value) if relation.signalling_value else None
        })

    data = {
        'nodes': nodes,
        'edges': edges,
        'center_skill': {
            'id': skill.id,
            'name': skill.preferred_label,
            'description': skill.description
        }
    }

    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def taxonomy_stats(request):
    """
    Returns statistics about the taxonomy data
    """
    stats = {
        'total_skills': Skill.objects.count(),
        'total_occupations': Occupation.objects.count(),
        'total_skill_groups': SkillGroup.objects.count(),
        'total_occupation_groups': OccupationGroup.objects.count(),
        'total_skill_relations': SkillToSkillRelation.objects.count(),
        'total_occupation_skill_relations': OccupationToSkillRelation.objects.count(),
        'skills_by_type': {},
        'skills_by_reuse_level': {},
        'occupations_by_type': {}
    }

    # Skill type distribution
    skill_types = Skill.objects.values('skill_type').annotate(count=Count('id'))
    for item in skill_types:
        stats['skills_by_type'][item['skill_type'] or 'Not Specified'] = item['count']

    # Skill reuse level distribution
    reuse_levels = Skill.objects.values('reuse_level').annotate(count=Count('id'))
    for item in reuse_levels:
        stats['skills_by_reuse_level'][item['reuse_level'] or 'Not Specified'] = item['count']

    # Occupation type distribution
    occupation_types = Occupation.objects.values('occupation_type').annotate(count=Count('id'))
    for item in occupation_types:
        stats['occupations_by_type'][item['occupation_type']] = item['count']

    return Response(stats)


@api_view(['GET'])
@permission_classes([AllowAny])
def popular_skills(request):
    """
    Returns the most popular skills based on occupation relations
    """
    popular_skills = Skill.objects.annotate(
        occupation_count=Count('occupation_relations')
    ).filter(occupation_count__gt=0).order_by('-occupation_count')[:20]

    data = []
    for skill in popular_skills:
        data.append({
            'id': skill.id,
            'preferred_label': skill.preferred_label,
            'skill_type': skill.skill_type,
            'reuse_level': skill.reuse_level,
            'occupation_count': skill.occupation_count,
            'description': skill.description[:200] if skill.description else ''
        })

    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def skill_suggestions(request):
    """
    Returns skill suggestions based on a given skill
    """
    skill_id = request.GET.get('skill_id')
    if not skill_id:
        return Response({'error': 'skill_id is required'}, status=400)

    try:
        skill = Skill.objects.get(id=skill_id)
    except Skill.DoesNotExist:
        return Response({'error': 'Skill not found'}, status=404)

    # Find skills that are often used together with this skill
    # by finding occupations that use this skill and seeing what other skills they use
    occupations_with_skill = OccupationToSkillRelation.objects.filter(
        skill=skill
    ).values_list('occupation', flat=True)

    suggested_skills = Skill.objects.filter(
        occupation_relations__occupation__in=occupations_with_skill
    ).exclude(id=skill_id).annotate(
        common_occupation_count=Count('occupation_relations__occupation')
    ).order_by('-common_occupation_count')[:10]

    data = []
    for suggested_skill in suggested_skills:
        data.append({
            'id': suggested_skill.id,
            'preferred_label': suggested_skill.preferred_label,
            'skill_type': suggested_skill.skill_type,
            'reuse_level': suggested_skill.reuse_level,
            'common_occupation_count': suggested_skill.common_occupation_count,
            'description': suggested_skill.description[:200] if suggested_skill.description else ''
        })

    return Response(data)
