# PRD: DocPack - Agent-Optimized Document Compression Engine

**Version:** 1.0
**Date:** 2026-03-24
**Author:** PO Agent
**Epic:** docpack
**Status:** Draft

---

## 1. Problem Statement

SDLC workflow generates numerous markdown documents across phases (PRD, FRS, ADR, test plans, API specs, etc.). As projects scale:

- **File bloat**: Dozens of .md files per epic, many with redundant headers, boilerplate, and verbose formatting
- **Context window waste**: AI agents loading full docs consume tokens on formatting/structure rather than content
- **Multi-file overhead**: Agents must read 5-10 files to understand one epic, each with filesystem round-trips
- **Storage inefficiency**: Repeated patterns (tables, headers, status fields) across docs waste space

## 2. Vision

A compression engine that packs multiple markdown documents into a single compact `.md` file using an agent-readable shorthand notation. The compressed format strips all human-friendly formatting while preserving 100% of semantic content. A decompression engine reconstructs full, human-readable markdown on demand.

**Key constraint**: Both compressed and decompressed outputs remain valid `.md` files.

## 3. Target Users

| User | Need |
|------|------|
| AI Agents (primary) | Read compressed docs efficiently within token budgets |
| SDLC CLI | Automate pack/unpack as part of workflow |
| Developers | Occasionally inspect compressed format; primarily use decompressed |
| CI/CD pipelines | Store compressed artifacts, decompress for publishing |

## 4. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Size reduction | Compressed size vs original | >= 60% reduction |
| Lossless round-trip | Decompress(Compress(docs)) == docs | 100% fidelity |
| Agent readability | Agent can answer questions from compressed format | 95%+ accuracy |
| Multi-file packing | N files into 1 compressed file | Supported |
| Performance | Pack/unpack time for 50 files | < 2 seconds |
| Format compliance | Output is valid markdown | Always |

## 5. Features

### 5.1 Core: Pack (Compress)

- **Multi-file bundling**: Combine N .md files into 1 .md file with file boundary markers
- **Shorthand notation**: Replace verbose markdown patterns with compact symbols
  - Headers → compact markers (e.g., `#1`, `#2` with inline section IDs)
  - Tables → delimiter-separated values (DSV)
  - Repeated boilerplate → reference tokens
  - Whitespace/formatting → stripped to minimum
  - Status badges, metadata → compact key-value pairs
- **Semantic preservation**: All content, hierarchy, relationships preserved
- **Configurable levels**: Level 1 (light - strip whitespace), Level 2 (medium - shorthand), Level 3 (max - full compression)

### 5.2 Core: Unpack (Decompress)

- **Full reconstruction**: Restore complete human-readable markdown
- **Selective unpack**: Extract single file from bundle
- **Format options**: Original format or standardized template

### 5.3 CLI Integration

- `sdlc pack <path>` - Compress file(s)
- `sdlc unpack <path>` - Decompress file
- `sdlc pack --epic <slug>` - Pack all docs for an epic
- `sdlc pack --level 1|2|3` - Compression level

### 5.4 Agent Context Protocol

- Compressed format includes a micro-header that tells agents:
  - Format version
  - Compression level used
  - File manifest (what's inside)
  - Quick-seek offsets for sections

## 6. User Stories

### Epic: DocPack Compression Engine

#### US-1: Pack single file
**As** an SDLC CLI user,
**I want** to compress a single markdown document,
**So that** the file size is minimized while keeping it agent-readable.

**Acceptance Criteria:**
- Given a `.md` file, when I run `sdlc pack file.md`, then a `.packed.md` file is created
- The packed file is >= 50% smaller than the original
- The packed file is valid markdown
- An agent can extract all original information from the packed format

#### US-2: Pack multiple files into one
**As** an AI agent,
**I want** all docs for an epic bundled into a single compressed file,
**So that** I can load one file instead of many, reducing I/O and token usage.

**Acceptance Criteria:**
- Given an epic folder with N `.md` files, when I run `sdlc pack --epic docpack`, then one `.packed.md` is created
- The packed file contains all content from all source files
- File boundaries are clearly marked for selective extraction
- Total size is >= 60% smaller than sum of originals

#### US-3: Unpack to full docs
**As** a developer,
**I want** to decompress a packed file back to full human-readable markdown,
**So that** I can review documentation in standard format.

**Acceptance Criteria:**
- Given a `.packed.md` file, when I run `sdlc unpack file.packed.md`, then original `.md` files are restored
- Restored files match originals in content (whitespace normalization allowed)
- Original file names and directory structure preserved

#### US-4: Selective unpack
**As** an AI agent,
**I want** to extract just one document from a packed bundle,
**So that** I only load what I need for the current task.

**Acceptance Criteria:**
- Given a packed bundle, when I request a specific file by name, then only that file's content is extracted
- Extraction is fast (no need to parse entire bundle)

#### US-5: Compression levels
**As** a user,
**I want** to choose compression aggressiveness,
**So that** I can balance readability vs size.

**Acceptance Criteria:**
- Level 1: Strip extra whitespace, normalize formatting (~30% reduction)
- Level 2: Apply shorthand notation (~50% reduction)
- Level 3: Maximum compression with full shorthand + deduplication (~70% reduction)

#### US-6: Agent context header
**As** an AI agent,
**I want** a compact header in packed files describing what's inside,
**So that** I can quickly determine if this file has what I need without parsing everything.

**Acceptance Criteria:**
- Packed files start with a machine-readable manifest
- Manifest includes: version, level, file list, section index
- Manifest is < 200 bytes for typical bundles

## 7. Out of Scope (v1)

- Binary file compression (images, PDFs)
- Encryption of compressed content
- Streaming compression for very large doc sets
- GUI/web interface for pack/unpack
- Cross-project deduplication

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lossy compression | Data loss | Strict round-trip testing; hash verification |
| Agent can't parse compact format | Defeats purpose | Standardized grammar; agent prompt includes format spec |
| Format versioning breaks | Old packed files unreadable | Version header; backward-compatible parser |
| Over-compression hurts agent comprehension | Reduced accuracy | Benchmark agent accuracy at each level |

## 9. Dependencies

- Node.js runtime (existing in project)
- No external dependencies required (pure JS/string manipulation)

## 10. Release Plan

| Phase | Scope |
|-------|-------|
| MVP | Single-file pack/unpack, level 2 compression |
| v1.0 | Multi-file bundling, all 3 levels, CLI commands |
| v1.1 | Selective unpack, agent context header |
| v1.2 | Performance optimization, streaming for large sets |
