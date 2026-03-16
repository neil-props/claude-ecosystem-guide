---
title: "Comparisons"
slug: comparisons
order: 2
description: "Side-by-side comparison of similar Claude Code extension points"
section: tools
---

# Comparisons

Several Claude Code extension points have overlapping capabilities. These tables help you understand the differences and choose the right one for your situation.

## Skill vs Agent vs Command

These three extension points all let you give Claude reusable instructions, but they differ in complexity, isolation, and how they are invoked.

| Aspect | Skill | Agent | Command |
|--------|-------|-------|---------|
| **What it is** | Markdown instructions with frontmatter | Dedicated agent file with system prompt | Slash command shortcut |
| **Complexity** | Low -- just a markdown file | Medium -- needs agent config | Low -- simple prompt template |
| **Reusability** | High -- works across Code/Chat/Cowork | Medium -- Code only | Low -- project-specific |
| **Auto-invoked?** | Yes, via progressive disclosure | No, explicit `--agent` flag | No, explicit `/command` |
| **Best for** | Repeatable processes, domain expertise | Complex multi-step workflows | Quick prompt shortcuts |
| **Can use tools?** | Yes, via `allowed-tools` frontmatter | Yes, full tool access | No direct tool access |
| **File format** | `.claude/skills/SKILL.md` | `.claude/agents/agent-name.md` | `.claude/commands/cmd-name.md` |
| **Distribution** | Git repo or plugin | Git repo or plugin | Git repo only |
| **Context isolation** | No (unless `context: fork`) | Yes, separate context window | No |
| **Persistent memory** | No | Yes, agent memory file | No |

## MCP vs Plugin vs Connector

These three are all ways to extend Claude with external capabilities, but they serve different purposes and audiences.

| Aspect | MCP Server | Plugin | Connector |
|--------|-----------|--------|-----------|
| **What it is** | External process providing tools via protocol | Bundle of skills, hooks, MCP configs, agents | Pre-built one-click integration |
| **Setup complexity** | Medium -- configure server in `.mcp.json` | Low -- install via plugin registry | Very low -- enable in settings |
| **Who builds it** | Developers | Developers | Anthropic and partners |
| **Scope** | Project (`.mcp.json`) or user | Project or global | User account |
| **Transport** | stdio or HTTP/SSE | File-based (installed to `.claude/plugins/`) | Cloud-hosted |
| **Best for** | Custom tool integrations, API access | Distributing packaged workflows | Quick access to popular services |
| **Example use case** | Connect to your company database | Share a full dev workflow bundle | Use GitHub, Slack, Jira in Chat |
| **Where it works** | Code, Chat, Cowork | Code, Cowork | Chat only |

## Hook vs Skill (for automation)

Both Hooks and Skills can automate behavior, but they differ fundamentally in how they trigger and execute.

| Aspect | Hook | Skill |
|--------|------|-------|
| **Trigger mechanism** | Lifecycle event (automatic) | Claude's judgment (on-demand) |
| **Execution** | Runs external command/script | Inline instructions Claude follows |
| **Configuration** | `settings.json` hooks section | `.claude/skills/SKILL.md` file |
| **Use case** | Enforce rules, auto-lint, notifications | Teach processes, domain expertise |
| **Can block Claude?** | Yes -- pre-tool hooks can reject actions | No -- skills are advisory |
| **Deterministic?** | Yes -- always fires at the event | No -- Claude decides relevance |
| **Example** | Auto-format code after every edit | Guide Claude through deployment steps |
| **Requires external tool?** | Yes -- runs a command (script, binary) | No -- pure markdown instructions |

## Still not sure?

Try the [Decision Wizard](decision-wizard.html) -- answer a few questions and get a personalized recommendation.
