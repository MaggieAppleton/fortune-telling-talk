# Fortune Telling and Speculative Design

The final presentation, using Reveal.js 6.0.2. Slides, animations, speaker notes and media run locally.

## Present

Use Node.js 22.12 or newer. Install dependencies once, then start the server:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173** and keep the server running while presenting.

- **→ / Space:** advance; click-to-reveal steps appear before the next slide.
- **←:** go back.
- **S:** speaker view with notes and timer. Allow popups for the local address.
- **F:** fullscreen.
- **Esc:** slide overview.
- **B:** black screen.

Videos play locally, muted and looping, with controls. Presenting needs no Wi-Fi once dependencies are installed.

Videos are compressed at up to 2400 pixels wide and 30 fps for sharp playback at 1200 pixels wide on Retina screens. Images use lossless WebP where it saves space. Optimise new media locally before committing; keep full-resolution source recordings outside this repo.

## Edit

- `index.html`: the complete deck. Edit slide content here; speaker notes are bullet lists inside each slide’s `<aside class="notes">`.
- `src/`: Reveal settings, styling, transitions, stagger animations, click reveals and video playback.
- `public/assets/`: all referenced images and videos, including WebM and MP4 versions.
- `public/fonts/`: bundled Test Family and Test Untitled Sans web fonts, including italics and variable weights; loaded by `src/fonts.css` without relying on fonts installed on the presenting computer.
- `slide-images/`: 69 lossless WebP exports at 1280 × 720, one per finished slide with all click reveals visible. Video slides use still frames. These are snapshots and need re-exporting after slide edits.
- `package.json`, `package-lock.json`, `vite.config.js`: dependencies and local server/build settings.

Keep `data-source-slide` attributes when editing: the animation helpers use them to identify slides with special reveals.

## Build

```sh
npm run build
npm run preview
```

Open **http://127.0.0.1:4173**. The generated `dist/` folder contains the presentation and its media, ready to serve from any local web server.
