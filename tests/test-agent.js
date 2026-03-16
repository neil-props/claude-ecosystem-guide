import { describe, it } from 'node:test';
import assert from 'node:assert';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const AGENT_PATH = join(process.cwd(), '.claude', 'agents', 'claude-ecosystem.md');
const SKILLS_DIR = join(process.cwd(), '.claude', 'skills');

const SKILL_NAMES = [
  'ecosystem-mcp',
  'ecosystem-skills',
  'ecosystem-plugins',
  'ecosystem-hooks',
  'ecosystem-agents',
  'ecosystem-projects',
  'ecosystem-connectors',
  'ecosystem-commands',
  'ecosystem-memory',
  'ecosystem-settings',
];

describe('AGNT-01: Agent file exists with valid frontmatter', () => {
  it('agent file exists at .claude/agents/claude-ecosystem.md', () => {
    assert.ok(existsSync(AGENT_PATH), 'Agent file should exist');
  });

  it('agent file has valid YAML frontmatter with name: claude-ecosystem', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { data } = matter(raw);
    assert.strictEqual(data.name, 'claude-ecosystem', 'name should be claude-ecosystem');
  });

  it('frontmatter has model, maxTurns, and description', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { data } = matter(raw);
    assert.ok(data.model, 'model field should exist');
    assert.ok(data.maxTurns, 'maxTurns field should exist');
    assert.ok(data.description, 'description field should exist');
  });
});

describe('AGNT-02: Frontmatter has skills array listing all 10 skill names', () => {
  it('skills field is an array with 10 entries', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { data } = matter(raw);
    assert.ok(Array.isArray(data.skills), 'skills should be an array');
    assert.strictEqual(data.skills.length, 10, 'skills array should have 10 entries');
  });

  it('skills array contains all expected skill names', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { data } = matter(raw);
    for (const name of SKILL_NAMES) {
      assert.ok(data.skills.includes(name), `skills should include ${name}`);
    }
  });
});

describe('AGNT-03: All 10 skill directories exist with SKILL.md', () => {
  for (const name of SKILL_NAMES) {
    it(`${name}/SKILL.md exists`, () => {
      const skillPath = join(SKILLS_DIR, name, 'SKILL.md');
      assert.ok(existsSync(skillPath), `${skillPath} should exist`);
    });
  }
});

describe('AGNT-04: Frontmatter tools include WebFetch and WebSearch', () => {
  it('tools field includes WebFetch', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { data } = matter(raw);
    const tools = typeof data.tools === 'string' ? data.tools : String(data.tools);
    assert.ok(tools.includes('WebFetch'), 'tools should include WebFetch');
  });

  it('tools field includes WebSearch', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { data } = matter(raw);
    const tools = typeof data.tools === 'string' ? data.tools : String(data.tools);
    assert.ok(tools.includes('WebSearch'), 'tools should include WebSearch');
  });
});

describe('AGNT-05: System prompt contains citation instructions', () => {
  it('body mentions citing sources', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { content } = matter(raw);
    assert.ok(/cite|citation|source/i.test(content), 'body should contain citation instructions');
  });
});

describe('AGNT-06: System prompt contains project context reading instructions', () => {
  it('body mentions CLAUDE.md', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { content } = matter(raw);
    assert.ok(content.includes('CLAUDE.md'), 'body should reference CLAUDE.md');
  });

  it('body mentions .mcp.json', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { content } = matter(raw);
    assert.ok(content.includes('.mcp.json'), 'body should reference .mcp.json');
  });

  it('body mentions settings', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { content } = matter(raw);
    assert.ok(/settings/i.test(content), 'body should reference settings');
  });
});

describe('AGNT-07: System prompt contains setup workflow instructions', () => {
  it('body mentions setup and workflow or step-by-step', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { content } = matter(raw);
    assert.ok(/setup/i.test(content), 'body should mention setup');
    assert.ok(/workflow|step-by-step|step \d/i.test(content), 'body should mention workflow or step-by-step');
  });
});

describe('AGNT-08: System prompt contains audit/health-check instructions', () => {
  it('body mentions audit or health check', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { content } = matter(raw);
    assert.ok(/audit|health.check/i.test(content), 'body should mention audit or health check');
  });
});

describe('AGNT-09: System prompt contains comparison format template', () => {
  it('body contains a comparison table pattern (Dimension or vs)', () => {
    const raw = readFileSync(AGENT_PATH, 'utf-8');
    const { content } = matter(raw);
    assert.ok(/Dimension|vs\s|versus|\| Purpose/i.test(content), 'body should contain comparison format');
  });
});
