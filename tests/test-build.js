import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';

describe('Build output', () => {
  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
  });

  it('build script runs without error', () => {
    // If we got here, the before() hook succeeded
    assert.ok(true);
  });

  it('docs/index.html exists after build', () => {
    assert.ok(existsSync('docs/index.html'), 'docs/index.html should exist');
  });

  it('at least one file in docs/topics/ exists after build', () => {
    assert.ok(existsSync('docs/topics'), 'docs/topics/ directory should exist');
    const files = readdirSync('docs/topics').filter(f => f.endsWith('.html'));
    assert.ok(files.length > 0, 'docs/topics/ should contain at least one HTML file');
  });

  it('docs/assets/style.css exists after build', () => {
    assert.ok(existsSync('docs/assets/style.css'), 'docs/assets/style.css should exist');
  });

  it('docs/assets/main.js exists after build', () => {
    assert.ok(existsSync('docs/assets/main.js'), 'docs/assets/main.js should exist');
  });
});
