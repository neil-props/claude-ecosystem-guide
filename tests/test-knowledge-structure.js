import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const TOPIC_SLUGS = [
  'mcp', 'skills', 'plugins', 'hooks', 'agents',
  'projects', 'connectors', 'commands', 'memory', 'settings'
];

const REQUIRED_FRONTMATTER_FIELDS = ['title', 'slug', 'order', 'description', 'section'];

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      fields[key] = value;
    }
  }
  return fields;
}

describe('Knowledge base structure validation', () => {
  for (const slug of TOPIC_SLUGS) {
    const filePath = `content/${slug}.md`;

    it(`${filePath} has valid YAML frontmatter with required fields`, () => {
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);
      assert.ok(fm, `${filePath} should have YAML frontmatter`);
      for (const field of REQUIRED_FRONTMATTER_FIELDS) {
        assert.ok(
          fm[field] !== undefined && fm[field] !== '',
          `${filePath} frontmatter missing required field: ${field}`
        );
      }
    });

    it(`${filePath} contains an "## Overview" heading`, () => {
      const content = readFileSync(filePath, 'utf-8');
      assert.ok(
        content.includes('## Overview'),
        `${filePath} should contain "## Overview" heading`
      );
    });

    it(`${filePath} has at least 3 ## level headings`, () => {
      const content = readFileSync(filePath, 'utf-8');
      const headings = content.match(/^## /gm) || [];
      assert.ok(
        headings.length >= 3,
        `${filePath} has ${headings.length} ## headings, expected >= 3`
      );
    });
  }
});
