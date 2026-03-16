---
title: "Recipe: Pre-Commit Linting Hook"
slug: recipe-pre-commit-hook
order: 3
description: "End-to-end walkthrough: enforce code quality with a hook"
section: guides
---

# Recipe: Pre-Commit Linting Hook

## What You Will Build

A **pre-commit hook** that runs ESLint on staged files before Claude commits code. If linting fails, the commit is blocked and Claude sees the errors -- then automatically fixes them and retries. This creates a quality gate that enforces your coding standards without manual intervention.

Hooks are event-driven commands that Claude executes at specific points in its workflow. The `PreCommit` hook fires just before a `git commit`, giving you a chance to validate changes.

## Prerequisites

- Claude Code installed and working in your project
- ESLint configured in your project (`npx eslint --version` should work)
- Basic familiarity with [Hooks](topics/hooks.html) concepts

## Step 1: Understand the Hook Lifecycle

When Claude commits code, the following happens:

1. Claude stages files with `git add`.
2. The `PreCommit` hook fires with the list of staged files.
3. Your hook command runs (e.g., ESLint) on the matched files.
4. If the command exits 0, the commit proceeds.
5. If the command exits non-zero, the commit is blocked and Claude receives the error output.

Claude can then read the linting errors, fix the code, re-stage, and retry the commit -- all automatically.

## Step 2: Configure the Hook

Add the hook to your project's `.claude/settings.json`:

```json
{
  "hooks": {
    "PreCommit": [
      {
        "matcher": "**/*.{js,ts,jsx,tsx}",
        "command": "npx eslint --no-warn-ignored ${files}",
        "description": "Lint staged JS/TS files before commit"
      }
    ]
  }
}
```

How this works:

- **matcher** -- A glob pattern that filters which staged files trigger this hook. Only JS/TS files will be linted.
- **command** -- The shell command to run. `${files}` is replaced with the space-separated list of matched staged files.
- **description** -- Shown in Claude's output so you know which hook is running.

You can add multiple hooks to the `PreCommit` array. They run in order, and all must pass for the commit to proceed.

## Step 3: Test the Hook

Create a file with a deliberate linting error:

```javascript
// test-lint-error.js
const unused = "this variable is never used";

console.log("hello world")
```

Then ask Claude to commit it:

```bash
claude "add test-lint-error.js and commit it with message 'test hook'"
```

You should see:

1. Claude stages the file.
2. The PreCommit hook fires and runs ESLint.
3. ESLint reports the `no-unused-vars` error.
4. The commit is blocked.

## Step 4: Handle Failures Gracefully

When the hook blocks a commit, Claude does not just stop. It reads the ESLint output and takes action:

1. Claude sees the specific errors (line numbers, rule names).
2. It edits the file to fix the violations.
3. It re-stages the fixed file.
4. It retries the commit.
5. The hook runs again on the fixed file -- this time it passes.

This block-then-fix loop is the key value of hooks: Claude enforces your standards *and* resolves violations in the same workflow.

If you want the hook to only warn (not block), change the ESLint config to use `warn` severity instead of `error` for those rules, or use a command that always exits 0:

```json
{
  "matcher": "**/*.{js,ts}",
  "command": "npx eslint --no-warn-ignored ${files} || true",
  "description": "Lint staged files (warnings only, never blocks)"
}
```

## Verify It Works

Your hook is working correctly when:

- Committing a file with linting errors triggers the hook and blocks the commit.
- Claude's output shows the hook name and the ESLint errors.
- Claude automatically fixes the errors and retries.
- The second commit attempt succeeds with clean code.
- Committing files that do not match the `**/*.{js,ts,jsx,tsx}` pattern (e.g., `.md` files) skips the hook entirely.

## Next Steps

- Read the [Hooks reference](topics/hooks.html) for all event types (`PreCommit`, `PostCommit`, `PreToolUse`, `PostToolUse`, and more).
- See [Settings](topics/settings.html) for where to place hook configuration in the settings hierarchy.
- Add more hooks: format with Prettier on `PreCommit`, run tests on `PostCommit`, validate branch names.
- Combine with a [deployment skill](topics/recipe-deployment-skill.html) to ensure clean code before deploying.
