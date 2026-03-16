import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';

describe('Per-topic decision guidance', () => {
  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
  });

  it('at least 8 of 10 topic pages contain enhanced decision guidance', () => {
    const topicFiles = readdirSync('docs/topics')
      .filter(f => f.endsWith('.html'))
      .filter(f => {
        // Only check the 10 core topic pages
        const topics = [
          'skills.html', 'agents.html', 'mcp.html', 'plugins.html',
          'hooks.html', 'commands.html', 'connectors.html', 'memory.html',
          'projects.html', 'settings.html'
        ];
        return topics.includes(f);
      });

    let guidanceCount = 0;
    for (const file of topicFiles) {
      const html = readFileSync('docs/topics/' + file, 'utf-8');
      // Check for "When to Use" section AND cross-reference guidance
      const hasWhenToUse = html.includes('When to Use');
      const hasAlternative = /instead|choose|consider|alternative/i.test(html);
      if (hasWhenToUse && hasAlternative) {
        guidanceCount++;
      }
    }

    assert.ok(
      guidanceCount >= 8,
      'At least 8 of 10 topic pages should have enhanced decision guidance with cross-references (found ' + guidanceCount + ')'
    );
  });
});
