---
phase: 5
slug: decision-guidance-and-recipes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (node:test) |
| **Config file** | None -- tests run via `node --test` |
| **Quick run command** | `node --test tests/test-build.js` |
| **Full suite command** | `node --test tests/test-build.js tests/test-search.js tests/test-wizard.js tests/test-decision-guidance.js tests/test-comparisons.js tests/test-recipes.js` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/test-build.js`
- **After every plan wave:** Run full suite command
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-W0-01 | W0 | 0 | ALL | test infra | `node --test tests/test-search.js tests/test-wizard.js tests/test-recipes.js` | No -- Wave 0 creates | ⬜ pending |
| 05-01-01 | 01 | 1 | DECT-01 | unit | `node --test tests/test-wizard.js` | Wave 0 | ⬜ pending |
| 05-01-02 | 01 | 1 | DECT-02, DECT-03 | unit | `node --test tests/test-decision-guidance.js tests/test-comparisons.js` | Wave 0 | ⬜ pending |
| 05-02-01 | 02 | 1 | RECP-01,02,03,04,05 | unit | `node --test tests/test-recipes.js` | Wave 0 | ⬜ pending |
| 05-03-01 | 03 | 2 | SITE-02 | unit | `node --test tests/test-search.js` | Wave 0 | ⬜ pending |
| ALL | ALL | ALL | ALL | build | `node build/build.js` | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/test-search.js` -- verifies search input in template, Pagefind data-pagefind-body attribute
- [ ] `tests/test-wizard.js` -- verifies wizard page builds with wizard container element
- [ ] `tests/test-decision-guidance.js` -- verifies topic pages contain decision guidance content
- [ ] `tests/test-comparisons.js` -- verifies comparison tables render
- [ ] `tests/test-recipes.js` -- verifies all 5 recipe pages build with correct structure
- [ ] `pagefind` dev dependency: `npm install -D pagefind`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Decision wizard flow is intuitive | DECT-01 | UX requires human evaluation | Walk through wizard as different user personas |
| Search returns relevant results | SITE-02 | Relevance is subjective | Search for "MCP", "hooks", "skill" and verify top results |
| Recipe walkthroughs are followable | RECP-01 through RECP-05 | Requires trying to follow steps | Follow each recipe end-to-end |
| Comparison tables are clear | DECT-03 | Readability is subjective | Review tables for clarity and completeness |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
