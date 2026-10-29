#!/usr/bin/env python3
"""Regenerate delivery images from retained PNG originals (requires cwebp).

Run: python3 scripts/optimize-images.py
PNG masks/book paper and social sharing images intentionally remain unchanged.
"""
from pathlib import Path
import shutil
import struct
import subprocess

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
GROUPS = {
    # Full-width layered artwork: preserve desktop detail and transparency.
    2172: '52108 58b7c bdcd3 d7fd2 f7dfd',
    960: '45ef8 a1fb2 d0273',
    800: '2273d dc7cf 93d4b 531b1 38e08 60de8 f924c 93ed8 d2df8 8df7c',
    640: 'step-1-palette step-2-palette step-3-palette step-4-palette',
    400: 'd8d95 bcc8e b3f84 750b7 b840d',
    256: '05ca9',
}
LOSSLESS = {528: 'logo-transparent 06074', 0: 'c50bd 859d1 683e0 bfaca a741f a654e'}


def convert(name, cap, lossless=False, suffix=''):
    source = ASSETS / (name + '.png')
    width, height = struct.unpack('>II', source.read_bytes()[16:24])
    target_width = min(width, cap) if cap else width
    target_height = max(1, round(height * target_width / width))
    output = ASSETS / (name + suffix + '.webp')
    command = ['cwebp', '-quiet', '-m', '6']
    command += ['-lossless'] if lossless else ['-q', '85', '-alpha_q', '100']
    command += ['-resize', str(target_width), str(target_height), str(source), '-o', str(output)]
    subprocess.run(command, check=True)
    print(f'{output.relative_to(ROOT)}: {target_width}x{target_height}, {output.stat().st_size:,} bytes')


if __name__ == '__main__':
    if not shutil.which('cwebp'):
        raise SystemExit('cwebp is required; install libwebp before running this script.')
    for cap, names in GROUPS.items():
        for name in names.split():
            convert(name, cap)
            if cap >= 800:
                convert(name, cap // 2, suffix='-small')
    for cap, names in LOSSLESS.items():
        for name in names.split():
            convert(name, cap, lossless=True)
