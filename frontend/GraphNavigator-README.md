# GraphNavigator - Tabiya Dataset Explorer

An interactive React component for visualizing the Tabiya ESCO dataset as a graph using Sigma.js and Graphology. This component provides an immersive exploration experience for occupations, skills, and their relationships.

## Features

### Core Functionality

- **Interactive Graph Visualization**: WebGL-powered rendering with Sigma.js
- **Dynamic Clustering**: Initial view shows occupation groups as clusters
- **Progressive Loading**: Click clusters to expand and explore detailed relationships
- **Fuzzy Search**: Find and center specific occupations or skills
- **Real-time Interactions**: Hover tooltips, click highlighting, zoom controls

### Performance Optimizations

- **Web Worker CSV Parsing**: Non-blocking data processing
- **Lazy Loading**: Initial view shows 20 top clusters, expand on demand
- **Efficient Data Structures**: Uses Maps for O(1) lookups
- **Progressive Rendering**: Limits nodes per cluster (10 occupations, 15 skills)

### UI/UX Features

- **Responsive Design**: Works on desktop and large tablets
- **Tailwind CSS Styling**: Modern, clean interface
- **Node Size Mapping**: Occupation node sizes reflect skill count
- **Color Coding**: Blue (occupations), Green (skills), Yellow (groups)
- **Edge Styling**: Solid (essential), Dashed (optional), Thick (hierarchy)

## Installation & Setup

### Prerequisites

- Node.js 18+
- Modern browser with WebGL support

### Dependencies

The component uses CDN-hosted libraries to avoid bundle bloat:

- **Sigma.js v3.0.0-beta.20**: WebGL graph rendering
- **Graphology v0.25.4**: Graph data structure and algorithms
- **ForceAtlas2 Layout**: Automatic node positioning
- **Louvain Communities**: Community detection (optional)

### Running Locally

1. **Start the development server**:

   ```bash
   cd frontend
   npm run dev
   ```

2. **Access the component**:
   Navigate to the TabiyaDatasetExplorer page in your application

3. **Dataset Requirements**:
   Ensure CSV files are available in `frontend/public/data/`:
   - `occupations.csv`
   - `skills.csv`
   - `occupation_groups.csv`
   - `skill_groups.csv`
   - `occupation_to_skill_relations.csv`
   - `occupation_hierarchy.csv`
   - `skill_hierarchy.csv`

## Usage Guide

### Initial View

- The graph loads with occupation group clusters (max 20)
- Node sizes indicate total skills in each group
- Hover over nodes to see tooltips with details

### Exploration

- **Click clusters** to expand and see constituent occupations
- **Click occupations** to highlight connected skills
- **Search** to find specific items and center the view
- **Zoom/Pan** using controls or mouse/touch gestures

### Controls

- **Search Bar**: Type and press Enter or click Search button
- **Zoom In/Out**: Dedicated buttons in toolbar
- **Reset View**: Return to initial position and zoom level
- **Node Selection**: Click nodes to see details in side panel

## Architecture

### Component Structure

```
TabiyaDatasetExplorer.tsx (Main component)
├── State Management (React hooks)
├── CDN Script Loading (Sigma.js, Graphology)
├── Web Worker (CSV parsing)
├── Graph Processing (Clustering, layout)
├── Event Handlers (Search, zoom, selection)
└── UI Components (Search, legend, tooltips)
```

### Data Flow

1. **Load CDN Scripts**: Dynamically inject Sigma.js and Graphology
2. **Spawn Worker**: Create inline worker for CSV parsing
3. **Fetch CSV Files**: Load dataset files from `/data/` directory
4. **Process Data**: Worker parses CSVs, main thread builds graph
5. **Initialize Visualization**: Create Sigma instance with initial clusters
6. **Handle Interactions**: User events trigger graph updates

### Performance Notes

#### Lazy Loading Strategy

- **Initial Load**: 20 occupation group clusters only
- **Cluster Expansion**: Max 10 occupations + 15 related skills
- **Memory Management**: Clean up unused nodes when switching views

#### Web Worker Benefits

- **Non-blocking Parsing**: CSV processing doesn't freeze UI
- **Parallel Processing**: Multiple files parsed simultaneously
- **Data Cleaning**: Standardizes values, handles null/empty fields

#### Further Optimizations

- **Viewport Culling**: Only render visible nodes (future enhancement)
- **Level-of-Detail**: Simplify distant nodes (future enhancement)
- **Precomputed Clusters**: JSON cluster tiles for faster initial load
- **Server-side Embeddings**: Precomputed similarity for semantic search

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

- **CSV Parser**: Handles quoted fields, malformed data, empty files
- **Graph Operations**: Node sizing, color assignment, edge styling
- **Search Functionality**: Fuzzy matching, prefix prioritization
- **Performance Limits**: Cluster size constraints, data cleaning
- **Component Lifecycle**: State transitions, error handling

### Smoke Tests

Basic functionality tests that don't require full DOM rendering:

- Data processing logic
- Search algorithms
- Performance optimizations
- Error handling

## CDN Dependencies

### Script Tags Used

```html
<!-- Core graph library -->
<script src="https://cdn.jsdelivr.net/npm/graphology@0.25.4/dist/graphology.umd.min.js"></script>

<!-- Visualization renderer -->
<script src="https://cdn.jsdelivr.net/npm/sigma@3.0.0-beta.20/build/sigma.min.js"></script>

<!-- Layout algorithms -->
<script src="https://cdn.jsdelivr.net/npm/graphology-layout-forceatlas2@0.10.1/index.js"></script>

<!-- Community detection -->
<script src="https://cdn.jsdelivr.net/npm/graphology-communities-louvain@2.0.1/index.js"></script>
```

### Why CDN Instead of NPM?

- **Bundle Size**: Avoids 2MB+ of graph libraries in main bundle
- **Loading Strategy**: Scripts load only when component is used
- **Version Control**: Specific versions pinned for stability
- **Fallback Support**: Dynamic import() available as alternative

## Dataset Schema

### Key Fields Used

- **PREFERREDLABEL**: Node display text
- **DESCRIPTION**: Tooltip content
- **ID**: Unique identifiers for nodes and relationships
- **RELATIONTYPE**: Edge styling (essential/optional)
- **OCCUPATIONGROUPCODE**: Clustering key

### Relationship Mapping

- **Occupation → Skills**: Via `occupation_to_skill_relations.csv`
- **Group → Occupations**: Via `OCCUPATIONGROUPCODE` matching
- **Hierarchies**: Via `*_hierarchy.csv` files
- **Skill → Skill**: Via `skill_to_skill_relations.csv`

## Trade-offs & Design Decisions

### CDN vs NPM Dependencies

**Decision**: Use CDN-hosted Sigma.js and Graphology  
**Trade-off**: Network dependency vs bundle size  
**Rationale**: Keeps main bundle lean, loads only when needed

### Inline Worker vs Separate File

**Decision**: Create worker with Blob URL from inline code  
**Trade-off**: Code organization vs deployment simplicity  
**Rationale**: Avoids worker file deployment issues, keeps everything in one component

### Initial Clustering vs Full Graph

**Decision**: Show occupation group clusters initially  
**Trade-off**: Immediate detail vs performance  
**Rationale**: Provides overview while maintaining smooth interaction with large datasets

### Map-based Data vs Arrays

**Decision**: Convert CSV data to Maps for lookups  
**Trade-off**: Memory usage vs query performance  
**Rationale**: O(1) lookups critical for real-time interactions

## Future Enhancements

### Semantic Similarity (Extra Credit)

- **Server-side Embeddings**: Precompute occupation/skill vectors
- **Cosine Similarity**: Find related items beyond direct connections
- **Similar Roles Panel**: Show semantically related occupations
- **Mock Implementation**: Client-side TF-IDF for current neighborhood

### Advanced Features

- **Graph Analytics**: Centrality measures, path analysis
- **Export Functions**: Save graph as image or data
- **Filter Controls**: Show/hide node types, relation types
- **Time-based Animation**: Animate layout changes
- **Collaborative Features**: Share specific graph views

## Troubleshooting

### Common Issues

#### "Failed to load visualization libraries"

- Check internet connection for CDN access
- Verify firewall allows jsdelivr.net requests
- Consider self-hosting scripts if CDN is blocked

#### "Failed to load dataset files"

- Ensure CSV files exist in `frontend/public/data/`
- Check file permissions and web server configuration
- Verify CSV file format matches expected schema

#### Performance Issues

- Reduce initial cluster count in `generateClusteredGraph`
- Limit expansion cluster sizes in `expandCluster`
- Consider implementing viewport culling for large datasets

#### Graph Not Rendering

- Check browser WebGL support
- Verify container div has non-zero dimensions
- Check console for Sigma.js initialization errors

### Browser Compatibility

- **Minimum**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **WebGL Required**: Component will fail gracefully without WebGL
- **Performance**: Best on desktop, acceptable on tablets

## Files Created

- `src/pages/TabiyaDatasetExplorer.tsx` - Main React component
- `src/workers/graphParser.worker.ts` - Web worker for CSV parsing
- `src/pages/TabiyaDatasetExplorer.test.tsx` - Unit and integration tests
- `GraphNavigator-README.md` - This documentation

---

**Built with**: React 18, TypeScript, Tailwind CSS, Sigma.js, Graphology  
**Performance**: Optimized for datasets up to 100K nodes  
**License**: Follow project license terms
