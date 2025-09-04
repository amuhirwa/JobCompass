from django.db import models
import uuid


class BaseModel(models.Model):
    """Base model with common fields"""
    id = models.CharField(max_length=100, primary_key=True)
    uuid_history = models.TextField(help_text="Comma-separated list of UUIDs")
    origin_uri = models.URLField(max_length=4096, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def get_uuid_history_list(self):
        """Return UUID history as a list"""
        if self.uuid_history:
            return self.uuid_history.split('|')
        return []

    def set_uuid_history_list(self, uuid_list):
        """Set UUID history from a list"""
        self.uuid_history = '|'.join(uuid_list)

    def get_current_uuid(self):
        """Get the current (first) UUID"""
        uuid_list = self.get_uuid_history_list()
        return uuid_list[0] if uuid_list else None


class ModelInfo(models.Model):
    """Model information for the taxonomy"""
    uuid_history = models.TextField(help_text="Comma-separated list of UUIDs")
    name = models.CharField(max_length=255)
    locale = models.CharField(max_length=10)
    description = models.TextField(blank=True)
    version = models.CharField(max_length=50)
    released = models.BooleanField(default=False)
    release_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} v{self.version}"


class SkillGroup(BaseModel):
    """Skill groups as defined in the taxonomy"""
    code = models.CharField(max_length=20, unique=True, blank=True, null=True)
    preferred_label = models.CharField(max_length=255)
    alt_labels = models.TextField(blank=True, help_text="Pipe-separated alternative labels")
    description = models.TextField(max_length=4000, blank=True)
    scope_note = models.TextField(max_length=4000, blank=True)

    def __str__(self):
        return f"{self.code} - {self.preferred_label}"

    def get_alt_labels_list(self):
        """Return alternative labels as a list"""
        if self.alt_labels:
            return self.alt_labels.split('|')
        return []

    def set_alt_labels_list(self, labels_list):
        """Set alternative labels from a list"""
        self.alt_labels = '|'.join(labels_list)


class Skill(BaseModel):
    """Skills in the taxonomy"""
    SKILL_TYPES = [
        ('skill/competence', 'Skill/Competence'),
        ('knowledge', 'Knowledge'),
        ('language', 'Language'),
        ('attitude', 'Attitude'),
        ('', 'Not Specified'),
    ]

    REUSE_LEVELS = [
        ('sector-specific', 'Sector Specific'),
        ('occupation-specific', 'Occupation Specific'),
        ('cross-sector', 'Cross Sector'),
        ('transversal', 'Transversal'),
        ('', 'Not Specified'),
    ]

    skill_type = models.CharField(max_length=20, choices=SKILL_TYPES, blank=True)
    reuse_level = models.CharField(max_length=20, choices=REUSE_LEVELS, blank=True)
    preferred_label = models.CharField(max_length=255)
    alt_labels = models.TextField(blank=True, help_text="Pipe-separated alternative labels")
    description = models.TextField(max_length=4000, blank=True)
    definition = models.TextField(max_length=4000, blank=True)
    scope_note = models.TextField(max_length=4000, blank=True)
    is_localized = models.BooleanField(default=False)

    def __str__(self):
        return self.preferred_label

    def get_alt_labels_list(self):
        """Return alternative labels as a list"""
        if self.alt_labels:
            return self.alt_labels.split('|')
        return []

    def set_alt_labels_list(self, labels_list):
        """Set alternative labels from a list"""
        self.alt_labels = '|'.join(labels_list)


class OccupationGroup(BaseModel):
    """Occupation groups in the taxonomy"""
    GROUP_TYPES = [
        ('iscogroup', 'ISCO Group'),
        ('localgroup', 'Local Group'),
    ]

    code = models.CharField(max_length=20, unique=True)
    group_type = models.CharField(max_length=15, choices=GROUP_TYPES)
    preferred_label = models.CharField(max_length=255)
    alt_labels = models.TextField(blank=True, help_text="Pipe-separated alternative labels")
    description = models.TextField(max_length=4000, blank=True)

    def __str__(self):
        return f"{self.code} - {self.preferred_label}"

    def get_alt_labels_list(self):
        """Return alternative labels as a list"""
        if self.alt_labels:
            return self.alt_labels.split('|')
        return []

    def set_alt_labels_list(self, labels_list):
        """Set alternative labels from a list"""
        self.alt_labels = '|'.join(labels_list)


class Occupation(BaseModel):
    """Occupations in the taxonomy"""
    OCCUPATION_TYPES = [
        ('escooccupation', 'ESCO Occupation'),
        ('localoccupation', 'Local Occupation'),
    ]

    occupation_group_code = models.CharField(max_length=20)
    code = models.CharField(max_length=50, unique=True)
    preferred_label = models.CharField(max_length=255)
    alt_labels = models.TextField(blank=True, help_text="Pipe-separated alternative labels")
    description = models.TextField(max_length=4000, blank=True)
    definition = models.TextField(max_length=4000, blank=True)
    scope_note = models.TextField(max_length=4000, blank=True)
    regulated_profession_note = models.TextField(max_length=4000, blank=True)
    occupation_type = models.CharField(max_length=20, choices=OCCUPATION_TYPES)
    is_localized = models.BooleanField(default=False)

    def __str__(self):
        return self.preferred_label

    def get_alt_labels_list(self):
        """Return alternative labels as a list"""
        if self.alt_labels:
            return self.alt_labels.split('|')
        return []

    def set_alt_labels_list(self, labels_list):
        """Set alternative labels from a list"""
        self.alt_labels = '|'.join(labels_list)


class SkillToSkillRelation(models.Model):
    """Relations between skills"""
    RELATION_TYPES = [
        ('essential', 'Essential'),
        ('optional', 'Optional'),
    ]

    requiring_skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='required_skills'
    )
    required_skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='requiring_skills'
    )
    relation_type = models.CharField(max_length=10, choices=RELATION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['requiring_skill', 'required_skill']

    def __str__(self):
        return f"{self.requiring_skill} ({self.relation_type}) -> {self.required_skill}"


class OccupationToSkillRelation(models.Model):
    """Relations between occupations and skills"""
    RELATION_TYPES = [
        ('essential', 'Essential'),
        ('optional', 'Optional'),
        ('', 'Not Specified'),
    ]

    SIGNALLING_VALUE_LABELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('', 'Not Specified'),
    ]

    occupation = models.ForeignKey(
        Occupation,
        on_delete=models.CASCADE,
        related_name='skill_relations'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='occupation_relations'
    )
    relation_type = models.CharField(max_length=10, choices=RELATION_TYPES, blank=True)
    signalling_value_label = models.CharField(
        max_length=10, 
        choices=SIGNALLING_VALUE_LABELS, 
        blank=True
    )
    signalling_value = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Value between 0 and 1"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['occupation', 'skill']

    def __str__(self):
        return f"{self.occupation} -> {self.skill}"


class SkillHierarchy(models.Model):
    """Hierarchical structure of skills and skill groups"""
    PARENT_OBJECT_TYPES = [
        ('skill', 'Skill'),
        ('skillgroup', 'Skill Group'),
    ]

    CHILD_OBJECT_TYPES = [
        ('skill', 'Skill'),
        ('skillgroup', 'Skill Group'),
    ]

    parent_object_type = models.CharField(max_length=15, choices=PARENT_OBJECT_TYPES)
    parent_id = models.CharField(max_length=100)
    child_object_type = models.CharField(max_length=15, choices=CHILD_OBJECT_TYPES)
    child_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['parent_object_type', 'parent_id', 'child_object_type', 'child_id']

    def __str__(self):
        return f"{self.parent_object_type}({self.parent_id}) -> {self.child_object_type}({self.child_id})"


class OccupationHierarchy(models.Model):
    """Hierarchical structure of occupations and occupation groups"""
    PARENT_OBJECT_TYPES = [
        ('occupationgroup', 'Occupation Group'),
        ('escooccupation', 'ESCO Occupation'),
        ('localoccupation', 'Local Occupation'),
    ]

    CHILD_OBJECT_TYPES = [
        ('occupationgroup', 'Occupation Group'),
        ('escooccupation', 'ESCO Occupation'),
        ('localoccupation', 'Local Occupation'),
    ]

    parent_object_type = models.CharField(max_length=20, choices=PARENT_OBJECT_TYPES)
    parent_id = models.CharField(max_length=100)
    child_object_type = models.CharField(max_length=20, choices=CHILD_OBJECT_TYPES)
    child_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['parent_object_type', 'parent_id', 'child_object_type', 'child_id']

    def __str__(self):
        return f"{self.parent_object_type}({self.parent_id}) -> {self.child_object_type}({self.child_id})"
