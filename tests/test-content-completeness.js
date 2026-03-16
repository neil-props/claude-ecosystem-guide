import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

describe('Content completeness spot-checks', () => {

  describe('content/mcp.md', () => {
    const content = readFileSync('content/mcp.md', 'utf-8');

    it('mentions JSON-RPC protocol detail', () => {
      assert.ok(content.includes('JSON-RPC'), 'mcp.md should mention JSON-RPC');
    });

    it('mentions stdio transport type', () => {
      assert.ok(content.includes('stdio'), 'mcp.md should mention stdio transport');
    });
  });

  describe('content/skills.md', () => {
    const content = readFileSync('content/skills.md', 'utf-8');

    it('mentions frontmatter as a key concept', () => {
      assert.ok(content.includes('frontmatter'), 'skills.md should mention frontmatter');
    });
  });

  describe('content/hooks.md', () => {
    const content = readFileSync('content/hooks.md', 'utf-8');

    const hookEvents = ['PreToolUse', 'PostToolUse', 'Notification', 'Stop', 'SubagentStop', 'PreCompact'];

    it('mentions at least 5 hook event names', () => {
      const found = hookEvents.filter(e => content.includes(e));
      assert.ok(
        found.length >= 5,
        `hooks.md mentions ${found.length} of ${hookEvents.length} expected hook events: ${found.join(', ')}`
      );
    });
  });

  describe('content/agents.md', () => {
    const content = readFileSync('content/agents.md', 'utf-8');

    it('mentions subagent concept', () => {
      assert.ok(
        content.includes('subagent') || content.includes('sub-agent'),
        'agents.md should mention subagent or sub-agent'
      );
    });
  });

  describe('content/plugins.md', () => {
    const content = readFileSync('content/plugins.md', 'utf-8');

    it('mentions manifest or bundle concept', () => {
      assert.ok(
        content.includes('manifest') || content.includes('bundle'),
        'plugins.md should mention manifest or bundle'
      );
    });
  });

});
