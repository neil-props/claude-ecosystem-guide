---
phase: 3
slug: conceptual-content
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (node --test) |
| **Config file** | None — uses direct file paths |
| **Quick run command** | `node --test build/test-build.js` |
| **Full suite command** | `node --test build/test-build.js` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node build/build.js && grep -l "tab-panel" content/*.md | wc -l`
- **After every plan wave:** Run `node --test build/test-build.js && node build/build.js`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | CONC-01 | content check | `grep -c "stdio\|streamable HTTP\|SSE" content/mcp.md` | N/A | ⬜ pending |
| 03-01-02 | 01 | 1 | CONC-02 | content check | `grep -c "frontmatter\|vs.*agent\|vs.*hook" content/skills.md` | N/A | ⬜ pending |
| 03-01-03 | 01 | 1 | CONC-03 | content check | `grep -c "bundle\|distribution\|install" content/plugins.md` | N/A | ⬜ pending |
| 03-01-04 | 01 | 1 | CONC-04 | content check | `grep -c "lifecycle\|event\|deterministic" content/hooks.md` | N/A | ⬜ pending |
| 03-01-05 | 01 | 1 | CONC-05 | content check | `grep -c "agent file\|custom agent\|isolated context" content/agents.md` | N/A | ⬜ pending |
| 03-02-01 | 02 | 2 | CONC-06 | content check | `grep -c "hierarchy\|CLAUDE.md\|global.*project" content/projects.md` | N/A | ⬜ pending |
| 03-02-02 | 02 | 2 | CONC-07 | content check | `grep -c "connector\|Interactive App" content/connectors.md` | N/A | ⬜ pending |
| 03-02-03 | 02 | 2 | CONC-08 | content check | `grep -c "slash command\|built-in\|custom" content/commands.md` | N/A | ⬜ pending |
| 03-02-04 | 02 | 2 | CONC-09 | content check | `grep -c "layer\|persist\|CLAUDE.md\|auto-memory" content/memory.md` | N/A | ⬜ pending |
| 03-02-05 | 02 | 2 | CONC-10 | content check | `grep -c "precedence\|resolution\|override\|scope" content/settings.md` | N/A | ⬜ pending |
| ALL | 01+02 | 1+2 | ALL | smoke | `grep -c "tab-panel" content/mcp.md content/skills.md content/plugins.md content/hooks.md content/agents.md content/projects.md content/connectors.md content/commands.md content/memory.md content/settings.md` | N/A | ⬜ pending |
| ALL | 01+02 | 1+2 | ALL | integration | `node build/build.js` | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

No new test files or frameworks needed. Content validation uses grep-based checks and build verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Conceptual content accuracy | CONC-01 through CONC-10 | Content quality requires human review | Read each concept tab and verify accuracy, completeness, and clarity |
| Tab UI renders correctly | ALL | Visual rendering requires browser | Open each topic page in browser, verify tabs switch correctly |
| Markdown renders inside tab panels | ALL | Rendering quality is visual | Verify headings, code blocks, tables render inside tab-panel divs |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
