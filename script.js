(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------------------------------- */
  /* Jaar in footer                                                             */
  /* -------------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* -------------------------------------------------------------------------- */
  /* Reveal on scroll                                                           */
  /* -------------------------------------------------------------------------- */
  var revealElements = document.querySelectorAll("[data-reveal]");

  function initReveal() {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      document.querySelectorAll(".skill-pill").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initReveal();

  /* -------------------------------------------------------------------------- */
  /* Smooth scroll voor interne links (aanvulling op CSS scroll-behavior)      */
  /* -------------------------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var anchor = e.target.closest && e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var href = anchor.getAttribute("href");
    if (!href || href.length < 2) return;

    var id = href.slice(1);
    var section = document.getElementById(id);
    if (!section) return;

    e.preventDefault();
    if (prefersReducedMotion) {
      section.scrollIntoView();
      return;
    }
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* -------------------------------------------------------------------------- */
  /* Mobiel menu                                                                */
  /* -------------------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var backdrop = document.querySelector(".nav-backdrop");

  function setMenuOpen(open) {
    if (!header || !navToggle || !siteNav) return;
    header.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
    document.body.style.overflow = open ? "hidden" : "";
    if (backdrop) {
      if (open) {
        backdrop.removeAttribute("hidden");
      } else {
        backdrop.setAttribute("hidden", "");
      }
    }
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = !header.classList.contains("is-open");
      setMenuOpen(open);
    });

    siteNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
          setMenuOpen(false);
        }
      });
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setMenuOpen(false);
    });
  }

  window.addEventListener(
    "resize",
    function () {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    },
    { passive: true }
  );

  /* -------------------------------------------------------------------------- */
  /* Escape sluit menu                                                          */
  /* -------------------------------------------------------------------------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header && header.classList.contains("is-open")) {
      setMenuOpen(false);
      if (navToggle) navToggle.focus();
    }
  });
})();
