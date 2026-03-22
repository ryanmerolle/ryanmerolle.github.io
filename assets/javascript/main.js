---
  layout: null
sitemap:
  exclude: 'yes'
---

// Single initialization function to avoid duplicate listeners on permanent elements
var initialized = false;

function init(panelCover, disableLandingPage) {
  if (initialized) return;
  initialized = true;

  if (!disableLandingPage) {
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
        }
        // On desktop (>= 960), we do NOT collapse immediately.
        // We let Turbo fetch the new page natively. Once it renders the new page,
        // turbo:load will trigger the collapse transition so the new content is revealed.
      });
    });
  }

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
    // Only toggle the mobile navigation visibility if the mobile menu button is actually visible
    if (!mobileMenu || mobileMenu.offsetWidth === 0) return;

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

function getConfig() {
  return {
    disableLandingPage: document.body.dataset.disableLanding === 'true',
    baseUrl: document.body.dataset.baseurl || ''
  };
}

function isHomePage() {
  var baseUrl = getConfig().baseUrl;
  var path = window.location.pathname;
  return path === baseUrl + '/' || path === baseUrl + '/index.html';
}

document.addEventListener('DOMContentLoaded', function () {
  var config = getConfig();
  var panelCover = document.querySelector('.panel-cover');

  init(panelCover, config.disableLandingPage);

  if (!config.disableLandingPage) {
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
  }
});

// For Turbo, when navigation happens to a new page, adjust panel state
document.addEventListener('turbo:load', function() {
  var config = getConfig();
  if (config.disableLandingPage) return;

  var panelCover = document.querySelector('.panel-cover');
  if (!panelCover) return;

  if (isHomePage()) {
    if (panelCover.classList.contains('panel-cover--collapsed')) {
      // Returning home via Turbo (if not caught by before-render, or on fallback), expand it.
      requestAnimationFrame(function () {
        panelCover.style.transition = '';
        panelCover.classList.remove('panel-cover--collapsed');
      });
    }
  } else {
    // Navigating to a content page
    if (!panelCover.classList.contains('panel-cover--collapsed')) {
      // It is currently expanded. Force reflow, then apply the collapsed
      // class so the browser animates the CSS transition.
      void panelCover.offsetHeight;
      requestAnimationFrame(function () {
        panelCover.style.transition = '';
        panelCover.classList.add('panel-cover--collapsed');
      });
    }
  }
});

// Intercept Turbo rendering to delay it if we are returning to the home page
// from a content page, allowing the panel to slide shut over the old content first.
document.addEventListener('turbo:before-render', function(e) {
  var config = getConfig();
  if (config.disableLandingPage) return;

  var panelCover = document.querySelector('.panel-cover');
  if (!panelCover) return;

  // During turbo:before-render, window.location has already been updated
  // to the destination URL, so isHomePage() reflects the target page.
  if (isHomePage()) {
    if (panelCover.classList.contains('panel-cover--collapsed')) {
      // Pause Turbo's rendering process
      e.preventDefault();

      // Start expanding the panel to cover the old content
      panelCover.style.transition = '';
      panelCover.classList.remove('panel-cover--collapsed');

      // Wait for the panel's CSS transition to finish
      // before allowing Turbo to swap the DOM elements
      var transitionHandler = function() {
        panelCover.removeEventListener('transitionend', transitionHandler);
        e.detail.resume();
      };

      // Add a small timeout fallback just in case transitionend somehow doesn't fire
      var fallbackTimer = setTimeout(function() {
        panelCover.removeEventListener('transitionend', transitionHandler);
        e.detail.resume();
      }, 1000); // the CSS transition takes 0.6s max

      panelCover.addEventListener('transitionend', function wrapper() {
        clearTimeout(fallbackTimer);
        transitionHandler();
      });
    }
  }
});
