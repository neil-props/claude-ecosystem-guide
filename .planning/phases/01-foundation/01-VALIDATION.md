---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in `node --test` (Node 20+) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `node build/build.js && echo "Build succeeded"` |
| **Full suite command** | `node --test tests/` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node build/build.js && echo "Build succeeded"`
- **After every plan wave:** Run `node --test tests/`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | SITE-01 | smoke | `node --test tests/test-nav.js` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | SITE-03 | smoke | `grep -q 'data-theme' docs/index.html && grep -q 'themeToggle' docs/assets/main.js` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | SITE-04 | manual-only | Visual inspection at 375px, 768px, 1024px | N/A | ⬜ pending |
| 1-01-04 | 01 | 1 | SITE-05 | unit | `node --test tests/test-anchors.js` | ❌ W0 | ⬜ pending |
| 1-01-05 | 01 | 1 | SITE-06 | smoke | `grep -q 'copy-btn' docs/topics/*.html` | ❌ W0 | ⬜ pending |
| 1-01-06 | 01 | 1 | SITE-07 | smoke | `grep -q 'hljs' docs/topics/*.html` | ❌ W0 | ⬜ pending |
| 1-01-07 | 01 | 1 | SITE-08 | unit | `test ! -d docs/node_modules && wc -l docs/assets/main.js` | ❌ W0 | ⬜ pending |
| 1-01-08 | 01 | 1 | SITE-09 | smoke | `grep -q 'matrix' docs/index.html` | ❌ W0 | ⬜ pending |
| 1-01-09 | 01 | 1 | KNOW-05 | integration | `node build/build.js && ls docs/topics/*.html` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — with build dependencies (marked, gray-matter, highlight.js, marked-highlight) and test script
- [ ] `tests/test-build.js` — verifies build script produces expected output files
- [ ] `tests/test-nav.js` — verifies sidebar nav HTML contains all topic links with correct active states
- [ ] `tests/test-anchors.js` — verifies heading IDs are generated in output HTML
- [ ] `tests/test-highlighting.js` — verifies code blocks contain hljs classes

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive layout | SITE-04 | Requires visual inspection at multiple viewport widths | Open site in browser, check 375px, 768px, 1024px widths |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
