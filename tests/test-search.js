import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

describe('Search integration', () => {
  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
  });

  it('template output contains search input element', () => {
    const html = readFileSync('docs/index.html', 'utf-8');
    assert.ok(html.includes('id="searchInput"'), 'should have searchInput element');
  });

  it('template output contains search results container', () => {
    const html = readFileSync('docs/index.html', 'utf-8');
    assert.ok(html.includes('id="searchResults"'), 'should have searchResults element');
  });

  it('main tag has data-pagefind-body attribute', () => {
    const html = readFileSync('docs/index.html', 'utf-8');
    assert.ok(html.includes('data-pagefind-body'), 'main should have data-pagefind-body');
  });

  it('main.js contains pagefind integration', () => {
    const js = readFileSync('docs/assets/main.js', 'utf-8');
    assert.ok(js.includes('pagefind'), 'main.js should reference pagefind');
  });

  it('sidebar nav does NOT have data-pagefind-body', () => {
    const html = readFileSync('docs/index.html', 'utf-8');
    // Extract sidebar section and verify it doesn't contain data-pagefind-body
    const sidebarMatch = html.match(/<aside class="sidebar"[\s\S]*?<\/aside>/);
    assert.ok(sidebarMatch, 'sidebar should exist');
    assert.ok(!sidebarMatch[0].includes('data-pagefind-body'), 'sidebar should NOT have data-pagefind-body');
  });

  it('search container is between sidebar-header and sidebar-nav', () => {
    const html = readFileSync('docs/index.html', 'utf-8');
    const headerIdx = html.indexOf('sidebar-header');
    const searchIdx = html.indexOf('search-container');
    const navIdx = html.indexOf('sidebar-nav');
    assert.ok(headerIdx < searchIdx, 'search should come after sidebar-header');
    assert.ok(searchIdx < navIdx, 'search should come before sidebar-nav');
  });
});
