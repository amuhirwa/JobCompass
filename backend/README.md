# JobCompass Backend

A Django REST API backend for the JobCompass application, implementing the complete Tabiya Open Taxonomy CSV format for skills, occupations, and their relationships.

## Features

- **Complete Tabiya CSV Support**: All 9 CSV file types from the Tabiya Open Taxonomy
- **RESTful API**: Full CRUD operations for all taxonomy entities
- **JWT Authentication**: Secure authentication using django-rest-framework-simplejwt
- **Search & Filtering**: Advanced search across skills and occupations
- **Skill Mapping**: Network visualization data for skill relationships
- **Analytics**: Statistics and insights about the taxonomy data
- **CSV Import**: Management command to import Tabiya CSV files
- **Admin Interface**: Django admin for data management

## Quick Start

### Prerequisites

- Python 3.11+
- uv (Python package manager)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd JobCompass/backend
```

2. Install dependencies using uv:

```bash
uv sync
```

3. Run migrations:

```bash
uv run python manage.py migrate
```

4. Create a superuser:

```bash
uv run python manage.py createsuperuser
```

5. Create sample data (optional):

```bash
uv run python create_sample_data.py
```

6. Start the development server:

```bash
uv run python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

### Key Endpoints

- `/api/taxonomy/skills/` - Skills with search and filtering
- `/api/taxonomy/occupations/` - Occupations with search and filtering
- `/api/taxonomy/search/?q={query}` - Universal search
- `/api/taxonomy/skill-mapping/?skill_id={id}` - Skill network data
- `/api/taxonomy/stats/` - Taxonomy statistics
- `/api/auth/login/` - JWT authentication

## Data Import

To import Tabiya CSV files:

```bash
uv run python manage.py import_csv /path/to/csv/directory --clear
```

The CSV directory should contain the 9 Tabiya files:

- model_info.csv
- skill_groups.csv
- skills.csv
- skill_hierarchy.csv
- skill_to_skill_relations.csv
- occupation_groups.csv
- occupations.csv
- occupation_hierarchy.csv
- occupation_to_skill_relations.csv

## Tabiya CSV Format Support

This backend implements the complete Tabiya Open Taxonomy CSV format:

### Supported Entity Types

- **ModelInfo**: Taxonomy metadata
- **SkillGroups**: Hierarchical skill categories
- **Skills**: Individual skills with types and reuse levels
- **OccupationGroups**: Hierarchical occupation categories
- **Occupations**: Individual occupations (ESCO and local)
- **Relations**: Skill-to-skill and occupation-to-skill relationships
- **Hierarchies**: Parent-child relationships for skills and occupations

### Field Support

- UUID History tracking
- Origin URI references
- Alternative labels (pipe-separated)
- Skill types: skill/competence, knowledge, language, attitude
- Reuse levels: sector-specific, occupation-specific, cross-sector, transversal
- Occupation types: escooccupation, localoccupation
- Relation types: essential, optional
- Signalling values: 0-1 decimal values with labels

## Frontend Integration

The API is designed to support the JobCompass React frontend:

```javascript
// Example usage
const api = new JobCompassAPI("http://127.0.0.1:8000/api");

// Search
const results = await api.universalSearch("python programming");

// Skill mapping for visualization
const mappingData = await api.getSkillMappingData("SKILL1");

// Statistics for dashboard
const stats = await api.getTaxonomyStats();
```

See [frontend_integration_examples.js](frontend_integration_examples.js) for complete examples.

## Project Structure

```
backend/
├── core/                  # Django settings and configuration
├── taxonomy/              # Main taxonomy app
│   ├── models.py         # Database models for Tabiya entities
│   ├── serializers.py    # DRF serializers
│   ├── views.py          # API views
│   ├── admin.py          # Django admin configuration
│   └── management/       # Management commands
│       └── commands/
│           └── import_csv.py
├── accounts/              # Authentication app
├── create_sample_data.py  # Sample data creation script
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
└── docker-compose.yml    # Docker Compose setup
```

## Database Models

The backend models closely follow the Tabiya CSV structure:

- **BaseModel**: Abstract base with UUID history and timestamps
- **ModelInfo**: Taxonomy version information
- **SkillGroup/Skill**: Skills with hierarchy support
- **OccupationGroup/Occupation**: Occupations with hierarchy support
- **Relations**: Skill-skill and occupation-skill relationships
- **Hierarchies**: Parent-child relationships

## Docker Deployment

Build and run with Docker:

```bash
docker-compose up --build
```

This will start:

- Django backend on port 8000
- PostgreSQL database on port 5432

## Development

### Adding New Endpoints

1. Add view to `taxonomy/views.py`
2. Add URL pattern to `taxonomy/urls.py`
3. Add serializer if needed in `taxonomy/serializers.py`

### Running Tests

```bash
uv run python manage.py test
```

### Code Style

```bash
# Format code
uv run black .

# Check linting
uv run flake8 .
```

## Configuration

### Environment Variables

- `DJANGO_DEBUG`: Set to `0` for production
- `DJANGO_SECRET_KEY`: Secret key for Django
- `DATABASE_URL`: Database connection string (optional)

### CORS Settings

The backend is configured to accept requests from:

- http://localhost:3000 (React)
- http://localhost:5173 (Vite)
- http://127.0.0.1:3000
- http://127.0.0.1:5173

Update `CORS_ALLOWED_ORIGINS` in settings.py for production.

## Production Deployment

1. Set environment variables:

   ```bash
   export DJANGO_DEBUG=0
   export DJANGO_SECRET_KEY=your-secret-key
   ```

2. Use PostgreSQL database:

   ```bash
   uv add psycopg2-binary
   ```

3. Update database settings in `settings.py`

4. Collect static files:

   ```bash
   uv run python manage.py collectstatic
   ```

5. Use production WSGI server:
   ```bash
   uv add gunicorn
   uv run gunicorn core.wsgi:application
   ```

## License

[Add your license information here]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions:

- Check the API documentation
- Review the sample data and examples
- Create an issue in the repository
