---
  layout: null
sitemap:
  exclude: 'yes'
---

{% if site.disable_landing_page != true %}
// Shared helper: is the current page the landing/home page?
function isHomePage() {
  var path = window.location.pathname;
  return path === '{{ site.baseurl }}/' || path === '{{ site.baseurl }}/index.html';
}
{% endif %}

// Single initialization function to avoid duplicate listeners on permanent elements
var initialized = false;

function init(panelCover) {
  if (initialized) return;
  initialized = true;

  {% if site.disable_landing_page != true %}
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

  function playAnimation(element, animationClass, extraClassesToAdd) {
    if (!element) return;
    element.classList.remove('animated', animationClass);
    if (extraClassesToAdd) {
      element.classList.add(extraClassesToAdd);
    }
    void element.offsetHeight; // force reflow
    element.classList.add('animated', animationClass);
  }

  function toggleMobileNav() {
    var opening = navWrapper && !navWrapper.classList.contains('visible');

    if (navWrapper) {
      if (opening) {
        playAnimation(navWrapper, 'fadeInDown', 'visible');
      } else {
        navWrapper.classList.remove('visible', 'animated', 'fadeInDown');
      }
    }
    if (menuIcon) {
      menuIcon.classList.toggle('fa-bars');
      menuIcon.classList.toggle('fa-circle-xmark');
      if (opening) {
        playAnimation(menuIcon, 'fadeIn');
      } else {
        menuIcon.classList.remove('animated', 'fadeIn');
      }
    }
    if (mobileMenu) {
      mobileMenu.setAttribute('aria-expanded', String(opening));
    }
  }

  if (mobileMenu) {
    mobileMenu.addEventListener('click', toggleMobileNav);
  }

  // Close mobile nav when a nav link is clicked (reuse toggleMobileNav
  // so the animation and aria-expanded state stay consistent)
  document.querySelectorAll('.navigation-wrapper .blog-button').forEach(function (btn) {
    btn.addEventListener('click', toggleMobileNav);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  {% if site.disable_landing_page != true %}
  var panelCover = document.querySelector('.panel-cover');
  {% endif %}

  init({% if site.disable_landing_page != true %}panelCover{% endif %});

  {% if site.disable_landing_page != true %}
  function setInitialPanelState(panelCover, isHome) {
    if (!panelCover) return;
    
    if (!isHome) {
      // Content page: collapse panel immediately (no animation needed)
      panelCover.style.transition = 'none';
      panelCover.classList.add('panel-cover--collapsed');
      void panelCover.offsetHeight; // force reflow
      requestAnimationFrame(function () {
        panelCover.style.transition = '';
      });
    } else if (document.referrer.indexOf(window.location.origin) === 0) {
      // Returning from another page on this site: snap to collapsed then expand smoothly
      panelCover.style.transition = 'none';
      panelCover.classList.add('panel-cover--collapsed');
      void panelCover.offsetHeight; // force reflow
      requestAnimationFrame(function () {
        panelCover.style.transition = '';
        panelCover.classList.remove('panel-cover--collapsed');
      });
    }
  }

  setInitialPanelState(panelCover, isHomePage());
  {% endif %}
});

// For Turbo, when navigation happens to a new page, adjust panel state
document.addEventListener('turbo:load', function() {
  {% if site.disable_landing_page != true %}
  var panelCover = document.querySelector('.panel-cover');
  if (!panelCover) return;

  if (isHomePage()) {
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
