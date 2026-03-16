---
title: Agents
slug: agents
order: 5
description: Create specialized AI workflows with custom instructions and tools
color: "#4ade80"
section: topics
---

# Agents

## Overview

Agents are specialized Claude Code configurations that combine custom instructions, specific tool access, and defined workflows into reusable AI assistants. An agent can be a code reviewer, a documentation writer, a test generator, or any other focused role. Agents are defined as markdown files and invoked via the CLI.

Agents are the right choice when you need Claude to take on a specific persona with constrained capabilities and clear objectives.

## Quick Example

Create an agent file at `.claude/agents/reviewer.md`:

```markdown
# Code Reviewer Agent

You are a code reviewer. Review the provided code changes for:
- Security vulnerabilities
- Performance issues
- Code style violations
- Missing error handling

Use the Read tool to examine files. Never modify code directly.
Output your review as a structured markdown report.
```

Then invoke it:

```bash
claude --agent reviewer "Review the changes in src/auth/"
```

## Coming Soon

Full content including agent file format, tool restrictions, prompt engineering patterns, and agent vs skill comparison will be added in Phases 2-4.
