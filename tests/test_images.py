"""Static delivery checks. Run: python3 -m unittest discover -s tests -v"""
from html.parser import HTMLParser
from pathlib import Path
import re
import struct
import unittest

ROOT = Path(__file__).resolve().parents[1]


class MediaParser(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.images = []
        self.videos = []
        self.references = set()
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'img':
            self.images.append(attrs)
        if tag == 'video':
            self.videos.append(attrs)
        for name in ('src', 'href'):
            if attrs.get(name, '').startswith('assets/'):
                self.references.add(attrs[name])
        for candidate in attrs.get('srcset', '').split(','):
            if candidate.strip():
                self.references.add(candidate.split()[0])


def webp_width(path):
    data = path.read_bytes()
    assert data[:4] == b'RIFF' and data[8:12] == b'WEBP'
    kind, payload = data[12:16], data[20:]
    if kind == b'VP8X':
        return 1 + int.from_bytes(payload[4:7], 'little')
    if kind == b'VP8L':
        return 1 + (int.from_bytes(payload[1:5], 'little') & 0x3fff)
    if kind == b'VP8 ':
        return struct.unpack('<H', payload[6:8])[0] & 0x3fff
    raise AssertionError(f'Unknown WebP format: {path}')


class ImageDeliveryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.media = MediaParser((ROOT / 'index.html').read_text())

    def test_all_local_media_exist(self):
        for reference in self.media.references:
            with self.subTest(reference=reference):
                self.assertTrue((ROOT / reference).is_file())

    def test_srcset_widths_match_files(self):
        for image in self.media.images:
            if 'srcset' not in image:
                continue
            self.assertIn('sizes', image)
            for candidate in image['srcset'].split(','):
                filename, descriptor = candidate.split()
                with self.subTest(filename=filename):
                    self.assertEqual(webp_width(ROOT / filename), int(descriptor[:-1]))

    def test_png_originals_and_paper_masks_are_preserved(self):
        for reference in self.media.references:
            if reference.endswith('.webp'):
                original = re.sub(r'-small(?=\.webp$)', '', reference).replace('.webp', '.png')
                self.assertTrue((ROOT / original).is_file(), original)
        pngs = {image['src'] for image in self.media.images if image['src'].endswith('.png')}
        self.assertEqual(pngs, {'assets/book-page-left.png', 'assets/book-page-right.png'})

    def test_delivery_budgets(self):
        # All default image sources combined, not a measured network budget.
        sources = {image['src'] for image in self.media.images}
        self.assertLess(sum((ROOT / source).stat().st_size for source in sources), 3_000_000)
        self.assertLess((ROOT / 'assets/d0273.webp').stat().st_size, 200_000)

    def test_loading_policy(self):
        hero_classes = {'hero-back', 'hero-garden', 'land-left', 'land-right'}
        for image in self.media.images:
            if hero_classes.intersection(image.get('class', '').split()):
                self.assertNotEqual(image.get('loading'), 'lazy')
        lazy_images = [i for i in self.media.images if i.get('loading') == 'lazy']
        self.assertGreaterEqual(len(lazy_images), 30)
        self.assertEqual(len(self.media.videos), 1)
        self.assertEqual(self.media.videos[0]['preload'], 'none')
        self.assertNotIn('autoplay', self.media.videos[0])


if __name__ == '__main__':
    unittest.main()
