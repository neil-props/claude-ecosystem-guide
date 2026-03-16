import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const RECIPE_PAGES = [
  'recipe-deployment-skill',
  'recipe-crm-mcp',
  'recipe-pre-commit-hook',
  'recipe-custom-agent',
  'recipe-monorepo-settings'
];

describe('Recipe pages', () => {
  before(() => {
    execSync('node build/build.js', { cwd: process.cwd(), stdio: 'pipe' });
  });

  for (const slug of RECIPE_PAGES) {
    const filePath = `docs/topics/${slug}.html`;

    it(`${slug}.html exists after build`, () => {
      assert.ok(existsSync(filePath), `${filePath} should exist`);
    });

    it(`${slug}.html contains recipe structure (What You, Prerequisites, Verify)`, () => {
      const html = readFileSync(filePath, 'utf-8');
      assert.ok(html.includes('What You'), `${slug} should contain "What You" heading`);
      assert.ok(html.includes('Prerequisites'), `${slug} should contain "Prerequisites" section`);
      assert.ok(html.includes('Verify'), `${slug} should contain "Verify" section`);
    });

    it(`${slug}.html contains at least 2 code blocks`, () => {
      const html = readFileSync(filePath, 'utf-8');
      const codeBlockCount = (html.match(/class="code-block"/g) || []).length;
      assert.ok(codeBlockCount >= 2, `${slug} should have at least 2 code blocks, found ${codeBlockCount}`);
    });

    it(`${slug}.html links to at least one topic page`, () => {
      const html = readFileSync(filePath, 'utf-8');
      assert.ok(html.includes('topics/'), `${slug} should link to at least one topic page`);
    });
  }
});
