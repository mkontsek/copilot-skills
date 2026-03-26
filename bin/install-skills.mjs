#!/usr/bin/env node

import { mkdir, readdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.resolve(__dirname, "../.github");
const dst = path.resolve(process.cwd(), ".github");
const dryRun = process.argv.includes("--dry-run");

async function copyDirectoryRecursive(sourceDir, destinationDir) {
  await mkdir(destinationDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectoryRecursive(sourcePath, destinationPath);
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] copy ${path.relative(process.cwd(), sourcePath)} -> ${path.relative(process.cwd(), destinationPath)}`);
      continue;
    }

    await mkdir(path.dirname(destinationPath), { recursive: true });
    await copyFile(sourcePath, destinationPath);
    console.log(`Copied ${path.relative(process.cwd(), destinationPath)}`);
  }
}

async function main() {
  console.log(`${dryRun ? "[dry-run] " : ""}Installing Copilot skills to .github/skills`);

  await mkdir(dst, { recursive: true });
  await copyDirectoryRecursive(src, dst);

  console.log(`${dryRun ? "[dry-run] " : ""}Copilot skills installation complete`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to install Copilot skills: ${message}`);
  process.exitCode = 1;
});
