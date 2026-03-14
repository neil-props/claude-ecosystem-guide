# Feature Landscape

**Domain:** Developer documentation/reference site + CLI agent for the Claude Code ecosystem
**Researched:** 2026-03-14
**Confidence:** HIGH (based on established patterns from Stripe, Tailwind, React, Docusaurus-era documentation sites; Claude Code agent capabilities from existing project context and training data)

---

## Table Stakes

Features users expect. Missing = product feels incomplete or amateurish.

### Documentation Site

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Full-text search | Every doc site has it; users will not browse manually | Low | Already partially exists. Needs to work across all content layers. Client-side is fine at this scale (Fuse.js, Pagefind, or Lunr). |
| Dark/light theme | Developer audience expects it | Low | Already implemented in index.html. Preserve. |
| Responsive/mobile layout | Developers read docs on phones, tablets | Low | Already partially implemented. Needs verification on multi-page structure. |
| Sidebar navigation | Standard doc site navigation pattern. Users expect persistent TOC | Medium | Current single-page scroll nav works but will not scale when content expands to multiple layers per topic. |
| Deep linking / anchor URLs | Users share specific sections, bookmark them, return from search engines | Low | Partially exists via section IDs. Needs to work across all content pages. |
| Code examples with copy button | Developers copy-paste; friction here = abandonment | Low | Code blocks exist but need consistent copy-to-clipboard across all reference content. |
| Syntax highlighting | Unformatted code blocks look unprofessional and are hard to scan | Low | Use Prism.js or highlight.js. Needed for YAML frontmatter, JSON configs, bash commands, markdown. |
| Conceptual overviews per topic | "What is this?" is the first question for every extension point | Medium | Partially exists in current cards/modals. Needs expansion to full prose for each of: MCP, Skills, Plugins, Hooks, Agents, Projects, Connectors, Commands, Memory, Settings. |
| How-to guides per topic | "How do I set this up?" is the second question | High | This is the bulk of new content. Step-by-step guides for each extension point. |
| Technical reference per topic | "What are all the options?" is the third question | Medium | Partially exists (frontmatter specs, settings hierarchy). Needs completeness for every config surface. |
| Decision trees / "which should I use" | Users are confused by overlapping concepts (skill vs agent vs command) | Medium | Already exists as "Which Should I Use?" section. Needs to be integrated into each topic page, not just one central section. |
| Compatibility matrix | "Does this work in Code/Chat/Cowork?" is asked constantly | Low | Already implemented. Preserve and keep current. |
| Loading performance | Single HTML page at 2343 lines is already pushing it; multi-page must be fast | Low | Static HTML + minimal JS. No framework overhead needed. |
| Print / offline readability | Developers open docs tabs and read offline on planes | Low | Static site handles this naturally. Avoid JS-dependent content rendering. |

### Claude Code Agent

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Answer ecosystem questions from static knowledge | Core purpose. Agent must know the Claude ecosystem deeply | Medium | Skill files as knowledge base. ~10 topic areas need SKILL.md files with comprehensive content. |
| Accurate, up-to-date information | Wrong answers are worse than no answers | Medium | Static knowledge base needs a maintenance cadence. This is the hardest ongoing cost. |
| Cite sources / point to docs | Users want to verify answers and read further | Low | Agent responses should reference specific doc pages or official Anthropic docs. |
| Handle "I don't know" gracefully | Hallucinated ecosystem answers destroy trust | Low | Agent instructions should explicitly say "attempt live research, then admit gaps" rather than guess. |
| Cover all extension points | Partial coverage = users hit dead ends | Medium | MCP, Skills, Plugins, Hooks, Agents, Projects, Connectors, Commands, Memory, Settings. All must be covered. |
| Slash command interface | `/ecosystem` or similar entry point for discoverability | Low | Standard Claude Code agent pattern via `claude --agent`. |

---

## Differentiators

Features that set the product apart. Not expected, but create real value.

### Documentation Site

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Layered content depth (concept / howto / reference / decision-tree on same page) | Most doc sites force you to hunt across sections. Tabs or accordions per topic page let users self-select depth. | Medium | This is the project's core content model. Each of the ~10 topics gets all 4 layers. Few doc sites do this well. |
| Interactive decision wizard | Go beyond static Q&A. "What are you trying to do?" flow that recommends the right extension point based on answers. | Medium | Builds on existing "Which Should I Use?" but makes it interactive/filterable rather than a static list of 12 scenarios. |
| Visual architecture diagrams | Show how MCP, Skills, Plugins, Hooks, and Agents relate. Static diagrams (SVG) are fine. | Medium | The customization stack visual already exists. Expand to show data flow, loading order, scope resolution. |
| Persona-based entry points | "I'm a developer" / "I'm ops" / "I'm non-technical" landing paths that filter content | Medium | Already partially exists in "Building by Persona" section. Make it a first-class navigation path, not just one section. |
| Version/changelog tracking | Document when features launched, what changed. Timeline already exists; make it a living changelog. | Low | Existing "Product Timeline" section is a strong foundation. |
| Cross-reference linking between topics | "Skills can be bundled into Plugins" links directly to Plugins page. Tight internal linking makes the ecosystem feel cohesive. | Low | Simple but requires discipline during content authoring. |
| Comparison tables (Skill vs Agent vs Command) | The single most confusing area. A clear, scannable comparison table is worth more than paragraphs of prose. | Low | Already exists in Technical Reference. Elevate it to a prominent, standalone piece. |
| Real-world recipes / cookbook section | "Build a deploy skill", "Set up a CRM enrichment project", "Create your first hook". Practical, copy-paste-ready. | High | Most doc sites lack concrete examples. This is where users actually get unblocked. |

### Claude Code Agent

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Hybrid knowledge: static base + live doc fetching | Static knowledge goes stale. Agent that can fetch current Anthropic docs on demand stays accurate longer. | High | Core differentiator per PROJECT.md. Needs MCP server or WebFetch tool access. Agent tries static knowledge first, falls back to live fetch. |
| Contextual recommendations based on user's project | Agent reads user's CLAUDE.md, .mcp.json, settings, and gives ecosystem advice specific to their setup. | Medium | "You have 3 MCP servers configured but no skills. Here's how to add skills for your workflow." |
| Guided setup workflows | "Help me set up my first skill" walks user through creating SKILL.md with correct frontmatter, placing it correctly, testing it. | Medium | Interactive wizard-style guidance within the CLI conversation. |
| Ecosystem health check | "Audit my Claude Code setup" reviews CLAUDE.md, settings, MCP configs, skills, and flags issues or improvements. | Medium | High-value for power users who have accumulated config over time. |
| Comparison mode | "What's the difference between a skill and an agent?" gives a structured comparison, not just prose | Low | Agent has comparison knowledge baked into skill files. |

---

## Anti-Features

Features to deliberately NOT build. Scope traps that add complexity without proportional value.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Server-side rendering / dynamic backend | Adds infrastructure complexity for a reference site. GitHub Pages is free, fast, and sufficient. | Static HTML/CSS/JS. Pre-render everything. No build step if possible. |
| User accounts / personalization on site | Out of scope per PROJECT.md. Adds auth complexity, privacy concerns, maintenance burden. | Let the agent handle personalization (it reads local project context). |
| npm-published agent package | Distribution overhead, versioning, breaking changes, support burden for a personal tool. | Local install via git clone + `claude --agent` path. |
| Comment system / community features | Moderation burden. Community belongs on GitHub Discussions or Discord, not a reference site. | Link to GitHub repo for issues/discussions. |
| AI-powered site search | Over-engineered for the content volume. Client-side fuzzy search handles this well. | Fuse.js or Pagefind for client-side search. |
| Automated content pipeline / CI-generated docs | Per PROJECT.md out of scope. Adds CI complexity for a manually maintained knowledge base. | Manual updates. Agent-assisted live fetch covers freshness. |
| Multi-language / i18n | Small audience, English-first domain. Translation maintenance cost is enormous. | English only. |
| Analytics / tracking | Privacy concern, adds JS bloat, provides minimal value for a public reference site. | Check GitHub Pages traffic stats if curious. |
| Tutorial progression / learning paths | This is a reference site, not a course. Users arrive with specific questions, not to learn sequentially. | Decision trees and recipes serve the "help me do X" use case better. |
| PDF / ebook export | Maintenance burden for a format nobody prefers over a fast static site. | The site itself works offline. |
| Versioned docs (v1, v2 branches) | The Claude ecosystem moves too fast for versioned snapshots. One current version is correct. | Single living document. Changelog section tracks what changed and when. |
| Agent memory across sessions | Adds persistence complexity. The agent answers ecosystem questions; it does not need to remember past conversations. | Stateless per session. Project context comes from reading local files, not memory. |

---

## Feature Dependencies

```
Sidebar navigation ──> Multi-page site structure
                           │
Search (full-text) ────────┤
                           │
Deep linking ──────────────┘

Conceptual overviews ──> How-to guides ──> Technical reference
       │                      │                    │
       └──────────────────────┴────────────────────┘
                              │
                    Layered content depth (tabs/accordions)

Decision trees ──> Cross-reference linking
       │
Interactive decision wizard

Static knowledge base ──> Agent answers questions
       │
       └──> Live doc fetching (hybrid knowledge)

Agent reads project context ──> Contextual recommendations
                                       │
                              Ecosystem health check

Code examples + copy button ──> Real-world recipes / cookbook
```

Key dependency chain: **Content structure must be decided before content is written.** The layered depth model (concept / howto / reference / decision-tree per topic) is an architectural decision that affects every piece of content. Get this right first.

---

## MVP Recommendation

### Phase 1: Site Content Architecture + Core Content

Prioritize:
1. **Multi-page site structure with sidebar navigation** -- foundational. Everything else builds on this.
2. **Conceptual overviews for all 10 extension points** -- table stakes content layer 1.
3. **Search, deep linking, code copy buttons** -- table stakes UX.
4. **Compatibility matrix and comparison tables** -- already exist, migrate and elevate.

### Phase 2: Depth + Guides

Prioritize:
1. **How-to guides for top 5 extension points** (Skills, MCP, Agents, Hooks, CLAUDE.md) -- highest traffic topics.
2. **Technical reference completion** -- frontmatter specs, config options, env vars.
3. **Layered content depth** (tabs or accordions per topic page) -- the differentiator.
4. **Decision trees integrated per topic** -- not just one central page.

### Phase 3: Agent

Prioritize:
1. **Static knowledge base** (skill files covering all topics) -- must work offline.
2. **Hybrid live fetch** -- MCP or WebFetch fallback for current docs.
3. **Contextual project recommendations** -- reads local config and advises.

Defer:
- **Interactive decision wizard**: Nice-to-have, not blocking. The static decision tree section already serves 80% of the need.
- **Cookbook / recipes section**: High value but high effort. Add incrementally after core content is solid.
- **Ecosystem health check agent**: Power user feature. Build after basic agent works.
- **Guided setup workflows in agent**: Requires the static knowledge base to be complete first.

---

## Sources

- Existing `index.html` analysis (2343 lines, 10 content sections, dark/light theme, search, interactive modals)
- Existing `ama.html` analysis (2816 lines, Q&A format with Fuse.js search)
- PROJECT.md requirements and constraints
- Training data knowledge of documentation site patterns (Stripe, Tailwind CSS, React, Vue, Next.js, Docusaurus, MDN, Vercel docs) -- MEDIUM confidence, patterns are well-established but specific implementation details should be verified against current versions
- Training data knowledge of Claude Code agent capabilities (`claude --agent`, skill files, SKILL.md frontmatter) -- HIGH confidence, consistent with existing site content
