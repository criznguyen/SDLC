/**
 * DocPack v2 - Agent-optimized markdown compression engine
 *
 * Strategy: Bundle N .md files → 1 .md file with zlib-compressed base64 payload.
 * Output is valid markdown (header + code block with encoded data).
 * Agents can decompress inline; humans use `sdlc-workflow unpack`.
 *
 * Format:
 * ───────
 * # DocPack v2
 * <!-- dpk:v2 {fileCount}f {origBytes}b -->
 * | File | Size |
 * |------|------|
 * | path1 | 1.2 KB |
 * ```dpk
 * <base64 of zlib(JSON manifest + file contents)>
 * ```
 *
 * The payload is: zlib(JSON.stringify({ files: [{ p: relPath, c: content }] }))
 * then base64-encoded. Simple, lossless, ~60-70% compression on text.
 */

import { readFile, writeFile, readdir, stat, mkdir } from "node:fs/promises";
import { join, relative, basename, extname, dirname } from "node:path";
import { deflateSync, inflateSync } from "node:zlib";
import { existsSync } from "node:fs";

// ── Helpers ──

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function collectMdFiles(dirPath) {
  const files = [];
  const entries = await readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMdFiles(fullPath)));
    } else if (entry.isFile() && extname(entry.name) === ".md") {
      files.push(fullPath);
    }
  }
  return files.sort();
}

async function getDirSize(dirPath) {
  let total = 0;
  const entries = await readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fp = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      total += await getDirSize(fp);
    } else if (extname(entry.name) === ".md") {
      const s = await stat(fp);
      total += s.size;
    }
  }
  return total;
}

// ── Core Pack/Unpack ──

/**
 * Pack file entries into a compressed .md string
 * @param {Array<{path: string, content: string}>} fileEntries
 * @returns {string} valid markdown with compressed payload
 */
export function pack(fileEntries) {
  const payload = JSON.stringify({ v: 2, files: fileEntries.map(f => ({ p: f.path, c: f.content })) });
  const compressed = deflateSync(Buffer.from(payload, "utf8"), { level: 9 });
  const b64 = compressed.toString("base64");
  const origBytes = fileEntries.reduce((sum, f) => sum + Buffer.byteLength(f.content, "utf8"), 0);

  // Build readable markdown header + encoded payload
  const lines = [];
  lines.push(`# DocPack v2`);
  lines.push(`<!-- dpk:v2 ${fileEntries.length}f ${origBytes}b -->`);
  lines.push(``);
  lines.push(`| File | Size |`);
  lines.push(`|------|------|`);
  for (const f of fileEntries) {
    const size = formatBytes(Buffer.byteLength(f.content, "utf8"));
    lines.push(`| \`${f.path}\` | ${size} |`);
  }
  lines.push(``);
  // Wrap base64 in fenced code block (valid markdown)
  lines.push("```dpk");
  // Split base64 into 80-char lines for readability
  for (let i = 0; i < b64.length; i += 80) {
    lines.push(b64.slice(i, i + 80));
  }
  lines.push("```");

  return lines.join("\n");
}

/**
 * Unpack a compressed .md back to file entries
 * @param {string} packed - the packed markdown content
 * @returns {Array<{path: string, content: string}>}
 */
export function unpack(packed) {
  // Extract base64 from ```dpk ... ``` block
  const match = packed.match(/```dpk\n([\s\S]*?)\n```/);
  if (!match) {
    throw new Error("Not a valid DocPack v2 file (missing ```dpk block)");
  }
  const b64 = match[1].replace(/\s+/g, ""); // strip newlines
  const compressed = Buffer.from(b64, "base64");
  const payload = inflateSync(compressed).toString("utf8");
  const data = JSON.parse(payload);

  if (data.v !== 2) {
    throw new Error(`Unsupported DocPack version: ${data.v}`);
  }

  return data.files.map(f => ({ path: f.p, content: f.c }));
}

// ── File system operations ──

export async function packDir(dirPath, level) {
  const mdFiles = await collectMdFiles(dirPath);
  if (mdFiles.length === 0) {
    throw new Error(`No .md files found in ${dirPath}`);
  }
  const fileEntries = [];
  for (const fp of mdFiles) {
    const content = await readFile(fp, "utf8");
    const relPath = relative(dirPath, fp);
    fileEntries.push({ path: relPath, content });
  }
  return pack(fileEntries);
}

export async function packFile(filePath) {
  const content = await readFile(filePath, "utf8");
  return pack([{ path: basename(filePath), content }]);
}

export async function unpackToDir(packed, targetDir) {
  const files = unpack(packed);
  const written = [];
  for (const { path: relPath, content } of files) {
    const fullPath = join(targetDir, relPath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content, "utf8");
    written.push(fullPath);
  }
  return written;
}

// ── CLI handler ──

export async function handleDocpackCommand(args) {
  const subCmd = args[0];

  if (subCmd === "pack") {
    const target = args[1];
    const outFlag = args.indexOf("-o");
    let outPath = outFlag !== -1 ? args[outFlag + 1] : null;

    if (!target) {
      console.error("Usage: sdlc-workflow pack <file-or-dir> [-o output.md]");
      process.exit(1);
    }

    const targetPath = join(process.cwd(), target);
    const info = await stat(targetPath);
    let packed;

    if (info.isDirectory()) {
      packed = await packDir(targetPath);
      if (!outPath) outPath = target.replace(/\/$/, "") + ".packed.md";
    } else {
      packed = await packFile(targetPath);
      if (!outPath) outPath = target.replace(/\.md$/, ".packed.md");
    }

    const fullOut = join(process.cwd(), outPath);
    await writeFile(fullOut, packed, "utf8");

    const origSize = info.isDirectory()
      ? await getDirSize(targetPath)
      : info.size;
    const packedSize = Buffer.byteLength(packed, "utf8");
    const ratio = ((1 - packedSize / origSize) * 100).toFixed(1);

    console.log(`Packed → ${outPath}`);
    console.log(`  Files:    ${info.isDirectory() ? (await collectMdFiles(targetPath)).length : 1}`);
    console.log(`  Original: ${formatBytes(origSize)}`);
    console.log(`  Packed:   ${formatBytes(packedSize)}`);
    console.log(`  Reduced:  ${ratio}%`);
    return;
  }

  if (subCmd === "unpack") {
    const target = args[1];
    const outFlag = args.indexOf("-o");
    let outDir = outFlag !== -1 ? args[outFlag + 1] : null;

    if (!target) {
      console.error("Usage: sdlc-workflow unpack <packed.md> [-o output-dir]");
      process.exit(1);
    }

    const packed = await readFile(join(process.cwd(), target), "utf8");
    if (!outDir) outDir = target.replace(/\.packed\.md$/, "");

    const fullOut = join(process.cwd(), outDir);
    const written = await unpackToDir(packed, fullOut);

    console.log(`Unpacked → ${outDir}/`);
    for (const f of written) {
      console.log(`  + ${relative(process.cwd(), f)}`);
    }
    return;
  }

  if (subCmd === "inspect") {
    const target = args[1];
    if (!target) {
      console.error("Usage: sdlc-workflow inspect <packed.md>");
      process.exit(1);
    }
    const packed = await readFile(join(process.cwd(), target), "utf8");
    const files = unpack(packed);
    const headerMatch = packed.match(/<!-- dpk:v2 (\d+)f (\d+)b -->/);
    const origBytes = headerMatch ? parseInt(headerMatch[2]) : 0;
    const packedBytes = Buffer.byteLength(packed, "utf8");

    console.log(`DocPack v2 | ${files.length} file(s) | ${formatBytes(origBytes)} → ${formatBytes(packedBytes)}`);
    console.log("");
    for (const f of files) {
      const size = Buffer.byteLength(f.content, "utf8");
      console.log(`  ${f.path} (${formatBytes(size)})`);
    }
    return;
  }

  console.log("DocPack commands:");
  console.log("  pack <file-or-dir> [-o out.md]   Compress .md files into one packed .md");
  console.log("  unpack <packed.md> [-o dir]       Decompress packed .md back to files");
  console.log("  inspect <packed.md>               Show packed file manifest");
}
