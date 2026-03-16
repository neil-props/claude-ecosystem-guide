import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';

const TOPIC_SLUGS = [
  'mcp', 'skills', 'plugins', 'hooks', 'agents',
  'projects', 'connectors', 'commands', 'memory', 'settings'
];

describe('AMA content integration', () => {

  it('at least 5 topic files contain a "## Common Questions" section', () => {
    let count = 0;
    for (const slug of TOPIC_SLUGS) {
      const filePath = `content/${slug}.md`;
      if (!existsSync(filePath)) continue;
      const content = readFileSync(filePath, 'utf-8');
      if (content.includes('## Common Questions')) {
        count++;
      }
    }
    assert.ok(
      count >= 5,
      `Only ${count} topic files have "## Common Questions", expected >= 5`
    );
  });

  it('each Common Questions section contains at least one bold question or ### heading', () => {
    for (const slug of TOPIC_SLUGS) {
      const filePath = `content/${slug}.md`;
      if (!existsSync(filePath)) continue;
      const content = readFileSync(filePath, 'utf-8');
      const cqIdx = content.indexOf('## Common Questions');
      if (cqIdx === -1) continue;

      const cqSection = content.slice(cqIdx);
      const hasBoldQ = /\*\*[^*]+\?\*\*/.test(cqSection);
      const hasH3Q = /### .+\?/.test(cqSection);
      assert.ok(
        hasBoldQ || hasH3Q,
        `${filePath} Common Questions section should contain at least one bold question (**Q?**) or ### heading`
      );
    }
  });

});
