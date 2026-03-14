# Domain Pitfalls

**Domain:** Documentation site + CLI agent from shared knowledge base (Claude Code ecosystem reference)
**Researched:** 2026-03-14

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Content Format Lock-In -- Optimizing for One Deliverable

**What goes wrong:** The shared knowledge base gets shaped to serve the site's rendering needs (HTML structure, component markup, visual hierarchy) and becomes unusable as agent context -- or vice versa, gets written as flat reference text that renders poorly on the site. The "single source of truth" becomes a lie because one deliverable requires heavy transformation.

**Why it happens:** Developers naturally optimize for whichever deliverable they build first. With an existing 2300-line `index.html`, the gravity pulls toward HTML-native content. Agent skill files need dense, structured markdown. These formats fight each other.

**Consequences:** Either (a) the knowledge base silently forks into two copies that drift apart, defeating the entire project premise, or (b) one deliverable always feels like a second-class citizen with awkward rendering or missing context.

**Prevention:**
- Define the canonical format as **structured markdown** (works natively as agent context AND converts cleanly to HTML)
- Build the site to consume markdown, not the other way around
- Never put substantive content directly in HTML templates -- templates reference markdown source files
- Add a lint step: if content exists in HTML that does not trace back to a markdown source file, flag it

**Detection:**
- Content appears in `index.html` that has no corresponding markdown source
- Agent answers diverge from what the site shows
- Edits require updating two places

**Phase to address:** Phase 1 (knowledge base format design). Getting this wrong poisons everything downstream.

---

### Pitfall 2: Monolithic Single-File Agent That Hits Context Limits

**What goes wrong:** All ecosystem knowledge gets packed into one massive agent skill file (or a small number of very large files). Claude Code agents have context window constraints. A 40KB+ skill file eats most of the context budget before the user even asks a question, leaving insufficient room for tool results, conversation history, and reasoning.

**Why it happens:** It feels simpler to have one comprehensive file. The Claude ecosystem has ~10 major topics (MCP, Skills, Plugins, Hooks, Agents, Projects, Connectors, Commands, Memory, Settings) each with conceptual + how-to + reference + decision-tree layers. That is a lot of content.

**Consequences:** Agent becomes slow, truncates its own knowledge, gives incomplete answers, or fails to use tool results because context is already saturated. Worst case: the agent appears to work in testing (short conversations) but degrades in real use (multi-turn conversations).

**Prevention:**
- Design a **modular skill file architecture**: one core routing file that understands the topic taxonomy, plus per-topic skill files loaded on demand
- Core agent file should be under 8KB -- just enough for personality, tool instructions, and topic routing logic
- Per-topic files should be under 15KB each
- Use the agent's tool access (Read) to load topic-specific knowledge files at query time rather than embedding everything in the system prompt
- Test with 5+ turn conversations, not just single questions

**Detection:**
- Agent skill file exceeds 20KB
- Agent answers get worse as conversation length grows
- Agent stops citing specific details and gives vague summaries

**Phase to address:** Phase 2 (agent architecture design). Must be settled before writing any skill content.

---

### Pitfall 3: Stale Knowledge With No Update Path

**What goes wrong:** Claude Code's ecosystem evolves rapidly. The knowledge base captures a snapshot. Within weeks, new features ship, APIs change, or existing features get deprecated. The static knowledge base becomes a source of confident misinformation.

**Why it happens:** The project explicitly plans for "hybrid knowledge (static + live fetch)" but the live fetch component is architecturally hard. Fetching live docs requires knowing which URLs to hit, parsing heterogeneous page formats, and integrating results with static knowledge without contradictions.

**Consequences:** Users get outdated guidance. Agent confidently recommends deprecated patterns. Site shows old configuration syntax. Trust erodes.

**Prevention:**
- Every knowledge file must include a `last_verified` date and `source_urls` metadata
- Agent should check `last_verified` and add a staleness caveat for content older than 30 days
- Design the live fetch as a **fallback with disclosure**, not a silent supplement: "My static knowledge says X (last verified DATE). Let me check the current docs..."
- For the site: add "Last verified" badges on each topic section
- Prioritize live fetch for the topics that change fastest: MCP protocol, new extension points, configuration schemas

**Detection:**
- Knowledge files have no date metadata
- Agent gives answers without citing when info was last verified
- Users report incorrect information

**Phase to address:** Phase 1 (knowledge base metadata schema) and Phase 3 (live fetch implementation).

---

### Pitfall 4: The 2300-Line HTML Monolith Becomes Untouchable

**What goes wrong:** The existing `index.html` is a single 2300-line file containing all styles, scripts, and content. Attempting to evolve it -- adding new topic sections, restructuring navigation, implementing content from the knowledge base -- becomes a fragile, error-prone operation. Every change risks breaking the carefully tuned CSS, search, modals, and theme toggle.

**Why it happens:** The file works well as-is. There is natural resistance to refactoring something functional. But the project requires adding significant new content (layered docs for each topic) which will push this file to 5000+ lines.

**Consequences:** Development velocity drops. Bugs appear in unrelated sections when adding content. Contributors (including the agent itself, if used for maintenance) struggle to make surgical edits. The site becomes a "don't touch it" artifact.

**Prevention:**
- Break the monolith early: separate CSS into its own file, JS into its own file, and content into per-topic partials or markdown files
- Use a minimal static site generator (or even a simple build script) to assemble the final HTML from components
- Keep the visual design and theme system intact -- this is a structural refactor, not a redesign
- Do this BEFORE adding new content, not after

**Detection:**
- `index.html` grows past 3000 lines
- Changes to one section break styling in another
- Fear of editing the file

**Phase to address:** Phase 1 (site architecture refactor). Must happen before content expansion.

---

### Pitfall 5: Agent Cannot Access Its Own Knowledge Files at Runtime

**What goes wrong:** The agent is designed to read knowledge files using Claude Code's tool access (Read, Glob), but the file paths are wrong, the files are not where the agent expects them, or the agent's working directory is not the project root. The agent appears intelligent in design but cannot actually retrieve its knowledge.

**Why it happens:** Claude Code agents run in the user's current working directory. If the user runs `claude --agent claude-ecosystem` from their home directory, relative paths to knowledge files break. The agent file references `./knowledge/mcp.md` but the file lives in the project's install location.

**Consequences:** Agent falls back to its base training data (stale, generic) instead of the curated knowledge base. It still answers questions -- just badly. This failure is silent and hard to detect because the agent does not say "I couldn't find my knowledge files."

**Prevention:**
- Use **absolute paths** in the agent's file-reading instructions, resolved at install time
- Or: store knowledge files in a well-known location (`~/.claude/knowledge/claude-ecosystem/`) that does not depend on working directory
- Add a self-check: the agent's first action on any query should be to verify it can read its index file, and report clearly if it cannot
- Include a `--verify` flag or startup diagnostic

**Detection:**
- Agent gives generic answers instead of specific, cited ones
- Agent does not mention specific file names or quote content
- Running the agent from a different directory changes answer quality

**Phase to address:** Phase 2 (agent installation and path resolution).

## Moderate Pitfalls

### Pitfall 6: Decision Tree Logic That Does Not Match Reality

**What goes wrong:** The "Which Should I Use?" decision trees (already present in the site) give recommendations that conflict with actual constraints. For example, suggesting MCP for a use case where Hooks would be simpler, or recommending Skills when the user's Claude plan does not support them.

**Why it happens:** Decision trees are authored based on theoretical capability overlap, not tested against real user scenarios. The Claude ecosystem has genuine ambiguity -- multiple extension points can solve the same problem, and the "right" choice depends on context that the decision tree does not capture.

**Prevention:**
- Validate every decision tree path against a concrete scenario (write the scenario, follow the tree, verify the recommendation works)
- Include "it depends" paths with follow-up questions rather than false certainty
- Add constraints (plan tier, interface mode, persistence needs) as branching criteria
- Test with the agent: ask it the decision-tree questions and see if its answers match the tree

**Detection:**
- Users follow the tree and hit a dead end
- Agent and site give different recommendations for the same question
- Decision tree has no "it depends" paths

**Phase to address:** Phase 3 (content validation and testing).

---

### Pitfall 7: Conceptual/How-To/Reference Layers Without Clear Boundaries

**What goes wrong:** The three content layers blur together. The conceptual overview includes code snippets. The how-to guide explains theory. The reference section tells you when to use the feature. Users cannot find the depth they need because everything is mixed.

**Why it happens:** Writers naturally include context. Explaining "what MCP is" invites adding "here's how to set it up." The layers are a content architecture decision that requires discipline to maintain.

**Prevention:**
- Define strict rules for each layer:
  - **Conceptual:** What is it? Why does it exist? How does it relate to other parts? NO code, NO step-by-step.
  - **How-To:** Step-by-step to accomplish a specific task. Assumes you already know what and why. MINIMAL theory.
  - **Reference:** Complete technical details. Every option, every field, every edge case. NO narrative.
  - **Decision Tree:** When to use this vs. alternatives. NO implementation details.
- Use templates for each layer type
- Review content against layer rules before merging

**Detection:**
- Code examples appear in conceptual sections
- How-to guides open with two paragraphs of background
- Reference sections include "you should" recommendations

**Phase to address:** Phase 1 (content templates) and ongoing enforcement.

---

### Pitfall 8: Ignoring the AMA Content

**What goes wrong:** The `ama.html` file (93KB) contains Q&A content that represents real user questions and answers about the ecosystem. This gets ignored during knowledge base construction because it is in a different format and feels supplementary.

**Why it happens:** The AMA is Q&A-shaped, not reference-shaped. Extracting structured knowledge from conversational Q&A requires effort. It is easier to write from scratch.

**Consequences:** The knowledge base misses the actual questions users ask, the edge cases that come up in practice, and the nuanced explanations that work because they responded to real confusion. The site and agent end up answering questions nobody asked while missing questions everybody has.

**Prevention:**
- Mine `ama.html` for: (a) most-asked topic areas, (b) edge cases and gotchas mentioned in answers, (c) specific phrasing users use when confused
- Use AMA questions as test cases for the agent
- Use AMA answers to seed the how-to and conceptual layers

**Detection:**
- Knowledge base does not address common questions visible in the AMA
- Agent cannot answer questions that the AMA already answered

**Phase to address:** Phase 1 (knowledge base seeding from existing content).

---

### Pitfall 9: Building a Build System Nobody Maintains

**What goes wrong:** To solve the HTML monolith problem and the single-source-of-truth requirement, the project introduces a build step (static site generator, markdown compiler, template engine). This build system becomes its own maintenance burden -- dependencies to update, breaking changes in the toolchain, CI configuration to maintain.

**Why it happens:** The instinct to "do it right" leads to adopting a framework when a 50-line shell script would suffice. The project is a documentation site with ~10 topics, not a content management platform.

**Consequences:** More time spent fighting the build system than writing content. Contributors need to understand the toolchain before they can edit content. Updates stall because "the build is broken."

**Prevention:**
- Use the **lightest possible build step**: a shell script or Node.js script that concatenates markdown-to-HTML output into a template, not a full SSG framework
- If using an SSG, use one with zero or near-zero configuration (e.g., a single-file approach)
- The build step must be runnable with `npm run build` and nothing else
- No external service dependencies (no headless CMS, no API calls during build)
- Document the build in 10 lines or fewer

**Detection:**
- Build step has more than 3 dependencies
- New contributor cannot build the site in under 2 minutes
- Build configuration file exceeds 50 lines

**Phase to address:** Phase 1 (tooling decisions).

## Minor Pitfalls

### Pitfall 10: Agent Personality and Scope Creep

**What goes wrong:** The agent starts answering general Claude/AI questions instead of staying focused on the Claude Code ecosystem. Users ask "how do I fine-tune Claude?" and the agent attempts an answer instead of redirecting.

**Prevention:**
- Agent system prompt must define explicit scope boundaries
- Include redirect responses: "That's about the Claude API, not Claude Code extensions. Check docs.anthropic.com for API questions."
- Test with out-of-scope questions

**Phase to address:** Phase 2 (agent system prompt design).

---

### Pitfall 11: Search That Does Not Scale

**What goes wrong:** The existing site search (likely client-side text matching) breaks down when content volume grows 3-5x with the new layered documentation.

**Prevention:**
- Use a client-side search index (e.g., Lunr.js, Pagefind, Fuse.js) built at compile time rather than runtime text scanning
- Index content by topic, layer, and keywords
- Test search with 50+ sections

**Phase to address:** Phase 3 (site enhancement).

---

### Pitfall 12: Over-Engineering the Live Fetch

**What goes wrong:** The agent's live fetch capability becomes an attempt to build a general-purpose web scraper that can parse any documentation site. Edge cases multiply: JavaScript-rendered docs, authentication walls, rate limits, changing page structures.

**Prevention:**
- Hardcode a small list of known-good documentation URLs (Anthropic docs, Claude Code GitHub)
- Use Claude Code's built-in WebFetch or Bash (curl) rather than building custom scraping
- Accept that live fetch is a supplement with graceful degradation, not a guaranteed feature
- Define explicit fallback: "I couldn't fetch the latest docs. Here's what I know as of [date]."

**Phase to address:** Phase 3 (agent live fetch implementation).

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Knowledge base format | Content format lock-in (#1) | Define markdown-first format before writing any content |
| HTML refactor | Monolith becomes untouchable (#4) | Refactor structure BEFORE adding content |
| HTML refactor | Over-engineered build system (#9) | Start with minimal tooling, add complexity only when pain justifies it |
| Agent architecture | Monolithic skill file (#2) | Design modular architecture with size budgets |
| Agent architecture | Path resolution failures (#5) | Use absolute paths or well-known locations, add self-check |
| Content authoring | Layer boundaries blur (#7) | Enforce templates per layer type |
| Content authoring | AMA content ignored (#8) | Mine AMA before writing from scratch |
| Agent live fetch | Over-engineering (#12) | Hardcoded URL list, graceful degradation |
| Decision trees | Logic mismatches (#6) | Scenario-based testing for every path |
| Staleness | No update path (#3) | Metadata schema with dates, staleness caveats |

## Sources

- Direct analysis of project codebase: `index.html` (2343 lines, monolithic), `ama.html` (93KB), existing GitHub Pages deployment
- Direct analysis of Claude Code agent file patterns: `~/.claude/agents/` (12 agent files ranging 5-43KB, markdown format with YAML frontmatter)
- Project constraints from `.planning/PROJECT.md`
- Training data knowledge of documentation architecture patterns (Divio documentation system, docs-as-code movement), static site generation, and CLI agent design -- MEDIUM confidence, patterns are well-established but specific tooling recommendations should be validated against current versions
