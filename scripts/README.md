# Image delivery

The site is static: optimized images are checked in and need no server-side image service.

- Keep the source PNG files. `scripts/optimize-images.py` generates WebP files using `cwebp` (libwebp).
- Run `python3 scripts/optimize-images.py` after replacing a source image. If its dimensions change, update the matching `srcset` width descriptors and `width`/`height` in `index.html` too.
- App screenshots use lossless WebP; illustrations/photos use quality 85 with full-quality alpha. Large images also have `-small.webp` variants.
- Hero artwork stays eager. Its `sizes` must account for wide, cropped layers, not just viewport width. Below-fold content is lazy-loaded.
- Book paper images remain PNG because the same files are CSS masks. Social sharing PNGs are also unchanged for crawler compatibility.
- The reel uses `preload="none"`; `app.js` starts playback within 300px of the viewport and pauses it outside that area.

Validate local references, responsive descriptors, retained originals and size budgets:

```sh
python3 -m unittest discover -s tests -v
```

For visual changes, also serve the site locally and check desktop/mobile layouts, the scroll-driven book, mobile menu, and reel playback near the bottom. Measure production loading after deployment; local byte savings do not establish production LCP or load times.
