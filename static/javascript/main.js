// Single initialization function to avoid duplicate listeners on permanent elements
let initialized = false

function forceReflow (element) {
  return element.offsetHeight
}

function init (panelCover, disableLandingPage) {
  if (initialized) return
  initialized = true

  if (!disableLandingPage) {
    function collapsePanel () {
      if (panelCover) panelCover.classList.add('panel-cover--collapsed')
    }

    document.querySelectorAll('a.nav-link').forEach((btn) => {
      btn.addEventListener('click', (_e) => {
        if (
          !panelCover ||
          panelCover.classList.contains('panel-cover--collapsed')
        ) {
          // If already collapsed, let Turbo handle it normally
          return
        }
        const bpTablet = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bp-tablet'), 10) || 960
        if (panelCover.offsetWidth < bpTablet) {
          collapsePanel()
          // Query fresh — Turbo replaces .content-wrapper on each navigation
          const cw = document.querySelector('.content-wrapper')
          if (cw) cw.classList.add('animated', 'slideInRight')
        }
      })
    })
  }

  const mobileMenu = document.querySelector('.btn-mobile-menu')
  const navWrapper = document.querySelector('.navigation-wrapper')
  const menuIcon = document.querySelector('.btn-mobile-menu__icon')

  function playAnimation (element, animationClass, extraClassesToAdd) {
    if (!element) return
    element.classList.remove('animated', animationClass)
    if (extraClassesToAdd) {
      element.classList.add(extraClassesToAdd)
    }
    forceReflow(element) // force reflow
    element.classList.add('animated', animationClass)
  }

  function toggleMobileNav () {
    // Only toggle the mobile navigation visibility if the mobile menu button is actually visible
    if (!mobileMenu || mobileMenu.offsetWidth === 0) return

    const opening = navWrapper && !navWrapper.classList.contains('visible')

    if (navWrapper) {
      if (opening) {
        playAnimation(navWrapper, 'fadeInDown', 'visible')
      } else {
        navWrapper.classList.remove('visible', 'animated', 'fadeInDown')
      }
    }
    if (menuIcon) {
      menuIcon.classList.toggle('fa-bars')
      menuIcon.classList.toggle('fa-circle-xmark')
      if (opening) {
        playAnimation(menuIcon, 'fadeIn')
      } else {
        menuIcon.classList.remove('animated', 'fadeIn')
      }
    }
    if (mobileMenu) {
      mobileMenu.setAttribute('aria-expanded', String(opening))
    }
  }

  if (mobileMenu) {
    mobileMenu.addEventListener('click', toggleMobileNav)
  }

  // Close mobile nav when a nav link is clicked (reuse toggleMobileNav
  // so the animation and aria-expanded state stay consistent)
  document
    .querySelectorAll('.navigation-wrapper .nav-link')
    .forEach((btn) => {
      btn.addEventListener('click', toggleMobileNav)
    })
}

function getConfig () {
  return {
    disableLandingPage: document.body.dataset.disableLanding === 'true',
    baseUrl: document.body.dataset.baseurl || ''
  }
}

function isHomePage () {
  const baseUrl = getConfig().baseUrl
  const path = window.location.pathname
  return path === `${baseUrl}/` || path === `${baseUrl}/index.html`
}

document.addEventListener('DOMContentLoaded', () => {
  const config = getConfig()
  const panelCover = document.querySelector('.panel-cover')

  init(panelCover, config.disableLandingPage)

  if (!config.disableLandingPage) {
    function setInitialPanelState (panelCover, isHome) {
      if (!panelCover) return

      if (!isHome) {
        // Content page: collapse panel immediately (no animation needed)
        panelCover.style.transition = 'none'
        panelCover.classList.add('panel-cover--collapsed')
        forceReflow(panelCover) // force reflow
        window.requestAnimationFrame(() => {
          panelCover.style.transition = ''
        })
      } else if (document.referrer.indexOf(window.location.origin) === 0) {
        // Returning from another page on this site: snap to collapsed then expand smoothly
        panelCover.style.transition = 'none'
        panelCover.classList.add('panel-cover--collapsed')
        forceReflow(panelCover) // force reflow
        window.requestAnimationFrame(() => {
          panelCover.style.transition = ''
          panelCover.classList.remove('panel-cover--collapsed')
        })
      }
    }

    setInitialPanelState(panelCover, isHomePage())
  }
})

// Fallback panel-state sync after Turbo replaces the body.
// turbo:before-render handles the animated transitions; this ensures the
// correct class is present if before-render was skipped (e.g. hard load).
document.addEventListener('turbo:load', () => {
  const config = getConfig()
  if (config.disableLandingPage) return

  const panelCover = document.querySelector('.panel-cover')
  if (!panelCover) return

  if (isHomePage()) {
    if (panelCover.classList.contains('panel-cover--collapsed')) {
      window.requestAnimationFrame(() => {
        panelCover.style.transition = ''
        panelCover.classList.remove('panel-cover--collapsed')
      })
    }
  } else {
    if (!panelCover.classList.contains('panel-cover--collapsed')) {
      // Snap collapsed without animation (turbo:before-render should
      // have already handled the animated case)
      panelCover.style.transition = 'none'
      panelCover.classList.add('panel-cover--collapsed')
      forceReflow(panelCover)
      window.requestAnimationFrame(() => {
        panelCover.style.transition = ''
      })
    }
  }
})

// Intercept Turbo rendering to coordinate panel animations with DOM swaps.
// - Navigating TO home: pause render, expand panel over old content, then resume.
// - Navigating AWAY from home: snap panel collapsed before Turbo swaps in the
//   new content so it is immediately visible.
document.addEventListener('turbo:before-render', (e) => {
  const config = getConfig()
  if (config.disableLandingPage) return

  const panelCover = document.querySelector('.panel-cover')
  if (!panelCover) return

  // During turbo:before-render, window.location has already been updated
  // to the destination URL, so isHomePage() reflects the target page.
  if (isHomePage()) {
    // --- Returning to home: expand the panel over the old content first ---
    if (panelCover.classList.contains('panel-cover--collapsed')) {
      e.preventDefault()

      const widthBefore = window.getComputedStyle(panelCover).width

      panelCover.style.transition = ''
      panelCover.classList.remove('panel-cover--collapsed')

      const widthAfter = window.getComputedStyle(panelCover).width

      // On mobile the collapsed and non-collapsed widths are both 100%,
      // so no CSS transition fires. Resume immediately in that case.
      if (widthBefore === widthAfter) {
        e.detail.resume()
        return
      }

      let resumed = false
      function doResume () {
        if (resumed) return
        resumed = true
        clearTimeout(fallbackTimer)
        panelCover.removeEventListener('transitionend', onTransitionEnd)
        e.detail.resume()
      }

      function onTransitionEnd (evt) {
        // width and max-width both transition; only act on width to avoid double-fire
        if (evt.propertyName === 'width') doResume()
      }

      panelCover.addEventListener('transitionend', onTransitionEnd)
      const fallbackTimer = setTimeout(doResume, 1100)
    }
  } else {
    // --- Navigating away from home: snap panel collapsed instantly ---
    if (!panelCover.classList.contains('panel-cover--collapsed')) {
      panelCover.style.transition = 'none'
      panelCover.classList.add('panel-cover--collapsed')
      forceReflow(panelCover) // force reflow
      panelCover.style.transition = ''
    }
  }
})
