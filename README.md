# Sloan Business Club website

Static rebuild of [mitsbc.org](https://www.mitsbc.org) in plain HTML, CSS, and a few lines of JavaScript. No framework, no build step. Google Fonts (Inter, Playfair Display) is the only external dependency.

## Preview locally

```bash
cd sbc-website
python3 -m http.server 8080
# open http://localhost:8080
```

## Layout

| Path | What it is |
|---|---|
| `index.html` | Home: hero, about, initiatives, BEP teaser, partner logos, contact band |
| `board.html` | Executive board (headshots), general board, alumni by year, campus activities, placements |
| `program.html` | Board Education Program overview, curriculum, Deep Dive projects |
| `finance.html`, `consulting.html`, `entrepreneurship.html` | Initiative pages |
| `edge.html` + `edge/*.html` | The SBC Edge: post index and the individual newsletters, interviews, and essays |
| `join.html` | Recruitment: SBC Week schedule, eligibility, how to apply, mailing list |
| `gallery.html`, `contact.html` | Gallery and contact |
| `css/styles.css` | The whole design system. Colors, fonts, and spacing are CSS variables at the top of the file. |
| `js/main.js` | Scroll-reveal animation (elements float up as they enter the viewport), mobile nav toggle, dropdown, current-page highlighting |
| `assets/` | Logos, headshots, photos, newsletter pages, Deep Dive PDFs |
| `scripts/fetch-assets.sh` | Re-downloads every asset from the old Squarespace CDN (already run; kept for reference) |

Every page carries the same header and footer markup. When you change the nav or footer, change it in every `*.html` and `edge/*.html` file (a find-and-replace across the folder works well).

## Common edits

**Add or change a board member** (`board.html`): drop a square headshot into `assets/headshots/` named like `first-last.jpg`, then copy an existing `<div class="person">…</div>` block inside the right `people-group` and update the image, name, and role. For a member without a photo, use the initials variant:

```html
<div class="person">
  <div class="person__photo person__photo--initials" aria-hidden="true">AB</div>
  <div class="person__name">Ada Bell</div>
  <div class="person__role">Treasurer</div>
</div>
```

**Add alumni**: in `board.html`, each class year is a `<details>` block. Add an `<li>` to the right year, or copy a whole block for a new year and update the `Class of …` label and count.

**Add a partner logo** (`index.html`): save a PNG with a transparent background to `assets/logos/` and add one `<div class="logo-wall__item">` to the `logo-wall` grid. Logos are shown in grayscale until hover, so any brand color is fine.

**Add an Edge post**: copy the closest existing file in `edge/` (a newsletter, an interview, or an essay), edit the content, then add a matching card to `edge.html` at the top of the `post-list`. Newsletter page images go in `assets/edge/`.

**Turn off the reveal animation**: delete the first block in `js/main.js` (the one that adds the `reveal` class). It already switches itself off for visitors who have "reduce motion" enabled.

**Update recruitment** (`join.html`): the SBC Week schedule is an `<ol class="tl">` with one `<li class="tl__item">` per event (day, date, time, title, blurb, room). Dates appear in the hero, the schedule heading, the timeline, the four steps, and the application box, so search the file for the month name when a new year rolls around. When the application form goes live, replace the mailing-list link in the `apply-box` with the form URL and change the button text to "Apply now" (there is an HTML comment marking the spot).

**Edit the member photo strip** (`index.html`): the scrolling strip is `.marquee__track`. The photos are listed twice in a row so the loop is seamless; add or remove a `<figure>` in both copies. Strip images are small copies in `assets/photos/thumbs/` (about 900px wide) so the strip loads fast.

**Change colors or fonts**: edit the variables in the `:root` block at the top of `css/styles.css`. `--navy` and `--sky` come from the SBC logo.

## Deploying

The folder is a complete static site. Upload it as-is to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, or MIT's web hosting). `index.html` is the entry point.
