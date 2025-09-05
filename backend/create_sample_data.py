"""
Script to create sample data for testing the API
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from taxonomy.models import *
import uuid

def create_sample_data():
    """Create sample taxonomy data for testing"""
    
    # Create model info
    model_info = ModelInfo.objects.create(
        uuid_history=str(uuid.uuid4()),
        name="Sample Tabiya Taxonomy",
        locale="en-US",
        description="Sample taxonomy data for testing",
        version="1.0.0",
        released=True,
        release_notes="Initial sample data"
    )
    
    # Create skill groups
    skill_group1 = SkillGroup.objects.create(
        id="SG1",
        uuid_history=str(uuid.uuid4()),
        code="S1",
        preferred_label="Technical Skills",
        description="Technical and digital skills",
        alt_labels="Tech Skills|Digital Skills"
    )
    
    skill_group2 = SkillGroup.objects.create(
        id="SG2",
        uuid_history=str(uuid.uuid4()),
        code="S2",
        preferred_label="Soft Skills",
        description="Communication and interpersonal skills",
        alt_labels="Communication Skills|Interpersonal Skills"
    )
    
    # Create skills
    skill1 = Skill.objects.create(
        id="SKILL1",
        uuid_history=str(uuid.uuid4()),
        skill_type="skill/competence",
        reuse_level="cross-sector",
        preferred_label="Python Programming",
        description="Ability to write code in Python programming language",
        alt_labels="Python|Python Development",
        is_localized=False
    )
    
    skill2 = Skill.objects.create(
        id="SKILL2",
        uuid_history=str(uuid.uuid4()),
        skill_type="skill/competence",
        reuse_level="cross-sector",
        preferred_label="Machine Learning",
        description="Knowledge and application of machine learning algorithms",
        alt_labels="ML|AI|Artificial Intelligence",
        is_localized=False
    )
    
    skill3 = Skill.objects.create(
        id="SKILL3",
        uuid_history=str(uuid.uuid4()),
        skill_type="skill/competence",
        reuse_level="transversal",
        preferred_label="Communication",
        description="Ability to communicate effectively with others",
        alt_labels="Verbal Communication|Written Communication",
        is_localized=False
    )
    
    skill4 = Skill.objects.create(
        id="SKILL4",
        uuid_history=str(uuid.uuid4()),
        skill_type="knowledge",
        reuse_level="sector-specific",
        preferred_label="Data Analysis",
        description="Knowledge of data analysis techniques and tools",
        alt_labels="Data Analytics|Statistical Analysis",
        is_localized=False
    )
    
    # Create occupation groups
    occ_group1 = OccupationGroup.objects.create(
        id="OG1",
        uuid_history=str(uuid.uuid4()),
        code="2",
        group_type="iscogroup",
        preferred_label="Professionals",
        description="Professional occupations requiring high level skills",
        alt_labels="Professional Workers"
    )
    
    # Create occupations
    occupation1 = Occupation.objects.create(
        id="OCC1",
        uuid_history=str(uuid.uuid4()),
        occupation_group_code="2",
        code="2511",
        preferred_label="Software Developer",
        description="Develops and maintains software applications",
        occupation_type="escooccupation",
        alt_labels="Programmer|Software Engineer",
        is_localized=False
    )
    
    occupation2 = Occupation.objects.create(
        id="OCC2",
        uuid_history=str(uuid.uuid4()),
        occupation_group_code="2",
        code="2512",
        preferred_label="Data Scientist",
        description="Analyzes complex data to help organizations make decisions",
        occupation_type="escooccupation",
        alt_labels="Data Analyst|Machine Learning Engineer",
        is_localized=False
    )
    
    # Create skill hierarchies
    SkillHierarchy.objects.create(
        parent_object_type="skillgroup",
        parent_id="SG1",
        child_object_type="skill",
        child_id="SKILL1"
    )
    
    SkillHierarchy.objects.create(
        parent_object_type="skillgroup",
        parent_id="SG1",
        child_object_type="skill",
        child_id="SKILL2"
    )
    
    SkillHierarchy.objects.create(
        parent_object_type="skillgroup",
        parent_id="SG1",
        child_object_type="skill",
        child_id="SKILL4"
    )
    
    SkillHierarchy.objects.create(
        parent_object_type="skillgroup",
        parent_id="SG2",
        child_object_type="skill",
        child_id="SKILL3"
    )
    
    # Create skill to skill relations
    SkillToSkillRelation.objects.create(
        requiring_skill=skill2,
        required_skill=skill1,
        relation_type="essential"
    )
    
    SkillToSkillRelation.objects.create(
        requiring_skill=skill2,
        required_skill=skill4,
        relation_type="essential"
    )
    
    # Create occupation to skill relations
    OccupationToSkillRelation.objects.create(
        occupation=occupation1,
        skill=skill1,
        relation_type="essential"
    )
    
    OccupationToSkillRelation.objects.create(
        occupation=occupation1,
        skill=skill3,
        relation_type="optional"
    )
    
    OccupationToSkillRelation.objects.create(
        occupation=occupation2,
        skill=skill1,
        relation_type="essential"
    )
    
    OccupationToSkillRelation.objects.create(
        occupation=occupation2,
        skill=skill2,
        relation_type="essential"
    )
    
    OccupationToSkillRelation.objects.create(
        occupation=occupation2,
        skill=skill4,
        relation_type="essential"
    )
    
    OccupationToSkillRelation.objects.create(
        occupation=occupation2,
        skill=skill3,
        signalling_value_label="high",
        signalling_value=0.8
    )
    
    print("Sample data created successfully!")
    print(f"Created {Skill.objects.count()} skills")
    print(f"Created {Occupation.objects.count()} occupations")
    print(f"Created {SkillGroup.objects.count()} skill groups")
    print(f"Created {OccupationGroup.objects.count()} occupation groups")
    print(f"Created {SkillToSkillRelation.objects.count()} skill relations")
    print(f"Created {OccupationToSkillRelation.objects.count()} occupation-skill relations")

if __name__ == "__main__":
    create_sample_data()
