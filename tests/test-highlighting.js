import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

describe('Syntax highlighting and copy buttons', () => {
  let topicFiles = [];

  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
    topicFiles = readdirSync('docs/topics')
      .filter(f => f.endsWith('.html'))
      .map(f => join('docs/topics', f));
  });

  it('HTML files contain hljs class on code blocks', () => {
    assert.ok(topicFiles.length > 0, 'Should have topic files to test');
    for (const file of topicFiles) {
      const html = readFileSync(file, 'utf-8');
      const hasHljs = /class="hljs/.test(html);
      assert.ok(hasHljs, `${file} should have hljs class on code blocks`);
    }
  });

  it('HTML files contain copy-btn class for copy buttons', () => {
    for (const file of topicFiles) {
      const html = readFileSync(file, 'utf-8');
      const hasCopyBtn = /copy-btn/.test(html);
      assert.ok(hasCopyBtn, `${file} should have copy-btn class`);
    }
  });

  it('code blocks are wrapped in a .code-block container div', () => {
    for (const file of topicFiles) {
      const html = readFileSync(file, 'utf-8');
      const hasCodeBlock = /class="code-block"/.test(html);
      assert.ok(hasCodeBlock, `${file} should have .code-block container divs`);
    }
  });
});
