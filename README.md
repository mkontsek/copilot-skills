# @martin/copilot-skills

Source-of-truth repository for shared GitHub Copilot skills distributed as a Git dependency.

## What this repo provides

- A reusable `.github/skills/` directory with shared instruction files.
- A CLI script (`install-copilot-skills`) that syncs those files into `.github/skills` in consumer repos.
- A simple update workflow: bump the dependency ref and re-run install.

## Usage in another repo

1. Add this repository as a dev dependency:

```bash
pnpm add -D github:martinkontsek/copilot-skills#main
```

2. Wire a `postinstall` script in the consumer repo:

```json
{
  "devDependencies": {
    "@martin/copilot-skills": "github:martinkontsek/copilot-skills#main"
  },
  "scripts": {
    "postinstall": "install-copilot-skills"
  }
}
```

3. After install, files from this package's `.github/skills/` folder are copied to:

```text
.github/skills/
```

GitHub Copilot reads instruction files under `.github/skills` and applies them when generating and reviewing code.

4. Commit `.github/skills` in each consumer repo.

This ensures Copilot on GitHub and all contributors share the same instructions. The installer is an update mechanism, not a runtime dependency.

## Local development

```bash
pnpm install
pnpm test
```

`pnpm test` runs the installer in `--dry-run` mode for a quick sanity check.
