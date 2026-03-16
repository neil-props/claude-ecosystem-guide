/**
 * Claude Ecosystem Guide - Runtime JavaScript
 * Theme toggle, copy-to-clipboard, scroll-to-anchor
 * No frameworks. Vanilla JS only.
 */

document.addEventListener('DOMContentLoaded', function() {
  // ════ THEME TOGGLE ════
  const themeToggle = document.getElementById('themeToggle');

  function setTheme(theme) {
    document.documentElement.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('claude-guide-theme', theme);
    setTimeout(function() {
      document.documentElement.classList.remove('theme-transition');
    }, 400);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // ════ MOBILE NAV TOGGLE ════
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function closeMobileNav() {
    if (sidebar) sidebar.classList.remove('sidebar-open');
    if (mobileNavToggle) mobileNavToggle.classList.remove('nav-active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
  }

  function openMobileNav() {
    if (sidebar) sidebar.classList.add('sidebar-open');
    if (mobileNavToggle) mobileNavToggle.classList.add('nav-active');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
  }

  if (mobileNavToggle && sidebar) {
    mobileNavToggle.addEventListener('click', function() {
      if (sidebar.classList.contains('sidebar-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close sidebar when a nav link is clicked (mobile)
    sidebar.addEventListener('click', function(e) {
      if (e.target.closest('.nav-link')) {
        closeMobileNav();
      }
    });
  }

  // Close sidebar when overlay is clicked
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileNav);
  }

  // System preference listener
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
      // Only apply system preference if user hasn't manually set a preference
      if (!localStorage.getItem('claude-guide-theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'light' : 'dark');
      }
    });
  }

  // ════ COPY TO CLIPBOARD ════
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;

    var codeBlock = btn.closest('.code-block');
    if (!codeBlock) return;

    var code = codeBlock.querySelector('code');
    if (!code) return;

    navigator.clipboard.writeText(code.textContent).then(function() {
      btn.textContent = 'Copied!';
      btn.classList.add('copy-success');
      setTimeout(function() {
        btn.textContent = 'Copy';
        btn.classList.remove('copy-success');
      }, 2000);
    }).catch(function() {
      // Fallback for environments without clipboard API
      btn.textContent = 'Failed';
      setTimeout(function() {
        btn.textContent = 'Copy';
      }, 2000);
    });
  });

  // ════ TAB SWITCHING ════
  document.addEventListener('click', function(e) {
    var tabBtn = e.target.closest('.tab-btn');
    if (!tabBtn) return;

    var group = tabBtn.closest('.tabs');
    if (!group) return;

    var tabId = tabBtn.getAttribute('data-tab');

    // Deactivate all tabs in this group
    group.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.classList.remove('active');
    });
    group.querySelectorAll('.tab-panel').forEach(function(panel) {
      panel.classList.remove('active');
    });

    // Activate selected tab
    tabBtn.classList.add('active');
    var panel = group.querySelector('[data-tab-panel="' + tabId + '"]');
    if (panel) panel.classList.add('active');
  });

  // ════ SCROLL TO ANCHOR ════
  if (location.hash && !location.hash.startsWith('#step=')) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      // Small delay to ensure layout is complete
      setTimeout(function() {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // ════ DECISION WIZARD ════
  var wizardContainer = document.getElementById('wizard');

  if (wizardContainer) {
    var wizardSteps = {
      start: {
        question: "What are you trying to do?",
        options: [
          { label: "Connect Claude to an external tool or API", next: "external-tool" },
          { label: "Teach Claude a repeatable process", next: "repeatable" },
          { label: "Run code automatically at certain points", next: "automation" },
          { label: "Configure how Claude behaves in my project", next: "configure" },
          { label: "Create a specialized AI workflow", next: "specialized" }
        ]
      },
      "external-tool": {
        question: "What kind of integration?",
        options: [
          { label: "I want to build or host my own server", result: "mcp" },
          { label: "I want a pre-built one-click integration", result: "connectors" },
          { label: "I want to bundle tools as a distributable package", result: "plugins" }
        ]
      },
      repeatable: {
        question: "How complex is the process?",
        options: [
          { label: "Simple instructions or a checklist", result: "skills" },
          { label: "Multi-step workflow with tool access", result: "agents" },
          { label: "Quick prompt shortcut", result: "commands" }
        ]
      },
      automation: {
        question: "What triggers the automation?",
        options: [
          { label: "Code lifecycle events (before/after edits, notifications)", result: "hooks" },
          { label: "Scheduled or on-demand multi-step tasks", result: "agents" },
          { label: "Project-specific rules Claude should follow", result: "skills" }
        ]
      },
      configure: {
        question: "What level of configuration?",
        options: [
          { label: "Project-wide instructions for the team", result: "projects" },
          { label: "Behavior settings (model, permissions, tools)", result: "settings" },
          { label: "Persistent context that Claude remembers", result: "memory" }
        ]
      },
      specialized: {
        question: "What kind of workflow?",
        options: [
          { label: "Domain expert with specific knowledge", result: "skills" },
          { label: "Autonomous multi-step agent", result: "agents" }
        ]
      }
    };

    var wizardResults = {
      mcp: { name: "MCP (Model Context Protocol)", description: "Connect Claude to external tools, APIs, and data sources via a standardized server protocol.", link: "mcp.html" },
      connectors: { name: "Connectors", description: "Pre-built one-click integrations for popular services like GitHub, Slack, and Jira.", link: "connectors.html" },
      plugins: { name: "Plugins", description: "Bundle skills, hooks, MCP configs, and agents into distributable packages.", link: "plugins.html" },
      skills: { name: "Skills", description: "Reusable markdown instructions that teach Claude repeatable processes and domain expertise.", link: "skills.html" },
      agents: { name: "Agents", description: "Isolated Claude instances with their own context, memory, and tool access for complex workflows.", link: "agents.html" },
      commands: { name: "Commands", description: "Quick slash command shortcuts. Consider migrating to Skills for auto-invocation and cross-surface support.", link: "commands.html" },
      hooks: { name: "Hooks", description: "Automatic scripts that run at lifecycle events to enforce rules, lint code, or send notifications.", link: "hooks.html" },
      projects: { name: "Projects (CLAUDE.md)", description: "Project-wide instructions via CLAUDE.md files that set standards for every team member.", link: "projects.html" },
      settings: { name: "Settings", description: "Configure Claude Code behavior at user, project, and enterprise levels.", link: "settings.html" },
      memory: { name: "Memory", description: "Persistent context across sessions via auto-memory, CLAUDE.md, and the /memory command.", link: "memory.html" }
    };

    var wizardHistory = [];

    function getStepLabel(stepId) {
      if (stepId === 'start') return 'Start';
      var labels = {
        'external-tool': 'External Tool',
        'repeatable': 'Repeatable Process',
        'automation': 'Automation',
        'configure': 'Configuration',
        'specialized': 'Specialized Workflow'
      };
      return labels[stepId] || stepId;
    }

    function renderWizardProgress() {
      if (wizardHistory.length === 0) return '';
      var crumbs = wizardHistory.map(function(id) { return getStepLabel(id); });
      return '<div class="wizard-progress">' + crumbs.join(' &rsaquo; ') + '</div>';
    }

    function renderWizardStep(stepId) {
      var step = wizardSteps[stepId];
      if (!step) return;

      var html = renderWizardProgress();

      if (wizardHistory.length > 0) {
        html += '<button class="wizard-back" type="button">&larr; Back</button>';
      }

      html += '<h3 class="wizard-question">' + step.question + '</h3>';

      for (var i = 0; i < step.options.length; i++) {
        var opt = step.options[i];
        html += '<button class="wizard-option" type="button" data-next="' + (opt.next || '') + '" data-result="' + (opt.result || '') + '">' + opt.label + '</button>';
      }

      wizardContainer.innerHTML = html;
      location.hash = 'step=' + stepId;

      // Attach click handlers
      var options = wizardContainer.querySelectorAll('.wizard-option');
      for (var j = 0; j < options.length; j++) {
        options[j].addEventListener('click', function() {
          var next = this.getAttribute('data-next');
          var result = this.getAttribute('data-result');
          if (result) {
            wizardHistory.push(stepId);
            renderWizardResult(result);
          } else if (next) {
            wizardHistory.push(stepId);
            renderWizardStep(next);
          }
        });
      }

      var backBtn = wizardContainer.querySelector('.wizard-back');
      if (backBtn) {
        backBtn.addEventListener('click', function() {
          var prev = wizardHistory.pop();
          if (prev !== undefined) {
            renderWizardStep(prev);
          }
        });
      }
    }

    function renderWizardResult(resultId) {
      var result = wizardResults[resultId];
      if (!result) return;

      var html = renderWizardProgress();

      html += '<div class="wizard-result">';
      html += '<div class="wizard-result-title">' + result.name + '</div>';
      html += '<p>' + result.description + '</p>';
      html += '<a href="' + result.link + '" class="wizard-result-link">Learn more about ' + result.name + '</a>';
      html += '</div>';
      html += '<button class="wizard-back wizard-start-over" type="button">Start Over</button>';

      wizardContainer.innerHTML = html;
      location.hash = 'result=' + resultId;

      var startOver = wizardContainer.querySelector('.wizard-start-over');
      if (startOver) {
        startOver.addEventListener('click', function() {
          wizardHistory = [];
          renderWizardStep('start');
        });
      }
    }

    // Initialize wizard -- check hash for state restoration
    var hash = location.hash.slice(1);
    if (hash.startsWith('step=')) {
      var stepId = hash.replace('step=', '');
      if (wizardSteps[stepId]) {
        renderWizardStep(stepId);
      } else {
        renderWizardStep('start');
      }
    } else if (hash.startsWith('result=')) {
      var resId = hash.replace('result=', '');
      if (wizardResults[resId]) {
        renderWizardResult(resId);
      } else {
        renderWizardStep('start');
      }
    } else {
      renderWizardStep('start');
    }
  }
});
