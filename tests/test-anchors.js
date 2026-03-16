import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

describe('Heading anchors', () => {
  let topicFiles = [];

  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
    topicFiles = readdirSync('docs/topics')
      .filter(f => f.endsWith('.html'))
      .map(f => join('docs/topics', f));
  });

  it('HTML files contain heading elements with id attributes', () => {
    assert.ok(topicFiles.length > 0, 'Should have topic files to test');
    for (const file of topicFiles) {
      const html = readFileSync(file, 'utf-8');
      const hasHeadingWithId = /<h[1-6]\s+id="[^"]+">/.test(html);
      assert.ok(hasHeadingWithId, `${file} should have headings with id attributes`);
    }
  });

  it('heading IDs are URL-safe slugs', () => {
    for (const file of topicFiles) {
      const html = readFileSync(file, 'utf-8');
      const ids = [...html.matchAll(/<h[1-6]\s+id="([^"]+)">/g)].map(m => m[1]);
      for (const id of ids) {
        assert.match(id, /^[a-z0-9-]+$/, `ID "${id}" in ${file} should be URL-safe (lowercase, hyphens, no special chars)`);
      }
    }
  });

  it('anchor links exist next to headings', () => {
    for (const file of topicFiles) {
      const html = readFileSync(file, 'utf-8');
      const hasAnchorLink = /<a class="anchor" href="#[^"]+">/.test(html);
      assert.ok(hasAnchorLink, `${file} should have anchor links next to headings`);
    }
  });
});
