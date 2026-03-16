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

  it('HTML files with code blocks contain hljs class', () => {
    assert.ok(topicFiles.length > 0, 'Should have topic files to test');
    const filesWithCode = topicFiles.filter(f => /<pre>/.test(readFileSync(f, 'utf-8')));
    assert.ok(filesWithCode.length > 0, 'At least one topic file should have code blocks');
    for (const file of filesWithCode) {
      const html = readFileSync(file, 'utf-8');
      const hasHljs = /class="hljs/.test(html);
      assert.ok(hasHljs, `${file} should have hljs class on code blocks`);
    }
  });

  it('HTML files with code blocks contain copy-btn class for copy buttons', () => {
    const filesWithCode = topicFiles.filter(f => /<pre>/.test(readFileSync(f, 'utf-8')));
    for (const file of filesWithCode) {
      const html = readFileSync(file, 'utf-8');
      const hasCopyBtn = /copy-btn/.test(html);
      assert.ok(hasCopyBtn, `${file} should have copy-btn class`);
    }
  });

  it('code blocks are wrapped in a .code-block container div', () => {
    const filesWithCode = topicFiles.filter(f => /<pre>/.test(readFileSync(f, 'utf-8')));
    for (const file of filesWithCode) {
      const html = readFileSync(file, 'utf-8');
      const hasCodeBlock = /class="code-block"/.test(html);
      assert.ok(hasCodeBlock, `${file} should have .code-block container divs`);
    }
  });
});
