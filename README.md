# MOONLITREATS Site

Static official brand hub for MOONLITREATS.

## Structure

- `index.html`: Home
- `about.html`: Brand / About
- `characters.html`: Character-first series archive
- `episode.html`: Short episode archive
- `gallery.html`: Character illustration, poster, and seasonal image gallery
- `gacha.html`: Character draw
- `goods-preview.html`: Goods Coming Soon
- `css/style.css`: Shared site chrome and global responsive system
- `css/characters.css`: Character page styles
- `css/gallery.css`: Gallery page styles
- `css/gacha.css`: Gacha page styles
- `js/main.js`: Shared navigation, theme, reveal, slider, and back-to-top behavior
- `js/character-data.js`: Shared brand, character, series, episode, gallery, goods, and news data
- `js/site-renderer.js`: Reusable page renderers for data-driven sections
- `js/characters.js`: Character page modal behavior
- `js/gacha.js`: Gacha page behavior
- `partials/`: Shared header/footer source
- `tools/apply-partials.js`: Injects header/footer partials into every HTML file

## Shared Partials

After changing `partials/site-header.html` or `partials/site-footer.html`, run:

```bash
node tools/apply-partials.js
```

The HTML files remain deployable as plain static files, while the header and footer stay synchronized from one source.

## Content Model

Most renewable site content lives in `js/character-data.js`.

- Add new characters to `characters`.
- Add new series to `content.series`.
- Add short illustrated stories to `content.episodes`.
- Add gallery items, goods, and news to their matching arrays.

The current default locale is Korean. The data shape is intentionally centralized so English or Japanese content can be added later without rewriting the page structure.
