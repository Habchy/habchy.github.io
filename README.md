# habchy.com

Personal portfolio website for **Charbel Habchy** — Computer Science student at UMass Boston, developer, and perpetual explorer.

## Pages

| Page | URL | Description |
|---|---|---|
| Home | `/` | Cinematic hero with two-layer parallax (Baalbek backdrop + suit cutout foreground), name, tagline, and CTAs |
| About | `/about` | Bio, skills & technologies, language proficiency with scroll reveal animations |
| 404 | `/404` | "Lost in the ruins." — animated H monogram marquee background |
| Design Language | `/design-language` | Internal design system reference (noindex) |

## Tech Stack

- **Vanilla HTML, CSS, JavaScript** — no frameworks, no build step
- **CSS Custom Properties** for light/dark theming (`prefers-color-scheme`)
- **Glassmorphism** via `backdrop-filter: blur()` with warm gold/parchment palette
- **Typography**: Cormorant Garamond (display) + Jost (body) via Google Fonts
- **Parallax**: mouse-tracking two-layer photo parallax on homepage; scroll-driven watermark on about
- **Animations**: CSS keyframes for load-in; `IntersectionObserver` for scroll reveal
- **Performance**: preloaded LCP images, deferred analytics, non-blocking fonts, GPU-composited transforms
- **PWA**: `manifest.webmanifest` + SVG favicon with adaptive theme color

## Design

Warm archaeological luxury. The Baalbek ruins, a cream linen suit, gilded afternoon light — the entire palette and motion language derives from this one image.

- Dark: `#0E0D0B` charcoal / `#F2EFE8` sand white / `#C9A84C` gold
- Light: `#F5F1E8` parchment / `#1A1510` umber / `#B8922E` antique gold
- All design decisions documented at `/design-language`

## Structure

```
/
├── index.html
├── about.html
├── 404.html
├── design-language.html
├── favicon.svg
├── favicon.png
├── manifest.webmanifest
├── sitemap.xml
├── CNAME
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── parallax.js
    │   └── 404.js
    ├── images/
    │   ├── Baalbek-Panorama.jpeg      ← hero background
    │   ├── Charbel-Suit-Cutout.png    ← hero foreground (parallax figure)
    │   ├── Charbel-Suit.jpeg          ← OpenGraph / social share image
    │   ├── habchy.svg                 ← logo (dark fill, light mode)
    │   ├── habchy-white.svg           ← logo (white fill, dark mode)
    │   └── icon-192x192.png           ← PWA icon
    └── fonts/
        ├── fa-brands-400.woff2
        └── fa-solid-900.woff2
```

## License

All Rights Reserved © Charbel Habchy
