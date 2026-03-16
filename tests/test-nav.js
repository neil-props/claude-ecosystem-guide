import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const DOCS_DIR = join(import.meta.dirname, '..', 'docs');
const TOPICS_DIR = join(DOCS_DIR, 'topics');

// Collect all generated HTML files
function getAllHtmlFiles() {
  const files = [];
  const rootIndex = join(DOCS_DIR, 'index.html');
  if (existsSync(rootIndex)) {
    files.push(rootIndex);
  }
  if (existsSync(TOPICS_DIR)) {
    for (const f of readdirSync(TOPICS_DIR)) {
      if (f.endsWith('.html')) {
        files.push(join(TOPICS_DIR, f));
      }
    }
  }
  return files;
}

describe('Sidebar navigation', () => {
  const htmlFiles = getAllHtmlFiles();

  it('generated at least one HTML file', () => {
    assert.ok(htmlFiles.length > 0, 'No HTML files found in docs/');
  });

  it('every page has a sidebar element', () => {
    for (const file of htmlFiles) {
      const html = readFileSync(file, 'utf-8');
      assert.ok(
        html.includes('<aside class="sidebar"'),
        `Missing sidebar in ${file}`
      );
    }
  });

  it('sidebar contains nav links for all topic pages', () => {
    // Check that index page sidebar has links for each topic
    const indexHtml = readFileSync(join(DOCS_DIR, 'index.html'), 'utf-8');
    const topicFiles = existsSync(TOPICS_DIR) ? readdirSync(TOPICS_DIR).filter(f => f.endsWith('.html')) : [];

    for (const topicFile of topicFiles) {
      const slug = topicFile.replace('.html', '');
      assert.ok(
        indexHtml.includes(`topics/${slug}.html`),
        `Index page sidebar missing link for ${slug}`
      );
    }
  });

  it('each topic page has exactly one active nav link matching itself', () => {
    if (!existsSync(TOPICS_DIR)) return;
    const topicFiles = readdirSync(TOPICS_DIR).filter(f => f.endsWith('.html'));

    for (const topicFile of topicFiles) {
      const html = readFileSync(join(TOPICS_DIR, topicFile), 'utf-8');
      const slug = topicFile.replace('.html', '');

      // Count active nav-link occurrences
      const activeMatches = html.match(/class="nav-link active"/g);
      assert.ok(
        activeMatches && activeMatches.length === 1,
        `${topicFile} should have exactly one active nav link, found ${activeMatches ? activeMatches.length : 0}`
      );

      // The active link should reference this page's slug
      // Match either href...class or class...href ordering
      const activeLink = html.match(/<a[^>]*class="nav-link active"[^>]*/);
      assert.ok(
        activeLink && activeLink[0].includes(`${slug}.html`),
        `${topicFile} active link should reference ${slug}.html`
      );
    }
  });

  it('index page has no active topic link', () => {
    const indexHtml = readFileSync(join(DOCS_DIR, 'index.html'), 'utf-8');
    const activeMatches = indexHtml.match(/class="nav-link active"/g);
    assert.ok(
      !activeMatches,
      `Index page should have no active topic nav link, found ${activeMatches ? activeMatches.length : 0}`
    );
  });

  it('theme toggle button exists in every page', () => {
    for (const file of htmlFiles) {
      const html = readFileSync(file, 'utf-8');
      assert.ok(
        html.includes('id="themeToggle"'),
        `Missing theme toggle in ${file}`
      );
    }
  });

  it('mobile nav toggle button exists in every page', () => {
    for (const file of htmlFiles) {
      const html = readFileSync(file, 'utf-8');
      assert.ok(
        html.includes('class="mobile-nav-toggle"'),
        `Missing mobile nav toggle in ${file}`
      );
    }
  });
});
