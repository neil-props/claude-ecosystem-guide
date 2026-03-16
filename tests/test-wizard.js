import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

describe('Decision wizard page', () => {
  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
  });

  it('decision-wizard.html exists after build', () => {
    assert.ok(existsSync('docs/topics/decision-wizard.html'), 'docs/topics/decision-wizard.html should exist');
  });

  it('contains wizard container element with id="wizard"', () => {
    const html = readFileSync('docs/topics/decision-wizard.html', 'utf-8');
    assert.ok(html.includes('id="wizard"'), 'Page should contain element with id="wizard"');
  });

  it('contains wizard-option or wizard-step elements via noscript fallback', () => {
    const html = readFileSync('docs/topics/decision-wizard.html', 'utf-8');
    const hasWizardMarkup = html.includes('wizard-container') || html.includes('wizard-option');
    assert.ok(hasWizardMarkup, 'Page should contain wizard markup');
  });

  it('page title includes "Decision"', () => {
    const html = readFileSync('docs/topics/decision-wizard.html', 'utf-8');
    assert.ok(html.includes('Decision Wizard'), 'Page title should include "Decision Wizard"');
  });

  it('sidebar contains Decision Tools section', () => {
    const html = readFileSync('docs/topics/decision-wizard.html', 'utf-8');
    assert.ok(html.includes('Decision Tools'), 'Sidebar should contain "Decision Tools" section');
  });
});
