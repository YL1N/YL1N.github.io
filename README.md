# yl1n.github.io

Personal academic homepage of Lien Yilin Jiang. Plain HTML and CSS, no build step and no external dependencies.

## Structure

- `index.html` holds all content.
- `assets/css/style.css` holds the styles. Colours are defined as variables at the top of the file, for light and dark themes.
- `assets/js/main.js` handles the theme toggle and the navigation highlight.
- `assets/img/profile.jpg` is the portrait. It is shown whole at its own aspect ratio, so any uncropped photo works; update the `width` and `height` attributes of the `<img>` in `index.html` to match.

- `assets/img/logos/` holds the affiliation emblems shown under the About text.

## Adding a publication

Copy one `<li class="pub">` block in `index.html` and edit the venue badge, title, authors, venue line and links. Wrap your own name in `<strong class="me">`. Put a one- or two-sentence summary in `<p class="pub-tldr">` under the venue line. Use `<span class="venue venue-plain">` for preprints. CCF ranks use `<span class="tag ccf ccf-a">`, `ccf-b` or `ccf-c` (red, yellow, green).

## Preview locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploy

Push to the `main` branch of a repository named `YL1N.github.io`. GitHub Pages serves it at https://yl1n.github.io/.
