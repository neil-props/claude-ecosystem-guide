---
title: "Recipe: Build a Custom Agent"
slug: recipe-custom-agent
order: 4
description: "End-to-end walkthrough: create a specialized agent for your team"
section: guides
---

# Recipe: Build a Custom Agent

## What You Will Build

A **code review agent** that team members invoke to get thorough, structured PR reviews. When someone runs `claude --agent code-reviewer "Review PR #42"`, the agent checks out the branch, reviews every changed file, and produces a written summary covering bugs, security issues, and style violations.

Agents are markdown files that define a specialized persona and workflow for Claude. Unlike skills (which are short instruction sets), agents provide a complete system prompt that shapes how Claude approaches an entire task.

## Prerequisites

- Claude Code installed
- A Git repository with pull requests to review
- GitHub CLI (`gh`) installed (for PR checkout) or manual branch switching
- Basic familiarity with [Agents](topics/agents.html) concepts

## Step 1: Create the Agent File

Agent files live in `.claude/agents/` in your project root. Each file defines one agent.

```bash
mkdir -p .claude/agents
touch .claude/agents/code-reviewer.md
```

Your project structure:

```plaintext
my-app/
  .claude/
    agents/
      code-reviewer.md    <-- your new agent
  src/
  package.json
```

## Step 2: Write the Agent Prompt

Open `.claude/agents/code-reviewer.md` and write the full agent definition. The file content becomes Claude's system prompt when the agent is invoked.

```markdown
---
name: code-reviewer
description: Performs thorough code reviews on pull requests
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# Code Review Agent

You are a senior code reviewer. When given a PR number or branch name,
perform a thorough review following this process.

## Review Process

### 1. Gather Context

- Check out the PR branch: `gh pr checkout <number>`
- List all changed files: `gh pr diff --name-only`
- Read the PR description: `gh pr view <number>`

### 2. Review Each File

For every changed file, check for:

**Bugs**
- Null/undefined access without guards
- Off-by-one errors in loops or slices
- Race conditions in async code
- Resource leaks (unclosed connections, file handles)

**Security**
- User input used without sanitization
- SQL injection vectors
- Secrets or credentials in code
- Missing authentication or authorization checks

**Style**
- Functions longer than 50 lines
- Deeply nested conditionals (3+ levels)
- Magic numbers without named constants
- Missing or misleading comments

### 3. Write the Review

Produce a structured review with these sections:

#### Summary
One paragraph describing the overall change and its quality.

#### Issues Found
A numbered list, each with:
- **Severity**: Critical / Warning / Suggestion
- **File**: path and line number
- **Description**: what the issue is
- **Fix**: how to resolve it

#### Positive Notes
Call out well-written code, good patterns, and thoughtful design.

#### Verdict
One of: APPROVE, REQUEST_CHANGES, or NEEDS_DISCUSSION.
```

## Step 3: Understand the Agent Format

The agent file has two parts:

- **Frontmatter** (between `---` markers) -- Metadata that tells Claude which tools the agent can use and how to identify it.
  - `name` -- The identifier you use on the command line.
  - `description` -- Shown when listing agents.
  - `allowed-tools` -- Restricts tools to only what the agent needs. The code reviewer needs `Bash` for git commands, `Read` to view files, and `Grep`/`Glob` to search the codebase.

- **Body** (the markdown below the frontmatter) -- The system prompt Claude follows. Write this as direct instructions: what to do, in what order, and how to format the output.

## Step 4: Invoke the Agent

Run the agent from your project directory:

```bash
claude --agent code-reviewer "Review PR #42"
```

Claude will:

1. Load the `code-reviewer.md` agent prompt.
2. Use `gh pr checkout 42` to switch to the PR branch.
3. Read every changed file.
4. Produce a structured review following your template.

You can also pass context:

```bash
claude --agent code-reviewer "Review PR #42, focus on the auth changes"
```

## Step 5: Customize for Your Team

Add team-specific rules to the agent body. For example:

```markdown
## Team Standards

- All API endpoints must have JSDoc comments.
- Database queries must use parameterized statements (no string interpolation).
- React components must have PropTypes or TypeScript interfaces.
- Test coverage must not decrease (check with `npm run coverage`).
- No `console.log` in production code (use the logger utility).

## Forbidden Patterns

Flag these immediately as Critical issues:
- `eval()` or `new Function()`
- `dangerouslySetInnerHTML` without sanitization
- `// TODO` or `// FIXME` in new code (must be resolved before merge)
- Direct database access outside the repository layer
```

These rules make the agent enforce your specific coding standards, not just generic best practices.

## Verify It Works

Your agent is working correctly when:

- Running `claude --agent code-reviewer "Review PR #42"` produces a structured review.
- The review covers all changed files, not just the first one.
- Issues include file paths and line numbers.
- The verdict section gives a clear APPROVE, REQUEST_CHANGES, or NEEDS_DISCUSSION.
- Team-specific rules are enforced (if you added them).

## Next Steps

- Read the [Agents reference](topics/agents.html) for all agent configuration options and invocation patterns.
- Explore [Skills](topics/skills.html) for simpler, trigger-based instructions that do not need a full agent prompt.
- Build more agents: `security-auditor`, `documentation-writer`, `migration-helper`.
- Combine with [hooks](topics/hooks.html) to automatically trigger a review agent on PR creation.
