/**
 * parallax.js — habchy.com
 *
 * Three behaviours:
 *
 * 1. INDEX — Two-layer photo parallax
 *    .hero-bg  (background city photo) drifts at 0.025× cursor offset
 *    .hero-fg  (foreground cutout)     drifts at 0.055× cursor offset
 *    The difference in speed creates genuine depth — the person appears
 *    to float in front of the cityscape. Both use lerped rAF so the
 *    motion is smooth and never snappy.
 *
 * 2. ABOUT — Scroll parallax on the logo watermark
 *    .about-watermark translates upward at 0.32× scroll speed.
 *
 * 3. ABOUT — IntersectionObserver scroll reveal
 *    .reveal and .reveal-stagger elements fade+rise into view.
 *
 * All motion is disabled when prefers-reduced-motion is set.
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Reduced motion check
     ------------------------------------------------------------------ */
  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ==================================================================
     1. INDEX — Two-layer mouse parallax
     ================================================================== */
  var heroBg = document.querySelector(".hero-bg");
  var heroFg = document.querySelector(".hero-fg");

  if (heroBg || heroFg) {
    try {
      if (prefersReducedMotion) {
        console.log("[parallax] Reduced motion — skipping photo parallax.");
      } else {
        /*
         * Strength multipliers.
         * bg moves subtly (slow layer), fg moves more (fast layer).
         * The difference is what creates the depth illusion.
         *
         * Baalbek panorama is very wide — keep bg movement conservative
         * so the columns stay visible. Suit cutout is tall and narrow,
         * so it can move more without losing the subject.
         */
        var BG_STRENGTH = 0.022;
        var FG_STRENGTH = 0.058;

        /* Lerp factor — how quickly each layer catches up to target.
           Lower = smoother / more cinematic lag. */
        var LERP = 0.07;

        /* Current interpolated positions */
        var bgX = 0,
          bgY = 0;
        var fgX = 0,
          fgY = 0;

        /* Target positions (set on mousemove) */
        var bgTargetX = 0,
          bgTargetY = 0;
        var fgTargetX = 0,
          fgTargetY = 0;

        var isAnimating = false;

        /**
         * On mouse move: calculate offset from viewport center.
         * Positive X = cursor right of center → layers shift right.
         */
        function onMouseMove(e) {
          var cx = window.innerWidth / 2;
          var cy = window.innerHeight / 2;
          var dx = e.clientX - cx;
          var dy = e.clientY - cy;

          bgTargetX = dx * BG_STRENGTH;
          bgTargetY = dy * BG_STRENGTH;
          fgTargetX = dx * FG_STRENGTH;
          fgTargetY = dy * FG_STRENGTH;

          if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(animateLayers);
          }
        }

        /**
         * Lerp each layer toward its target every frame.
         * Stops when all layers are within 0.05px of target.
         */
        function animateLayers() {
          bgX += (bgTargetX - bgX) * LERP;
          bgY += (bgTargetY - bgY) * LERP;
          fgX += (fgTargetX - fgX) * LERP;
          fgY += (fgTargetY - fgY) * LERP;

          if (heroBg) {
            /*
             * The background is centered via CSS translate(-50%, -50%).
             * We must preserve that base offset and add the parallax
             * delta on top — otherwise the image jumps off-center.
             * calc() combines the percentage centering with the
             * pixel-based parallax offset in a single transform.
             */
            heroBg.style.transform =
              "translate3d(calc(-50% + " +
              bgX.toFixed(3) +
              "px), calc(-50% + " +
              bgY.toFixed(3) +
              "px), 0)";
          }

          if (heroFg) {
            /*
             * The centering architecture changed with the wrapper refactor:
             *
             * DESKTOP: .hero-fg-wrap is positioned with right/bottom.
             *   The img (.hero-fg) has no base transform — JS writes
             *   plain translate3d(fgXpx, fgYpx, 0).
             *
             * MOBILE: .hero-fg-wrap carries left:50% + translateX(-50%)
             *   as a CSS base style. The img (.hero-fg) fills the wrapper
             *   at width/height 100% with no position offset of its own.
             *   JS writes plain translate3d(fgXpx, fgYpx, 0) on the img —
             *   no -50% needed because the WRAPPER already centers it.
             *   Adding -50% here would double-apply the offset and shift
             *   the figure off to the left.
             *
             * Both cases: same plain transform. No isMobile branching needed.
             * Y movement is dampened to 0.55× so the figure stays grounded.
             */
            heroFg.style.transform =
              "translate3d(" +
              fgX.toFixed(3) +
              "px, " +
              (fgY * 0.55).toFixed(3) +
              "px, 0)";
          }

          /* Continue loop only if still moving */
          var stillMoving =
            Math.abs(bgTargetX - bgX) > 0.05 ||
            Math.abs(bgTargetY - bgY) > 0.05 ||
            Math.abs(fgTargetX - fgX) > 0.05 ||
            Math.abs(fgTargetY - fgY) > 0.05;

          if (stillMoving) {
            requestAnimationFrame(animateLayers);
          } else {
            isAnimating = false;
          }
        }

        /* Attach to document so full page area is tracked */
        document.addEventListener("mousemove", onMouseMove, { passive: true });

        /* Return to center when mouse leaves the window */
        document.addEventListener("mouseleave", function () {
          bgTargetX = 0;
          bgTargetY = 0;
          fgTargetX = 0;
          fgTargetY = 0;
          if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(animateLayers);
          }
        });

        /* On touch devices, disable parallax (no hover state) */
        if ("ontouchstart" in window) {
          document.removeEventListener("mousemove", onMouseMove);
          console.log(
            "[parallax] Touch device detected — photo parallax disabled.",
          );
        } else {
          console.log("[parallax] Two-layer photo parallax initialised.");
        }
      }
    } catch (err) {
      console.error("[parallax] Photo parallax init failed:", err);
    }
  }

  /* ==================================================================
     2. ABOUT — Scroll parallax on the logo watermark
     ================================================================== */
  var aboutWatermark = document.querySelector(".about-watermark");

  if (aboutWatermark) {
    try {
      if (!prefersReducedMotion) {
        /* How much slower the watermark scrolls vs the page */
        var SCROLL_STRENGTH = 0.32;

        var lastScrollY = -1;
        var scrollRafId = null;

        function onScroll() {
          if (scrollRafId === null) {
            scrollRafId = requestAnimationFrame(updateScrollParallax);
          }
        }

        function updateScrollParallax() {
          scrollRafId = null;
          var scrollY = window.scrollY || window.pageYOffset;
          if (scrollY !== lastScrollY) {
            var offset = -(scrollY * SCROLL_STRENGTH);
            aboutWatermark.style.transform =
              "translateY(" + offset.toFixed(2) + "px)";
            lastScrollY = scrollY;
          }
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        updateScrollParallax(); /* Set initial position */

        console.log("[parallax] About watermark scroll parallax initialised.");
      }
    } catch (err) {
      console.error("[parallax] About scroll parallax init failed:", err);
    }
  }

  /* ==================================================================
     3. ABOUT — IntersectionObserver scroll reveal
     ================================================================== */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");

  if (revealEls.length > 0) {
    try {
      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          {
            rootMargin: "0px 0px -60px 0px",
            threshold: 0.08,
          },
        );

        revealEls.forEach(function (el) {
          observer.observe(el);
        });

        console.log(
          "[parallax] Scroll reveal watching " +
            revealEls.length +
            " element(s).",
        );
      } else {
        /* Fallback: show everything immediately */
        revealEls.forEach(function (el) {
          el.classList.add("visible");
        });
        console.warn(
          "[parallax] IntersectionObserver not supported — all elements shown.",
        );
      }
    } catch (err) {
      revealEls.forEach(function (el) {
        el.classList.add("visible");
      });
      console.error(
        "[parallax] Reveal observer failed, showing all elements:",
        err,
      );
    }
  }
})();
