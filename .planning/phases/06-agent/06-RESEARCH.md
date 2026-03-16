# Phase 6: Agent - Research

**Researched:** 2026-03-16
**Domain:** Claude Code custom agents, skill files, CLI agent invocation
**Confidence:** HIGH

## Summary

Phase 6 builds a custom Claude Code agent that users invoke with `claude --agent claude-ecosystem` to get expert answers about the 10 Claude Code extension points. The agent is a single markdown file (`.claude/agents/claude-ecosystem.md`) with YAML frontmatter and a comprehensive system prompt. It reads the project's `content/*.md` knowledge files as its static knowledge base, uses WebFetch/WebSearch tools for live documentation fetching, and reads the user's local project files (CLAUDE.md, .mcp.json, settings) for contextual recommendations.

The `--agent` flag (singular, introduced in v2.0.59) transforms the main Claude Code session into the specified agent persona. This is distinct from `--agents` (plural) which defines ephemeral subagents. When a user runs `claude --agent claude-ecosystem`, Claude Code loads the agent file, applies its system prompt, tool restrictions, and model configuration, then operates as that agent for the entire session.

**Primary recommendation:** Build a single `.claude/agents/claude-ecosystem.md` agent file with preloaded skills pointing to content knowledge, WebFetch/WebSearch for live docs, and Read/Grep/Glob for local project context analysis. The agent file itself contains the comprehensive system prompt; supplementary knowledge lives in skills that get preloaded via the `skills:` frontmatter field.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AGNT-01 | Agent invokable via `claude --agent claude-ecosystem` | Agent file at `.claude/agents/claude-ecosystem.md`; `--agent` flag verified in official docs |
| AGNT-02 | Agent answers ecosystem questions from static skill file knowledge | `skills:` frontmatter preloads skill content into agent context at startup |
| AGNT-03 | Agent covers all 10 extension points | 10 content markdown files exist in `content/`; each becomes a preloaded skill or referenced knowledge |
| AGNT-04 | Agent uses hybrid knowledge -- static base + live doc fetching | WebFetch and WebSearch are standard Claude Code tools; agent can use them when static knowledge is insufficient |
| AGNT-05 | Agent cites sources and points users to relevant doc pages | System prompt instructs citation behavior; agent knows site URL structure |
| AGNT-06 | Agent reads user's local project context | Read, Grep, Glob tools enable reading CLAUDE.md, .mcp.json, settings files |
| AGNT-07 | Agent provides guided setup workflows | System prompt includes step-by-step workflow templates for common tasks |
| AGNT-08 | Agent performs ecosystem health check / audit | System prompt defines audit checklist; Read/Glob tools scan project structure |
| AGNT-09 | Agent handles comparison questions with structured responses | System prompt includes comparison format templates |
</phase_requirements>

## Standard Stack

### Core

| Component | Version/Format | Purpose | Why Standard |
|-----------|---------------|---------|--------------|
| Agent file | `.claude/agents/claude-ecosystem.md` | Main agent definition | Official Claude Code agent file format |
| YAML frontmatter | Claude Code agent spec | Agent configuration (tools, model, skills, etc.) | Standard agent config mechanism |
| Markdown body | Free-form markdown | System prompt / instructions | Body becomes the agent's system prompt |
| Skills | `.claude/skills/*/SKILL.md` | Preloaded knowledge modules | `skills:` frontmatter loads full content at startup |

### Supporting

| Component | Purpose | When to Use |
|-----------|---------|-------------|
| WebFetch tool | Fetch live documentation from official URLs | When static knowledge is outdated or insufficient |
| WebSearch tool | Search for current ecosystem information | When user asks about recent changes or unknown topics |
| Read/Grep/Glob tools | Read user's local project files | For contextual recommendations and audit functionality |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Preloaded skills | Inline all knowledge in agent body | Agent body would be enormous (5500+ lines); skills separate concerns cleanly |
| Multiple agent files | Single comprehensive agent | One agent is simpler to maintain and invoke; internal routing handles topic switching |
| Plugin distribution | Direct file placement | Plugin adds packaging overhead; users can just copy the `.claude/` directory |

## Architecture Patterns

### Recommended Project Structure

```
.claude/
  agents/
    claude-ecosystem.md          # Main agent file (~200-300 lines system prompt)
  skills/
    ecosystem-mcp/
      SKILL.md                   # MCP knowledge (from content/mcp.md)
    ecosystem-skills/
      SKILL.md                   # Skills knowledge (from content/skills.md)
    ecosystem-plugins/
      SKILL.md                   # Plugins knowledge
    ecosystem-hooks/
      SKILL.md                   # Hooks knowledge
    ecosystem-agents/
      SKILL.md                   # Agents knowledge
    ecosystem-projects/
      SKILL.md                   # Projects knowledge
    ecosystem-connectors/
      SKILL.md                   # Connectors knowledge
    ecosystem-commands/
      SKILL.md                   # Commands knowledge
    ecosystem-memory/
      SKILL.md                   # Memory knowledge
    ecosystem-settings/
      SKILL.md                   # Settings knowledge
```

### Pattern 1: Agent with Preloaded Skills

**What:** The agent file declares `skills:` in frontmatter to preload topic-specific knowledge modules. Each skill contains the full knowledge for one extension point.

**When to use:** When the agent needs comprehensive domain knowledge available at startup without requiring tool calls to load it.

**How it works (from official docs):** "The full content of each skill is injected into the subagent's context, not just made available for invocation. Subagents don't inherit skills from the parent conversation; you must list them explicitly."

**Example:**
```yaml
---
name: claude-ecosystem
description: Expert guide to the Claude Code ecosystem -- MCP, Skills, Plugins, Hooks, Agents, Projects, Connectors, Commands, Memory, and Settings
skills:
  - ecosystem-mcp
  - ecosystem-skills
  - ecosystem-plugins
  - ecosystem-hooks
  - ecosystem-agents
  - ecosystem-projects
  - ecosystem-connectors
  - ecosystem-commands
  - ecosystem-memory
  - ecosystem-settings
model: sonnet
tools: Read, Grep, Glob, Bash, WebFetch, WebSearch, Agent
maxTurns: 50
---

# Claude Ecosystem Guide Agent

You are an expert on the Claude Code ecosystem...
```

**CRITICAL CONSTRAINT -- Context Budget:** All 10 content files total ~5,534 lines / ~200KB of markdown. When preloaded as skills, the full content of each skill is injected into the agent's context at startup. This could consume a significant portion of the context window. Two mitigation strategies:

1. **Condensed skills:** Create condensed versions of each topic (~100-150 lines each) focusing on the most essential information, with instructions to use WebFetch for the full docs site when deeper detail is needed.
2. **Selective preloading:** Only preload the most commonly needed skills (MCP, Skills, Agents, Settings) and use Read tool to load others on demand from the content/ directory.

**Recommendation:** Use condensed skills. 10 skills at ~100-150 lines each = ~1,000-1,500 lines total, which fits comfortably in context while covering all topics.

### Pattern 2: Hybrid Knowledge (Static + Live)

**What:** The agent uses preloaded skill content as its primary knowledge base, and falls back to WebFetch/WebSearch when the static knowledge is insufficient or when the user asks about very recent changes.

**When to use:** Always -- this is the core architecture for AGNT-04.

**Example system prompt pattern:**
```markdown
## Knowledge Sources (Priority Order)

1. **Preloaded skills** -- Your primary knowledge base. Use this FIRST for all questions.
2. **Local content files** -- Read from `content/*.md` for detailed reference when skills lack depth.
3. **Official docs** -- Use WebFetch to fetch from https://code.claude.com/docs/en/ for the latest information.
4. **Web search** -- Use WebSearch as a last resort for community patterns or very recent changes.

Always cite your source: "[From preloaded knowledge]", "[From official docs: URL]", or "[From web search]".
```

### Pattern 3: Local Project Context Analysis

**What:** The agent reads the user's local project files to provide contextual recommendations.

**When to use:** For AGNT-06 (contextual recommendations) and AGNT-08 (ecosystem audit).

**Files to scan:**
```
CLAUDE.md                          # Project instructions
.claude/settings.json              # Project settings
.claude/settings.local.json        # Local settings
.claude/skills/*/SKILL.md          # Custom skills
.claude/agents/*.md                # Custom agents
.claude/commands/*.md              # Legacy commands
.mcp.json                          # MCP server configuration
~/.claude/CLAUDE.md                # User-level instructions
~/.claude/settings.json            # User settings
```

### Pattern 4: Structured Comparison Responses

**What:** Template for handling "what's the difference between X and Y?" questions.

**When to use:** For AGNT-09.

**System prompt template:**
```markdown
## Comparison Questions

When asked to compare extension points, use this format:

### [X] vs [Y]

| Dimension | [X] | [Y] |
|-----------|-----|-----|
| Purpose | ... | ... |
| Context | ... | ... |
| Invocation | ... | ... |
| Best for | ... | ... |

**Use [X] when:** [specific scenarios]
**Use [Y] when:** [specific scenarios]
**Use both together when:** [if applicable]
```

### Anti-Patterns to Avoid

- **Massive inline system prompt:** Do not embed all 5,500 lines of knowledge directly in the agent markdown body. Use skills for knowledge, keep the agent body focused on behavior/persona instructions.
- **No source citation:** The agent must always indicate where information came from (preloaded knowledge, live docs, web search). Without this, users cannot verify accuracy.
- **Ignoring local context:** When the user has a project with existing Claude Code config, the agent should proactively mention relevant local setup rather than giving generic advice.
- **Over-reliance on live fetching:** WebFetch/WebSearch add latency. The preloaded skills should cover 90%+ of questions. Live fetching is for edge cases and currency verification.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Knowledge storage | Custom database or file format | Claude Code skills (SKILL.md) | Built-in preloading mechanism; official format |
| Agent invocation | Custom CLI wrapper | `claude --agent` flag | Native Claude Code feature |
| Live doc fetching | Custom scraping scripts | WebFetch/WebSearch tools | Built-in Claude Code tools with caching |
| Project scanning | Custom file walker | Read/Grep/Glob tools | Native Claude Code tools, permission-aware |
| Comparison formatting | Custom templating | Markdown tables in system prompt | Claude generates markdown natively |

**Key insight:** The entire agent is a configuration artifact -- a markdown file and skill files. There is zero application code to write. The "implementation" is entirely prompt engineering and knowledge curation.

## Common Pitfalls

### Pitfall 1: Context Window Exhaustion from Preloaded Skills

**What goes wrong:** Loading all 10 topic files as full skills consumes too much context, leaving insufficient room for the conversation.
**Why it happens:** Each content file is 100-700 lines. Total is ~5,500 lines.
**How to avoid:** Create condensed skill versions (~100-150 lines each) focused on the most essential information. Include pointers to the full content files for deep dives.
**Warning signs:** Agent starts forgetting early instructions or giving truncated responses.

### Pitfall 2: Agent File Not Found

**What goes wrong:** `claude --agent claude-ecosystem` fails with "agent not found."
**Why it happens:** File not at the expected path, wrong filename, or running from outside the project.
**How to avoid:** Ensure file is at `.claude/agents/claude-ecosystem.md`. The filename minus `.md` must match the agent name used in `--agent`. For cross-project use, place at `~/.claude/agents/`.
**Warning signs:** Error message when invoking.

### Pitfall 3: Skills Not Preloading

**What goes wrong:** Agent starts without topic knowledge despite `skills:` being configured.
**Why it happens:** Skill names in frontmatter don't match actual skill directory names, or skills are in wrong location.
**How to avoid:** Skill name in `skills:` list must exactly match the directory name under `.claude/skills/`. Verify with `/agents` command.
**Warning signs:** Agent responds with generic knowledge instead of specific ecosystem details.

### Pitfall 4: Stale Knowledge vs Live Docs

**What goes wrong:** Agent gives outdated information because static skills aren't updated.
**Why it happens:** Claude Code ecosystem evolves rapidly; skill content becomes stale.
**How to avoid:** Include instructions in system prompt to verify with live docs when the user asks about specific version numbers, release dates, or "latest" features. Static skills cover concepts; live fetching covers currency.
**Warning signs:** Users report incorrect version numbers or deprecated features.

### Pitfall 5: Missing Tool Access

**What goes wrong:** Agent cannot read local files or fetch web content.
**Why it happens:** `tools:` field in frontmatter is too restrictive, omitting needed tools.
**How to avoid:** Ensure tools list includes: Read, Grep, Glob, Bash, WebFetch, WebSearch. If using `disallowedTools` instead of `tools`, only block Write/Edit (the agent should not modify the user's files).
**Warning signs:** Agent says "I can't read that file" or "I don't have web access."

### Pitfall 6: Skill Description Budget Exceeded

**What goes wrong:** In normal (non-preloaded) mode, too many skill descriptions exceed the 2% context budget and some skills are excluded.
**Why it happens:** The ecosystem agent has 10+ skills. The description budget is 2% of context window (~16,000 chars fallback).
**How to avoid:** This is not an issue when skills are preloaded via the agent's `skills:` field -- preloaded skills inject full content regardless of the description budget. The budget only applies to auto-discovery in the main session.
**Warning signs:** Not applicable when using preloaded skills.

## Code Examples

### Minimal Agent File (Verified Pattern)

```yaml
# Source: https://code.claude.com/docs/en/sub-agents
---
name: claude-ecosystem
description: Expert guide to the Claude Code ecosystem. Answers questions about MCP, Skills, Plugins, Hooks, Agents, Projects, Connectors, Commands, Memory, and Settings.
tools: Read, Grep, Glob, Bash, WebFetch, WebSearch
model: sonnet
maxTurns: 50
skills:
  - ecosystem-mcp
  - ecosystem-skills
  - ecosystem-plugins
  - ecosystem-hooks
  - ecosystem-agents
  - ecosystem-projects
  - ecosystem-connectors
  - ecosystem-commands
  - ecosystem-memory
  - ecosystem-settings
---

# Claude Ecosystem Guide

You are an expert on the Claude Code ecosystem...
```

### Skill File Format (Verified Pattern)

```yaml
# Source: https://code.claude.com/docs/en/skills
---
name: ecosystem-mcp
description: Knowledge about MCP (Model Context Protocol) servers in Claude Code
user-invocable: false
disable-model-invocation: true
---

# MCP Servers and Connectors

[Condensed knowledge content here...]
```

Note: Skills preloaded by an agent via `skills:` are injected regardless of `disable-model-invocation` and `user-invocable` settings. Those settings only affect auto-discovery in the main session. Setting them prevents the skills from cluttering the user's normal `/` menu and auto-invocation when not using the agent.

### Agent Invocation (Verified Pattern)

```bash
# Source: https://code.claude.com/docs/en/sub-agents
# Invoke the agent -- transforms main session into this agent
claude --agent claude-ecosystem

# Invoke with an initial question
claude --agent claude-ecosystem "What's the difference between skills and agents?"

# Can also set as default agent in settings.json
# {"agent": "claude-ecosystem"}
```

### Local Project Context Reading

```markdown
# System prompt section for project analysis

## Reading the User's Project Context

When the user asks about their setup or requests an audit:

1. Check for CLAUDE.md files:
   - Read `CLAUDE.md` in the project root
   - Read `.claude/CLAUDE.md` if it exists
   - Note any instructions or conventions

2. Check MCP configuration:
   - Read `.mcp.json` for configured MCP servers
   - Verify server configurations look correct

3. Check settings:
   - Read `.claude/settings.json` for project settings
   - Read `.claude/settings.local.json` for local overrides
   - Note permission rules, hooks, and custom configurations

4. Check for skills and agents:
   - List `.claude/skills/*/SKILL.md` files
   - List `.claude/agents/*.md` files
   - List `.claude/commands/*.md` files (legacy)

5. Provide contextual recommendations based on what you find.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `Task` tool for subagents | `Agent` tool (Task still works as alias) | v2.1.63 | Renamed for clarity; existing Task refs still work |
| No `--agent` flag | `--agent` transforms main session | v2.0.59 | Enables running entire session as a custom agent |
| Skills and commands separate | Commands merged into skills | 2026 | `.claude/commands/` still works but skills are preferred |
| No agent memory | `memory:` field in agent frontmatter | v2.0+ | Agents can persist knowledge across sessions |
| No agent teams | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | Experimental | Multiple agents coordinating via shared task lists |

**Deprecated/outdated:**
- `.claude/commands/` directory: Still works but superseded by `.claude/skills/` with more features
- `Task` tool name: Renamed to `Agent` in v2.1.63; `Task(...)` still works as alias
- `allowed-tools` vs `tools`: Official docs now use `tools` field name in agent frontmatter

## Open Questions

1. **Context budget with 10 preloaded skills**
   - What we know: Full skill content is injected at startup. Total content is ~5,500 lines / ~200KB.
   - What's unclear: Exact context consumption vs. available window. The 2% description budget does not apply to preloaded skills, but total injected content still counts.
   - Recommendation: Create condensed skill versions (~100-150 lines each). Test with full preload first; if context issues arise, further condense or selectively preload.

2. **WebFetch/WebSearch tool availability with --agent**
   - What we know: These are standard Claude Code tools. Agent `tools:` field can include them.
   - What's unclear: Whether WebFetch/WebSearch require any special permissions or API keys.
   - Recommendation: Include them in the tools list; test during implementation. They should work as standard tools.

3. **Skill preloading with --agent vs subagent context**
   - What we know: Official docs describe skill preloading for subagents. `--agent` transforms the main session.
   - What's unclear: Whether `skills:` field works identically when the agent runs as main session vs as a subagent.
   - Recommendation: Test during implementation. The agent file format is the same; behavior should be consistent.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in test runner |
| Config file | None (inline in package.json scripts) |
| Quick run command | `node --test tests/test-build.js` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AGNT-01 | Agent file exists at correct path with valid frontmatter | unit | `node --test tests/test-agent.js::agent-file-exists` | No -- Wave 0 |
| AGNT-02 | Agent has skills: field listing all 10 topic skills | unit | `node --test tests/test-agent.js::skills-configured` | No -- Wave 0 |
| AGNT-03 | All 10 skill files exist with valid SKILL.md | unit | `node --test tests/test-agent.js::all-skills-exist` | No -- Wave 0 |
| AGNT-04 | Agent tools include WebFetch and WebSearch | unit | `node --test tests/test-agent.js::tools-configured` | No -- Wave 0 |
| AGNT-05 | System prompt includes citation instructions | unit | `node --test tests/test-agent.js::citation-instructions` | No -- Wave 0 |
| AGNT-06 | System prompt includes project context reading instructions | unit | `node --test tests/test-agent.js::project-context` | No -- Wave 0 |
| AGNT-07 | System prompt includes setup workflow templates | unit | `node --test tests/test-agent.js::setup-workflows` | No -- Wave 0 |
| AGNT-08 | System prompt includes audit checklist | unit | `node --test tests/test-agent.js::audit-checklist` | No -- Wave 0 |
| AGNT-09 | System prompt includes comparison format template | unit | `node --test tests/test-agent.js::comparison-format` | No -- Wave 0 |

### Sampling Rate

- **Per task commit:** `node --test tests/test-agent.js`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/test-agent.js` -- Agent file validation, skill existence checks, frontmatter parsing, system prompt content verification
- [ ] `.claude/agents/claude-ecosystem.md` -- The agent file itself
- [ ] `.claude/skills/ecosystem-*/SKILL.md` -- 10 topic skill files
- [ ] Framework install: None needed -- uses existing Node.js test runner and `gray-matter` dependency

## Sources

### Primary (HIGH confidence)

- [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents) -- Complete agent file format, frontmatter fields, invocation patterns, skill preloading, memory, hooks, all configuration
- [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills) -- Skill file format, SKILL.md structure, frontmatter fields, discovery mechanism, preloading behavior

### Secondary (MEDIUM confidence)

- [claudelog.com -- what-is-agent-flag-in-claude-code](https://claudelog.com/faqs/what-is-agent-flag-in-claude-code/) -- `--agent` (singular) vs `--agents` (plural) distinction, v2.0.59 introduction
- [wmedia.es -- claude-code-create-custom-agents](https://wmedia.es/en/tips/claude-code-create-custom-agents) -- `--agent` flag transforms main session
- [threads.com/@boris_cherny](https://www.threads.com/@boris_cherny/post/DUoX5EUkm7Q/) -- Agent field in settings.json, `--agent` flag override

### Tertiary (LOW confidence)

- None -- all critical claims verified against official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Agent file format and skill preloading verified against official docs
- Architecture: HIGH -- Patterns derived from official documentation examples
- Pitfalls: HIGH -- Context budget concern is real and documented; other pitfalls from direct experience patterns
- Tool availability: MEDIUM -- WebFetch/WebSearch assumed available as standard tools; needs implementation verification

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable -- agent file format is well-established)
