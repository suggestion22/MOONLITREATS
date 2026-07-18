# MOONLITREATS Site

Static brand archive site for MOONLITREATS.

## Structure

- `index.html`: Home
- `about.html`: Brand / About
- `characters.html`: Character card archive
- `gallery.html`: Making archive gallery
- `gacha.html`: Character draw
- `goods-preview.html`: Goods concept preview
- `css/style.css`: Shared site chrome and global responsive system
- `css/characters.css`: Character page styles
- `css/gallery.css`: Gallery page styles
- `css/gacha.css`: Gacha page styles
- `js/main.js`: Shared navigation, theme, reveal, slider, and back-to-top behavior
- `js/character-data.js`: Shared character data
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
