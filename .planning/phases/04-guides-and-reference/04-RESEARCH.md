# Phase 4: Guides and Reference - Research

**Researched:** 2026-03-16
**Domain:** How-to guide writing and technical reference documentation for Claude Code extension points
**Confidence:** HIGH

## Summary

Phase 4 replaces the placeholder content in the How-To and Reference tab panels across all 10 topic pages with complete, actionable content. The existing tab infrastructure (CSS, JS, HTML-in-markdown pattern) is fully established from Phases 1.1 and 3. Each topic page already has `<div class="tab-panel" data-tab-panel="howto">` and `<div class="tab-panel" data-tab-panel="reference">` sections containing "[!INFO] coming in Phase 4" placeholders. The work is purely content authoring within these existing containers.

There are 18 requirements: 10 how-to guides (HOWT-01 through HOWT-10) and 8 technical reference specs (REFR-01 through REFR-08). The how-to guides must be complete start-to-finish walkthroughs with copy-pasteable code using realistic values. The reference specs must document complete config schemas with all fields, types, and validation rules. Content sources are the official Claude Code documentation at code.claude.com/docs, which has been fetched and verified for all major extension points (hooks, skills, subagents, plugins, settings, MCP).

A key decision from Phase 3 (noted in STATE.md): "Configuration sections kept in Concept tab for now, will move to Reference in Phase 4." This means some configuration content currently in the Concept tab should be migrated to Reference tabs where it fits better as a formal spec, while keeping the Concept tab's configuration sections as lighter overviews pointing to the Reference tab.

**Primary recommendation:** Split into 3 waves: Wave 1 covers MCP guides and references (HOWT-01 through HOWT-04, REFR-01, REFR-08 partial), Wave 2 covers extension point guides and references (HOWT-05 through HOWT-08, REFR-02 through REFR-05), Wave 3 covers project/settings guides and references (HOWT-09, HOWT-10, REFR-06 through REFR-08 partial). Each wave modifies content markdown files and rebuilds.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOWT-01 | How to set up an MCP server (stdio transport) | Official docs at code.claude.com/docs/en/mcp verified: `claude mcp add` CLI syntax, `.mcp.json` project config, env var expansion `${TOKEN}`. Guide walks through adding a stdio server, testing, and sharing via git. |
| HOWT-02 | How to set up an MCP server (SSE/streamable HTTP transport) | Official docs confirm: `claude mcp add --transport http name url` for remote servers. Streamable HTTP is the current standard replacing SSE. Guide covers remote server setup with auth headers. |
| HOWT-03 | How to configure MCP authentication | Official docs confirm OAuth 2.0 support, custom auth headers, env var expansion. Guide covers `${ENV_VAR}` syntax in `.mcp.json`, OAuth flow, and managed-mcp.json allowlists. |
| HOWT-04 | How to build your own MCP server | Official MCP SDK docs: TypeScript SDK `@modelcontextprotocol/sdk`. Guide walks through creating a minimal server with tool definitions, testing locally, and registering in Claude Code. |
| HOWT-05 | How to create a skill with correct frontmatter | Official docs verified: 10 frontmatter fields (name, description, argument-hint, disable-model-invocation, user-invocable, allowed-tools, model, context, agent, hooks). Name: max 64 chars, lowercase/hyphens. Description: max 1024 chars. Guide walks through creating project and personal skills. |
| HOWT-06 | How to create a plugin that bundles skills | Official plugins-reference verified: `.claude-plugin/plugin.json` manifest, directory structure with skills/, agents/, hooks/, .mcp.json. Guide walks through creating a plugin, testing with `claude --plugin-dir`, and distribution. |
| HOWT-07 | How to set up hooks for lifecycle events | Official docs verified: 24 hook events, 4 handler types (command, http, prompt, agent), matcher regex syntax, exit code 2 for blocking. Guide walks through adding hooks to settings.json with real examples. |
| HOWT-08 | How to create a custom agent | Official docs verified: `.claude/agents/name.md` format, 12 frontmatter fields, `claude --agent name` invocation, memory scopes. Guide walks through creating, testing, and sharing an agent. |
| HOWT-09 | How to configure CLAUDE.md for a project | Existing concept content covers hierarchy well. Guide walks through creating initial CLAUDE.md, adding .claude/rules/, using CLAUDE.local.md, and monorepo patterns. |
| HOWT-10 | How to use the memory system effectively | Existing concept content covers 4-layer architecture. Guide walks through setting up each layer, using /memory command, configuring agent memory, and debugging memory issues. |
| REFR-01 | MCP config schema (.mcp.json format, all fields) | Official docs verified: `mcpServers` object with server entries containing command, args, env, type fields. Also managed-mcp.json with allowedMcpServers/deniedMcpServers. 4 scopes documented. |
| REFR-02 | Skill frontmatter spec (all fields, validation rules) | Official docs verified all 10 fields with types, constraints, defaults. Name: max 64, lowercase/hyphens. Description: max 1024, no XML tags. String substitutions: $ARGUMENTS, $ARGUMENTS[N], $N, ${CLAUDE_SESSION_ID}, ${CLAUDE_SKILL_DIR}. |
| REFR-03 | Plugin manifest spec | Official plugins-reference verified: complete plugin.json schema with required (name only) and optional fields (version, description, author, homepage, repository, license, keywords, commands, agents, skills, hooks, mcpServers, outputStyles, lspServers). Auto-discovery behavior documented. |
| REFR-04 | Hook configuration spec (events, patterns, commands) | Official docs verified: 24 events with matcher support, blockable status. 4 handler types with full field specs. Exit code behavior per event. JSON output schemas for each event type. Complete matcher regex syntax. |
| REFR-05 | Agent file format spec | Official docs verified: 12 frontmatter fields (name, description, tools, disallowedTools, model, permissionMode, maxTurns, skills, mcpServers, hooks, memory, background, isolation). File locations with priority order. Memory scopes. |
| REFR-06 | Settings hierarchy resolution order (full detail) | Official docs verified: 5-level precedence (Managed > CLI > local > project > user). Scope locations for each OS. Permission modes (default, acceptEdits, dontAsk, bypassPermissions, plan). Complete allow/deny syntax. |
| REFR-07 | CLAUDE.md file format and loading order | Existing concept content covers hierarchy and loading behavior (UP/DOWN/SIBLING). Reference formalizes the loading order, merge semantics, @import syntax, and character limits. |
| REFR-08 | Environment variables reference | Official docs confirm 140+ env vars. Key vars: ANTHROPIC_MODEL, CLAUDE_CODE_EFFORT_LEVEL, CLAUDE_CODE_SUBAGENT_MODEL, CLAUDE_AUTOCOMPACT_PCT_OVERRIDE, MAX_THINKING_TOKENS, CLAUDE_CODE_MAX_OUTPUT_TOKENS, ENABLE_TOOL_SEARCH, SLASH_COMMAND_TOOL_CHAR_BUDGET, CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS, ANTHROPIC_DEFAULT_*_MODEL, ANTHROPIC_BASE_URL, CLAUDE_CODE_DISABLE_BACKGROUND_TASKS, CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| marked | ^17.0.0 | Markdown to HTML | Already in use by build.js; passes through raw HTML in markdown |
| gray-matter | ^4.0.3 | YAML frontmatter parsing | Already in use by build.js |
| highlight.js | ^11.11.0 | Syntax highlighting | Already in use by build.js with yaml, json, bash, js, ts, markdown, html, plaintext |

### Supporting
No new libraries needed. This phase is pure content work within existing tab panels using the established build pipeline.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline how-to content in tabs | Separate how-to pages per guide | Tabs keep everything on one page per topic, reducing navigation; separate pages would fragment the experience |
| Manual reference tables | JSON Schema rendering | Tables are simpler, no build tool changes needed, and match the existing content patterns |

**Installation:**
```bash
# No new dependencies needed
```

## Architecture Patterns

### Content File Structure (Phase 4 Changes)
```
content/
  mcp.md             # How-To tab: HOWT-01,02,03,04 | Reference tab: REFR-01, REFR-08 (partial)
  skills.md          # How-To tab: HOWT-05 | Reference tab: REFR-02
  plugins.md         # How-To tab: HOWT-06 | Reference tab: REFR-03
  hooks.md           # How-To tab: HOWT-07 | Reference tab: REFR-04
  agents.md          # How-To tab: HOWT-08 | Reference tab: REFR-05
  projects.md        # How-To tab: HOWT-09 | Reference tab: REFR-07
  memory.md          # How-To tab: HOWT-10 | Reference tab: (memory file format)
  settings.md        # How-To tab: (settings guides) | Reference tab: REFR-06, REFR-08 (partial)
  connectors.md      # No HOWT/REFR requirements assigned -- light placeholder update only
  commands.md        # No HOWT/REFR requirements assigned -- light placeholder update only
```

### Pattern 1: How-To Guide Structure
**What:** Each how-to guide follows a consistent step-by-step walkthrough format.
**When to use:** Every HOWT-* requirement.

**Template:**
```markdown
## Guide Title

### Prerequisites
- What you need before starting

### Step 1: [Action]
[Explanation of what this step does and why]

\`\`\`bash
# Copy-pasteable command with realistic values
claude mcp add github-server -- npx @modelcontextprotocol/server-github
\`\`\`

### Step 2: [Action]
...

### Step 3: [Action]
...

### Verify It Works
[How to confirm the setup is correct]

### Troubleshooting
- **Problem:** [description] **Fix:** [solution]
```

### Pattern 2: Technical Reference Structure
**What:** Each reference spec uses a formal schema documentation format with tables.
**When to use:** Every REFR-* requirement.

**Template:**
```markdown
## Config/Schema Name

### File Location
\`path/to/file\`

### Complete Schema
\`\`\`json
{
  "field": "value"
}
\`\`\`

### Field Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| name | string | Yes | N/A | ... |

### Validation Rules
- rule 1
- rule 2

### Examples
\`\`\`json
// Minimal example
\`\`\`

\`\`\`json
// Full example
\`\`\`
```

### Pattern 3: Configuration Migration from Concept to Reference
**What:** Move detailed config schemas from Concept tab to Reference tab, leaving a lighter overview in Concept with a "see Reference tab" pointer.
**When to use:** Topics where the Concept tab has detailed config JSON that belongs in Reference (hooks, settings, agents).

**Process:**
1. Identify configuration blocks in Concept tab that are schema-level detail
2. Move the full schema to the Reference tab
3. Leave a concise summary in Concept with: "For the complete schema, see the **Reference** tab."
4. Ensure no information is lost in the migration

### Anti-Patterns to Avoid
- **Lorem ipsum or placeholder values in code examples:** All code must use realistic project names, real CLI commands, and plausible configuration values.
- **Duplicating Concept content in How-To:** How-To guides should reference the Concept tab for background, not repeat it. Focus on the step-by-step workflow.
- **Incomplete reference tables:** Every field in a schema must be documented. Don't skip optional fields.
- **Mixing how-to and reference content:** How-To is procedural (do this, then this). Reference is declarative (this field accepts these values).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Schema documentation | Custom schema renderer | Markdown tables in existing build | Tables are simple, portable, and match existing patterns |
| Code example validation | Custom code tester | Manual review against official docs | Build pipeline has no test framework for content accuracy |
| Tab switching | New tab implementation | Existing .tabs/.tab-panel CSS+JS from Phase 1.1 | Already works, proven in 10 topic pages |

## Common Pitfalls

### Pitfall 1: Stale or Incorrect Config Schemas
**What goes wrong:** Documenting fields that don't exist or missing newly added fields.
**Why it happens:** Claude Code evolves rapidly; training data may be outdated.
**How to avoid:** All reference content MUST be verified against official docs at code.claude.com. The fetched official docs in this research are the authoritative source.
**Warning signs:** A field mentioned in concept content but not in official docs, or vice versa.

### Pitfall 2: How-To Guides That Aren't Complete Walkthroughs
**What goes wrong:** Guide assumes knowledge or skips steps, user can't follow from start to finish.
**Why it happens:** Author knows the system and unconsciously skips "obvious" steps.
**How to avoid:** Each guide must start with prerequisites, include every command, and end with verification. The success criterion says "a user can follow from start to finish."
**Warning signs:** A guide that doesn't have a "Verify It Works" section.

### Pitfall 3: Broken HTML Structure in Tab Panels
**What goes wrong:** Unclosed HTML tags or incorrect nesting breaks the tab UI.
**Why it happens:** Mixing raw HTML with markdown in the same file is fragile.
**How to avoid:** Each tab panel must have matching open/close `<div>` tags. Test by building (`npm run build`) and visually checking each tab.
**Warning signs:** Content appearing outside tab panels, or tabs not switching correctly.

### Pitfall 4: Overlong Content Files
**What goes wrong:** Markdown files become thousands of lines, hard to maintain.
**Why it happens:** Adding full how-to guides and reference specs to already-substantial concept content.
**How to avoid:** Keep how-to guides focused (one guide per HOWT requirement, ~40-80 lines each). Keep reference tables concise. The mcp.md file is currently ~230 lines; with how-to and reference content it may reach ~600-800 lines, which is manageable.
**Warning signs:** A single content file exceeding 1000 lines.

### Pitfall 5: Environment Variables Spread Across Multiple Pages
**What goes wrong:** REFR-08 (env vars reference) content duplicated across multiple topic reference tabs.
**Why it happens:** Many env vars relate to specific features (MCP, settings, agents).
**How to avoid:** Put the comprehensive env vars table in the Settings reference tab (REFR-08). Other topic reference tabs should only mention topic-specific env vars and link to Settings for the full list.
**Warning signs:** The same env var documented with different descriptions on different pages.

## Code Examples

Verified patterns from official documentation:

### How-To: Setting Up an MCP Server (stdio)
```bash
# Source: code.claude.com/docs/en/mcp
# Step 1: Add a local stdio MCP server
claude mcp add github-server -- npx @modelcontextprotocol/server-github

# Step 2: Verify it's configured
claude mcp list

# Step 3: Share with team via .mcp.json
# Create .mcp.json at repo root:
```

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

### Reference: Hook Configuration Schema
```json
// Source: code.claude.com/docs/en/hooks
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix $CLAUDE_FILE_PATH",
            "timeout": 600
          }
        ]
      }
    ]
  }
}
```

### Reference: Skill Frontmatter (Complete)
```yaml
# Source: code.claude.com/docs/en/skills
---
name: deploy-checker
description: Validates deployment readiness before pushing to production
argument-hint: "[environment]"
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
model: sonnet
context: fork
agent: general-purpose
hooks:
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
---
```

### Reference: Agent Frontmatter (Complete)
```yaml
# Source: code.claude.com/docs/en/sub-agents
---
name: code-reviewer
description: Reviews code changes for quality and security issues
tools: Read, Grep, Glob
disallowedTools: Write, Edit
model: sonnet
permissionMode: plan
maxTurns: 20
skills:
  - code-standards
  - security-review
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh"
memory: project
background: false
isolation: worktree
---
```

### Reference: Plugin Manifest (Complete)
```json
// Source: code.claude.com/docs/en/plugins-reference
{
  "name": "deployment-tools",
  "version": "1.0.0",
  "description": "Deployment automation tools for our team",
  "author": {
    "name": "Platform Team",
    "email": "platform@company.com",
    "url": "https://github.com/company"
  },
  "homepage": "https://docs.company.com/claude-plugins",
  "repository": "https://github.com/company/deployment-tools",
  "license": "MIT",
  "keywords": ["deployment", "ci-cd", "automation"],
  "commands": ["./custom/commands/deploy-status.md"],
  "agents": "./agents/",
  "skills": "./skills/",
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json",
  "lspServers": "./.lsp.json"
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SSE transport for remote MCP | Streamable HTTP transport | 2025 | New remote servers should use streamable HTTP; SSE still works for backward compat |
| `.claude/commands/` for custom commands | `.claude/skills/` with SKILL.md | Oct 2025 | Commands still work but skills are recommended; skills add frontmatter, supporting files |
| 12 hook events | 24 hook events | Feb 2026 | Events like TeammateIdle, TaskCompleted, InstructionsLoaded, Elicitation added |
| Flat hook config (matcher + command at same level) | Nested hook config (matcher group > hooks array) | 2026 | New schema nests hooks under matcher groups: `{ "matcher": "...", "hooks": [{ "type": "command", ... }] }` |
| `ANTHROPIC_SMALL_FAST_MODEL` env var | `ANTHROPIC_DEFAULT_HAIKU_MODEL` | 2026 | Old var deprecated |

**Critical finding -- Hook config schema change:** The official docs show a NESTED structure where each event contains an array of matcher groups, and each matcher group contains a `hooks` array of handlers. The existing Concept tab content in hooks.md uses a FLAT structure where matchers and types are at the same level. The Reference tab MUST use the correct nested schema from official docs. The Concept tab examples should also be updated for accuracy.

**Deprecated/outdated:**
- `.claude/commands/` -- still works but skills are the recommended replacement
- SSE transport -- still functional but streamable HTTP is the current standard
- `ANTHROPIC_SMALL_FAST_MODEL` -- deprecated in favor of `ANTHROPIC_DEFAULT_HAIKU_MODEL`

## Open Questions

1. **Hook config schema -- flat vs nested**
   - What we know: Official docs at code.claude.com/docs/en/hooks show a nested structure with `{ "matcher": "...", "hooks": [{ "type": "command", ... }] }`. The existing Concept tab uses a flat structure.
   - What's unclear: Whether both formats are accepted (backward compatibility) or only the nested format works.
   - Recommendation: Document the nested format as canonical in Reference (it's what official docs show). Keep Concept tab examples updated to match. Note that the flat format may still work for backward compat.

2. **Environment variables -- complete list**
   - What we know: Official docs mention 140+ env vars. We have ~15 key ones verified.
   - What's unclear: The complete list of all 140+ env vars is not readily available in a single page.
   - Recommendation: Document the ~20 most important env vars in a table in the Settings Reference tab. Note that the full list is available via `claude config list` or official docs.

3. **Connectors and Commands pages -- no HOWT/REFR requirements**
   - What we know: These pages have how-to and reference placeholder tabs but no Phase 4 requirements assigned.
   - What's unclear: Whether to fill them with content anyway or leave updated placeholders.
   - Recommendation: Update the placeholder text to be more helpful (e.g., "See the MCP page for connector setup guides") rather than leaving "coming soon" text that references Phase 4. Keep them lightweight.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js built-in test runner |
| Config file | none -- tests run via package.json script |
| Quick run command | `node --test tests/test-build.js` |
| Full suite command | `npm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOWT-01 | MCP stdio how-to guide present in mcp.md howto tab | content check | `node --test tests/test-howto-content.js` | No -- Wave 0 |
| HOWT-05 | Skills how-to guide present in skills.md howto tab | content check | `node --test tests/test-howto-content.js` | No -- Wave 0 |
| HOWT-07 | Hooks how-to guide present in hooks.md howto tab | content check | `node --test tests/test-howto-content.js` | No -- Wave 0 |
| REFR-01 | MCP config schema in mcp.md reference tab | content check | `node --test tests/test-reference-content.js` | No -- Wave 0 |
| REFR-02 | Skill frontmatter spec in skills.md reference tab | content check | `node --test tests/test-reference-content.js` | No -- Wave 0 |
| REFR-04 | Hook config spec in hooks.md reference tab | content check | `node --test tests/test-reference-content.js` | No -- Wave 0 |
| ALL | Build succeeds with new content | build test | `node --test tests/test-build.js` | Yes |
| ALL | Syntax highlighting works on new code blocks | highlight test | `node --test tests/test-highlighting.js` | Yes |

### Sampling Rate
- **Per task commit:** `node --test tests/test-build.js`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before /gsd:verify-work

### Wave 0 Gaps
- [ ] `tests/test-howto-content.js` -- spot-checks that how-to tabs contain guide content (not placeholders)
- [ ] `tests/test-reference-content.js` -- spot-checks that reference tabs contain schema content (not placeholders)

## Sources

### Primary (HIGH confidence)
- [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks) -- Complete hook configuration spec: 24 events, 4 handler types, matchers, exit codes, JSON schemas
- [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills) -- Complete skill spec: 10 frontmatter fields, file structure, loading behavior, string substitutions
- [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents) -- Complete agent file format: 12 frontmatter fields, scopes, memory, hooks
- [code.claude.com/docs/en/plugins-reference](https://code.claude.com/docs/en/plugins-reference) -- Complete plugin manifest schema, directory structure, CLI commands
- [code.claude.com/docs/en/settings](https://code.claude.com/docs/en/settings) -- Complete settings hierarchy, scopes, permission modes

### Secondary (MEDIUM confidence)
- [code.claude.com/docs/en/model-config](https://code.claude.com/docs/en/model-config) -- Model configuration and environment variables
- [builder.io/blog/claude-code-mcp-servers](https://www.builder.io/blog/claude-code-mcp-servers) -- MCP server setup patterns, verified against official docs

### Tertiary (LOW confidence)
- Environment variables complete list -- only ~20 key vars verified; full 140+ list not available from a single source

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no changes needed, same build pipeline as Phases 1-3
- Architecture: HIGH - tab structure proven, content patterns established in Phase 3
- Pitfalls: HIGH - verified against official docs; hook schema discrepancy identified and documented
- How-to content: HIGH - all guide topics verified against official Claude Code docs
- Reference content: HIGH - all schema fields verified against official docs (hooks 24 events, skills 10 fields, agents 12 fields, plugins complete manifest)
- Environment variables: MEDIUM - key vars verified but complete list unavailable

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (30 days -- Claude Code docs update frequently but core schemas are stable)
