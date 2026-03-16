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
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      // Small delay to ensure layout is complete
      setTimeout(function() {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
});
