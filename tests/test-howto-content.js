import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

describe('How-To tab content checks', () => {
  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
  });

  /**
   * Helper: extract the howto tab-panel content from an HTML file.
   * Returns the inner HTML of <div class="tab-panel" data-tab-panel="howto">...</div>
   */
  function getHowtoPanel(filename) {
    const html = readFileSync(`docs/topics/${filename}`, 'utf-8');
    // Howto panel is followed by the reference panel div; extract content between them
    const match = html.match(/data-tab-panel="howto"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*data-tab-panel="reference"/);
    assert.ok(match, `${filename} should have a howto tab-panel`);
    return match[1];
  }

  function assertNoPlaceholder(content, filename) {
    const lower = content.toLowerCase();
    assert.ok(
      !lower.includes('coming in phase 4'),
      `${filename} howto tab should not contain "coming in Phase 4" placeholder`
    );
    assert.ok(
      !lower.includes('coming soon'),
      `${filename} howto tab should not contain "coming soon" placeholder`
    );
  }

  describe('mcp.html (HOWT-01, HOWT-02, HOWT-03, HOWT-04)', () => {
    let panel;
    before(() => { panel = getHowtoPanel('mcp.html'); });

    it('contains Prerequisites section', () => {
      assert.ok(panel.includes('Prerequisites'), 'mcp.html howto should include Prerequisites');
    });

    it('contains Step 1 section', () => {
      assert.ok(panel.includes('Step 1'), 'mcp.html howto should include Step 1');
    });

    it('contains Verify It Works section', () => {
      assert.ok(panel.includes('Verify It Works') || panel.includes('Verify it works'),
        'mcp.html howto should include Verify It Works');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'mcp.html');
    });
  });

  describe('skills.html (HOWT-05)', () => {
    let panel;
    before(() => { panel = getHowtoPanel('skills.html'); });

    it('contains Prerequisites section', () => {
      assert.ok(panel.includes('Prerequisites'), 'skills.html howto should include Prerequisites');
    });

    it('contains Step 1 section', () => {
      assert.ok(panel.includes('Step 1'), 'skills.html howto should include Step 1');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'skills.html');
    });
  });

  describe('plugins.html (HOWT-06)', () => {
    let panel;
    before(() => { panel = getHowtoPanel('plugins.html'); });

    it('contains Prerequisites section', () => {
      assert.ok(panel.includes('Prerequisites'), 'plugins.html howto should include Prerequisites');
    });

    it('contains Step 1 section', () => {
      assert.ok(panel.includes('Step 1'), 'plugins.html howto should include Step 1');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'plugins.html');
    });
  });

  describe('hooks.html (HOWT-07)', () => {
    let panel;
    before(() => { panel = getHowtoPanel('hooks.html'); });

    it('contains Prerequisites section', () => {
      assert.ok(panel.includes('Prerequisites'), 'hooks.html howto should include Prerequisites');
    });

    it('contains Step 1 section', () => {
      assert.ok(panel.includes('Step 1'), 'hooks.html howto should include Step 1');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'hooks.html');
    });
  });

  describe('agents.html (HOWT-08)', () => {
    let panel;
    before(() => { panel = getHowtoPanel('agents.html'); });

    it('contains Prerequisites section', () => {
      assert.ok(panel.includes('Prerequisites'), 'agents.html howto should include Prerequisites');
    });

    it('contains Step 1 section', () => {
      assert.ok(panel.includes('Step 1'), 'agents.html howto should include Step 1');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'agents.html');
    });
  });

  describe('projects.html (HOWT-09)', () => {
    let panel;
    before(() => { panel = getHowtoPanel('projects.html'); });

    it('contains Prerequisites section', () => {
      assert.ok(panel.includes('Prerequisites'), 'projects.html howto should include Prerequisites');
    });

    it('contains Step 1 section', () => {
      assert.ok(panel.includes('Step 1'), 'projects.html howto should include Step 1');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'projects.html');
    });
  });

  describe('memory.html (HOWT-10)', () => {
    let panel;
    before(() => { panel = getHowtoPanel('memory.html'); });

    it('contains Prerequisites section', () => {
      assert.ok(panel.includes('Prerequisites'), 'memory.html howto should include Prerequisites');
    });

    it('contains Step 1 section', () => {
      assert.ok(panel.includes('Step 1'), 'memory.html howto should include Step 1');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'memory.html');
    });
  });
});
