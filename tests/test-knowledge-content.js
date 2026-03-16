import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';

const TOPIC_SLUGS = [
  'mcp', 'skills', 'plugins', 'hooks', 'agents',
  'projects', 'connectors', 'commands', 'memory', 'settings'
];

describe('Knowledge base content completeness', () => {
  for (const slug of TOPIC_SLUGS) {
    const filePath = `content/${slug}.md`;

    it(`${filePath} exists`, () => {
      assert.ok(existsSync(filePath), `${filePath} should exist`);
    });

    it(`${filePath} has more than 80 lines of real content`, () => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      assert.ok(
        lines.length > 80,
        `${filePath} has ${lines.length} lines, expected > 80`
      );
    });

    it(`${filePath} does not contain "Coming Soon" placeholder`, () => {
      const content = readFileSync(filePath, 'utf-8');
      assert.ok(
        !content.includes('Coming Soon'),
        `${filePath} should not contain "Coming Soon" placeholder text`
      );
    });
  }
});
