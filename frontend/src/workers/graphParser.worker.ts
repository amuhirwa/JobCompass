/// <reference lib="webworker" />

import Papa from "papaparse";

/**
 * Graph Parser Web Worker
 * Handles CSV parsing and initial graph data processing to avoid blocking the main UI thread
 */

interface CSVParseMessage {
  csvData: string;
  type: string;
}

interface ParsedData {
  type: string;
  data: any[];
  success: boolean;
  error?: string;
}

// Calculate graph metrics for optimization
function calculateGraphMetrics(data: any[], type: string): any {
  const metrics: any = {
    nodeCount: data.length,
    type: type,
  };

  if (type === "occupations.csv") {
    metrics.avgDescriptionLength =
      data.reduce((sum, item) => sum + (item.DESCRIPTION?.length || 0), 0) /
      data.length;
  } else if (type === "skills.csv") {
    metrics.skillTypes = {};
    data.forEach((item) => {
      const skillType = item.SKILLTYPE || "unknown";
      metrics.skillTypes[skillType] = (metrics.skillTypes[skillType] || 0) + 1;
    });
  } else if (type === "occupation_to_skill_relations.csv") {
    metrics.relationTypes = {};
    data.forEach((item) => {
      const relType = item.RELATIONTYPE || "unknown";
      metrics.relationTypes[relType] =
        (metrics.relationTypes[relType] || 0) + 1;
    });
  }

  return metrics;
}

// Preprocess data for faster graph construction
function preprocessData(data: any[]): any[] {
  return data.map((item) => {
    // Clean and standardize data
    const cleaned: any = {};

    Object.keys(item).forEach((key) => {
      let value = item[key];

      // Clean string values
      if (typeof value === "string") {
        value = value.trim();
        // Handle empty values
        if (value === "" || value === "nan" || value === "null") {
          value = null;
        }
      }

      cleaned[key] = value;
    });

    return cleaned;
  });
}

// Main message handler
self.onmessage = function (e: MessageEvent<CSVParseMessage>) {
  const { csvData, type } = e.data;

  try {
    console.log(`Worker: Processing ${type} (${csvData.length} characters)`);

    // Parse CSV data using papaparse
    const parseResult = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transform: (value: string) => {
        // Clean up values
        const trimmed = value.trim();
        if (trimmed === "" || trimmed === "nan" || trimmed === "null") {
          return null;
        }
        return trimmed;
      },
    });

    if (parseResult.errors.length > 0) {
      console.warn(`Worker: Parse warnings for ${type}:`, parseResult.errors);
    }

    // Preprocess for optimization
    const processedData = preprocessData(parseResult.data);

    // Calculate metrics
    const metrics = calculateGraphMetrics(processedData, type);

    const result: ParsedData = {
      type,
      data: processedData,
      success: true,
    };

    console.log(
      `Worker: Completed ${type} - ${processedData.length} rows, metrics:`,
      metrics
    );

    // Send result back to main thread
    self.postMessage(result);
  } catch (error) {
    console.error(`Worker: Error processing ${type}:`, error);

    const errorResult: ParsedData = {
      type,
      data: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown parsing error",
    };

    self.postMessage(errorResult);
  }
};

// Handle worker termination
self.onclose = function () {
  console.log("Graph parser worker terminated");
};

export {}; // Make this a module
