#!/usr/bin/env node
/**
 * Dynamic lint-staged script for monorepo.
 * Detects workspace from file paths, runs workspace-specific lint/format/tsc.
 */
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";

const rawFiles = process.argv.slice(2);
if (rawFiles.length === 0) process.exit(0);

// Get repo root to convert absolute paths to relative
const repoRoot = process.cwd();

// Convert absolute paths to relative paths from repo root
const files = rawFiles.map((f) => {
  if (path.isAbsolute(f)) {
    return path.relative(repoRoot, f);
  }
  return f;
});

// Show staged files upfront (use stderr to bypass lint-staged output capture)
process.stderr.write("\n📋 Staged files:\n");
for (const file of files) {
  process.stderr.write(`   ${file}\n`);
}

// Group files by workspace
const workspaceFiles = new Map();

for (const file of files) {
  const parts = file.split("/");
  let workspace = null;

  if (parts[0] === "apps" && parts[1]) {
    workspace = `apps/${parts[1]}`;
  } else if (parts[0] === "packages" && parts[1]) {
    workspace = `packages/${parts[1]}`;
  } else if (
    parts[0] === "infrastructure" &&
    parts[1] === "functions" &&
    parts[2]
  ) {
    workspace = `infrastructure/functions/${parts[2]}`;
  }

  // Skip root-level files and generated clients
  if (!workspace) continue;
  if (workspace.includes("-service-client")) continue;

  if (!workspaceFiles.has(workspace)) {
    workspaceFiles.set(workspace, []);
  }
  workspaceFiles.get(workspace).push(file);
}

// Run checks per workspace
for (const [workspace, wsFiles] of workspaceFiles) {
  const pkgPath = path.join(workspace, "package.json");
  if (!existsSync(pkgPath)) continue;

  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const scripts = pkg.scripts || {};
  const wsName = pkg.name;

  // Convert file paths to be relative to workspace
  const relativeFiles = wsFiles.map((f) =>
    f.replace(`${workspace}/`, "")
  );
  const fileList = relativeFiles.map((f) => `"${f}"`).join(" ");

  process.stderr.write(`\n✔ Checking ${wsName}...\n`);
  process.stderr.write(`  Files: ${relativeFiles.join(", ")}\n`);

  // Run eslint on staged files (uses workspace's eslint config)
  if (scripts.lint) {
    try {
      execSync(`npx eslint --fix ${fileList}`, {
        stdio: "inherit",
        cwd: workspace,
      });
    } catch {
      process.exit(1);
    }
  }

  // Run prettier on staged files
  if (scripts.format) {
    try {
      execSync(`npx prettier --write ${fileList}`, {
        stdio: "inherit",
        cwd: workspace,
      });
    } catch {
      process.exit(1);
    }
  }

  // Run tsc on whole workspace (can't do individual files)
  if (scripts.tsc) {
    try {
      execSync(`npm run tsc -w ${wsName}`, { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  }
}

process.stderr.write("\n✔ All checks passed\n");
