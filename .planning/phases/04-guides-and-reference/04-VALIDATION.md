---
phase: 4
slug: guides-and-reference
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (node --test) |
| **Config file** | None -- tests run via package.json script |
| **Quick run command** | `node --test tests/test-build.js` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/test-build.js`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-W0-01 | W0 | 0 | ALL | test infra | `node --test tests/test-howto-content.js` | No -- Wave 0 creates | ⬜ pending |
| 04-W0-02 | W0 | 0 | ALL | test infra | `node --test tests/test-reference-content.js` | No -- Wave 0 creates | ⬜ pending |
| 04-01-01 | 01 | 1 | HOWT-01,02,03,04 | content check | `node --test tests/test-howto-content.js` | Wave 0 | ⬜ pending |
| 04-01-02 | 01 | 1 | HOWT-05,06,07,08 | content check | `node --test tests/test-howto-content.js` | Wave 0 | ⬜ pending |
| 04-02-01 | 02 | 1 | REFR-01,02,03,04 | content check | `node --test tests/test-reference-content.js` | Wave 0 | ⬜ pending |
| 04-02-02 | 02 | 1 | REFR-05,06,07,08 | content check | `node --test tests/test-reference-content.js` | Wave 0 | ⬜ pending |
| 04-03-01 | 03 | 2 | HOWT-09,10 | content check | `node --test tests/test-howto-content.js` | Wave 0 | ⬜ pending |
| ALL | ALL | ALL | ALL | build | `node build/build.js` | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/test-howto-content.js` -- spot-checks that how-to tabs contain guide content (not placeholders)
- [ ] `tests/test-reference-content.js` -- spot-checks that reference tabs contain schema content (not placeholders)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Code examples are copy-pasteable | HOWT-01 through HOWT-10 | Requires trying to run examples | Copy code blocks, verify syntax, check realistic values |
| How-to guides are followable start-to-finish | HOWT-01 through HOWT-10 | Requires human comprehension | Follow each guide as a new user |
| Tab switching works with new content | ALL | Visual/interactive | Click through tabs on each page |
| Reference schemas are complete and accurate | REFR-01 through REFR-08 | Requires domain expertise | Compare against official Claude Code docs |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
