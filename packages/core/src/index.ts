export const CORE_VERSION = "0.0.0";

export type EntityId = string;

export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

export type SourceId = EntityId;
export type ArtifactId = EntityId;
export type CitationId = EntityId;
export type FindingId = EntityId;
export type InsightId = EntityId;
export type TopicId = EntityId;
export type NoteId = EntityId;
export type ActionItemId = EntityId;
export type EventId = EntityId;

export interface TimeRange {
  start: string;
  end?: string;
}

export type TrustLevel = "unknown" | "low" | "medium" | "high" | "authoritative";

export interface Provenance {
  sourceId: SourceId;
  trustLevel: TrustLevel;
  retrievedAt: string;
  notes?: string;
}

export type CitationLocation =
  | { type: "page"; page: number; offset?: number }
  | { type: "line"; startLine: number; endLine?: number }
  | { type: "timestamp"; startSeconds: number; endSeconds?: number }
  | { type: "selector"; cssSelector: string; textOffset?: number }
  | { type: "heading"; headingPath: string[] }
  | { type: "range"; start: string; end: string };

export interface Citation {
  id: CitationId;
  artifactId: ArtifactId;
  location: CitationLocation;
  excerpt?: string;
  createdAt: string;
}

export type ArtifactKind =
  | "document" | "webpage" | "video" | "email" | "repository"
  | "issue" | "note" | "image" | "dataset" | "api_response" | "database_query";

export interface Artifact extends Timestamped {
  id: ArtifactId;
  sourceId: SourceId;
  kind: ArtifactKind;
  title?: string;
  contentPath?: string;
  contentHash?: string;
  mimeType?: string;
  language?: string;
  provenance: Provenance;
}

export type ActionItemStatus =
  | "discovered" | "reviewed" | "accepted" | "rejected" | "exported" | "archived";

export type ActionItemPriority = 0 | 1 | 2 | 3 | 4;

export type ExportTarget =
  | "claude" | "codex" | "gemini" | "local_todo" | "markdown"
  | "jira" | "linear" | "github_issues" | "notion" | "obsidian"
  | "email" | "discord" | "teams";

export interface ActionItem extends Timestamped {
  id: ActionItemId;
  description: string;
  status: ActionItemStatus;
  priority: ActionItemPriority;
  exportTargets: ExportTarget[];
  artifactId?: ArtifactId;
  citationId?: CitationId;
}

export type AndromedaEventType =
  | "source.discovered" | "source.fetched" | "source.normalized"
  | "artifact.created" | "artifact.updated"
  | "citation.created"
  | "finding.created" | "finding.updated"
  | "action_item.discovered" | "action_item.exported"
  | "graph.edge.created"
  | "plugin.registered"
  | "job.started" | "job.completed" | "job.failed";

export interface AndromedaEvent {
  id: EventId;
  type: AndromedaEventType;
  occurredAt: string;
  payload?: unknown;
}
