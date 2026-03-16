import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

describe('Comparisons page', () => {
  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
  });

  it('comparisons.html exists after build', () => {
    assert.ok(existsSync('docs/topics/comparisons.html'), 'docs/topics/comparisons.html should exist');
  });

  it('contains at least 3 HTML table elements', () => {
    const html = readFileSync('docs/topics/comparisons.html', 'utf-8');
    const tableCount = (html.match(/<table>/g) || []).length;
    assert.ok(tableCount >= 3, 'Page should contain at least 3 tables (found ' + tableCount + ')');
  });

  it('contains key extension point names', () => {
    const html = readFileSync('docs/topics/comparisons.html', 'utf-8');
    assert.ok(html.includes('Skill'), 'Page should mention Skill');
    assert.ok(html.includes('Agent'), 'Page should mention Agent');
    assert.ok(html.includes('MCP'), 'Page should mention MCP');
    assert.ok(html.includes('Plugin'), 'Page should mention Plugin');
    assert.ok(html.includes('Hook'), 'Page should mention Hook');
  });

  it('sidebar contains Decision Tools section', () => {
    const html = readFileSync('docs/topics/comparisons.html', 'utf-8');
    assert.ok(html.includes('Decision Tools'), 'Sidebar should contain "Decision Tools" section');
  });
});
