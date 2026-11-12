import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../html-css-course/', import.meta.url));
const output = fileURLToPath(new URL('../public/demos/youtube-clone/', import.meta.url));
const files = [
  ['youtube.html', 'index.html'],
  ['youtube.css', 'youtube.css'],
  ...['general', 'header', 'video'].map(name => [`styles/${name}.css`, `styles/${name}.css`]),
];
for (let index = 1; index <= 6; index++) {
  files.push([`thumbnails/thumbnail-${index}.webp`, `thumbnails/thumbnail-${index}.webp`]);
  files.push([`channel-pictures/channel-${index}.jpeg`, `channel-pictures/channel-${index}.jpeg`]);
}
for (const [from, to] of files) {
  const destination = join(output, to);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(join(source, from), destination);
}
console.log('Prepared the HTML/CSS YouTube demo.');
