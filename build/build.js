import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, copyFileSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/core';

// Register only needed languages
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import markdown from 'highlight.js/lib/languages/markdown';
import xml from 'highlight.js/lib/languages/xml';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('plaintext', plaintext);

// Resolve paths relative to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'content');
const DOCS_DIR = join(ROOT, 'docs');
const TEMPLATE_PATH = join(__dirname, 'templates', 'page.html');
const ASSETS_SRC = join(DOCS_DIR, 'assets');

// Configure marked with highlight.js
marked.use(markedHighlight({
  emptyLangClass: 'hljs',
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

// Slugify text for heading IDs
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/[^\w\s-]/g, '')  // remove special chars
    .replace(/\s+/g, '-')      // spaces to hyphens
    .replace(/-+/g, '-')       // collapse multiple hyphens
    .replace(/^-|-$/g, '');    // trim leading/trailing hyphens
}

// Custom renderer for headings with anchor links
const renderer = new marked.Renderer();
renderer.heading = function({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const slug = slugify(text);
  return `<h${depth} id="${slug}">${text}<a class="anchor" href="#${slug}">#</a></h${depth}>\n`;
};

// Custom renderer for callout blockquotes
renderer.blockquote = function({ tokens }) {
  // Parse tokens to get raw text content
  const rawText = tokens.map(t => t.raw || '').join('');
  const calloutMatch = rawText.match(/^\s*\[!(INFO|WARNING|TIP|DANGER)\]\s*\n?([\s\S]*)/i);
  if (calloutMatch) {
    const type = calloutMatch[1].toLowerCase();
    const label = calloutMatch[1].charAt(0).toUpperCase() + calloutMatch[1].slice(1).toLowerCase();
    const body = calloutMatch[2].trim();
    return `<div class="callout callout-${type}">
  <div class="callout-title">${label}</div>
  <p>${body}</p>
</div>\n`;
  }
  // Default blockquote rendering
  const bodyHtml = this.parser.parse(tokens);
  return `<blockquote>${bodyHtml}</blockquote>\n`;
};

// Custom renderer for code blocks with copy button
renderer.code = function({ text, lang }) {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const displayLang = lang || '';
  const highlighted = hljs.getLanguage(language)
    ? hljs.highlight(text, { language }).value
    : text;
  return `<div class="code-block">
  <div class="code-header">
    <span class="code-lang">${displayLang}</span>
    <button class="copy-btn" aria-label="Copy code">Copy</button>
  </div>
  <pre><code class="hljs language-${language}">${highlighted}</code></pre>
</div>\n`;
};

marked.use({ renderer });

// Read HTML template
const template = readFileSync(TEMPLATE_PATH, 'utf-8');

// Clean docs directory (preserve assets/)
function cleanDocs() {
  if (existsSync(DOCS_DIR)) {
    // Remove all HTML files in docs root
    if (existsSync(DOCS_DIR)) {
      const rootFiles = readdirSync(DOCS_DIR);
      for (const f of rootFiles) {
        if (f.endsWith('.html')) {
          rmSync(join(DOCS_DIR, f));
        }
      }
    }
    // Remove topics directory entirely
    const topicsDir = join(DOCS_DIR, 'topics');
    if (existsSync(topicsDir)) {
      rmSync(topicsDir, { recursive: true });
    }
  }
}

// Load all content pages and parse frontmatter
async function loadPages() {
  const files = await glob('*.md', { cwd: CONTENT_DIR });
  const pages = [];

  for (const file of files) {
    const filePath = join(CONTENT_DIR, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { data: meta } = matter(raw);
    const slug = meta.slug || file.replace('.md', '');
    pages.push({ file, filePath, slug, meta });
  }

  return pages;
}

// Generate sidebar navigation HTML for a specific page
function generateNav(pages, currentSlug, basePath) {
  // Separate pages by section
  const topicPages = pages
    .filter(p => p.meta.section === 'topics')
    .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));

  const referencePages = pages
    .filter(p => p.meta.section === 'reference')
    .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));

  let nav = '';

  // Topics section
  nav += '<div class="nav-section">\n';
  nav += '  <div class="nav-section-title">Topics</div>\n';
  for (const page of topicPages) {
    const activeClass = page.slug === currentSlug ? ' active' : '';
    nav += `  <a href="${basePath}topics/${page.slug}.html" class="nav-link${activeClass}">${page.meta.title}</a>\n`;
  }
  nav += '</div>\n';

  // Reference section (if any reference pages exist)
  if (referencePages.length > 0) {
    nav += '<div class="nav-section">\n';
    nav += '  <div class="nav-section-title">Reference</div>\n';
    for (const page of referencePages) {
      const activeClass = page.slug === currentSlug ? ' active' : '';
      nav += `  <a href="${basePath}topics/${page.slug}.html" class="nav-link${activeClass}">${page.meta.title}</a>\n`;
    }
    nav += '</div>\n';
  }

  return nav;
}

// Build a single page
function buildPage(filePath, basePath, navHtml) {
  const raw = readFileSync(filePath, 'utf-8');
  const { data: meta, content } = matter(raw);
  const html = marked.parse(content);

  const page = template
    .replace(/\{\{title\}\}/g, meta.title || 'Untitled')
    .replace(/\{\{content\}\}/g, html)
    .replace(/\{\{nav\}\}/g, navHtml)
    .replace(/\{\{basePath\}\}/g, basePath);

  return { page, meta };
}

// Main build
async function build() {
  console.log('Building Claude Ecosystem Guide...\n');

  // Clean previous output
  cleanDocs();

  // Ensure output directories exist
  mkdirSync(join(DOCS_DIR, 'topics'), { recursive: true });
  mkdirSync(join(DOCS_DIR, 'assets'), { recursive: true });

  // Load all pages for nav generation
  const pages = await loadPages();

  if (pages.length === 0) {
    console.warn('Warning: No content files found in content/');
    return;
  }

  let pageCount = 0;

  for (const { file, filePath, slug, meta } of pages) {
    let outputPath;
    let basePath;

    if (slug === 'index') {
      outputPath = join(DOCS_DIR, 'index.html');
      basePath = '';
    } else {
      outputPath = join(DOCS_DIR, 'topics', `${slug}.html`);
      basePath = '../';
    }

    // Generate nav with active state for this specific page
    const navHtml = generateNav(pages, slug, basePath);
    const { page } = buildPage(filePath, basePath, navHtml);
    writeFileSync(outputPath, page);
    console.log(`  Built: ${outputPath.replace(ROOT + '/', '')}`);
    pageCount++;
  }

  console.log(`\nDone! Built ${pageCount} pages.`);
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
