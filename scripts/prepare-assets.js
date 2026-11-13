import { cpSync, mkdirSync } from 'node:fs';

// The project folder is the editable source. public/demos is generated output.
const source = new URL('../projects/youtube-clone/', import.meta.url);
const output = new URL('../public/demos/youtube-clone/', import.meta.url);

mkdirSync(output, { recursive: true });
for (const name of ['index.html', 'youtube.css', 'styles', 'thumbnails', 'channel-pictures']) {
  cpSync(new URL(name, source), new URL(name, output), { recursive: true });
}

console.log('Prepared the HTML/CSS YouTube demo from projects/youtube-clone/.');
