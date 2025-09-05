# JobCompass Backend API

This Django backend provides APIs for the Tabiya taxonomy data structure, designed to support the JobCompass frontend application.

## Features

- **Complete Tabiya CSV Format Support**: All 9 CSV file types are supported
- **JWT Authentication**: Using django-rest-framework-simplejwt
- **RESTful API**: Full CRUD operations for all taxonomy entities
- **Search Functionality**: Universal search across skills and occupations
- **Skill Mapping**: Network visualization data for skill relationships
- **Statistics & Analytics**: Taxonomy statistics and popular skills

## API Endpoints

### Authentication

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile

### Model Information

- `GET /api/taxonomy/model-info/` - Get taxonomy model information

### Skills

- `GET /api/taxonomy/skills/` - List all skills (with search, filtering)
- `GET /api/taxonomy/skills/{id}/` - Get specific skill details
- `GET /api/taxonomy/skill-groups/` - List skill groups
- `GET /api/taxonomy/skill-groups/{id}/` - Get specific skill group

### Occupations

- `GET /api/taxonomy/occupations/` - List all occupations (with search, filtering)
- `GET /api/taxonomy/occupations/{id}/` - Get specific occupation details
- `GET /api/taxonomy/occupation-groups/` - List occupation groups
- `GET /api/taxonomy/occupation-groups/{id}/` - Get specific occupation group

### Relations

- `GET /api/taxonomy/skill-relations/` - List skill-to-skill relations
- `GET /api/taxonomy/occupation-skill-relations/` - List occupation-to-skill relations

### Hierarchies

- `GET /api/taxonomy/skill-hierarchy/` - List skill hierarchy relationships
- `GET /api/taxonomy/occupation-hierarchy/` - List occupation hierarchy relationships

### Search & Analytics

- `GET /api/taxonomy/search/?q={query}` - Universal search
- `GET /api/taxonomy/skill-mapping/?skill_id={id}` - Get skill mapping visualization data
- `GET /api/taxonomy/stats/` - Get taxonomy statistics
- `GET /api/taxonomy/popular-skills/` - Get most popular skills
- `GET /api/taxonomy/skill-suggestions/?skill_id={id}` - Get skill suggestions

## Query Parameters

### Skills Endpoint

- `search` - Search in preferred_label, description, alt_labels
- `skill_type` - Filter by skill type (skill/competence, knowledge, language, attitude)
- `reuse_level` - Filter by reuse level (sector-specific, occupation-specific, cross-sector, transversal)

### Occupations Endpoint

- `search` - Search in preferred_label, description, alt_labels
- `occupation_type` - Filter by occupation type (escooccupation, localoccupation)

### Occupation Groups Endpoint

- `search` - Search in preferred_label, description, code
- `group_type` - Filter by group type (iscogroup, localgroup)

## Response Format

All list endpoints return paginated results:

```json
{
  "count": 100,
  "next": "http://example.com/api/taxonomy/skills/?page=3",
  "previous": "http://example.com/api/taxonomy/skills/?page=1",
  "results": [...]
}
```

## Data Import

To import Tabiya CSV files:

```bash
uv run python manage.py import_csv /path/to/csv/directory --clear
```

The `--clear` flag will remove existing data before importing.

## CSV File Structure Support

The backend supports all 9 Tabiya CSV files:

1. **model_info.csv** - Taxonomy model information
2. **skill_groups.csv** - Skill groups
3. **skills.csv** - Individual skills
4. **skill_hierarchy.csv** - Skill group/skill relationships
5. **skill_to_skill_relations.csv** - Skill dependencies
6. **occupation_groups.csv** - Occupation groups
7. **occupations.csv** - Individual occupations
8. **occupation_hierarchy.csv** - Occupation group/occupation relationships
9. **occupation_to_skill_relations.csv** - Occupation-skill relationships

## Frontend Integration

The API is designed to support the JobCompass frontend requirements:

### For Skill Mapping Page

- Use `/api/taxonomy/skill-mapping/?skill_id={id}` to get visualization data
- Returns nodes and edges for network graph

### For Tabiya Dataset Explorer

- Use `/api/taxonomy/search/?q={query}` for search functionality
- Use `/api/taxonomy/stats/` for statistics dashboard
- Use `/api/taxonomy/popular-skills/` for trending skills

### For Landing Page

- Use `/api/taxonomy/stats/` for overview statistics
- Use `/api/taxonomy/popular-skills/` for featured content

## CORS Configuration

The backend is configured to accept requests from:

- http://localhost:3000 (React default)
- http://localhost:5173 (Vite default)
- http://127.0.0.1:3000
- http://127.0.0.1:5173

## Authentication

Most endpoints allow anonymous access for browsing. Authentication is required for:

- User profile access
- Future features like bookmarks, user preferences

## Sample Usage

```javascript
// Search for skills
const response = await fetch(
  "http://127.0.0.1:8000/api/taxonomy/search/?q=python"
);
const data = await response.json();

// Get skill mapping data
const mappingResponse = await fetch(
  "http://127.0.0.1:8000/api/taxonomy/skill-mapping/?skill_id=SKILL1"
);
const mappingData = await mappingResponse.json();

// Get taxonomy stats
const statsResponse = await fetch("http://127.0.0.1:8000/api/taxonomy/stats/");
const stats = await statsResponse.json();
```
