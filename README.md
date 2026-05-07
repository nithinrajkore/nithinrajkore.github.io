# Nithin Raj Kore — Portfolio

Personal portfolio site. 

## Currently live

**Minimal Editorial** — at the repository root (`index.html`).

## Folder structure

```
portfolio/
├── index.html                # ← LIVE site (Minimal Editorial)
├── themes/
│   └── index.html            # Theme picker (preview all 4)
├── crimson/                  # Theme 01 · Crimson Noir
├── crimson-light/            # Theme 02 · Crimson Light
├── editorial/                # Theme 03 · source copy of the live site
├── cyberpunk/                # Theme 04 · Cyberpunk Terminal
└── README.md
```

URLs after deploy (`https://nithinrajkore.github.io/...`):

| URL | Shows |
|---|---|
| `/` | **Minimal Editorial** (live site) |
| `/themes/` | Theme picker — preview all four |
| `/crimson/` | Crimson Noir |
| `/crimson-light/` | Crimson Light |
| `/editorial/` | Identical copy of the live site |
| `/cyberpunk/` | Cyberpunk Terminal |

## Run locally

```bash
open index.html             # the live (editorial) site
open themes/index.html      # the theme picker
```

## Deploy to GitHub Pages

Run from `/Users/nithinkore/Documents/portfolio`:

```bash
# 1) Create a new repo on github.com named EXACTLY:  nithinrajkore.github.io
#    (DO NOT initialize it with README/license)

# 2) From the portfolio folder:
cd /Users/nithinkore/Documents/portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/nithinrajkore/nithinrajkore.github.io.git
git push -u origin main
```

In ~1 minute the live URL will be **https://nithinrajkore.github.io**.

- All copy lives in `index.html` (or whichever theme folder you're editing)
- Editorial: red accent is `--red: #d10024`, swap inside the `<style>` block
- Crimson variants: edit `styles.css` `:root` block
- Projects/work/education are hand-coded in each theme's HTML — duplicate a card block to add more
