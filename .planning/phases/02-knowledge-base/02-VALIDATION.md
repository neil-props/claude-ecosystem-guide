---
phase: 2
slug: knowledge-base
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (node:test) |
| **Config file** | none — tests in package.json scripts |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build && npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | KNOW-01 | integration | `node --test tests/test-knowledge-content.js` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 1 | KNOW-02 | integration | `node --test tests/test-knowledge-structure.js` | ❌ W0 | ⬜ pending |
| 2-01-03 | 01 | 1 | KNOW-03 | integration | `node --test tests/test-content-completeness.js` | ❌ W0 | ⬜ pending |
| 2-01-04 | 01 | 1 | KNOW-04 | integration | `node --test tests/test-ama-content.js` | ❌ W0 | ⬜ pending |
| 2-01-05 | 01 | 1 | BUILD | smoke | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/test-knowledge-content.js` — verifies all 10 topic files have >80 lines of content (not placeholder)
- [ ] `tests/test-knowledge-structure.js` — verifies each topic file has required sections (Overview, How It Works, Configuration or equivalent)
- [ ] `tests/test-content-completeness.js` — verifies key facts from index.html appear in content files (MCP transport types, Skill frontmatter fields, Hook event list)
- [ ] `tests/test-ama-content.js` — verifies at least 5 topic files have a "Common Questions" section with content

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Content reads naturally and flows well | KNOW-03 | Quality of prose cannot be automated | Read through each topic file and check for clarity |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
