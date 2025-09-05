import csv
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from taxonomy.models import (
    ModelInfo, SkillGroup, Skill, OccupationGroup, Occupation,
    SkillToSkillRelation, OccupationToSkillRelation, 
    SkillHierarchy, OccupationHierarchy
)


class Command(BaseCommand):
    help = 'Import Tabiya CSV files into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            'csv_directory',
            type=str,
            help='Path to the directory containing the CSV files'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before importing'
        )

    def handle(self, *args, **options):
        csv_dir = options['csv_directory']
        clear_data = options['clear']

        if not os.path.exists(csv_dir):
            self.stdout.write(
                self.style.ERROR(f'Directory {csv_dir} does not exist')
            )
            return

        if clear_data:
            self.stdout.write('Clearing existing data...')
            self.clear_data()

        # Import order matters due to foreign key relationships
        self.import_model_info(csv_dir)
        self.import_skill_groups(csv_dir)
        self.import_skills(csv_dir)
        self.import_occupation_groups(csv_dir)
        self.import_occupations(csv_dir)
        self.import_skill_hierarchy(csv_dir)
        self.import_occupation_hierarchy(csv_dir)
        self.import_skill_to_skill_relations(csv_dir)
        self.import_occupation_to_skill_relations(csv_dir)

        self.stdout.write(
            self.style.SUCCESS('Successfully imported all CSV files')
        )

    def clear_data(self):
        """Clear all taxonomy data"""
        with transaction.atomic():
            OccupationToSkillRelation.objects.all().delete()
            SkillToSkillRelation.objects.all().delete()
            OccupationHierarchy.objects.all().delete()
            SkillHierarchy.objects.all().delete()
            Occupation.objects.all().delete()
            OccupationGroup.objects.all().delete()
            Skill.objects.all().delete()
            SkillGroup.objects.all().delete()
            ModelInfo.objects.all().delete()

    def import_model_info(self, csv_dir):
        """Import model_info.csv"""
        file_path = os.path.join(csv_dir, 'model_info.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f'Skipping model_info.csv - file not found')
            return

        self.stdout.write('Importing model_info.csv...')
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            with transaction.atomic():
                for row in reader:
                    ModelInfo.objects.create(
                        uuid_history=row.get('UUIDHISTORY', ''),
                        name=row.get('NAME', ''),
                        locale=row.get('LOCALE', ''),
                        description=row.get('DESCRIPTION', ''),
                        version=row.get('VERSION', ''),
                        released=row.get('RELEASED', '').lower() == 'true',
                        release_notes=row.get('RELEASENOTES', '')
                    )

    def import_skill_groups(self, csv_dir):
        """Import skill_groups.csv"""
        file_path = os.path.join(csv_dir, 'skill_groups.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f'Skipping skill_groups.csv - file not found')
            return

        self.stdout.write('Importing skill_groups.csv...')
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            with transaction.atomic():
                for row in reader:
                    SkillGroup.objects.create(
                        id=row.get('ID', ''),
                        uuid_history=row.get('UUIDHISTORY', ''),
                        origin_uri=row.get('ORIGINURI', ''),
                        code = row.get('CODE') or None,
                        preferred_label=row.get('PREFERREDLABEL', ''),
                        alt_labels=row.get('ALTLABELS', ''),
                        description=row.get('DESCRIPTION', ''),
                        scope_note=row.get('SCOPENOTE', '')
                    )

    def import_skills(self, csv_dir):
        """Import skills.csv"""
        file_path = os.path.join(csv_dir, 'skills.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f'Skipping skills.csv - file not found')
            return

        self.stdout.write('Importing skills.csv...')
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            with transaction.atomic():
                for row in reader:
                    Skill.objects.create(
                        id=row.get('ID', ''),
                        uuid_history=row.get('UUIDHISTORY', ''),
                        origin_uri=row.get('ORIGINURI', ''),
                        skill_type=row.get('SKILLTYPE', ''),
                        reuse_level=row.get('REUSELEVEL', ''),
                        preferred_label=row.get('PREFERREDLABEL', ''),
                        alt_labels=row.get('ALTLABELS', ''),
                        description=row.get('DESCRIPTION', ''),
                        definition=row.get('DEFINITION', ''),
                        scope_note=row.get('SCOPENOTE', ''),
                        is_localized=row.get('ISLOCALIZED', '').lower() == 'true'
                    )

    def import_occupation_groups(self, csv_dir):
        """Import occupation_groups.csv"""
        file_path = os.path.join(csv_dir, 'occupation_groups.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f'Skipping occupation_groups.csv - file not found')
            return

        self.stdout.write('Importing occupation_groups.csv...')
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            with transaction.atomic():
                for row in reader:
                    OccupationGroup.objects.create(
                        id=row.get('ID', ''),
                        uuid_history=row.get('UUIDHISTORY', ''),
                        origin_uri=row.get('ORIGINURI', ''),
                        code=row.get('CODE', ''),
                        group_type=row.get('GROUPTYPE', ''),
                        preferred_label=row.get('PREFERREDLABEL', ''),
                        alt_labels=row.get('ALTLABELS', ''),
                        description=row.get('DESCRIPTION', '')
                    )

    def import_occupations(self, csv_dir):
        """Import occupations.csv"""
        file_path = os.path.join(csv_dir, 'occupations.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f'Skipping occupations.csv - file not found')
            return

        self.stdout.write('Importing occupations.csv...')
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            with transaction.atomic():
                for row in reader:
                    Occupation.objects.create(
                        id=row.get('ID', ''),
                        uuid_history=row.get('UUIDHISTORY', ''),
                        origin_uri=row.get('ORIGINURI', ''),
                        occupation_group_code=row.get('OCCUPATIONGROUPCODE', ''),
                        code=row.get('CODE', ''),
                        preferred_label=row.get('PREFERREDLABEL', ''),
                        alt_labels=row.get('ALTLABELS', ''),
                        description=row.get('DESCRIPTION', ''),
                        definition=row.get('DEFINITION', ''),
                        scope_note=row.get('SCOPENOTE', ''),
                        regulated_profession_note=row.get('REGULATEDPROFESSIONNOTE', ''),
                        occupation_type=row.get('OCCUPATIONTYPE', ''),
                        is_localized=row.get('ISLOCALIZED', '').lower() == 'true'
                    )

    def import_skill_hierarchy(self, csv_dir):
        """Import skill_hierarchy.csv"""
        file_path = os.path.join(csv_dir, 'skill_hierarchy.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f'Skipping skill_hierarchy.csv - file not found')
            return

        self.stdout.write('Importing skill_hierarchy.csv...')
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            with transaction.atomic():
                for row in reader:
                    SkillHierarchy.objects.create(
                        parent_object_type=row.get('PARENTOBJECTTYPE', ''),
                        parent_id=row.get('PARENTID', ''),
                        child_object_type=row.get('CHILDOBJECTTYPE', ''),
                        child_id=row.get('CHILDID', '')
                    )

    def import_occupation_hierarchy(self, csv_dir):
        """Import occupation_hierarchy.csv"""
        file_path = os.path.join(csv_dir, 'occupation_hierarchy.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f'Skipping occupation_hierarchy.csv - file not found')
            return

        self.stdout.write('Importing occupation_hierarchy.csv...')
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            with transaction.atomic():
                for row in reader:
                    OccupationHierarchy.objects.create(
                        parent_object_type=row.get('PARENTOBJECTTYPE', ''),
                        parent_id=row.get('PARENTID', ''),
                        child_object_type=row.get('CHILDOBJECTTYPE', ''),
                        child_id=row.get('CHILDID', '')
                    )

    def import_skill_to_skill_relations(self, csv_dir):
        """Import skill_to_skill_relations.csv"""
        file_path = os.path.join(csv_dir, 'skill_to_skill_relations.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f'Skipping skill_to_skill_relations.csv - file not found')
            return

        self.stdout.write('Importing skill_to_skill_relations.csv...')
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            with transaction.atomic():
                for row in reader:
                    try:
                        requiring_skill = Skill.objects.get(id=row.get('REQUIRINGID', ''))
                        required_skill = Skill.objects.get(id=row.get('REQUIREDID', ''))
                        
                        SkillToSkillRelation.objects.create(
                            requiring_skill=requiring_skill,
                            required_skill=required_skill,
                            relation_type=row.get('RELATIONTYPE', '')
                        )
                    except Skill.DoesNotExist:
                        self.stdout.write(f'Skill not found for relation: {row}')
                        continue

    def import_occupation_to_skill_relations(self, csv_dir):
        """Import occupation_to_skill_relations.csv"""
        file_path = os.path.join(csv_dir, 'occupation_to_skill_relations.csv')
        if not os.path.exists(file_path):
            self.stdout.write(f'Skipping occupation_to_skill_relations.csv - file not found')
            return

        self.stdout.write('Importing occupation_to_skill_relations.csv...')
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            with transaction.atomic():
                for row in reader:
                    try:
                        occupation = Occupation.objects.get(id=row.get('OCCUPATIONID', ''))
                        skill = Skill.objects.get(id=row.get('SKILLID', ''))
                        
                        signalling_value = row.get('SIGNALLINGVALUE', '')
                        if signalling_value:
                            try:
                                signalling_value = float(signalling_value)
                            except ValueError:
                                signalling_value = None
                        else:
                            signalling_value = None

                        OccupationToSkillRelation.objects.create(
                            occupation=occupation,
                            skill=skill,
                            relation_type=row.get('RELATIONTYPE', ''),
                            signalling_value_label=row.get('SIGNALLINGVALUELABEL', ''),
                            signalling_value=signalling_value
                        )
                    except (Occupation.DoesNotExist, Skill.DoesNotExist):
                        self.stdout.write(f'Occupation or Skill not found for relation: {row}')
                        continue
