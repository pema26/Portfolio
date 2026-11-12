import fs from 'node:fs';
import path from 'node:path';
import { test as base, expect } from '@playwright/test';

const now = Math.floor(Date.now() / 1000);
export const ratingChanges = Array.from({ length: 6 }, (_, index) => ({
  contestId: 2000 + index,
  contestName: `Practice contest ${index + 1}`,
  rank: 50 + index,
  ratingUpdateTimeSeconds: now - (12 - index) * 86400,
  oldRating: 800 + index * 40,
  newRating: 840 + index * 40,
}));

const user = { handle: 'Vasta', rating: 1040, maxRating: 1040, rank: 'newbie' };
const submissions = Array.from({ length: 12 }, (_, index) => ({
  verdict: 'OK',
  creationTimeSeconds: now - index * 86400,
  author: { participantType: 'CONTESTANT' },
  problem: { contestId: index === 0 ? 339 : 2100 + index, index: 'A', name: index === 0 ? 'Helpful Maths' : `Practice problem ${index}`, rating: 800 },
}));

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('https://codeforces.com/api/**', async route => {
      const pathname = new URL(route.request().url()).pathname;
      const result = pathname.endsWith('user.info') ? [user]
        : pathname.endsWith('user.rating') ? ratingChanges : submissions;
      await route.fulfill({ json: { status: 'OK', result } });
    });
    await use(page);
  },
});
export { expect };

// Include every current content entry, so adding an entry extends the audit.
export const routes = ['/', '/about', '/contact', '/projects', '/problems', '/research', '/not-a-page', '/demos/youtube-clone/index.html'];
for (const [folder, prefix] of [['projects', '/projects'], ['challenges', '/problems'], ['research', '/research']]) {
  const directory = path.resolve('src/content', folder);
  for (const name of fs.readdirSync(directory).filter(file => file.endsWith('.jsx'))) {
    const id = fs.readFileSync(path.join(directory, name), 'utf8').match(/\bid:\s*['"]([^'"]+)['"]/);
    if (id) routes.push(`${prefix}/${id[1]}`);
  }
}
