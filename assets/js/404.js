/**
 * 404.js — habchy.com
 *
 * Builds a full-viewport marquee of the Habchy H letterform.
 * Multiple rows of the mark scroll continuously — odd rows left,
 * even rows right — creating a woven, fabric-like background.
 *
 * Why JS and not pure HTML/CSS:
 *   The SVG path is long and we need many copies (6–8 per row × 5 rows).
 *   Inlining all of them in HTML would be hundreds of duplicated lines.
 *   JS builds the DOM once, cleanly.
 *
 * All motion respects prefers-reduced-motion.
 */

(function () {
  "use strict";

  try {
    var container = document.getElementById("nf-marquee");
    if (!container) return;

    /* ------------------------------------------------------------------
       Config
       ------------------------------------------------------------------ */
    var ROWS = 5; /* number of horizontal rows              */
    var MARKS_PER_ROW = 14; /* marks per row — large so ends are      */
    /* always off-screen on any viewport      */
    var MARK_SIZE = 110; /* px — width of each H mark              */
    var GAP = 40; /* px — horizontal gap between marks      */
    var DURATION_BASE = 28; /* seconds for one full scroll cycle      */
    var DURATION_VAR = 8; /* ± variation per row for organic feel   */

    /* The H path data */
    var PATH =
      "m 2187.2791,6296.0601 c -34.9451,-7.4781 -58.7209,-45.3239 -53.1963,-80.1006 -1.7733,-477.7714 -0.9213,-955.5474 -1.5101,-1433.3208 -0.047,-619.7758 0.4961,-1239.5525 2.5086,-1859.3254 7.3192,-42.5973 44.4812,-74.699 84.8283,-85.8451 362.3519,-116.8098 725.9315,-229.7751 1089.3221,-343.2877 22.8993,-7.1677 48.6392,-12.0798 71.24,-1.1264 25.7638,11.2471 39.0597,39.4496 40.8995,66.2968 2.6499,30.1393 -0.037,60.4248 0.9525,90.6305 0.5928,114.5016 0.9678,229.003 0.4925,343.5058 -0.2909,199.1955 -0.7705,398.4012 1.841,597.5849 4.972,42.8007 57.5495,70.5399 96.04,51.9918 162.8956,-48.8365 324.6934,-101.2347 487.3062,-150.9932 264.8701,-82.4053 529.2774,-166.3217 794.1971,-248.5482 30.5177,-7.6213 63.2388,-22.3453 76.6864,-52.8537 11.331,-22.3054 8.3343,-47.8122 8.3034,-71.8651 2.3803,-303.0327 -1.878,-606.1026 3.6428,-909.1126 5.6192,-45.2403 45.3708,-80.0986 88.4266,-89.7478 71.1685,-20.8927 141.5139,-44.4691 212.493,-65.9898 265.1115,-82.8465 529.9394,-166.6161 795.2948,-248.6723 28.84,-7.9941 64.2035,-11.0924 88.0609,10.6172 18.3861,16.406 22.234,42.5704 21.0773,65.9422 1.3874,51.4523 -0.1432,102.9363 1.2736,154.3885 3.6746,1032.7084 9.4395,2065.4371 5.6717,3098.1466 -3.0119,42.5777 -38.0628,77.7779 -78.1823,88.6144 -41.2115,12.4487 -81.4813,27.811 -122.4417,41.0766 -303.6819,102.6246 -608.3402,202.3463 -912.2763,304.1993 -30.544,8.8946 -68.605,1.4234 -86.2744,-27.1227 -18.0848,-26.5453 -13.4038,-60.031 -14.1095,-90.2684 -3.9967,-417.4951 1.2282,-835.0279 -3.6054,-1252.5158 -0.6413,-16.993 1.2888,-35.7084 -9.8505,-50.0432 -15.7642,-22.8383 -47.331,-33.5332 -73.4762,-23.5613 -49.2133,11.3756 -95.6948,31.7628 -144.1794,45.626 -357.9138,119.488 -715.8267,238.9796 -1073.8536,358.1274 -37.2713,12.8999 -74.9503,24.8301 -111.6947,39.1252 -28.1254,13.3204 -51.2842,42.1589 -48.7664,74.5597 -5.2878,383.4801 1.4645,767.0279 -4.7649,1150.4974 -0.7249,24.7045 -0.4247,50.4251 -11.7077,73.128 -11.6674,26.6122 -34.4365,47.8777 -62.0114,57.2151 -38.4396,15.3202 -78.7373,25.2677 -117.5164,39.6635 -302.6575,102.4724 -607.2776,199.0642 -909.4869,302.8752 -29.8542,9.9477 -59.4573,20.7985 -89.4512,30.2318 -13.9455,2.6348 -28.1629,0.741 -42.203,0.2562 z";

    /* Respect reduced motion */
    var prefersReduced = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

    /* ------------------------------------------------------------------
       Build one SVG mark element
       ------------------------------------------------------------------ */
    function buildMark() {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 3971.7893 4497.9053");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.classList.add("nf-mark-svg");

      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", "translate(-2132.5701,-1799.2671)");

      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", PATH);
      path.classList.add("nf-mark-path");

      g.appendChild(path);
      svg.appendChild(g);
      return svg;
    }

    /* ------------------------------------------------------------------
       Build one row
       MARKS_PER_ROW marks are duplicated (×2) so the seamless loop
       can translate by exactly 50% to restart invisibly.
       ------------------------------------------------------------------ */
    function buildRow(rowIndex) {
      var row = document.createElement("div");
      row.classList.add("nf-marquee-row");

      /* Inner track — the element we animate */
      var track = document.createElement("div");
      track.classList.add("nf-marquee-track");

      /*
       * We need enough marks to cover the viewport + loop seamlessly.
       * We double MARKS_PER_ROW so we can translate -50% to loop.
       */
      var total = MARKS_PER_ROW * 2;
      for (var i = 0; i < total; i++) {
        var wrapper = document.createElement("div");
        wrapper.classList.add("nf-mark-wrap");
        wrapper.appendChild(buildMark());
        track.appendChild(wrapper);
      }

      row.appendChild(track);

      /* Determine scroll direction and speed */
      var goLeft = rowIndex % 2 === 0;
      var duration = DURATION_BASE + rowIndex * (DURATION_VAR / ROWS);
      var animName = "nfMarquee" + (goLeft ? "Left" : "Right");

      if (!prefersReduced) {
        track.style.animationName = animName;
        track.style.animationDuration = duration + "s";
        track.style.animationTimingFunction = "linear";
        track.style.animationIterationCount = "infinite";
        /* Stagger the start time slightly per row so they don't pulse in sync */
        track.style.animationDelay = "-" + rowIndex * 3.5 + "s";
      }

      return row;
    }

    /* ------------------------------------------------------------------
       Inject keyframe CSS
       One keyframe for left, one for right. Each translates by exactly
       the width of MARKS_PER_ROW marks (50% of the doubled track).
       ------------------------------------------------------------------ */
    var trackItemWidth = MARK_SIZE + GAP; /* px per mark */
    var totalShift = trackItemWidth * MARKS_PER_ROW; /* px for 50% shift */

    var styleEl = document.createElement("style");
    styleEl.textContent =
      "@keyframes nfMarqueeLeft  { from { transform: translateX(0); } to { transform: translateX(-" +
      totalShift +
      "px); } }" +
      "@keyframes nfMarqueeRight { from { transform: translateX(-" +
      totalShift +
      "px); } to { transform: translateX(0); } }";
    document.head.appendChild(styleEl);

    /* ------------------------------------------------------------------
       Build all rows and append to container
       ------------------------------------------------------------------ */
    for (var r = 0; r < ROWS; r++) {
      container.appendChild(buildRow(r));
    }

    console.log("[404] Marquee initialised — " + ROWS + " rows.");
  } catch (err) {
    console.error("[404] Marquee init failed:", err);
    /* Fail gracefully — the page still works without the background */
  }
})();
