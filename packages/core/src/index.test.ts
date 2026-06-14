import { describe, it, expect } from "vitest";
import type {
  Provenance,
  Citation,
  Artifact,
  ActionItem,
  AndromedaEvent,
  TimeRange,
  CitationLocation,
} from "./index.js";
import * as mod from "./index.js";

describe("@andromeda-eng/core", () => {
  it("exports a version", () => {
    expect(mod.CORE_VERSION).toBe("0.0.0");
  });

  it("constructs a valid TimeRange (open-ended)", () => {
    const r: TimeRange = { start: "2024-01-01T00:00:00Z" };
    expect(r.start).toBe("2024-01-01T00:00:00Z");
    expect(r.end).toBeUndefined();
  });

  it("constructs a valid TimeRange (closed)", () => {
    const r: TimeRange = { start: "2024-01-01T00:00:00Z", end: "2024-12-31T23:59:59Z" };
    expect(r.end).toBe("2024-12-31T23:59:59Z");
  });

  it("constructs a valid Provenance", () => {
    const p = {
      sourceId: "src-1",
      trustLevel: "high",
      retrievedAt: "2024-06-01T00:00:00Z",
    } satisfies Provenance;
    expect(p.trustLevel).toBe("high");
  });

  it("constructs a Provenance with notes", () => {
    const p = {
      sourceId: "src-2",
      trustLevel: "authoritative",
      retrievedAt: "2024-06-01T00:00:00Z",
      notes: "primary source",
    } satisfies Provenance;
    expect(p.notes).toBe("primary source");
  });

  it("constructs each CitationLocation variant", () => {
    const page: CitationLocation = { type: "page", page: 5 };
    const line: CitationLocation = { type: "line", startLine: 10, endLine: 20 };
    const ts: CitationLocation = { type: "timestamp", startSeconds: 30 };
    const sel: CitationLocation = { type: "selector", cssSelector: "h1 > span" };
    const heading: CitationLocation = { type: "heading", headingPath: ["Intro", "Background"] };
    const range: CitationLocation = { type: "range", start: "1:0", end: "2:10" };
    expect(page.type).toBe("page");
    expect(line.type).toBe("line");
    expect(ts.type).toBe("timestamp");
    expect(sel.type).toBe("selector");
    expect(heading.type).toBe("heading");
    expect(range.type).toBe("range");
  });

  it("constructs a valid Citation", () => {
    const c: Citation = {
      id: "cit-1",
      artifactId: "art-1",
      location: { type: "page", page: 3 } satisfies CitationLocation,
      createdAt: "2024-06-01T00:00:00Z",
    };
    expect(c.id).toBe("cit-1");
    expect(c.excerpt).toBeUndefined();
  });

  it("constructs a Citation with excerpt", () => {
    const c = {
      id: "cit-2",
      artifactId: "art-1",
      location: { type: "line", startLine: 42 } satisfies CitationLocation,
      excerpt: "This is the key sentence.",
      createdAt: "2024-06-01T00:00:00Z",
    } satisfies Citation;
    expect(c.excerpt).toBe("This is the key sentence.");
  });

  it("constructs a valid Artifact", () => {
    const a: Artifact = {
      id: "art-1",
      sourceId: "src-1",
      kind: "document",
      provenance: {
        sourceId: "src-1",
        trustLevel: "medium",
        retrievedAt: "2024-06-01T00:00:00Z",
      } satisfies Provenance,
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
    };
    expect(a.kind).toBe("document");
    expect(a.title).toBeUndefined();
  });

  it("constructs an Artifact with optional fields", () => {
    const a = {
      id: "art-2",
      sourceId: "src-1",
      kind: "webpage",
      title: "Home Page",
      mimeType: "text/html",
      language: "en",
      contentHash: "abc123",
      provenance: {
        sourceId: "src-1",
        trustLevel: "low",
        retrievedAt: "2024-06-01T00:00:00Z",
      } satisfies Provenance,
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: "2024-06-02T00:00:00Z",
    } satisfies Artifact;
    expect(a.title).toBe("Home Page");
    expect(a.mimeType).toBe("text/html");
  });

  it("constructs a valid ActionItem", () => {
    const ai = {
      id: "act-1",
      description: "Review the API spec",
      status: "discovered",
      priority: 2,
      exportTargets: ["linear"],
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
    } satisfies ActionItem;
    expect(ai.status).toBe("discovered");
    expect(ai.priority).toBe(2);
    expect(ai.exportTargets).toContain("linear");
  });

  it("constructs an ActionItem with citation link", () => {
    const ai = {
      id: "act-2",
      description: "Fix null check on line 42",
      status: "accepted",
      priority: 1,
      exportTargets: ["github_issues", "obsidian"],
      artifactId: "art-1",
      citationId: "cit-1",
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
    } satisfies ActionItem;
    expect(ai.citationId).toBe("cit-1");
  });

  it("constructs a valid AndromedaEvent without payload", () => {
    const ev: AndromedaEvent = {
      id: "evt-1",
      type: "source.discovered",
      occurredAt: "2024-06-01T00:00:00Z",
    };
    expect(ev.type).toBe("source.discovered");
    expect(ev.payload).toBeUndefined();
  });

  it("constructs a valid AndromedaEvent with payload", () => {
    const ev = {
      id: "evt-2",
      type: "job.failed",
      occurredAt: "2024-06-01T12:00:00Z",
      payload: { reason: "timeout", retries: 3 },
    } satisfies AndromedaEvent;
    expect(ev.type).toBe("job.failed");
    expect(ev.payload).toEqual({ reason: "timeout", retries: 3 });
  });
});
