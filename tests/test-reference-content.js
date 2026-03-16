import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

describe('Reference tab content checks', () => {
  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
  });

  /**
   * Helper: extract the reference tab-panel content from an HTML file.
   * Returns the inner HTML of <div class="tab-panel" data-tab-panel="reference">...</div>
   */
  function getReferencePanel(filename) {
    const html = readFileSync(`docs/topics/${filename}`, 'utf-8');
    // Reference is the last tab panel; extract from its opening tag to the closing </div> sequence that ends the tabs container
    const match = html.match(/data-tab-panel="reference"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/);
    assert.ok(match, `${filename} should have a reference tab-panel`);
    return match[1];
  }

  function assertNoPlaceholder(content, filename) {
    const lower = content.toLowerCase();
    assert.ok(
      !lower.includes('coming in phase 4'),
      `${filename} reference tab should not contain "coming in Phase 4" placeholder`
    );
    assert.ok(
      !lower.includes('coming soon'),
      `${filename} reference tab should not contain "coming soon" placeholder`
    );
  }

  describe('mcp.html (REFR-01)', () => {
    let panel;
    before(() => { panel = getReferencePanel('mcp.html'); });

    it('contains Field column header', () => {
      assert.ok(panel.includes('Field'), 'mcp.html reference should include Field column');
    });

    it('contains Type column header', () => {
      assert.ok(panel.includes('Type'), 'mcp.html reference should include Type column');
    });

    it('contains Required column header', () => {
      assert.ok(panel.includes('Required'), 'mcp.html reference should include Required column');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'mcp.html');
    });
  });

  describe('skills.html (REFR-02)', () => {
    let panel;
    before(() => { panel = getReferencePanel('skills.html'); });

    it('contains Field column header', () => {
      assert.ok(panel.includes('Field'), 'skills.html reference should include Field column');
    });

    it('contains Type column header', () => {
      assert.ok(panel.includes('Type'), 'skills.html reference should include Type column');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'skills.html');
    });
  });

  describe('plugins.html (REFR-03)', () => {
    let panel;
    before(() => { panel = getReferencePanel('plugins.html'); });

    it('contains Field column header', () => {
      assert.ok(panel.includes('Field'), 'plugins.html reference should include Field column');
    });

    it('contains Type column header', () => {
      assert.ok(panel.includes('Type'), 'plugins.html reference should include Type column');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'plugins.html');
    });
  });

  describe('hooks.html (REFR-04)', () => {
    let panel;
    before(() => { panel = getReferencePanel('hooks.html'); });

    it('contains Field column header', () => {
      assert.ok(panel.includes('Field'), 'hooks.html reference should include Field column');
    });

    it('contains Type column header', () => {
      assert.ok(panel.includes('Type'), 'hooks.html reference should include Type column');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'hooks.html');
    });
  });

  describe('agents.html (REFR-05)', () => {
    let panel;
    before(() => { panel = getReferencePanel('agents.html'); });

    it('contains Field column header', () => {
      assert.ok(panel.includes('Field'), 'agents.html reference should include Field column');
    });

    it('contains Type column header', () => {
      assert.ok(panel.includes('Type'), 'agents.html reference should include Type column');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'agents.html');
    });
  });

  describe('settings.html (REFR-06)', () => {
    let panel;
    before(() => { panel = getReferencePanel('settings.html'); });

    it('contains Field column header', () => {
      assert.ok(panel.includes('Field'), 'settings.html reference should include Field column');
    });

    it('contains Type column header', () => {
      assert.ok(panel.includes('Type'), 'settings.html reference should include Type column');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'settings.html');
    });
  });

  describe('projects.html (REFR-07)', () => {
    let panel;
    before(() => { panel = getReferencePanel('projects.html'); });

    it('mentions CLAUDE.md', () => {
      assert.ok(panel.includes('CLAUDE.md'), 'projects.html reference should mention CLAUDE.md');
    });

    it('has no placeholder text', () => {
      assertNoPlaceholder(panel, 'projects.html');
    });
  });
});
