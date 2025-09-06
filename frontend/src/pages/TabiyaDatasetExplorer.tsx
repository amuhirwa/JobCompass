import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Users,
  Briefcase,
  Target,
} from "lucide-react";

// Local imports instead of CDN
import Graph from "graphology";
import Sigma from "sigma";
// Import layout algorithms with fallback
import forceAtlas2 from "graphology-layout-forceatlas2";

// Types for our graph data
interface GraphNode {
  id: string;
  label: string;
  description: string;
  type: "occupation" | "skill" | "group";
  size: number;
  x?: number;
  y?: number;
  color?: string;
  skillCount?: number;
  relationType?: string;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationType: "essential" | "optional" | "hierarchy";
  weight?: number;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface ProcessedData {
  occupations: Map<string, any>;
  skills: Map<string, any>;
  groups: Map<string, any>;
  relations: any[];
  hierarchies: any[];
}

interface TooltipData {
  node: GraphNode;
  x: number;
  y: number;
}

/**
 * TabiyaDatasetExplorer - Interactive graph visualization of the Tabiya dataset
 *
 * Features:
 * - Interactive graph visualization using Sigma.js and Graphology
 * - Node clustering by occupation groups and skill communities
 * - Fuzzy search with node centering and expansion
 * - Hover tooltips and click interactions
 * - Lazy loading and progressive rendering for performance
 * - WebWorker-based CSV parsing to avoid UI blocking
 * - Responsive design with Tailwind CSS
 */
const TabiyaDatasetExplorer: React.FC = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set()
  );
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(
    new Set()
  );

  // Refs for Sigma.js integration
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<any>(null);
  const graphRef = useRef<any>(null);
  const workerRef = useRef<Worker | null>(null);

  // Initialize web worker for CSV parsing
  useEffect(() => {
    // Use external worker file with papaparse
    workerRef.current = new Worker(
      new URL("../workers/graphParser.worker.ts", import.meta.url),
      { type: "module" }
    );

    // Load and process CSV data
    loadDataset();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Load and process dataset files
  const loadDataset = async () => {
    if (!workerRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const filePromises = [
        "occupations.csv",
        "skills.csv",
        "occupation_groups.csv",
        "skill_groups.csv",
        "occupation_to_skill_relations.csv",
        "occupation_hierarchy.csv",
        "skill_hierarchy.csv",
      ].map(async (filename) => {
        const response = await fetch(`/data/${filename}`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        return { filename, data: await response.text() };
      });

      const files = await Promise.all(filePromises);
      const processed: any = {};

      const processPromises = files.map(({ filename, data }) => {
        return new Promise((resolve, reject) => {
          const handleMessage = (e: MessageEvent) => {
            if (e.data.type === filename) {
              if (e.data.success) {
                processed[filename] = e.data.data;
                console.log(
                  `Processed ${filename}: ${e.data.data.length} records`
                );
              } else {
                console.error(`Failed to process ${filename}:`, e.data.error);
                processed[filename] = [];
              }
              workerRef.current?.removeEventListener("message", handleMessage);
              resolve(e.data);
            }
          };

          const handleError = (error: any) => {
            console.error(`Worker error processing ${filename}:`, error);
            workerRef.current?.removeEventListener("error", handleError);
            reject(error);
          };

          workerRef.current?.addEventListener("message", handleMessage);
          workerRef.current?.addEventListener("error", handleError);
          workerRef.current?.postMessage({ csvData: data, type: filename });
        });
      });

      await Promise.all(processPromises);

      // Convert to Maps for faster lookups
      const processedData: ProcessedData = {
        occupations: new Map(
          processed["occupations.csv"]?.map((item: any) => [item.ID, item]) ||
            []
        ),
        skills: new Map(
          processed["skills.csv"]?.map((item: any) => [item.ID, item]) || []
        ),
        groups: new Map([
          ...(processed["occupation_groups.csv"]?.map((item: any) => [
            item.ID,
            { ...item, type: "occupation_group" },
          ]) || []),
          ...(processed["skill_groups.csv"]?.map((item: any) => [
            item.ID,
            { ...item, type: "skill_group" },
          ]) || []),
        ]),
        relations: processed["occupation_to_skill_relations.csv"] || [],
        hierarchies: [
          ...(processed["occupation_hierarchy.csv"] || []),
          ...(processed["skill_hierarchy.csv"] || []),
        ],
      };

      console.log("Processed data summary:", {
        occupations: processedData.occupations.size,
        skills: processedData.skills.size,
        groups: processedData.groups.size,
        relations: processedData.relations.length,
        hierarchies: processedData.hierarchies.length,
      });

      setProcessedData(processedData);

      // Generate initial graph with clustering
      const initialGraph = generateClusteredGraph(processedData);
      setGraphData(initialGraph);
    } catch (err) {
      console.error("Error loading dataset:", err);
      setError(
        `Failed to load dataset files: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate initial clustered view of the graph
  const generateClusteredGraph = useCallback(
    (data: ProcessedData): GraphData => {
      const nodes: GraphNode[] = [];
      const edges: GraphEdge[] = [];

      // Calculate skill counts for occupations
      const occupationSkillCounts = new Map<string, number>();
      data.relations.forEach((rel: any) => {
        const count = occupationSkillCounts.get(rel.OCCUPATIONID) || 0;
        occupationSkillCounts.set(rel.OCCUPATIONID, count + 1);
      });

      // Create cluster nodes for occupation groups (limit to top 20 for initial view)
      const topOccupationGroups = Array.from(data.groups.values())
        .filter((group: any) => group.type === "occupation_group")
        .slice(0, 20);

      topOccupationGroups.forEach((group: any) => {
        const relatedOccupations = Array.from(data.occupations.values()).filter(
          (occ: any) => occ.OCCUPATIONGROUPCODE === group.CODE
        );

        const totalSkills = relatedOccupations.reduce(
          (sum: number, occ: any) =>
            sum + (occupationSkillCounts.get(occ.ID) || 0),
          0
        );

        nodes.push({
          id: group.ID,
          label: group.PREFERREDLABEL || `Group ${group.CODE}`,
          description: group.DESCRIPTION || "Occupation group",
          type: "group",
          size: Math.max(15, Math.min(50, totalSkills / 10)),
          skillCount: totalSkills,
        });
      });

      return { nodes, edges };
    },
    []
  );

  // Expand a cluster to show its constituent nodes
  const expandCluster = useCallback(
    (clusterId: string) => {
      if (!processedData) return;

      const newExpandedClusters = new Set(expandedClusters);
      newExpandedClusters.add(clusterId);
      setExpandedClusters(newExpandedClusters);

      // Get the cluster/group data
      const group = processedData.groups.get(clusterId);
      if (!group) {
        console.warn(`Group not found for ID: ${clusterId}`);
        return;
      }

      console.log(`Expanding cluster: ${group.PREFERREDLABEL} (${group.type})`);

      const newNodes = [...graphData.nodes];
      const newEdges = [...graphData.edges];

      // Track existing node IDs to avoid duplicates
      const existingNodeIds = new Set(newNodes.map((node) => node.id));

      if (group.type === "occupation_group") {
        // Add occupations in this group
        const relatedOccupations = Array.from(
          processedData.occupations.values()
        )
          .filter((occ: any) => occ.OCCUPATIONGROUPCODE === group.CODE)
          .slice(0, 10); // Limit for performance

        relatedOccupations.forEach((occ: any) => {
          if (!existingNodeIds.has(occ.ID)) {
            const skillCount = processedData.relations.filter(
              (rel: any) => rel.OCCUPATIONID === occ.ID
            ).length;

            newNodes.push({
              id: occ.ID,
              label: occ.PREFERREDLABEL || "Unknown Occupation",
              description: occ.DESCRIPTION || "",
              type: "occupation",
              size: Math.max(8, Math.min(25, skillCount * 2)),
              skillCount,
            });

            existingNodeIds.add(occ.ID);
            console.log(
              `Added occupation: ${occ.PREFERREDLABEL} with ${skillCount} skills`
            );
          }

          // Add edge from group to occupation (check if edge doesn't already exist)
          const edgeId = `${clusterId}-${occ.ID}`;
          if (!newEdges.find((edge) => edge.id === edgeId)) {
            newEdges.push({
              id: edgeId,
              source: clusterId,
              target: occ.ID,
              relationType: "hierarchy",
            });
          }
        });

        // Add some related skills
        const skillIds = new Set<string>();
        processedData.relations
          .filter((rel: any) =>
            relatedOccupations.some((occ: any) => occ.ID === rel.OCCUPATIONID)
          )
          .slice(0, 15)
          .forEach((rel: any) => skillIds.add(rel.SKILLID));

        Array.from(skillIds).forEach((skillId) => {
          const skill = processedData.skills.get(skillId);
          if (skill && !existingNodeIds.has(skill.ID)) {
            newNodes.push({
              id: skill.ID,
              label: skill.PREFERREDLABEL || "Unknown Skill",
              description: skill.DESCRIPTION || "",
              type: "skill",
              size: 6,
            });

            existingNodeIds.add(skill.ID);
            console.log(`Added skill: ${skill.PREFERREDLABEL}`);
          }

          // Add edges for occupation-skill relations
          processedData.relations
            .filter(
              (rel: any) =>
                rel.SKILLID === skillId &&
                relatedOccupations.some(
                  (occ: any) => occ.ID === rel.OCCUPATIONID
                )
            )
            .forEach((rel: any) => {
              const edgeId = `${rel.OCCUPATIONID}-${rel.SKILLID}`;
              if (!newEdges.find((edge) => edge.id === edgeId)) {
                newEdges.push({
                  id: edgeId,
                  source: rel.OCCUPATIONID,
                  target: rel.SKILLID,
                  relationType: rel.RELATIONTYPE as "essential" | "optional",
                });
              }
            });
        });
      }

      console.log(
        `Cluster expansion complete. Total nodes: ${newNodes.length}, Total edges: ${newEdges.length}`
      );
      setGraphData({ nodes: newNodes, edges: newEdges });
    },
    [graphData, processedData, expandedClusters]
  );

  // Initialize Sigma.js visualization
  useEffect(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    try {
      // Clear existing instance
      if (sigmaRef.current) {
        sigmaRef.current.kill();
      }

      // Create new graph instance
      const graph = new Graph();
      graphRef.current = graph;

      // Add nodes with clustering colors
      graphData.nodes.forEach((node) => {
        const color =
          node.type === "occupation"
            ? "#3b82f6"
            : node.type === "skill"
              ? "#10b981"
              : "#f59e0b";

        graph.addNode(node.id, {
          label: node.label,
          x: Math.random() * 1000,
          y: Math.random() * 1000,
          size: node.size,
          color: color,
          // Store type in a custom attribute that doesn't interfere with Sigma
          nodeType: node.type,
          description: node.description,
          skillCount: node.skillCount,
        });
      });

      // Add edges with different styles
      graphData.edges.forEach((edge) => {
        if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
          graph.addEdge(edge.source, edge.target, {
            // Use line instead of dashed/solid - Sigma.js handles styling differently
            type: "line",
            color:
              edge.relationType === "hierarchy"
                ? "#94a3b8"
                : edge.relationType === "essential"
                  ? "#ef4444"
                  : "#64748b",
            size: edge.relationType === "hierarchy" ? 2 : 1,
            // Store relation type for potential custom rendering
            relationType: edge.relationType,
          });
        }
      });

      // Apply ForceAtlas2 layout
      const settings = forceAtlas2.inferSettings(graph);
      forceAtlas2.assign(graph, { ...settings, iterations: 100 });

      // Initialize Sigma renderer
      const sigma = new Sigma(graph, containerRef.current, {
        renderLabels: true,
        renderEdgeLabels: false,
        defaultNodeColor: "#666",
        defaultEdgeColor: "#ccc",
        labelFont: "Arial",
        labelSize: 12,
        labelColor: { color: "#000" },
        enableEdgeEvents: true,
      });

      sigmaRef.current = sigma;

      // Mouse event handlers
      sigma.on("enterNode", (event: any) => {
        const nodeId = event.node;
        const nodeData = graph.getNodeAttributes(nodeId);
        const domNode = sigma.getNodeDisplayData(nodeId);

        if (domNode) {
          setTooltip({
            node: {
              id: nodeId,
              label: nodeData.label,
              description: nodeData.description,
              type: nodeData.nodeType,
              size: nodeData.size,
              skillCount: nodeData.skillCount,
            },
            x: domNode.x,
            y: domNode.y,
          });
        }
      });

      sigma.on("leaveNode", () => {
        setTooltip(null);
      });

      sigma.on("clickNode", (event: any) => {
        const nodeId = event.node;
        const nodeData = graph.getNodeAttributes(nodeId);

        // Handle cluster expansion
        if (nodeData.nodeType === "group" && !expandedClusters.has(nodeId)) {
          expandCluster(nodeId);
          return;
        }

        // Highlight node and neighbors
        const neighbors = new Set([nodeId]);
        graph.forEachNeighbor(nodeId, (neighbor: string) => {
          neighbors.add(neighbor);
        });

        setHighlightedNodes(neighbors);
        setSelectedNode({
          id: nodeId,
          label: nodeData.label,
          description: nodeData.description,
          type: nodeData.nodeType,
          size: nodeData.size,
          skillCount: nodeData.skillCount,
        });

        // Update node colors
        graph.forEachNode((node: string) => {
          const isHighlighted = neighbors.has(node);
          if (!isHighlighted) {
            graph.setNodeAttribute(node, "color", "#ddd");
          }
        });

        sigma.refresh();
      });

      // Click on empty space to reset
      sigma.on("clickStage", () => {
        setHighlightedNodes(new Set());
        setSelectedNode(null);

        // Reset node colors
        graph.forEachNode((node: string, attributes: any) => {
          const originalColor =
            attributes.nodeType === "occupation"
              ? "#3b82f6"
              : attributes.nodeType === "skill"
                ? "#10b981"
                : "#f59e0b";
          graph.setNodeAttribute(node, "color", originalColor);
        });

        sigma.refresh();
      });
    } catch (err) {
      console.error("Error initializing Sigma.js:", err);
      setError(
        `Failed to initialize graph visualization: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }, [graphData, expandedClusters, expandCluster]);

  // Search functionality
  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (!sigmaRef.current || !graphRef.current || !searchTerm.trim()) return;

      const graph = graphRef.current;
      const sigma = sigmaRef.current;

      // Find matching nodes (fuzzy search)
      const matches: { node: string; score: number }[] = [];
      graph.forEachNode((nodeId: string, attributes: any) => {
        const label = attributes.label.toLowerCase();
        const search = searchTerm.toLowerCase();

        if (label.includes(search)) {
          const score = label.indexOf(search) === 0 ? 2 : 1; // Prefer prefix matches
          matches.push({ node: nodeId, score });
        }
      });

      if (matches.length > 0) {
        // Sort by relevance and get the best match
        matches.sort((a, b) => b.score - a.score);
        const bestMatch = matches[0].node;

        // Center the camera on the found node
        const nodePosition = sigma.getNodeDisplayData(bestMatch);
        sigma
          .getCamera()
          .animate(
            { x: nodePosition.x, y: nodePosition.y, ratio: 0.2 },
            { duration: 1000 }
          );

        // Highlight the found node
        graph.setNodeAttribute(bestMatch, "color", "#ff6b35");
        sigma.refresh();

        // If it's a group node that hasn't been expanded, expand it
        const nodeData = graph.getNodeAttributes(bestMatch);
        if (nodeData.nodeType === "group" && !expandedClusters.has(bestMatch)) {
          setTimeout(() => expandCluster(bestMatch), 500);
        }
      }
    },
    [expandedClusters, expandCluster]
  );

  // Control functions
  const zoomIn = () => {
    if (sigmaRef.current) {
      const camera = sigmaRef.current.getCamera();
      camera.animate({ ratio: camera.ratio * 0.7 }, { duration: 300 });
    }
  };

  const zoomOut = () => {
    if (sigmaRef.current) {
      const camera = sigmaRef.current.getCamera();
      camera.animate({ ratio: camera.ratio * 1.3 }, { duration: 300 });
    }
  };

  const resetView = () => {
    if (sigmaRef.current) {
      const camera = sigmaRef.current.getCamera();
      camera.animate({ x: 0.5, y: 0.5, ratio: 1 }, { duration: 500 });

      setHighlightedNodes(new Set());
      setSelectedNode(null);

      // Reset all node colors
      if (graphRef.current) {
        graphRef.current.forEachNode((node: string, attributes: any) => {
          const originalColor =
            attributes.nodeType === "occupation"
              ? "#3b82f6"
              : attributes.nodeType === "skill"
                ? "#10b981"
                : "#f59e0b";
          graphRef.current.setNodeAttribute(node, "color", originalColor);
        });
        sigmaRef.current.refresh();
      }
    }
  };

  // Statistics calculation
  const stats = useMemo(() => {
    if (!processedData) return null;

    return {
      occupations: processedData.occupations.size,
      skills: processedData.skills.size,
      groups: processedData.groups.size,
      relations: processedData.relations.length,
    };
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading Tabiya Dataset...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Parsing CSV files and building graph structure
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tabiya Dataset Explorer
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Interactive visualization of occupations, skills, and their
              relationships
            </p>
          </div>

          {stats && (
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{stats.occupations}</span>
                <span className="text-gray-500">occupations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-medium">{stats.skills}</span>
                <span className="text-gray-500">skills</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">{stats.groups}</span>
                <span className="text-gray-500">groups</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search occupations and skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearch(searchTerm)
                }
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => handleSearch(searchTerm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={zoomIn}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reset View"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Graph Container */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs pointer-events-none"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              transform: "translate(0, -100%)",
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              {tooltip.node.type === "occupation" && (
                <Briefcase className="h-4 w-4 text-blue-600" />
              )}
              {tooltip.node.type === "skill" && (
                <Target className="h-4 w-4 text-green-600" />
              )}
              {tooltip.node.type === "group" && (
                <Users className="h-4 w-4 text-yellow-600" />
              )}
              <span className="font-medium text-gray-900">
                {tooltip.node.label}
              </span>
            </div>

            {tooltip.node.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                {tooltip.node.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="capitalize">{tooltip.node.type}</span>
              {tooltip.node.skillCount && (
                <span>{tooltip.node.skillCount} skills</span>
              )}
            </div>
          </div>
        )}

        {/* Side Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Node Details</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Label
                </label>
                <p className="text-gray-900">{selectedNode.label}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>
                <p className="text-gray-600 capitalize">{selectedNode.type}</p>
              </div>

              {selectedNode.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="text-gray-600 text-sm">
                    {selectedNode.description}
                  </p>
                </div>
              )}

              {selectedNode.skillCount && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Related Skills
                  </label>
                  <p className="text-gray-600">{selectedNode.skillCount}</p>
                </div>
              )}

              {highlightedNodes.size > 1 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Connected Nodes
                  </label>
                  <p className="text-gray-600">{highlightedNodes.size - 1}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>Occupations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span>Skills</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span>Groups</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-red-500"></div>
              <span>Essential</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-gray-500 border-dashed border-t-2 border-gray-500"></div>
              <span>Optional</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Click nodes to explore • Search to find specific items • Node size
            indicates connections
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabiyaDatasetExplorer;
