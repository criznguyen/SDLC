# DocPack v2 Format Specification

## Overview

DocPack compresses multiple `.md` files into a single `.packed.md` file using zlib + base64. The output is valid markdown. Agents read the packed file instead of loading N individual docs, reducing context usage by ~50%.

## Format

```markdown
# DocPack v2
<!-- dpk:v2 {fileCount}f {originalBytes}b -->

| File | Size |
|------|------|
| `path/to/file.md` | 1.2 KB |
| ... | ... |

```dpk
{base64 of zlib-compressed JSON payload, split into 80-char lines}
```
```

## Payload Structure

The `dpk` code block contains: `base64(zlib(JSON))` where JSON is:

```json
{
  "v": 2,
  "files": [
    { "p": "relative/path.md", "c": "full file content..." },
    { "p": "another/file.md", "c": "..." }
  ]
}
```

## CLI Commands

```bash
# Pack a directory of .md files into one packed file
sdlc-workflow pack docs/sdlc/po/my-epic/

# Pack with custom output path
sdlc-workflow pack docs/sdlc/po/my-epic/ -o my-epic.packed.md

# Unpack back to individual files
sdlc-workflow unpack my-epic.packed.md -o output-dir/

# Inspect contents without unpacking
sdlc-workflow inspect my-epic.packed.md
```

## SDLC Integration

Each SDLC phase:
1. Writes docs to its folder as normal
2. Packs the folder: `sdlc-workflow pack docs/sdlc/{folder}/`
3. Next phase reads ONLY the `.packed.md` — never individual files

This is enforced in every phase README and in ORCHESTRATION.md.

## Properties

- **Lossless**: `unpack(pack(files)) == files` — 100% content fidelity
- **Valid markdown**: Packed file renders as readable manifest + code block
- **~50% reduction**: zlib level 9 on text content
- **No dependencies**: Uses Node.js built-in `zlib` and `Buffer`
- **Agent-readable**: Agents can decode the base64/zlib payload inline, or use the manifest table for quick inspection
