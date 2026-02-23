---
  layout: null
sitemap:
  exclude: 'yes'
---

document.addEventListener('DOMContentLoaded', function () {
  init();

  {% if site.disable_landing_page != true %}
  var panelCover = document.querySelector('.panel-cover');
  if (window.location.pathname !== '{{ site.baseurl }}/' &&
             window.location.pathname !== '{{ site.baseurl }}/index.html') {
    // Content page: collapse panel immediately (no animation needed)
    if (panelCover) panelCover.style.transition = 'none';
    if (panelCover) panelCover.classList.add('panel-cover--collapsed');
    if (panelCover) {
      panelCover.offsetHeight;
      requestAnimationFrame(function () {
        panelCover.style.transition = '';
      });
    }
  } else if (panelCover && document.referrer.indexOf(window.location.origin) === 0) {
    // Returning from another page on this site: snap to collapsed then expand smoothly
    panelCover.style.transition = 'none';
    panelCover.classList.add('panel-cover--collapsed');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        panelCover.style.transition = '';
        panelCover.classList.remove('panel-cover--collapsed');
      });
    });
  }
  {% endif %}
});

// Single initialization function to avoid duplicate listeners on permanent elements
var initialized = false;

function init() {
  if (initialized) return;
  initialized = true;

  {% if site.disable_landing_page != true %}
  var panelCover = document.querySelector('.panel-cover');
  var contentWrapper = document.querySelector('.content-wrapper');

  function collapsePanel() {
    if (panelCover) panelCover.classList.add('panel-cover--collapsed');
  }

  document.querySelectorAll('a.blog-button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (!panelCover || panelCover.classList.contains('panel-cover--collapsed')) {
        // If already collapsed, let Turbo handle it normally
        return;
      }
      if (panelCover.offsetWidth < 960) {
        collapsePanel();
        if (contentWrapper) contentWrapper.classList.add('animated', 'slideInRight');
      } else {
        // Prevent immediate navigation so the CSS transition can complete first
        e.preventDefault();
        var href = btn.getAttribute('href');
        collapsePanel();
        panelCover.addEventListener('transitionend', function handler() {
          panelCover.removeEventListener('transitionend', handler);
          if (window.Turbo) {
            window.Turbo.visit(href);
          } else {
            window.location.href = href;
          }
        });
      }
    });
  });
  {% endif %}

  var mobileMenu = document.querySelector('.btn-mobile-menu');
  var navWrapper = document.querySelector('.navigation-wrapper');
  var menuIcon = document.querySelector('.btn-mobile-menu__icon');

  function toggleMobileNav() {
    if (navWrapper) {
      navWrapper.classList.toggle('visible');
      navWrapper.classList.toggle('animated');
      navWrapper.classList.toggle('bounceInDown');
    }
    if (menuIcon) {
      menuIcon.classList.toggle('mdi-menu');
      menuIcon.classList.toggle('mdi-close-circle');
      menuIcon.classList.toggle('animated');
      menuIcon.classList.toggle('fadeIn');
    }
  }

  if (mobileMenu) {
    mobileMenu.addEventListener('click', toggleMobileNav);
  }

  document.querySelectorAll('.navigation-wrapper .blog-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (navWrapper) navWrapper.classList.toggle('visible');
      if (menuIcon) {
        menuIcon.classList.toggle('mdi-menu');
        menuIcon.classList.toggle('mdi-close-circle');
        menuIcon.classList.toggle('animated');
        menuIcon.classList.toggle('fadeIn');
      }
    });
  });
}

// For Turbo, when navigation happens to a new page, adjust panel state
document.addEventListener('turbo:load', function() {
  {% if site.disable_landing_page != true %}
  var panelCover = document.querySelector('.panel-cover');
  if (!panelCover) return;
  
  var isHome = window.location.pathname === '{{ site.baseurl }}/' || window.location.pathname === '{{ site.baseurl }}/index.html';
  
  if (isHome) {
    if (panelCover.classList.contains('panel-cover--collapsed')) {
      // Returning home via Turbo, expand it smoothly
      panelCover.classList.remove('panel-cover--collapsed');
    }
  } else {
    // Not home, collapse it
    if (!panelCover.classList.contains('panel-cover--collapsed')) {
      panelCover.classList.add('panel-cover--collapsed');
    }
  }
  {% endif %}
});
