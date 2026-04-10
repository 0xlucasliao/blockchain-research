# UI & design guide — blockchain-research

This document is the **written specification** for the GitHub Pages site. Shared implementation: [`css/theme.css`](css/theme.css) (colour tokens, light default + dark mode), [`css/motion.css`](css/motion.css), and [`js/motion.js`](js/motion.js) (includes theme persistence). Optional HTML reference for authors: `design-guide.html` (not linked from the public hub or masthead).

---

## Principles

1. **Serious and credible** — research, not marketing. Avoid flashy gradients, gimmicky cursors, and decorative motion that does not aid scanning.
2. **Readability first** — comfortable line length (~65 characters where possible), clear hierarchy, sufficient contrast (WCAG AA as a baseline for body text on both themes).
3. **Motion supports structure** — short page enters, optional cross-document transitions, and restrained scroll reveals. Never block reading on animation completing.
4. **Respect user preferences** — everything in `motion.css` / `motion.js` degrades cleanly when `prefers-reduced-motion: reduce` is set.

---

## Themes & typography

**One type system everywhere:** IBM Plex Sans (UI, body, section titles) and IBM Plex Mono (labels, nav, data, pills).

**Light is the default** (`:root` in `theme.css`). **Dark mode** is activated with `html[data-br-theme="dark"]`, toggled from the masthead **Dark / Light** button; preference is stored as `localStorage` key `br-theme` (`light` | `dark`).

Semantic tokens (examples): `--bg`, `--surface`, `--card`, `--border`, `--text`, `--muted`, `--heading`, `--gold`, `--masthead-*`, `--cover-*`, `--inv-header-*`. Pages should **not** hard-code hex colours for chrome — use these variables so both modes stay coherent.

### Institutional pages

Same fonts and token set as consumer research. Layout differences (cover hero, stat row, layer tables) remain; colours follow `theme.css`.

---

## Layout & chrome

- **Fixed masthead** (`.br-masthead`, 44px): site title + **Home**, **Use cases**, **Sectors** (`<details class="br-sectors">` with links to consumer and institutional sector HTML), and **theme toggle** (`[data-br-theme-toggle]`). Colours come from theme tokens (no separate `--dark` / `--light` masthead classes). **Relative `href`s depend on folder depth** (`../` from `sector_research/` and `use_cases/`).
- **Spacer** (`.br-masthead-spacer`): prevents content sitting under the fixed bar.
- **Consumer secondary nav** (`body.has-local-nav`): local sticky TOC; `top: 44px` so it stacks under the masthead when stuck.
- **Institutional cover**: extra top padding (`108px`) so the masthead does not obscure the cover logo; cover title block uses CSS-only staggered fade-in.

---

## Motion specification

| Behaviour | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Page enter | ~0.5s | `--br-ease-out` | First paint on `main`, `nav` (not masthead), `.page`, `.cover` |
| Scroll reveal | ~0.6s | `--br-ease-out` | `IntersectionObserver` adds `.br-is-visible` to `[data-reveal]` |
| Cross-page transition | ~0.38s | `--br-ease-out` | `document.startViewTransition` on same-origin `*.html` navigations (supported browsers only) |
| Link / control hover | 0.15–0.2s | standard | CSS `transition` on masthead and card components |

**CSS variables** (see `css/motion.css`): `--br-ease-out`, `--br-ease-standard`, `--br-duration-fast`, `--br-duration-med`, `--br-duration-slow`, `--br-stagger`.

**View Transitions:** `@view-transition { navigation: auto; }` is declared for future-friendly cross-document transitions. The script guards for API presence and same-document / hash-only navigation.

**Scroll reveal markup:**

```html
<section data-reveal>
  …
</section>
```

Optional stagger inside a section:

```html
<div data-reveal style="--br-reveal-delay: 0.12s">…</div>
```

---

## Accessibility

- Visible **`:focus-visible`** outlines on interactive elements (gold on dark; dark gold / neutral on light masthead).
- **Do not** remove focus outlines without replacing them.
- **Colour** is never the only signal; pair status colours with labels or icons.
- **Reduced motion:** page enter, scroll reveal, cover stagger, and view-transition interception are disabled; `[data-reveal]` content is shown immediately.

---

## Repository layout

| Folder | Purpose |
|--------|---------|
| **`sector_research/`** | Sector-wide briefs (e.g. consumer vs institutional payments). |
| **`use_cases/`** | Narrow application notes (one issue, one shape of solution). |
| **`css/`**, **`js/`** | `theme.css` (palette + light/dark), `motion.css` (motion + masthead), `motion.js` (theme + reveals + view transitions). |

## Adding a new page

1. Choose **root** vs **nested** folder; set asset paths accordingly (`css/theme.css` + `css/motion.css` vs `../css/…`, and `js/motion.js` vs `../js/motion.js`).
2. Link **`css/theme.css` before `css/motion.css`** (or `../css/` from nested folders).
3. Set `body` class `br-site`, plus `has-local-nav` if you add a second sticky bar under the masthead (consumer-style TOC). Institutional long-form uses `institutional-doc` on `<body>` for cover motion hooks.
4. Paste the **masthead** from `index.html` (include the **theme toggle** button) and **rewrite link targets** for your depth. `aria-current` is handled by `motion.js` using full normalized pathnames.
5. Insert `<div class="br-masthead-spacer" aria-hidden="true"></div>` after the masthead.
6. Add `<script src="js/motion.js" defer></script>` (or `../js/motion.js`) before `</body>`.
7. Mark major sections with `data-reveal` where a gentle entrance helps scanning — not every paragraph.
8. Add an entry on **`index.html`** (and **`use_cases/index.html`** if the page is a use case).

---

## Editorial alignment

Voice, neutral naming (e.g. **MPP SDK**), and chain-agnostic framing are defined in **`AGENTS.md`**. This guide covers **presentation only**.
