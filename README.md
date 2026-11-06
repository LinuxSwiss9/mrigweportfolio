# PAULMARY — Video Editor Portfolio

Portfolio site for Igwe Paulmary Nwachukwu. It uses plain HTML, CSS and JavaScript, with no build step and no dependencies.

## Structure

```
index.html            Page content and SEO meta tags
robots.txt
assets/
  css/style.css       All styles (sections are numbered in the header comment)
  js/main.js          Interactions; the CONFIG block is at the top
  img/favicon.svg
```

## Quick edits

- **WhatsApp number:** in `assets/js/main.js`, set `CONFIG.whatsappNumber` to digits only in international format, for example `2348012345678`. The WhatsApp button appears once a number is set.
- **Portfolio videos:** in `index.html`, each project is an `<article class="project">`. To change a video, update the video ID in `data-yt`, the thumbnail URL and the "Watch full video" link.
- **Domain (when live):** add `<link rel="canonical" href="https://your-domain/">` and an `og:image` to the `<head>` of `index.html`.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server, for example `npx serve .`.

## Deploy

Upload the whole folder to any static host, such as Netlify, Vercel, GitHub Pages or cPanel.
