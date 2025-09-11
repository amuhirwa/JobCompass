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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  BarChart3,
  Eye,
} from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";

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

  // Virtual Graph and LOD state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [renderQuality, setRenderQuality] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [visibleNodeCount, setVisibleNodeCount] = useState(5000);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedSkillsCount, setLoadedSkillsCount] = useState(0);
  const [maxSkillsCount, setMaxSkillsCount] = useState(0);
  const [hasInitialSkillsLoaded, setHasInitialSkillsLoaded] = useState(false);

  // Performance optimization state
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("");
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 0,
    renderTime: 0,
    nodeCount: 0,
  });
  const [isInteracting, setIsInteracting] = useState(false);

  // Sidebar and UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(["performance", "legend"]) // Start with performance and legend collapsed for better initial UX
  );

  // Theme integration
  const { isDark } = useDarkMode();

  // Sidebar helper functions
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleSection = (sectionId: string) => {
    const newCollapsedSections = new Set(collapsedSections);
    if (newCollapsedSections.has(sectionId)) {
      newCollapsedSections.delete(sectionId);
    } else {
      newCollapsedSections.add(sectionId);
    }
    setCollapsedSections(newCollapsedSections);
  };

  const isSectionCollapsed = (sectionId: string) =>
    collapsedSections.has(sectionId);

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

  // Optimized chunked dataset loading with progress tracking
  const loadDataset = async () => {
    if (!workerRef.current) return;

    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);
    setLoadingStage("Initializing...");

    try {
      // Stage 1: Load CSV files in parallel
      setLoadingStage("Loading CSV files...");
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
      setLoadingProgress(20);

      // Stage 2: Process files sequentially with delays to prevent blocking
      setLoadingStage("Processing core data...");
      const processed: any = {};

      for (let i = 0; i < files.length; i++) {
        const { filename, data } = files[i];

        await new Promise((resolve, reject) => {
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

        // Progress update and yield to main thread
        setLoadingProgress(20 + (i + 1) * (60 / files.length));
        await new Promise((resolve) => setTimeout(resolve, 10)); // Yield to main thread
      }

      // Stage 3: Create data structures
      setLoadingStage("Building data structures...");
      await new Promise((resolve) => setTimeout(resolve, 10));

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

      setLoadingProgress(85);

      console.log("Processed data summary:", {
        occupations: processedData.occupations.size,
        skills: processedData.skills.size,
        groups: processedData.groups.size,
        relations: processedData.relations.length,
        hierarchies: processedData.hierarchies.length,
      });

      setProcessedData(processedData);

      // Stage 4: Generate initial graph with 1000+ nodes
      setLoadingStage("Creating visualization with 1000+ nodes...");
      await new Promise((resolve) => setTimeout(resolve, 10));

      const initialGraph = generateMinimalGraph(processedData);
      setGraphData(initialGraph);

      setLoadingProgress(100);
      setLoadingStage("Complete!");

      // Brief delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      console.error("Error loading dataset:", err);
      setError(
        `Failed to load dataset files: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      setHasInitialSkillsLoaded(false); // Ensure button is available for manual loading
    } finally {
      setIsLoading(false);
    }
  };

  // Generate initial graph with guaranteed minimum 1000 nodes for immediate rendering
  const generateMinimalGraph = useCallback((data: ProcessedData): GraphData => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Load top occupation groups (30 groups)
    const topOccupationGroups = Array.from(data.groups.values())
      .filter((group: any) => group.type === "occupation_group")
      .slice(0, 30);

    // Calculate connection frequencies for prioritization
    const skillConnectionCounts = new Map<string, number>();
    const occupationSkillCounts = new Map<string, number>();

    data.relations.forEach((rel: any) => {
      const skillCount = skillConnectionCounts.get(rel.SKILLID) || 0;
      skillConnectionCounts.set(rel.SKILLID, skillCount + 1);

      const occCount = occupationSkillCounts.get(rel.OCCUPATIONID) || 0;
      occupationSkillCounts.set(rel.OCCUPATIONID, occCount + 1);
    });

    // Add occupation groups first (30 nodes)
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
        size: Math.max(8, Math.min(20, totalSkills / 15)),
        skillCount: totalSkills,
      });
    });

    // Add top occupations to reach ~200 occupation nodes
    const topOccupations = Array.from(data.occupations.values())
      .map((occ: any) => ({
        ...occ,
        skillCount: occupationSkillCounts.get(occ.ID) || 0,
      }))
      .sort((a, b) => b.skillCount - a.skillCount)
      .slice(0, 200);

    topOccupations.forEach((occ: any) => {
      if (!nodes.find((n) => n.id === occ.ID)) {
        nodes.push({
          id: occ.ID,
          label: occ.PREFERREDLABEL || "Unknown Occupation",
          description: occ.DESCRIPTION || "",
          type: "occupation",
          size: Math.max(8, Math.min(25, occ.skillCount / 2)),
          skillCount: occ.skillCount,
        });
      }
    });

    // Add top skills to reach minimum 1000 nodes total
    // Calculate how many skills we need: 1000 - (groups + occupations)
    const currentNodeCount = nodes.length;
    const skillsNeeded = Math.max(50, 200 - currentNodeCount); // Reduced initial skills for faster rendering

    const topSkills = Array.from(data.skills.values())
      .map((skill: any) => ({
        ...skill,
        connectionCount: skillConnectionCounts.get(skill.ID) || 0,
      }))
      .sort((a, b) => b.connectionCount - a.connectionCount)
      .slice(0, skillsNeeded);

    topSkills.forEach((skill: any) => {
      nodes.push({
        id: skill.ID,
        label: skill.PREFERREDLABEL || "Unknown Skill",
        description: skill.DESCRIPTION || "",
        type: "skill",
        size: Math.max(3, Math.min(8, skill.connectionCount / 5)),
      });
    });

    // Create edges with intelligent limiting
    const addedEdges = new Set<string>();
    const skillIds = new Set(topSkills.map((s: any) => s.ID));
    const occupationIds = new Set(topOccupations.map((o: any) => o.ID));

    // Add skill-occupation edges (limit per skill for performance)
    data.relations
      .filter(
        (rel: any) =>
          skillIds.has(rel.SKILLID) && occupationIds.has(rel.OCCUPATIONID)
      )
      .slice(0, 2000) // Limit total edges for initial performance
      .forEach((rel: any) => {
        const edgeId = `${rel.OCCUPATIONID}-${rel.SKILLID}`;
        if (!addedEdges.has(edgeId)) {
          edges.push({
            id: edgeId,
            source: rel.OCCUPATIONID,
            target: rel.SKILLID,
            relationType: rel.RELATIONTYPE as "essential" | "optional",
          });
          addedEdges.add(edgeId);
        }
      });

    // Add group-occupation hierarchy edges
    topOccupationGroups.forEach((group: any) => {
      const groupOccupations = topOccupations
        .filter((occ: any) => occ.OCCUPATIONGROUPCODE === group.CODE)
        .slice(0, 8); // Limit to prevent overcrowding

      groupOccupations.forEach((occ: any) => {
        const edgeId = `${group.ID}-${occ.ID}`;
        if (!addedEdges.has(edgeId)) {
          edges.push({
            id: edgeId,
            source: group.ID,
            target: occ.ID,
            relationType: "hierarchy",
          });
          addedEdges.add(edgeId);
        }
      });
    });

    // Set counters - count actual loaded skills
    const loadedSkillCount = nodes.filter((n) => n.type === "skill").length;
    setLoadedSkillsCount(loadedSkillCount);
    setMaxSkillsCount(data.skills.size);

    console.log(
      `Generated initial graph: ${nodes.length} nodes (${loadedSkillCount} skills), ${edges.length} edges`
    );

    // Ensure we have at least 1000 nodes for proper initial rendering
    if (nodes.length < 1000) {
      console.warn(
        `Only ${nodes.length} nodes generated, expected at least 1000`
      );
    }

    return { nodes, edges };
  }, []);

  // Chunked node addition for non-blocking rendering
  const addNodeChunk = useCallback(
    async (
      graph: any,
      nodes: GraphNode[],
      startIndex: number,
      chunkSize: number = 50
    ): Promise<number> => {
      const endIndex = Math.min(startIndex + chunkSize, nodes.length);

      for (let i = startIndex; i < endIndex; i++) {
        const node = nodes[i];
        const color =
          node.type === "occupation"
            ? "#3b82f6"
            : node.type === "skill"
              ? "#10b981"
              : "#f59e0b";

        graph.addNode(node.id, {
          label: node.label,
          originalLabel: node.label, // Store original label for restoration
          x: Math.random() * 1000,
          y: Math.random() * 1000,
          size: node.size,
          color: color,
          nodeType: node.type,
          description: node.description,
          skillCount: node.skillCount,
          zIndex: 1, // Default z-index for layering
        });
      }

      return endIndex;
    },
    []
  );

  // Load initial skills for first render
  const loadInitialSkills = useCallback(
    async (batchSize: number = 2000) => {
      if (!processedData || isLoadingMore || hasInitialSkillsLoaded) {
        return;
      }

      setIsLoadingMore(true);

      try {
        // Calculate skill connection frequencies
        const skillConnectionCounts = new Map<string, number>();
        processedData.relations.forEach((rel: any) => {
          const count = skillConnectionCounts.get(rel.SKILLID) || 0;
          skillConnectionCounts.set(rel.SKILLID, count + 1);
        });

        // Get top skills for initial load
        const topSkills = Array.from(processedData.skills.values())
          .map((skill: any) => ({
            ...skill,
            connectionCount: skillConnectionCounts.get(skill.ID) || 0,
          }))
          .sort((a, b) => b.connectionCount - a.connectionCount)
          .slice(0, batchSize);

        if (topSkills.length === 0) return;

        // Add skills to existing graph data
        const newNodes = [...graphData.nodes];
        const newEdges = [...graphData.edges];
        const microBatchSize = 100;

        for (let i = 0; i < topSkills.length; i += microBatchSize) {
          const microBatch = topSkills.slice(i, i + microBatchSize);

          microBatch.forEach((skill: any) => {
            // Only add if not already present
            if (!newNodes.find((n) => n.id === skill.ID)) {
              newNodes.push({
                id: skill.ID,
                label: skill.PREFERREDLABEL || "Unknown Skill",
                description: skill.DESCRIPTION || "",
                type: "skill",
                size: Math.max(2, Math.min(6, skill.connectionCount / 5)),
              });
            }
          });

          // Add edges with limit per skill
          const microBatchIds = new Set(microBatch.map((s: any) => s.ID));
          const edgeCount = new Map<string, number>();

          processedData.relations
            .filter((rel: any) => microBatchIds.has(rel.SKILLID))
            .forEach((rel: any) => {
              const skillEdgeCount = edgeCount.get(rel.SKILLID) || 0;
              if (
                skillEdgeCount < 5 &&
                newNodes.some((n) => n.id === rel.OCCUPATIONID)
              ) {
                const edgeId = `${rel.OCCUPATIONID}-${rel.SKILLID}`;
                if (!newEdges.find((e) => e.id === edgeId)) {
                  newEdges.push({
                    id: edgeId,
                    source: rel.OCCUPATIONID,
                    target: rel.SKILLID,
                    relationType: rel.RELATIONTYPE as "essential" | "optional",
                  });
                  edgeCount.set(rel.SKILLID, skillEdgeCount + 1);
                }
              }
            });

          // Yield to main thread
          await new Promise((resolve) => setTimeout(resolve, 5));
        }

        setGraphData({ nodes: newNodes, edges: newEdges });
        setLoadedSkillsCount(loadedSkillsCount + topSkills.length);
        setHasInitialSkillsLoaded(true);

        console.log(
          `Loaded ${topSkills.length} initial skills. Total: ${loadedSkillsCount + topSkills.length}/${maxSkillsCount}`
        );
      } catch (error) {
        console.error("Error loading initial skills:", error);
      } finally {
        setIsLoadingMore(false);
      }
    },
    [
      processedData,
      isLoadingMore,
      loadedSkillsCount,
      maxSkillsCount,
      graphData,
      hasInitialSkillsLoaded,
    ]
  );

  // Optimized progressive loading with micro-batching
  const loadMoreSkills = useCallback(
    async (batchSize: number = 1000) => {
      if (
        !processedData ||
        isLoadingMore ||
        loadedSkillsCount >= maxSkillsCount
      ) {
        return;
      }

      setIsLoadingMore(true);

      try {
        // Calculate skill connection frequencies
        const skillConnectionCounts = new Map<string, number>();
        processedData.relations.forEach((rel: any) => {
          const count = skillConnectionCounts.get(rel.SKILLID) || 0;
          skillConnectionCounts.set(rel.SKILLID, count + 1);
        });

        // Get currently loaded skill IDs
        const currentSkillIds = new Set(
          graphData.nodes
            .filter((node) => node.type === "skill")
            .map((node) => node.id)
        );

        // Get next batch of skills (most connected ones not yet loaded)
        const nextSkills = Array.from(processedData.skills.values())
          .filter((skill: any) => !currentSkillIds.has(skill.ID))
          .map((skill: any) => ({
            ...skill,
            connectionCount: skillConnectionCounts.get(skill.ID) || 0,
          }))
          .sort((a, b) => b.connectionCount - a.connectionCount)
          .slice(0, batchSize);

        if (nextSkills.length === 0) return;

        // Process skills in micro-batches to prevent blocking
        const newNodes = [...graphData.nodes];
        const newEdges = [...graphData.edges];
        const microBatchSize = 100;

        for (let i = 0; i < nextSkills.length; i += microBatchSize) {
          const microBatch = nextSkills.slice(i, i + microBatchSize);

          microBatch.forEach((skill: any) => {
            newNodes.push({
              id: skill.ID,
              label: skill.PREFERREDLABEL || "Unknown Skill",
              description: skill.DESCRIPTION || "",
              type: "skill",
              size: Math.max(2, Math.min(6, skill.connectionCount / 5)),
            });
          });

          // Add edges with reduced limit (5 per skill instead of 10)
          const microBatchIds = new Set(microBatch.map((s: any) => s.ID));
          const edgeCount = new Map<string, number>();

          processedData.relations
            .filter((rel: any) => microBatchIds.has(rel.SKILLID))
            .forEach((rel: any) => {
              const skillEdgeCount = edgeCount.get(rel.SKILLID) || 0;
              if (
                skillEdgeCount < 5 && // Reduced from 10 to 5
                newNodes.some((n) => n.id === rel.OCCUPATIONID)
              ) {
                const edgeId = `${rel.OCCUPATIONID}-${rel.SKILLID}`;
                if (!newEdges.find((e) => e.id === edgeId)) {
                  newEdges.push({
                    id: edgeId,
                    source: rel.OCCUPATIONID,
                    target: rel.SKILLID,
                    relationType: rel.RELATIONTYPE as "essential" | "optional",
                  });
                  edgeCount.set(rel.SKILLID, skillEdgeCount + 1);
                }
              }
            });

          // Yield to main thread every micro-batch
          await new Promise((resolve) => setTimeout(resolve, 5));
        }

        setGraphData({ nodes: newNodes, edges: newEdges });
        setLoadedSkillsCount(loadedSkillsCount + nextSkills.length);

        console.log(
          `Loaded ${nextSkills.length} more skills. Total: ${loadedSkillsCount + nextSkills.length}/${maxSkillsCount}`
        );
      } catch (error) {
        console.error("Error loading more skills:", error);
      } finally {
        setIsLoadingMore(false);
      }
    },
    [processedData, isLoadingMore, loadedSkillsCount, maxSkillsCount, graphData]
  );

  // Expand a cluster to show its constituent nodes (moved before setupSigmaEvents)
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

  // Optimized event handlers setup
  const setupSigmaEvents = useCallback(
    (sigma: any, graph: any) => {
      // Throttled camera updates
      let zoomTimeout: NodeJS.Timeout;
      let interactionTimeout: NodeJS.Timeout;

      sigma.getCamera().on("updated", ({ ratio }: { ratio: number }) => {
        setIsInteracting(true);

        // Throttle zoom updates for performance (increased to 150ms)
        clearTimeout(zoomTimeout);
        zoomTimeout = setTimeout(() => {
          updateRenderQuality(ratio);
        }, 150);

        // Reset interaction state
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => {
          setIsInteracting(false);
        }, 300);
      });

      // Optimized hover with delay
      let hoverTimeout: NodeJS.Timeout;

      sigma.on("enterNode", (event: any) => {
        // Skip tooltip during interactions or in low quality mode
        if (isInteracting || renderQuality === "low") return;

        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
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
        }, 100); // 100ms delay for hover
      });

      sigma.on("leaveNode", () => {
        clearTimeout(hoverTimeout);
        setTooltip(null);
      });

      // Enhanced click handler with comprehensive node highlighting
      sigma.on("clickNode", (event: any) => {
        const nodeId = event.node;
        const nodeData = graph.getNodeAttributes(nodeId);

        // Handle cluster expansion (legacy support)
        if (nodeData.nodeType === "group" && !expandedClusters.has(nodeId)) {
          expandCluster(nodeId);
          return;
        }

        // Comprehensive highlighting for all connected nodes and edges
        const neighbors = new Set([nodeId]);
        const connectedEdges = new Set<string>();

        // Get all directly connected neighbors
        graph.forEachNeighbor(nodeId, (neighbor: string) => {
          neighbors.add(neighbor);
        });

        // Get all edges connected to the selected node
        graph.forEachEdge(nodeId, (edgeKey: string) => {
          connectedEdges.add(edgeKey);
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

        // Enhanced visual feedback with z-index layering and label control
        if (graph.order > 0) {
          // Reset all nodes with background styling and hidden labels
          graph.forEachNode((node: string, attributes: any) => {
            const originalColor =
              attributes.nodeType === "occupation"
                ? "#3b82f6"
                : attributes.nodeType === "skill"
                  ? "#10b981"
                  : "#f59e0b";

            const isHighlighted = neighbors.has(node);
            const isSelected = node === nodeId;

            if (isSelected) {
              // Selected node - bright orange, largest size, highest z-index
              graph.setNodeAttribute(node, "color", "#ff6b35");
              graph.setNodeAttribute(node, "size", attributes.size * 1.5);
              graph.setNodeAttribute(node, "zIndex", 100); // Bring to front
              graph.setNodeAttribute(node, "label", attributes.originalLabel); // Show label
            } else if (isHighlighted) {
              // Connected nodes - original color, medium size, high z-index
              graph.setNodeAttribute(node, "color", originalColor);
              graph.setNodeAttribute(node, "size", attributes.size * 1.2);
              graph.setNodeAttribute(node, "zIndex", 50); // Bring to front
              graph.setNodeAttribute(node, "label", attributes.originalLabel); // Show label
            } else {
              // Background nodes - dimmed, smaller, low z-index, hidden labels
              graph.setNodeAttribute(node, "color", "#e5e7eb");
              graph.setNodeAttribute(node, "size", attributes.size * 0.6);
              graph.setNodeAttribute(node, "zIndex", 1); // Keep in background
              graph.setNodeAttribute(node, "label", ""); // Hide label
            }
          });

          // Highlight connected edges with z-index
          graph.forEachEdge((edgeKey: string, attributes: any) => {
            const isConnected = connectedEdges.has(edgeKey);
            if (isConnected) {
              // Connected edges - bright, thick, high z-index
              graph.setEdgeAttribute(edgeKey, "color", "#ff6b35");
              graph.setEdgeAttribute(
                edgeKey,
                "size",
                Math.max(2, attributes.size * 2)
              );
              graph.setEdgeAttribute(edgeKey, "zIndex", 75); // Bring to front
            } else {
              // Background edges - dimmed, thin, low z-index
              graph.setEdgeAttribute(edgeKey, "color", "#e5e7eb");
              graph.setEdgeAttribute(
                edgeKey,
                "size",
                Math.max(0.5, attributes.size * 0.3)
              );
              graph.setEdgeAttribute(edgeKey, "zIndex", 1); // Keep in background
            }
          });

          try {
            sigma.refresh();
          } catch (refreshError) {
            console.warn("Failed to refresh after highlighting:", refreshError);
          }
        }
      });

      // Enhanced click on empty space to reset with proper restoration
      sigma.on("clickStage", () => {
        setHighlightedNodes(new Set());
        setSelectedNode(null);

        // Reset all nodes and edges to original state with z-index and labels
        if (graph.order > 0) {
          try {
            graph.forEachNode((node: string, attributes: any) => {
              const originalColor =
                attributes.nodeType === "occupation"
                  ? "#3b82f6"
                  : attributes.nodeType === "skill"
                    ? "#10b981"
                    : "#f59e0b";

              // Restore original color, size, z-index, and labels
              graph.setNodeAttribute(node, "color", originalColor);
              // Reset to base size (assuming original size is stored or calculate from node type)
              const baseSize =
                attributes.nodeType === "group"
                  ? Math.max(
                      8,
                      Math.min(20, (attributes.skillCount || 10) / 15)
                    )
                  : attributes.nodeType === "occupation"
                    ? Math.max(
                        8,
                        Math.min(25, (attributes.skillCount || 5) / 2)
                      )
                    : Math.max(3, Math.min(8, 5)); // default skill size
              graph.setNodeAttribute(node, "size", baseSize);
              graph.setNodeAttribute(node, "zIndex", 1); // Reset z-index
              graph.setNodeAttribute(
                node,
                "label",
                attributes.originalLabel || attributes.label
              ); // Restore label
            });

            // Reset all edges to original state with z-index
            graph.forEachEdge((edgeKey: string, attributes: any) => {
              const originalColor =
                attributes.relationType === "hierarchy"
                  ? "#94a3b8"
                  : attributes.relationType === "essential"
                    ? "#ef4444"
                    : "#64748b";

              const originalSize =
                attributes.relationType === "hierarchy" ? 2 : 1;

              graph.setEdgeAttribute(edgeKey, "color", originalColor);
              graph.setEdgeAttribute(edgeKey, "size", originalSize);
              graph.setEdgeAttribute(edgeKey, "zIndex", 1); // Reset z-index
            });

            sigma.refresh();
          } catch (resetError) {
            console.warn("Failed to reset node and edge colors:", resetError);
          }
        }
      });
    },
    [renderQuality, isInteracting, expandedClusters, expandCluster]
  );

  // Update render quality based on zoom level with infinite zoom support
  const updateRenderQuality = useCallback(
    (zoomRatio: number) => {
      setZoomLevel(zoomRatio);

      // Adjusted quality thresholds for infinite zoom
      const newQuality =
        zoomRatio > 5 ? "low" : zoomRatio > 0.1 ? "medium" : "high";

      if (newQuality !== renderQuality) {
        setRenderQuality(newQuality);

        // Update Sigma settings based on quality with enhanced zoom support
        if (sigmaRef.current) {
          try {
            // Enable labels at all zoom levels for better user experience
            sigmaRef.current.setSetting("renderLabels", true);
            sigmaRef.current.setSetting(
              "hideLabelsOnMove",
              newQuality === "low"
            );

            // Adjust label size based on zoom for readability
            const labelSize =
              newQuality === "high" ? 12 : newQuality === "medium" ? 10 : 8;
            sigmaRef.current.setSetting("labelSize", labelSize);

            // Adjust edge visibility based on zoom
            sigmaRef.current.setSetting(
              "hideEdgesOnMove",
              newQuality === "low"
            );
          } catch (settingError) {
            console.warn("Failed to update Sigma settings:", settingError);
          }
        }
      }

      // Note: Removed automatic progressive loading on zoom
      // Skills are only loaded when "Load More Skills" button is clicked
    },
    [renderQuality]
  );

  // Optimized Sigma.js initialization with chunked rendering
  useEffect(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    // Add a small delay to ensure container is fully rendered
    const timeoutId = setTimeout(() => {
      const initializeSigma = async () => {
        try {
          // Ensure container has proper dimensions before initializing
          const container = containerRef.current!;
          if (container.clientWidth === 0 || container.clientHeight === 0) {
            console.warn("Container has no dimensions, waiting...");
            setTimeout(() => initializeSigma(), 100);
            return;
          }

          // Clear existing instance
          if (sigmaRef.current) {
            sigmaRef.current.kill();
          }

          // Create new graph instance
          const graph = new Graph();
          graphRef.current = graph;

          // Performance-first Sigma settings with infinite zoom
          const sigmaSettings = {
            renderLabels: true, // Enable labels for better initial experience
            renderEdgeLabels: false,
            defaultNodeColor: "#666",
            defaultEdgeColor: "#ccc",
            labelFont: "Arial",
            labelSize: 10,
            labelColor: { color: "#000" },
            enableEdgeEvents: false, // Disable for performance
            // Infinite zoom settings
            minCameraRatio: 0.001, // Allow extreme zoom in
            maxCameraRatio: 100, // Allow extreme zoom out
            // Performance settings
            hideEdgesOnMove: false, // Keep edges visible during interaction
            hideLabelsOnMove: false, // Keep labels visible during interaction
            mouseWheelZoomSpeed: 1.5, // Faster zoom speed for smooth experience
            // Allow invalid container to prevent errors
            allowInvalidContainer: true,
          };

          const sigma = new Sigma(graph, container, sigmaSettings);
          sigmaRef.current = sigma;

          // Start FPS monitoring
          let lastTime = performance.now();
          let frameCount = 0;

          const updateFPS = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) {
              setPerformanceMetrics((prev) => ({
                ...prev,
                fps: Math.round((frameCount * 1000) / (currentTime - lastTime)),
                renderTime: currentTime - lastTime,
              }));
              frameCount = 0;
              lastTime = currentTime;
            }

            requestAnimationFrame(updateFPS);
          };
          requestAnimationFrame(updateFPS);

          // Add nodes in chunks to prevent blocking
          let nodeIndex = 0;
          const addNodesChunked = async () => {
            while (nodeIndex < graphData.nodes.length) {
              nodeIndex = await addNodeChunk(
                graph,
                graphData.nodes,
                nodeIndex,
                50
              );
              // Update performance metrics
              setPerformanceMetrics((prev) => ({
                ...prev,
                nodeCount: nodeIndex,
              }));
              // Yield to main thread
              await new Promise((resolve) => requestAnimationFrame(resolve));
            }

            // Add edges after all nodes are added
            console.log("Adding edges...");
            let edgeCount = 0;
            for (const edge of graphData.edges) {
              if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
                graph.addEdge(edge.source, edge.target, {
                  type: "line",
                  color:
                    edge.relationType === "hierarchy"
                      ? "#94a3b8"
                      : edge.relationType === "essential"
                        ? "#ef4444"
                        : "#64748b",
                  size: edge.relationType === "hierarchy" ? 2 : 1,
                  relationType: edge.relationType,
                  zIndex: 1, // Default z-index for layering
                });
                edgeCount++;

                // Yield every 100 edges
                if (edgeCount % 100 === 0) {
                  await new Promise((resolve) =>
                    requestAnimationFrame(resolve)
                  );
                }
              }
            }

            // Apply optimized layout with reduced iterations
            console.log("Applying layout...");
            const settings = forceAtlas2.inferSettings(graph);
            forceAtlas2.assign(graph, { ...settings, iterations: 30 }); // Reduced from 100

            // Setup optimized event handlers
            setupSigmaEvents(sigma, graph);

            // Enable labels after initial setup (without refresh to prevent errors)
            sigma.setSetting("renderLabels", renderQuality !== "low");

            // Only refresh if we have nodes and the container is properly sized
            if (graph.order > 0 && container.clientWidth > 0) {
              try {
                sigma.refresh();
              } catch (refreshError) {
                console.warn("Refresh failed, will retry:", refreshError);
                // Retry refresh after a short delay
                setTimeout(() => {
                  try {
                    sigma.refresh();
                  } catch (retryError) {
                    console.error("Refresh retry failed:", retryError);
                  }
                }, 100);
              }
            }

            console.log(
              `Sigma initialization complete: ${graph.order} nodes, ${graph.size} edges`
            );
          };

          await addNodesChunked();
        } catch (err) {
          console.error("Error initializing Sigma.js:", err);
          setError(
            `Failed to initialize graph visualization: ${err instanceof Error ? err.message : "Unknown error"}`
          );
        }
      };

      initializeSigma();
    }, 50); // 50ms delay to ensure container is rendered

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [graphData]); // Simplified dependencies  // Ultra-fast performance-aware search functionality
  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (!sigmaRef.current || !graphRef.current || !searchTerm.trim()) return;

      const graph = graphRef.current;
      const sigma = sigmaRef.current;

      // Optimized search with aggressive early termination
      const matches: { node: string; score: number }[] = [];
      const maxMatches =
        isInteracting || renderQuality === "low"
          ? 5
          : renderQuality === "medium"
            ? 15
            : 30;

      let searchCount = 0;
      const maxSearchNodes =
        renderQuality === "low"
          ? 500
          : renderQuality === "medium"
            ? 2000
            : 5000;

      graph.forEachNode((nodeId: string, attributes: any) => {
        if (matches.length >= maxMatches || searchCount >= maxSearchNodes)
          return;
        searchCount++;

        const label = attributes.label.toLowerCase();
        const search = searchTerm.toLowerCase();

        if (label.includes(search)) {
          const score = label.indexOf(search) === 0 ? 2 : 1;
          matches.push({ node: nodeId, score });
        }
      });

      if (matches.length > 0) {
        // Sort by relevance and get the best match
        matches.sort((a, b) => b.score - a.score);
        const bestMatch = matches[0].node;

        // Get all connected nodes to the search result
        const connectedNodes = new Set([bestMatch]);
        const connectedEdges = new Set<string>();

        // Get all directly connected neighbors
        graph.forEachNeighbor(bestMatch, (neighbor: string) => {
          connectedNodes.add(neighbor);
        });

        // Get all edges connected to the selected node
        graph.forEachEdge(bestMatch, (edgeKey: string) => {
          connectedEdges.add(edgeKey);
        });

        // Set highlighted nodes and selected node for UI state
        setHighlightedNodes(connectedNodes);
        const nodeData = graph.getNodeAttributes(bestMatch);
        setSelectedNode({
          id: bestMatch,
          label: nodeData.label,
          description: nodeData.description,
          type: nodeData.nodeType,
          size: nodeData.size,
          skillCount: nodeData.skillCount,
        });

        // Apply visual highlighting with gray-out effect for unconnected nodes
        if (graph.order > 0) {
          // Reset all nodes with enhanced styling
          graph.forEachNode((node: string, attributes: any) => {
            const originalColor =
              attributes.nodeType === "occupation"
                ? "#3b82f6"
                : attributes.nodeType === "skill"
                  ? "#10b981"
                  : "#f59e0b";

            const isConnected = connectedNodes.has(node);
            const isSelected = node === bestMatch;

            if (isSelected) {
              // Selected node - bright highlight color, larger size, highest z-index
              graph.setNodeAttribute(node, "color", "#EB5D42");
              graph.setNodeAttribute(node, "size", attributes.size * 2);
              graph.setNodeAttribute(node, "zIndex", 100);
              graph.setNodeAttribute(
                node,
                "label",
                attributes.originalLabel || attributes.label
              );
            } else if (isConnected) {
              // Connected nodes - original color, slightly larger, high z-index
              graph.setNodeAttribute(node, "color", originalColor);
              graph.setNodeAttribute(node, "size", attributes.size * 1.3);
              graph.setNodeAttribute(node, "zIndex", 50);
              graph.setNodeAttribute(
                node,
                "label",
                attributes.originalLabel || attributes.label
              );
            } else {
              // Unconnected nodes - grayed out, smaller, low z-index, hidden labels
              graph.setNodeAttribute(node, "color", "#d1d5db");
              graph.setNodeAttribute(node, "size", attributes.size * 0.5);
              graph.setNodeAttribute(node, "zIndex", 1);
              graph.setNodeAttribute(node, "label", "");
            }
          });

          // Highlight connected edges and gray out unconnected ones
          graph.forEachEdge((edgeKey: string, attributes: any) => {
            const isConnected = connectedEdges.has(edgeKey);
            if (isConnected) {
              // Connected edges - bright highlight, thick, high z-index
              graph.setEdgeAttribute(edgeKey, "color", "#EB5D42");
              graph.setEdgeAttribute(
                edgeKey,
                "size",
                Math.max(3, attributes.size * 2.5)
              );
              graph.setEdgeAttribute(edgeKey, "zIndex", 75);
            } else {
              // Unconnected edges - grayed out, thin, low z-index
              graph.setEdgeAttribute(edgeKey, "color", "#e5e7eb");
              graph.setEdgeAttribute(
                edgeKey,
                "size",
                Math.max(0.3, attributes.size * 0.2)
              );
              graph.setEdgeAttribute(edgeKey, "zIndex", 1);
            }
          });

          try {
            sigma.refresh();
          } catch (refreshError) {
            console.warn(
              "Failed to refresh after search highlighting:",
              refreshError
            );
          }
        }

        // Center the camera on the found node with zoom to 0.01 ratio
        try {
          const nodePosition = sigma.getNodeDisplayData(bestMatch);

          sigma.getCamera().animate(
            {
              x: nodePosition.x,
              y: nodePosition.y,
              ratio: 0.01, // Very close zoom as requested
            },
            { duration: 1200 } // Slightly longer animation for smooth zoom
          );
        } catch (cameraError) {
          console.warn(
            "Failed to center camera on search result:",
            cameraError
          );
        }

        // If it's a group node that hasn't been expanded, expand it
        if (nodeData.nodeType === "group" && !expandedClusters.has(bestMatch)) {
          setTimeout(() => expandCluster(bestMatch), 500);
        }

        console.log(
          `Search found: ${nodeData.label} (${nodeData.nodeType}) with ${connectedNodes.size - 1} connected nodes`
        );
      } else {
        console.log(`No results found for: ${searchTerm}`);
      }
    },
    [expandedClusters, expandCluster, renderQuality, isInteracting]
  );

  // Control functions
  const zoomIn = () => {
    if (sigmaRef.current) {
      try {
        const camera = sigmaRef.current.getCamera();
        camera.animate({ ratio: camera.ratio * 0.7 }, { duration: 300 });
      } catch (zoomError) {
        console.warn("Failed to zoom in:", zoomError);
      }
    }
  };

  const zoomOut = () => {
    if (sigmaRef.current) {
      try {
        const camera = sigmaRef.current.getCamera();
        camera.animate({ ratio: camera.ratio * 1.3 }, { duration: 300 });
      } catch (zoomError) {
        console.warn("Failed to zoom out:", zoomError);
      }
    }
  };

  const resetView = () => {
    if (sigmaRef.current) {
      try {
        const camera = sigmaRef.current.getCamera();
        camera.animate({ x: 0.5, y: 0.5, ratio: 1 }, { duration: 500 });

        setHighlightedNodes(new Set());
        setSelectedNode(null);
      } catch (resetError) {
        console.warn("Failed to reset view:", resetError);
      }
    }

    // Reset all nodes and edges to original state with z-index and labels
    if (graphRef.current && graphRef.current.order > 0) {
      try {
        graphRef.current.forEachNode((node: string, attributes: any) => {
          const originalColor =
            attributes.nodeType === "occupation"
              ? "#3b82f6"
              : attributes.nodeType === "skill"
                ? "#10b981"
                : "#f59e0b";

          // Restore original color, size, z-index, and labels
          graphRef.current.setNodeAttribute(node, "color", originalColor);
          const baseSize =
            attributes.nodeType === "group"
              ? Math.max(8, Math.min(20, (attributes.skillCount || 10) / 15))
              : attributes.nodeType === "occupation"
                ? Math.max(8, Math.min(25, (attributes.skillCount || 5) / 2))
                : Math.max(3, Math.min(8, 5)); // default skill size
          graphRef.current.setNodeAttribute(node, "size", baseSize);
          graphRef.current.setNodeAttribute(node, "zIndex", 1); // Reset z-index
          graphRef.current.setNodeAttribute(
            node,
            "label",
            attributes.originalLabel || attributes.label
          ); // Restore label
        });

        // Reset all edges to original state with z-index
        graphRef.current.forEachEdge((edgeKey: string, attributes: any) => {
          const originalColor =
            attributes.relationType === "hierarchy"
              ? "#94a3b8"
              : attributes.relationType === "essential"
                ? "#ef4444"
                : "#64748b";

          const originalSize = attributes.relationType === "hierarchy" ? 2 : 1;

          graphRef.current.setEdgeAttribute(edgeKey, "color", originalColor);
          graphRef.current.setEdgeAttribute(edgeKey, "size", originalSize);
          graphRef.current.setEdgeAttribute(edgeKey, "zIndex", 1); // Reset z-index
        });

        sigmaRef.current.refresh();
      } catch (resetError) {
        console.warn("Failed to reset view colors and sizes:", resetError);
      }
    }
  };

  // Statistics calculation with performance metrics
  const stats = useMemo(() => {
    if (!processedData) return null;

    const visibleNodes = graphData.nodes.length;
    const visibleEdges = graphData.edges.length;
    const skillsLoaded = graphData.nodes.filter(
      (n) => n.type === "skill"
    ).length;

    return {
      occupations: processedData.occupations.size,
      skills: processedData.skills.size,
      groups: processedData.groups.size,
      relations: processedData.relations.length,
      // Performance metrics
      visibleNodes,
      visibleEdges,
      skillsLoaded,
      renderQuality,
      loadProgress:
        maxSkillsCount > 0
          ? Math.round((skillsLoaded / maxSkillsCount) * 100)
          : 0,
    };
  }, [processedData, graphData, renderQuality, maxSkillsCount]);

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          isDark
            ? "bg-gradient-to-br from-tabiya-dark to-tabiya-medium"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        }`}
      >
        <div className="text-center max-w-md w-full px-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#EB5D42] mx-auto mb-4"></div>
          <p
            className={`text-lg font-medium mb-2 ${
              isDark ? "text-tabiya-text" : "text-gray-700"
            }`}
          >
            Loading Tabiya Dataset...
          </p>
          <p
            className={`text-sm mb-4 ${
              isDark ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {loadingStage || "Initializing..."}
          </p>

          {/* Progress Bar */}
          <div
            className={`w-full rounded-full h-2 mb-2 ${
              isDark ? "bg-tabiya-medium" : "bg-gray-200"
            }`}
          >
            <div
              className="h-2 rounded-full transition-all duration-300 bg-[#EB5D42]"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-400"}`}
          >
            {loadingProgress.toFixed(0)}% complete
          </p>

          <div
            className={`mt-4 text-xs space-y-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <div>Optimized for 18,000+ nodes</div>
            <div>Progressive loading • Performance-first rendering</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          isDark ? "bg-tabiya-dark" : "bg-red-50"
        }`}
      >
        <div className="text-center">
          <p
            className={`text-xl font-semibold mb-2 ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            Error
          </p>
          <p className={isDark ? "text-gray-300" : "text-red-600"}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen flex ${isDark ? "bg-tabiya-dark" : "bg-gray-50"}`}
    >
      {/* Collapsible Sidebar */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-12"} transition-all duration-300 ${
          isDark
            ? "bg-tabiya-medium border-tabiya-dark"
            : "bg-white border-gray-200"
        } border-r flex flex-col`}
      >
        {/* Sidebar Header */}
        <div
          className={`p-4 border-b ${isDark ? "border-tabiya-dark" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2
                className={`text-lg font-semibold ${isDark ? "text-tabiya-text" : "text-gray-900"}`}
              >
                Controls
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-gray-300 hover:bg-tabiya-dark hover:text-tabiya-text"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto">
            {/* Search Widget */}
            <div
              className={`border-b ${isDark ? "border-tabiya-dark" : "border-gray-200"}`}
            >
              <button
                onClick={() => toggleSection("search")}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  isDark
                    ? "text-tabiya-text hover:bg-tabiya-dark"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span className="font-medium">Search</span>
                </div>
                {isSectionCollapsed("search") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>

              {!isSectionCollapsed("search") && (
                <div className="px-4 pb-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search occupations and skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSearch(searchTerm)
                      }
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        isDark
                          ? "bg-tabiya-dark border-gray-600 text-tabiya-text focus:ring-tabiya-accent placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 placeholder-gray-500"
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => handleSearch(searchTerm)}
                    className="w-full px-4 py-2 bg-[#EB5D42] text-white rounded-lg font-medium transition-colors hover:bg-[#d54d37]"
                  >
                    Search
                  </button>
                </div>
              )}
            </div>

            {/* Graph Controls Widget */}
            <div
              className={`border-b ${isDark ? "border-tabiya-dark" : "border-gray-200"}`}
            >
              <button
                onClick={() => toggleSection("controls")}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  isDark
                    ? "text-tabiya-text hover:bg-tabiya-dark"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Graph Controls</span>
                </div>
                {isSectionCollapsed("controls") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>

              {!isSectionCollapsed("controls") && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={zoomIn}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "text-gray-300 hover:bg-tabiya-dark hover:text-tabiya-text"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      title="Zoom In"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                    <button
                      onClick={zoomOut}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "text-gray-300 hover:bg-tabiya-dark hover:text-tabiya-text"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <button
                      onClick={resetView}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "text-gray-300 hover:bg-tabiya-dark hover:text-tabiya-text"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      title="Reset View"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Progressive Loading Controls - Only show Load More after initial skills are loaded */}
                  {hasInitialSkillsLoaded &&
                    loadedSkillsCount < maxSkillsCount && (
                      <button
                        onClick={() => loadMoreSkills(2000)}
                        disabled={isLoadingMore}
                        className="w-full px-4 py-2 bg-[#EB5D42] text-white rounded-lg font-medium transition-colors hover:bg-[#d54d37] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoadingMore ? "Loading..." : "Load More Skills"}
                      </button>
                    )}

                  {/* Node Count Control */}
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Max Skills:
                    </label>
                    <select
                      value={visibleNodeCount}
                      onChange={(e) =>
                        setVisibleNodeCount(Number(e.target.value))
                      }
                      className={`w-full text-sm border rounded px-3 py-2 ${
                        isDark
                          ? "bg-tabiya-dark border-gray-600 text-tabiya-text"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value={2000}>2K</option>
                      <option value={5000}>5K</option>
                      <option value={10000}>10K</option>
                      <option value={15000}>15K</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Performance Widget */}
            <div
              className={`border-b ${isDark ? "border-tabiya-dark" : "border-gray-200"}`}
            >
              <button
                onClick={() => toggleSection("performance")}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  isDark
                    ? "text-tabiya-text hover:bg-tabiya-dark"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Performance</span>
                </div>
                {isSectionCollapsed("performance") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>

              {!isSectionCollapsed("performance") && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Quality Indicator */}
                  <div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      isDark ? "bg-tabiya-dark" : "bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        renderQuality === "high"
                          ? "bg-green-500"
                          : renderQuality === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm capitalize ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {renderQuality} Quality
                    </span>
                    <span
                      className={`text-xs ml-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Zoom: {zoomLevel.toFixed(2)}
                    </span>
                    {isInteracting && (
                      <span className="text-xs text-orange-500 ml-1">
                        Moving
                      </span>
                    )}
                  </div>

                  {/* Performance Indicator */}
                  <div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      isDark ? "bg-tabiya-dark" : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        performanceMetrics.fps >= 30
                          ? "bg-green-500"
                          : performanceMetrics.fps >= 15
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {performanceMetrics.fps} FPS
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics Widget */}
            <div
              className={`border-b ${isDark ? "border-tabiya-dark" : "border-gray-200"}`}
            >
              <button
                onClick={() => toggleSection("stats")}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  isDark
                    ? "text-tabiya-text hover:bg-tabiya-dark"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">Statistics</span>
                </div>
                {isSectionCollapsed("stats") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>

              {!isSectionCollapsed("stats") && stats && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        <span
                          className={isDark ? "text-gray-300" : "text-gray-600"}
                        >
                          Occupations
                        </span>
                      </div>
                      <span
                        className={`font-medium ${isDark ? "text-tabiya-text" : "text-gray-900"}`}
                      >
                        {stats.occupations}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span
                          className={isDark ? "text-gray-300" : "text-gray-600"}
                        >
                          Skills
                        </span>
                      </div>
                      <span
                        className={`font-medium ${isDark ? "text-tabiya-text" : "text-gray-900"}`}
                      >
                        {stats.skillsLoaded} / {stats.skills}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-yellow-600" />
                        <span
                          className={isDark ? "text-gray-300" : "text-gray-600"}
                        >
                          Groups
                        </span>
                      </div>
                      <span
                        className={`font-medium ${isDark ? "text-tabiya-text" : "text-gray-900"}`}
                      >
                        {stats.groups}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`pt-3 border-t space-y-1 text-xs ${
                      isDark
                        ? "border-tabiya-dark text-gray-400"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <div>
                      Visible: {stats.visibleNodes} nodes, {stats.visibleEdges}{" "}
                      edges
                    </div>
                    <div>Progress: {stats.loadProgress}%</div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend Widget */}
            <div>
              <button
                onClick={() => toggleSection("legend")}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  isDark
                    ? "text-tabiya-text hover:bg-tabiya-dark"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4" />
                  <span className="font-medium">Legend</span>
                </div>
                {isSectionCollapsed("legend") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>

              {!isSectionCollapsed("legend") && (
                <div className="px-4 pb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        Occupations
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        Skills
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        Groups
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-0.5 bg-red-500"></div>
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        Essential
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-0.5 bg-gray-500 border-dashed border-t-2 border-gray-500"></div>
                      <span
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        Optional
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-xs mt-3 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Click nodes to explore connections
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className={`shadow-sm border-b p-4 ${
            isDark
              ? "bg-tabiya-medium border-tabiya-dark"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isDark ? "text-tabiya-text" : "text-gray-900"
                }`}
              >
                Tabiya Dataset Explorer
              </h1>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Interactive visualization of occupations, skills, and their
                relationships
              </p>
            </div>

            {/* Condensed Stats in Header */}
            {stats && (
              <div
                className={`text-xs space-y-1 text-right ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <div>
                  Quality: {stats.renderQuality} | FPS: {performanceMetrics.fps}
                </div>
                <div>
                  Nodes: {stats.visibleNodes} | Edges: {stats.visibleEdges}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Graph Container */}
        <div className="flex-1 relative">
          <div ref={containerRef} className="w-full h-full" />

          {/* Instructional Text - Show when dataset is loaded but skills haven't been loaded yet */}
          {!isLoading && !hasInitialSkillsLoaded && !isLoadingMore && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`text-center px-8 py-6 rounded-lg border-2 border-dashed max-w-md ${
                  isDark
                    ? "bg-tabiya-medium/80 border-gray-600 text-tabiya-text"
                    : "bg-white/80 border-gray-300 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDark ? "bg-tabiya-dark" : "bg-gray-100"
                    }`}
                  >
                    <Target className="h-6 w-6 text-[#EB5D42]" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Ready to Explore!
                </h3>
                <p className="text-sm mb-6">
                  Dataset loaded successfully. Click the button below to begin
                  visualizing the skill network and explore connections between
                  occupations and skills.
                </p>

                {/* Start Exploring Skills Button */}
                <button
                  onClick={() => loadInitialSkills(2000)}
                  disabled={isLoadingMore}
                  className="w-full px-6 py-3 bg-[#EB5D42] text-white rounded-lg font-medium transition-colors hover:bg-[#d54d37] disabled:opacity-50 disabled:cursor-not-allowed mb-4 pointer-events-auto"
                >
                  {isLoadingMore ? "Loading..." : "Start Exploring Skills"}
                </button>

                <div className="flex items-center justify-center text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-[#EB5D42] rounded-full animate-pulse"></div>
                    <span>Click to visualize skill network</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Progress Indicator */}
          {isLoadingMore && (
            <div
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 border rounded-lg shadow-lg px-4 py-2 ${
                isDark
                  ? "bg-tabiya-medium border-tabiya-dark"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#EB5D42]"></div>
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Loading more skills...
                </span>
              </div>
            </div>
          )}

          {/* Tooltip */}
          {tooltip && (
            <div
              className={`absolute z-10 border rounded-lg shadow-lg p-3 max-w-xs pointer-events-none ${
                isDark
                  ? "bg-tabiya-medium border-tabiya-dark"
                  : "bg-white border-gray-200"
              }`}
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
                <span
                  className={`font-medium ${
                    isDark ? "text-tabiya-text" : "text-gray-900"
                  }`}
                >
                  {tooltip.node.label}
                </span>
              </div>

              {tooltip.node.description && (
                <p
                  className={`text-sm mb-2 line-clamp-3 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {tooltip.node.description}
                </p>
              )}

              <div
                className={`flex items-center justify-between text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <span className="capitalize">{tooltip.node.type}</span>
                {tooltip.node.skillCount && (
                  <span>{tooltip.node.skillCount} skills</span>
                )}
              </div>
            </div>
          )}

          {/* Node Details Panel */}
          {selectedNode && (
            <div
              className={`absolute top-4 right-4 w-80 border rounded-lg shadow-lg p-4 ${
                isDark
                  ? "bg-tabiya-medium border-tabiya-dark"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h3
                    className={`font-semibold ${
                      isDark ? "text-tabiya-text" : "text-gray-900"
                    }`}
                  >
                    Node Details
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className={`transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-tabiya-text"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Label
                  </label>
                  <p className={isDark ? "text-tabiya-text" : "text-gray-900"}>
                    {selectedNode.label}
                  </p>
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Type
                  </label>
                  <p
                    className={`capitalize ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {selectedNode.type}
                  </p>
                </div>

                {selectedNode.description && (
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Description
                    </label>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {selectedNode.description}
                    </p>
                  </div>
                )}

                {selectedNode.skillCount && (
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Related Skills
                    </label>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      {selectedNode.skillCount}
                    </p>
                  </div>
                )}

                {highlightedNodes.size > 1 && (
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Connected Nodes
                    </label>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      {highlightedNodes.size - 1}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabiyaDatasetExplorer;
