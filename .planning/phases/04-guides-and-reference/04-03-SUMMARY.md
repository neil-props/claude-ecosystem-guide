---
phase: 04-guides-and-reference
plan: 03
subsystem: content
tags: [claude-md, memory, settings, env-vars, projects, connectors, commands]

requires:
  - phase: 03-conceptual-content
    provides: concept tab content with placeholders for how-to and reference tabs
  - phase: 04-guides-and-reference/01
    provides: tab panel patterns and HTML comment break technique
provides:
  - CLAUDE.md configuration how-to guide (HOWT-09)
  - Memory system usage how-to guide (HOWT-10)
  - CLAUDE.md file format and loading order reference (REFR-07)
  - Settings hierarchy 5-level precedence reference (REFR-06)
  - Environment variables reference table with 13 key vars (REFR-08)
  - Updated Connectors and Commands pages with helpful redirects
affects: [05-decision-guidance, 06-agent]

tech-stack:
  added: []
  patterns: [config-migration-from-concept-to-reference]

key-files:
  created: []
  modified:
    - content/projects.md
    - content/memory.md
    - content/settings.md
    - content/connectors.md
    - content/commands.md

key-decisions:
  - "Settings Concept tab Configuration section slimmed to overview with pointer to Reference tab for full schema"
  - "Connectors how-to redirects to MCP page for CLI-based tool server setup"
  - "Commands how-to redirects to Skills page for recommended custom command approach"
  - "No HTML comment break needed before reference tab closing div (only needed for howto tab)"

patterns-established:
  - "Config migration: move detailed schemas from Concept to Reference, leave Concept with overview + Reference pointer"
  - "Redirect pattern: pages without dedicated guides point users to the appropriate topic page"

requirements-completed: [HOWT-09, HOWT-10, REFR-06, REFR-07, REFR-08]

duration: 6min
completed: 2026-03-16
---

# Phase 4 Plan 3: Projects/Memory/Settings Guides and Reference Summary

**CLAUDE.md configuration guide, memory system walkthrough, settings hierarchy reference with env vars table, plus Connectors/Commands redirect updates**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-16T12:25:30Z
- **Completed:** 2026-03-16T12:31:58Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Projects page has complete CLAUDE.md how-to (create, rules, local, monorepo, import) and file format reference with loading order and precedence
- Memory page has complete memory system guide (4 layers, /memory command, agent memory, debugging) and file location/format reference
- Settings page has configuration walkthrough and reference with 5-level hierarchy, permission modes, allow/deny syntax, and env vars table (~13 key variables)
- Settings Concept tab Configuration section migrated to Reference tab (slimmed overview left in Concept)
- Connectors and Commands pages updated from "coming in Phase 4" placeholders to helpful redirects

## Task Commits

Each task was committed atomically:

1. **Task 1: Write how-to guides and reference specs for Projects, Memory, and Settings** - `d1650b2` (feat)
2. **Task 2: Update Connectors and Commands placeholder text** - `0b969e6` (feat)

## Files Created/Modified

- `content/projects.md` - CLAUDE.md how-to guide and file format reference with loading order
- `content/memory.md` - Memory system how-to guide and file location/format reference
- `content/settings.md` - Settings configuration how-to, hierarchy reference, env vars table; slimmed Concept config section
- `content/connectors.md` - Replaced placeholders with Chat UI setup note and MCP redirect
- `content/commands.md` - Replaced placeholders with Skills redirect and legacy format reference

## Decisions Made

- Settings Concept tab Configuration section slimmed to overview pointing to Reference tab for full schema, permissions, and env vars
- Connectors how-to explains these are managed through Claude Chat UI, redirects to MCP for CLI tool server setup
- Commands how-to redirects to Skills as recommended approach, reference documents legacy directory format
- HTML comment break (`<!-- end reference -->`) removed from reference tabs -- only needed for howto tabs to prevent markdown list swallowing

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 5 content files updated for this plan's requirements
- Hooks and Agents pages still have placeholder how-to/reference content (covered by plan 04-02, a separate wave)
- Build succeeds, all 18 core tests pass
- Content tests pass for projects, memory, and settings pages

---
*Phase: 04-guides-and-reference*
*Completed: 2026-03-16*
