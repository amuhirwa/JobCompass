# JobCompass

JobCompass is an intelligent platform that leverages the Tabiya Open Taxonomy to provide advanced skill mapping, occupation matching, and taxonomy visualization. It features a modern, accessible React frontend paired with a robust Django REST backend powered by AI.

## Key Features

- **Taxonomy Management**: Fully implements the Tabiya Open Taxonomy CSV format for skills, occupations, and their hierarchical relationships.
- **Interactive Visualizations**: Network graphs and visual skill mapping powered by Sigma.js, Graphology, and Three.js.
- **AI-Powered Insights**: Integrates Google Generative AI (Gemini) to enrich occupation matching and skill gap analysis.
- **Modern User Interface**: A beautifully designed, highly accessible frontend built with React, Radix UI primitives, Tailwind CSS, and Framer Motion.
- **Robust API**: Deep search and filtering capabilities via a Django REST API secured with JWT authentication.
- **Accessibility First**: Designed with broad accessibility in mind, supporting screen readers, keyboard navigation, and custom testing integrations.

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **State & Data Fetching**: TanStack React Query (@tanstack/react-query)
- **UI & Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons, Framer Motion
- **Visualization**: Sigma.js, Graphology, React Three Fiber
- **Code Quality**: ESLint, Prettier, Vitest

### Backend
- **Framework**: Django 5+ & Django REST Framework
- **Language**: Python 3.11+ (managed via `uv`)
- **Database**: SQLite (local) / PostgreSQL (production-ready via Docker)
- **Authentication**: JWT (SimpleJWT)
- **AI Integration**: Google Generative AI framework (`google-generativeai`)
- **Deployment**: Gunicorn, Docker & Docker Compose setup included

## Project Structure

```
JobCompass/
├── backend/                 # Django REST API and admin logic
│   ├── accounts/            # User models and authentication flows
│   ├── ai_services/         # Gemini AI integrations for insights
│   ├── authentication/      # API endpoints for auth (SimpleJWT)
│   ├── community/           # Community/user features
│   ├── jobs/                # Job listing and matching models
│   ├── taxonomy/            # Core Tabiya taxonomy implementations
│   └── docker-compose.yml   # Container setups for backend services
├── frontend/                # React application
│   ├── src/                 # Application source code
│   │   ├── components/      # Reusable UI elements (Radix + Tailwind)
│   │   ├── features/        # Feature-based module organization
│   │   ├── hooks/           # Custom React hooks
│   │   └── contexts/        # React context providers
│   ├── scripts/             # Built-in accessibility auditing scripts
│   └── docs/                # Frontend specific documentation
└── data/                    # Tabiya taxonomy CSV files
```

## Getting Started

### Backend Setup

1. **Navigate to the backend directory and run dependencies**:
   ```bash
   cd backend
   uv sync
   ```
2. **Apply Database Migrations**:
   ```bash
   uv run python manage.py migrate
   ```
3. **Import the taxonomy data** (from the `data/` directory folder at the root):
   ```bash
   uv run python manage.py import_csv ../data --clear
   ```
4. **Start the API server**:
   ```bash
   uv run python manage.py runserver
   ```
   *The backend will be available at `http://localhost:8000/api/`.*

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   Using `npm`, `yarn`, or `pnpm` (based on lockfiles):
   ```bash
   pnpm install
   ```
3. **Start the development server**:
   ```bash
   pnpm run dev
   ```
   *The frontend will run on `http://localhost:5173/`.*

## Documentation

For more in-depth setup or API guidance, see the component readmes:
- **Backend API**: [`backend/API_DOCUMENTATION.md`](backend/API_DOCUMENTATION.md) and [`backend/README.md`](backend/README.md)
- **Frontend Accessibility**: [`frontend/docs/ACCESSIBILITY.md`](frontend/docs/ACCESSIBILITY.md)
- **Learning Resources**: [`LEARNING_RESOURCES_IMPLEMENTATION.md`](LEARNING_RESOURCES_IMPLEMENTATION.md)
- **Jobs Setup**: [`JOBS_SETUP.md`](JOBS_SETUP.md)

## License & Data

This application ingests data following the Tabiya Open Taxonomy. Data is located in the `data/` directory. Check individual headers and files for relevant data licenses.
