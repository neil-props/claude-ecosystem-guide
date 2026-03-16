---
phase: 6
slug: agent
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (node --test) |
| **Config file** | None -- uses existing package.json scripts |
| **Quick run command** | `node --test tests/test-agent.js` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/test-agent.js`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-W0-01 | W0 | 0 | ALL | test infra | `node --test tests/test-agent.js` | No -- Wave 0 creates | ⬜ pending |
| 06-01-01 | 01 | 1 | AGNT-01,02,03 | unit | `node --test tests/test-agent.js` | Wave 0 | ⬜ pending |
| 06-01-02 | 01 | 1 | AGNT-04,05,06,07,08,09 | unit | `node --test tests/test-agent.js` | Wave 0 | ⬜ pending |
| ALL | ALL | ALL | ALL | build | `node build/build.js` | ✅ existing | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/test-agent.js` -- Agent file validation, skill existence, frontmatter parsing, system prompt content checks
- [ ] `.claude/agents/claude-ecosystem.md` -- The agent file itself
- [ ] `.claude/skills/ecosystem-*/SKILL.md` -- 10 topic skill files

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Agent answers questions accurately | AGNT-01 | Requires running the agent interactively | Run `claude --agent claude-ecosystem` and ask about MCP, Skills, Hooks |
| Live doc fetching works | AGNT-04 | Requires network access and agent runtime | Ask agent about a feature not in skills, verify it fetches and cites |
| Project context reading | AGNT-06 | Requires running in a project directory | Run agent in a project with CLAUDE.md, ask for recommendations |
| Comparison responses are structured | AGNT-09 | Requires agent runtime | Ask "what's the difference between skills and agents?" |
| Setup audit works | AGNT-08 | Requires agent runtime | Ask agent to audit current Claude Code setup |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
