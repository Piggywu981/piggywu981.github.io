# Piggywu981 · Project Index

Live at <https://piggywu981.github.io/> — a single-page entry point to every public repository on this account.

Lists 21 entries: 13 self-authored projects, 7 fork mirrors, and this site's own repository. Six of them are reachable as live demos straight from the cards.

## Stack

Static HTML, CSS and vanilla JavaScript. No framework, no build step, no runtime dependencies and no CDN — system font stacks only. The one remote resource is the GitHub avatar in the header; everything else renders from this repository.

| File | Role |
| --- | --- |
| `index.html` | Page shell and pre-JS English defaults |
| `assets/style.css` | Visual system: CSS variables, EL panel effects, both themes |
| `assets/projects.js` | Project data (Chinese is the base text) |
| `assets/i18n.js` | UI strings for both languages + English project text |
| `assets/app.js` | Rendering, search, filters, language and theme toggles, API refresh |

## How data stays current

Project entries are committed statically, then `app.js` fetches `https://api.github.com/users/Piggywu981/repos` on load to refresh star counts and push dates. The GitHub API allows only 60 unauthenticated requests per hour per IP, so a `403` is expected from time to time — the page then keeps the bundled data and says so in the boot log and the footer instead of failing silently. The same request reports repositories that exist upstream but are not indexed here yet.

## Languages

English is the default; the toggle in the header switches to Chinese and stores the choice in `localStorage`. Both dictionaries live in `assets/i18n.js`, and `PROJECTS_EN` supplies the English title and summary for every entry — anything missing falls back to the Chinese text rather than rendering blank. Search matches both languages regardless of the active one.

## Preview locally

```bash
python -m http.server 8765
```

Opening `index.html` directly also works; the only thing a `file://` origin changes is that the API refresh is skipped.

## Maintenance

Adding or removing a repository means editing `assets/projects.js` (and `PROJECTS_EN` in `assets/i18n.js` for the English side), plus the hard-coded defaults in the `bootlog` block of `index.html` so the pre-JavaScript text is not stale. The counts in the readout panel, the chips and the boot log are all derived from the data array at runtime — they need no manual update.

## Deployment

GitHub Pages, user site repository, publishing from the `main` branch at the repository root. Pushing to `main` is enough; there is nothing to build.

## Design notes

The visual language is an electroluminescent instrument panel: uniform cold backlight, edge bleed, inverter flicker — deliberately without scanlines or chromatic aberration, which belong to CRT phosphor rather than EL. The palette follows the yellow readout of an HP 37900D signal analyzer, with orange reserved for pending states and green for live signals only. Both themes clear WCAG AA on the smallest text (≥ 5.3:1), and everything animated is disabled under `prefers-reduced-motion`.
