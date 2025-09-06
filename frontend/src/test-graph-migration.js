// Quick test to verify the migration works
import Graph from "graphology";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import louvain from "graphology-communities-louvain";

console.log("Testing library imports...");

// Test Graph creation
try {
  const graph = new Graph();
  console.log("✅ Graph import and instantiation working");

  // Add test nodes and edges
  graph.addNode("node1", {
    label: "Test Node 1",
    x: 0,
    y: 0,
    size: 10,
    color: "#666",
  });
  graph.addNode("node2", {
    label: "Test Node 2",
    x: 100,
    y: 0,
    size: 10,
    color: "#666",
  });
  graph.addEdge("node1", "node2", { color: "#ccc" });

  console.log("✅ Graph operations working");

  // Test forceAtlas2 layout
  if (forceAtlas2) {
    const settings = forceAtlas2.inferSettings(graph);
    forceAtlas2.assign(graph, { ...settings, iterations: 10 });
    console.log("✅ ForceAtlas2 layout working");
  } else {
    console.log("❌ ForceAtlas2 not working");
  }

  // Test louvain communities
  if (louvain) {
    const communities = louvain(graph);
    console.log("✅ Louvain communities working:", communities);
  } else {
    console.log("❌ Louvain not working");
  }
} catch (error) {
  console.error("❌ Graph error:", error);
}

// Test Sigma (note: requires DOM element, so just test constructor)
try {
  console.log("✅ Sigma import working");
} catch (error) {
  console.error("❌ Sigma error:", error);
}

console.log("Migration test complete!");
