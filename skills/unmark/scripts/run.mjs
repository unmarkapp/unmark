#!/usr/bin/env node
/**
 * Unmark skill runner — upload stills to Cloud and write cleaned files.
 * Auth: UNMARK_BEARER_TOKEN (same token as Unmark MCP).
 */

import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const API_URL = (process.env.UNMARK_API_URL || "https://api.unmark.ink").replace(
  /\/$/,
  "",
);
const TOKEN = process.env.UNMARK_BEARER_TOKEN || "";
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const POLL_MS = 2000;
const TIMEOUT_MS = 5 * 60 * 1000;

function usage() {
  return `Usage:
  node scripts/run.mjs remove <input.png> --output <clean.png>
  node scripts/run.mjs remove <input-dir> --out-dir <clean-dir>
  node scripts/run.mjs remove <input> --output <file> --json

Set UNMARK_BEARER_TOKEN. Optional UNMARK_API_URL (default ${API_URL}).
`;
}

function authHeaders() {
  if (!TOKEN) {
    throw new Error(
      "UNMARK_BEARER_TOKEN is not set. Sign in at https://www.unmark.ink and follow https://www.unmark.ink/guides/mcp-server",
    );
  }
  return { Authorization: `Bearer ${TOKEN}` };
}

async function apiError(response, fallback) {
  let detail = fallback;
  try {
    const body = await response.json();
    if (typeof body.detail === "string") detail = body.detail;
    else if (body.detail) detail = JSON.stringify(body.detail);
  } catch {
    /* ignore */
  }
  if (response.status === 401) {
    throw new Error("Unauthorized — refresh UNMARK_BEARER_TOKEN.");
  }
  if (response.status === 402) {
    throw new Error("Out of credits — add more at https://www.unmark.ink/account");
  }
  throw new Error(detail);
}

async function submitImage(filePath) {
  const data = await readFile(filePath);
  const name = basename(filePath);
  const form = new FormData();
  form.append("image", new Blob([new Uint8Array(data)]), name);
  form.append("quality", "fast");

  const response = await fetch(`${API_URL}/v1/remove-watermark`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  if (!response.ok) await apiError(response, "Failed to start cleanup.");
  return response.json();
}

async function getJob(jobId) {
  const response = await fetch(`${API_URL}/v1/jobs/${encodeURIComponent(jobId)}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!response.ok) await apiError(response, "Failed to read job status.");
  return response.json();
}

async function pollJob(jobId) {
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    const job = await getJob(jobId);
    if (job.status === "completed") return job;
    if (job.status === "failed") {
      throw new Error(job.error || `Job ${jobId} failed.`);
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  throw new Error(`Timed out waiting for job ${jobId}.`);
}

async function downloadResult(job, outputPath) {
  let bytes;
  if (job.result_url) {
    const remote = await fetch(job.result_url);
    if (remote.ok) {
      bytes = Buffer.from(await remote.arrayBuffer());
    }
  }
  if (!bytes) {
    const fileRes = await fetch(
      `${API_URL}/v1/jobs/${encodeURIComponent(job.job_id)}/file`,
      { headers: authHeaders() },
    );
    if (!fileRes.ok) await apiError(fileRes, "Failed to download cleaned file.");
    bytes = Buffer.from(await fileRes.arrayBuffer());
  }
  await mkdir(resolve(outputPath, ".."), { recursive: true });
  await writeFile(outputPath, bytes);
}

function cleanedName(inputPath) {
  const ext = extname(inputPath) || ".png";
  const stem = basename(inputPath, ext);
  return `${stem}-clean${ext}`;
}

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && IMAGE_EXTS.has(extname(entry.name).toLowerCase()))
    .map((entry) => join(dir, entry.name));
}

async function cleanOne(inputPath, outputPath) {
  const queued = await submitImage(inputPath);
  const done = await pollJob(queued.job_id);
  await downloadResult(done, outputPath);
  return {
    input: inputPath,
    output: outputPath,
    job_id: done.job_id,
    result_url: done.result_url || null,
  };
}

function isDirectRun() {
  if (!process.argv[1]) return false;
  return resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

async function main(argv = process.argv.slice(2)) {
  const { values, positionals } = parseArgs({
    args: argv,
    options: {
      output: { type: "string" },
      "out-dir": { type: "string" },
      json: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    process.stdout.write(usage());
    return values.help ? 0 : 1;
  }

  const command = positionals[0];
  if (command !== "remove") {
    throw new Error(`Unknown command "${command}".\n${usage()}`);
  }

  const input = positionals[1];
  if (!input) throw new Error(`Missing input path.\n${usage()}`);

  const inputPath = resolve(input);
  const info = await stat(inputPath);
  const results = [];

  if (info.isDirectory()) {
    const outDir = values["out-dir"];
    if (!outDir) {
      throw new Error("Directory input requires --out-dir <folder>.");
    }
    const destRoot = resolve(outDir);
    await mkdir(destRoot, { recursive: true });
    const files = await listImages(inputPath);
    if (files.length === 0) {
      throw new Error(`No PNG, JPG, or WebP files in ${inputPath}`);
    }
    for (const file of files) {
      results.push(await cleanOne(file, join(destRoot, cleanedName(file))));
    }
  } else {
    if (!IMAGE_EXTS.has(extname(inputPath).toLowerCase())) {
      throw new Error("Input must be a PNG, JPG, or WebP file.");
    }
    const output = values.output;
    if (!output) {
      throw new Error("File input requires --output <file>.");
    }
    results.push(await cleanOne(inputPath, resolve(output)));
  }

  if (values.json) {
    process.stdout.write(`${JSON.stringify({ ok: true, results }, null, 2)}\n`);
  } else {
    for (const item of results) {
      process.stdout.write(`${item.output}\n`);
    }
  }
  return 0;
}

if (isDirectRun()) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`${message}\n`);
      process.exitCode = 1;
    });
}
