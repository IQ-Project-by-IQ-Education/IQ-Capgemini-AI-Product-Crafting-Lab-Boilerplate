---
name: capgemini-ui-design
description: Generate UI (web pages, components, dashboards, prototypes) that follow the Capgemini brand identity. Use this skill whenever the user asks to build, design, style, or mock up any interface "for Capgemini", "à la Capgemini", "charte Capgemini", or wants frontend output matching Capgemini's visual brand. Apply the tokens below to all HTML/CSS/React output.
---

# Capgemini UI Design

Apply Capgemini's brand identity to any UI. Use these tokens as the source of truth — do not improvise colors or fonts.

## Color tokens

```css
:root {
  --cap-blue:        #0070AD; /* Primary — Capgemini Blue. Logo, headers, primary CTAs */
  --cap-vibrant:     #12ABDB; /* Secondary — Vibrant Blue. Accents, links, highlights */
  --cap-deep:        #003D5C; /* Dark blue for depth, footers, dark surfaces */
  --cap-ink:         #1A1A1A; /* Body text */
  --cap-gray:        #5A6872; /* Secondary text, captions */
  --cap-line:        #E3E8EC; /* Borders, dividers */
  --cap-surface:     #F5F7F9; /* Light section background */
  --cap-white:       #FFFFFF;
}
```

Brand gradient (logo spade, hero accents): `linear-gradient(135deg, #0070AD 0%, #12ABDB 100%)`.

Rules:
- Primary blue `#0070AD` dominates. Vibrant blue `#12ABDB` is an accent only — never the main surface color.
- White and light-gray surfaces; keep layouts clean and airy. Capgemini is a corporate consulting brand: restrained, trustworthy, not flashy.
- Reserve the gradient for hero areas and the logo, not for body buttons.

## Typography

- Brand font is **Ubuntu** (Capgemini's corporate typeface). Use it for headings and body.
- Web stack: `font-family: 'Ubuntu', 'Segoe UI', system-ui, sans-serif;`
- Load: `https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap`
- Headings: weight 700, tight line-height (1.15), color `--cap-deep` or `--cap-ink`.
- Body: weight 400, line-height 1.6, color `--cap-ink`.
- Generous letter-spacing avoided; keep neutral. Sentence case for headings, not ALL CAPS.

## Layout & components

- Generous whitespace, 8px spacing scale (8/16/24/32/48/64).
- Border radius: small and subtle — 4px to 8px. Avoid heavily rounded "playful" shapes.
- Shadows: soft and minimal, e.g. `0 2px 8px rgba(0,61,92,0.08)`.
- Buttons: primary = solid `--cap-blue`, white text; hover darkens to `--cap-deep`. Secondary = outlined `--cap-blue`.
- Links: `--cap-vibrant`, underline on hover.
- Cards: white surface, 1px `--cap-line` border or soft shadow, never both heavy.

## Logo

The official Capgemini logo (wordmark + blue spade) already lives in this repo at `public/capgemini-logo.png`. In a Next.js app the `public/` folder is served from the root, so reference it directly:

```jsx
import Image from "next/image";
<Image src="/capgemini-logo.png" alt="Capgemini" width={180} height={40} priority />
```

Plain HTML/CSS equivalent: `<img src="/capgemini-logo.png" alt="Capgemini" />`.

- Always use this existing asset — never recreate, redraw, or fake the spade logo, and never recolor it.
- The logo sits well on white or light-gray surfaces. On the dark/gradient hero, place it inside a white pill/badge or use enough padding so the blue stays legible; do not place it directly on `--cap-blue`.
- Keep clear space around it (at least the height of the spade) and don't stretch — preserve its aspect ratio.
- If the file is ever missing, leave a placeholder area and tell the user to drop the official asset into `public/capgemini-logo.png`.

## Quick CSS starter

```css
body { font-family: 'Ubuntu', system-ui, sans-serif; color: var(--cap-ink); background: var(--cap-white); }
.btn-primary { background: var(--cap-blue); color: #fff; border: none; border-radius: 6px; padding: 12px 24px; font-weight: 500; }
.btn-primary:hover { background: var(--cap-deep); }
.hero { background: linear-gradient(135deg,#0070AD,#12ABDB); color:#fff; }
```
