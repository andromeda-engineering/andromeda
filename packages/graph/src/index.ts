export const GRAPH_VERSION = "0.0.0";

export interface GraphNode {
  id: string;
}

export interface GraphEdge {
  fromNodeId: string;
  toNodeId: string;
}
