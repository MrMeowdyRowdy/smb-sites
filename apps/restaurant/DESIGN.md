---
name: Neblina
description: Café template in one family and two flat teal grounds; the name is a monument the fog lifts off.
colors:
  paper: "#f7f9f8"
  surface: "#ebf0ee"
  ink: "#06525c"
  muted: "#2f737d"
  field: "#06525c"
  field-2: "#0b606b"
  field-3: "#17737e"
  field-ink: "#f7f9f8"
  field-muted: "#b4d3d3"
  deep: "#043e46"
  cherry: "#b3202d"
  cherry-press: "#8f1a26"
  tone-past: "#dbe6e3"
  tone-next: "#c3dad8"
  placeholder: "#c9dcda"
typography:
  monument:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(230px, 31vw, 1100px)"
    fontWeight: 500
    lineHeight: 0.8
    letterSpacing: "-0.045em"
  display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.2rem + 2.4vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 3.2vw, 4rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)"
    fontWeight: 500
rounded:
  none: "0px"
  full: "50%"
spacing:
  margin: "clamp(20px, 2vw, 28px)"
  section: "clamp(80px, 10vw, 160px)"
  target: "44px"
components:
  button-whatsapp:
    backgroundColor: "{colors.cherry}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "52px"
  button-whatsapp-hover:
    backgroundColor: "{colors.cherry-press}"
  button-disabled:
    backgroundColor: "{colors.tone-past}"
    textColor: "{colors.muted}"
  stepper-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    size: "44px"
  order-choice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    height: "56px"
  order-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "12px clamp(20px, 2vw, 28px)"
  category-tab:
    textColor: "{colors.ink}"
    padding: "0 12px"
    height: "52px"
  arrow-button:
    backgroundColor: "{colors.cherry}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
---

# Design System: Neblina

Recorded from the shipped build at commit 2a6984b (`src/globals.css`, `src/components`, `content/*.json`). Where the story (`concepts/smb-restaurant/decisions/story-v1.md`) and the build differ, this file follows the build.

## Overview

**Creative North Star: "Del bosque nublado a tu taza"**

The café's name is set as a monument, and a fog layer drifts over it. The fog lifts as the page scrolls and comes back at the close. The page uses one type family at two weights (500 for display, 400 for text) and flat colour grounds. There are no gradients and no card shadows. The colour ground changes at each chapter with a hard edge: paper, teal, paper, surface, teal, then deep teal. Each beat has one dominant object (the name, the altitude numeral, the dish band, the clock time, the address rows, or the cropped name), and photos and cut-outs are layered against it.

**Key Characteristics:**
- One family (Hanken Grotesk 400/500, self-hosted, `display: optional`).
- Teal ink on paper, or paper ink on teal. The only cherry red in the system is on the WhatsApp action.
- Square corners on every control. The only round shapes are the arrow button, the route dots and the map pin.
- Display type is cropped by section edges: the hero name, the "Menú" heading, the close name.
- Fog, display type and photos may overlap each other. Nothing ever covers text, prices or buttons.

## Colors

The palette is one teal family from deep (#043e46) to paper (#f7f9f8), plus one cherry red.

### Primary
- **Cloud-forest Teal** (`ink` / `field`): Ink on paper grounds, and the ground of the Origin and Visit chapters. It is also used for the order bar, the stepper, the photo-panel captions and the focus ring.
- **Deep Teal** (`deep`): Ground of the close (footer) and of the third band panel.

### Secondary
- **Cherry** (`cherry`, `cherry-press` on hover): Used only for the WhatsApp actions. That means the hero button, the close button, the order-bar button, the Visit arrow, the map pin, and the phone "Escríbenos" row.

### Neutral
- **Fog Paper** (`paper`): Page ground, and ink on teal (`field-ink`).
- **Mist Surface** (`surface`): Ground of the Hoy chapter, the first band panel and odd table rows.
- **Muted Teal** (`muted`): Secondary text on paper: table category labels, sold-out labels, Hoy hours.
- **Field Muted** (`field-muted`): Secondary text on teal and the origin route line.
- **Field steps** (`field-2`, `field-3`): Alternating rows of the Visit address and the map ground and streets.
- **Tone Past / Tone Next**: The Hoy bar track (`tone-next`), the ghost category names on /menu/ (`tone-past`), tab hover (`tone-next`) and disabled buttons (`tone-past`).
- **Placeholder** (`placeholder`): The flat block shown before a photo arrives or when the photo file is missing.

### Named Rules
**The One Red Rule.** Cherry means "write to us on WhatsApp", and it is used for nothing else.
**The Hard Edge Rule.** Chapter grounds meet at a straight edge. A fade between grounds is never used.

## Typography

**Display Font:** Hanken Grotesk 500 (fallback system-ui)
**Body Font:** Hanken Grotesk 400

**Character:** One grotesque family. Display sizes are set tight (-0.035 to -0.06em) and text is set plainly. Numbers use tabular figures (`.num`) wherever they are prices, times or the total.

### Hierarchy
- **Monument** (500, clamp(230px, 31vw, 1100px), 0.8, uppercase, no wrap): The hero name. The close name is clamp(150px, 26.5vw, 900px) at 0.74. "Menú" is min(26vw, 40rem). The origin numeral is clamp(170px, 33.5vw, 600px) at -0.06em, and the Hoy clock time is clamp(120px, 16vw, 280px).
- **Display** (500, clamp 2rem to 3.75rem, 1.08): The hero sentence, max 16ch. On phone it is 17px at 1.25.
- **Headline** (500, `--step-head`, 0.95): Every h2, the stair titles, the Visit rows, the close invitation, the /menu/ lead (line-height 1.02).
- **Title** (500, `--step-lead`): Dish names and prices on /menu/, Hoy moments, the origin lead, order choices.
- **Body** (400, `--step-body`, 1.45): Running text, max 34 to 52ch.
- **Label** (500, `--step-small`): Table category labels, route labels.

### Named Rules
**The Two Weights Rule.** Use only weights 400 and 500. No italics and no third family. Hierarchy comes from size and tracking.
**The Wide Canvas Rule.** The root font size goes to 125% at 1900px and 150% at 2400px, so every rem value grows on large screens.

## Layout

- **Margin:** `--m` clamp(20px, 2vw, 28px) on every edge. Sections use a 12-column grid with `--m` gutters.
- **Breakpoints:** 760px is the phone layout, which is its own composition. 1000px is where tables and art columns stack. 1900px and 2400px scale the root font size. GSAP pins Origin only at 800px and wider.
- **Section rhythm:** Vertical padding is clamp(80px, 10vw, 160px). Origin is clamp(80px, 11vw, 180px) at the top. The close is at least max(560px, 100svh).
- **Targets:** Every link and control is at least 44px tall. Buttons are 52px, order choices are 56px.

### Home beats
1. **Hero** (paper, min max(640px, 100svh)). The sky photo is masked to the top 70% at 0.36 opacity. The name sits at the bottom, centred, and bleeds off both edges with a baseline -0.125em below the fold. The copy block is top-left at 96px. The cup is 13vw wide at left 54vw, base on the bottom edge, with three SVG steam paths above it. On phone the name runs vertically down the right edge at 62vw, the copy is 54% wide, and the cup is 30vw at bottom-left.
2. **Origin** (teal field). The head sits top-left. The altitude numeral sits bottom-left at the stage foot. An SVG route runs from the dot at 5.83%/90% to the dot at 94.17%/11.7%. Four framed photos sit at fixed positions. After that, the four stages step right by 1/6 of the width each (6vw steps on phone). On phone the stage stacks: frames at 40 to 58vw alternate left and right, and the route is 46vw tall. The chapter is skipped when `site.origin` is absent.
3. **Menu promise** (paper). A band of four unequal panels, 68svh tall, with flex-grow 5:2:3:2. Panel tones cycle surface, teal, deep, surface. The cut-out stands 64px above a caption bar that shows the dish name and price. On phone the band is a 2x2 grid with columns 64/36 and 51/49 at 84svh. Below it, the h2 spans columns 1 to 6. A sticky photo (columns 1 to 5, height 100svh - 160px) bleeds to the left page edge, and the table of rows (category, name with note, price) spans columns 8 to 12. Below 1000px the photo goes full-bleed between the heading and the table.
4. **Hoy en Neblina** (surface). The clock time (monument scale) sits beside the label and "now / in 40 min". Below it is a row of moments whose widths are proportional to their duration, each with an 8px bar filled up to the current time. On phone it becomes a vertical timeline (columns 4.6rem, 8px, 1fr). When a seasonal item is active, its photo takes the right 28vw at full height and the text column is padded clear of it.
5. **Visit** (teal). Address rows at headline size alternate field and field-2, with the grid at 2.15fr:1fr. The SVG map of La Floresta sits on the right. On phone the greeting row turns cherry with a 56px paper arrow.
6. **Close** (deep). The invitation and button take columns 1 to 7, links and language columns 10 to 12. Below that are the legal line and credits, and the name is cropped by the bottom edge (translateY 30%).

### /menu/
The header is a 12-column grid: the lead and note sit in columns 6 to 12, and "Menú" fills the full width below them, cropped by the header's bottom edge. The hero cup (22vw) stands just right of the word's end, base on the same edge. On phone the cup is 28vw at right 3vw. Category tabs stick to the top (52px, 3px ink underline when current). The body is the dish list in columns 1 to 7. A sticky art column in columns 8 to 12 cross-fades (0.6s) to the current category's cut-out, with the category name behind it in `tone-past`. The current category is the last heading above 40% of the viewport. Below 1000px each category gets its own 70vw art block after its heading instead. Each dish is a grid row: name, price, then a 44px stepper. The description runs underneath at max 52ch. The ink order bar sticks to the bottom. "Pedir" swaps the bar's content for the "¿Para llevar o aquí?" question with two paper choices.

## Elevation & Depth

Depth comes from layering, not from elevation. Surfaces are flat, and there are no box-shadows on controls or containers. Only the cut-outs carry a soft teal shadow, so they read as objects standing on the ground.

### Shadow Vocabulary
- **Cut-out stand** (`filter: contrast(1.08) saturate(1.12) drop-shadow(0 28px 32px rgba(6,82,92,0.22))`; on phone 0 20px 22px): Used on band, /menu/ art and category art cut-outs only.

### Layering (back to front, z-index)
- **Hero:** sky 0, name 1, fog 2, cup with steam 3, copy 4. The header is 6.
- **Origin:** route 1. Frames 2 and 4 are at 1, under the numeral. The numeral is 2. Frames 1 and 3 are at 3, over the numeral. The head is 4.
- **Band:** cut-out 3, caption 4.
- **/menu/:** ghost name 0, cut-out 1, headings and dishes 1. The cup over "Menú" is 2. Tabs and order bar are 5.
- **Close:** name 1, fog above the name, text 4.

### Named Rules
**The Clear Text Rule.** Display type, photos, cut-outs and fog may overlap each other. Nothing ever covers body text, prices or buttons. Copy always sits on the top layer. Fog has `pointer-events: none` and never sits over the copy layer. The seasonal photo pads the text column instead of overlapping it, and band cut-outs stop 64px (92px on phone) above their caption.
**The Cropped Name Rule.** A monument word is cut by a section edge (the bottom, or the right edge on phone). It is never shown floating and complete in the middle of a section.

## Shapes

Every rectangle has square corners (0): buttons, steppers, tabs, panels, frames, the order bar. Origin frames are paper mats with clamp(6px, 0.7vw, 10px) padding, rotated 3, -4, -2 and 2deg. They straighten and scale to 1.04 on hover. Circles are used only for the 0.9em cherry arrow, the 24px route dots and the map pin. The /menu/ stepper uses the text glyphs + and − (see Do's and Don'ts).

## Components

### Buttons
- **WhatsApp:** cherry, white text, 52px tall, 0 28px padding, weight 500. Hover is `cherry-press`, active moves 2px down. When disabled it is `tone-past` on paper, or `field-2` / `field-muted` inside the order bar. On phone it is full width.
- **Text link:** 44px tall, underlined. On hover the underline thickens from 0.08em to 0.18em.
- **Arrow:** a cherry circle with an inline SVG arrow. On hover it moves 6px right.

### Photos and cut-outs
- **Lookup:** `photoSrc` looks for `public/photos/<name>.webp|png`. A name ending in `-cut-520` pairs with `-cut-1200` as a 520w/1200w srcset. A full photo is `<name>-1600.webp` with `-480` and `-800`. Sizes are read from the WebP header. A missing file renders as a flat placeholder block of the right ratio.
- **Deferral:** `LazyImg` first paints the placeholder block plus a `<noscript>` img. The real img is added 250ms after `load`. The hero sky and cup are `priority defer`, which means deferred and eager, so they never compete with the fonts and CSS. Only the /menu/ cup is a true `fetchPriority="high"` image (the /menu/ LCP).
- **Treatment:** Full photos use object-fit cover. The hero sky uses `sky-mask.svg`. Cut-outs use the stand filter.

### Motion
- **Gating:** All motion is gated. The CSS motion lives in `prefers-reduced-motion: no-preference`. GSAP and ScrollTrigger load at `requestIdleCallback` inside `gsap.matchMedia`. With reduced motion, or without JS, the final states are shown and nothing is hidden.
- **Arrival:** An inline script sets `data-arrive` once per session (sessionStorage `neblina-arrived`). The hero fog fades from opacity 1 and the name, cup and sky from 0.12, over 1.3s. The first pointerdown, keydown, wheel or touch removes the attribute.
- **Hero scrub:** As the hero scrolls out (scrub 0.5), the name scales 1 to 0.94, fog-a goes to 0.1, fog-b to 0.05, and the sky moves 8% in y.
- **Close:** The name scales 0.94 to 1 and the fog goes 0.03 to 0.2 as the footer arrives.
- **Origin (≥800px):** The stage is pinned for 130% of the viewport (scrub 1). The numeral counts from `from.altitude` to `to.altitude`, the route is revealed with `clip-path` inset, and the frames enter staggered (opacity 0, y 70, scale 0.92).
- **Reveal recipe:** `from {opacity 0, y 20}`, 0.6s power3.out, stagger 0.08, start `top 82%`, once. It is applied only to targets still below 85% of the viewport.
- **Ambient:** Fog drifts over 90s and 140s, alternating (translate -4%, 1%). Steam dashes loop at 6, 7.5 and 5.2s. On hover (hover devices only), a panel grows to flex 6 and a row moves 6px right. Quantity changes pop from scale 1.35, and the order question rises 10px.
- **Page veil:** `@view-transition` on navigation. The old page fades out over 0.28s onto paper, and the new one fades in over 0.5s after a 0.12s delay.
- **Easing:** `--ease` cubic-bezier(0.16, 1, 0.3, 1).

### Signature: the fog
Two noise sheets (`/fog.webp` at 0.62, `/fog-b.webp` at 0.4) are blended with `screen`, with an inset of -12% -6%. In the close they drop to 0.2 and 0.12. The fog is rendered only when `site.json` `atmosphere` is `"fog"`. With `"none"` it disappears, and the layering still holds.

## Reusing the template for another café

- **`content/site.json`:** Holds `name`, `atmosphere` (`fog` or `none`), `hours`, `rituals`, and optionally `origin`. Rituals use `at` set to `opens`, `closes` or HH:MM. `origin` needs a from and a to (name, altitude), an area, and exactly 4 stages. Without `origin`, the chapter is skipped. Hoy, the hero status and the Visit hours are all computed from this file in Quito time.
- **`content/menu.json`:** `featured` must hold exactly 4 ids, which sets the band size (cap 4). The home table takes up to 12 rows, round-robin over the categories and excluding featured and unavailable dishes. An optional `seasonal` window can be set. The validator fails the build on a broken edit.
- **Hero name:** 4 to 9 letters, uppercase, on one line. The type size is tuned for 7 letters bleeding equally off both edges. The build does not stack longer names, and the validator does not enforce the length.
- **Photos:** Place files under `public/photos` using the naming above, and give each a `credits.json` entry. Category art on /menu/ is a map keyed by category id in `views/MenuView.tsx`. That map is code, not JSON, and a category without art simply shows none.

## Do's and Don'ts

### Do:
- **Do** use cherry only for WhatsApp actions and the map pin.
- **Do** keep the dominant object of each beat as the largest thing, cropped by an edge.
- **Do** caption by naming the dish ("Pan de yuca recién horneado"). Band captions show the dish name and price, and alts describe the thing shown.
- **Do** show the fictional-business line on every page (in the footer). Show "Fotos ilustrativas." above the credits list whenever `credits.json` is not empty.
- **Do** give every motion a reduced-motion final state that is already visible.

### Don't:
- **Don't** let a photo, cut-out, fog or display word cover body text, prices or buttons.
- **Don't** say "our" or "nuestro" in captions or alts for stock photos, and never present them as this café's room, staff or plates.
- **Don't** round corners, add box-shadows to controls, or add a third weight or a second family.
- **Don't** type prices, hours or dishes into components. They come from `content/*.json`.
- **Don't** use text glyphs as icons on new surfaces. Use inline SVG, as the Visit arrow does.

## Known limits

- /menu/ LCP headroom is about 50ms. The cup over "Menú" is the LCP image, so nothing heavier can go above the fold there.
- On phone, the /menu/ header cup and the café category art are the same image (`hero-cup-cut-520`).
- Motion pins Origin at 800px and up, but the CSS phone layout starts at 760px. Between 761 and 799px the stage gets the stacked reveal instead.
