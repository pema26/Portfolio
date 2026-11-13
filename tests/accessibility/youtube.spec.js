import { test, expect } from './fixtures';

test('YouTube clone is showcased as a completed HTML and CSS project', async ({ page }) => {
  await page.goto('/projects/youtube-clone');
  await expect(page.getByRole('heading', { level: 1, name: 'YouTube interface clone (HTML & CSS)', exact: true })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  await expect(page.getByRole('main')).not.toContainText('JavaScript');
  const demoLink = page.getByRole('link', { name: 'Live demo' });
  await expect(demoLink).toHaveAttribute('href', '/demos/youtube-clone/index.html');
  const popupPromise = page.waitForEvent('popup');
  await demoLink.click();
  const demo = await popupPromise;
  await expect(demo.getByRole('heading', { level: 1, name: 'Recommended', exact: true })).toBeVisible();
  await demo.close();
  await expect(page.getByRole('link', { name: 'SuperSimpleDev: HTML & CSS course' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=G3e-cpL7ofc&t=15316s');
  await expect(page.getByRole('link', { name: 'SuperSimpleDev: additional learning resource' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=EerdGm-ehJQ');
  const preview = page.getByRole('img', { name: /completed YouTube-style homepage/ });
  await expect(preview).toBeVisible();
  await expect.poll(() => preview.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);

  await page.goto('/');
  const featured = page.locator('article').filter({ has: page.getByRole('link', { name: 'YouTube interface clone (HTML & CSS)', exact: true }) });
  await expect(featured).toBeVisible();
  await expect(featured.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: 'Ambitious projects', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Flagship projects', exact: true })).toHaveCount(0);
});

test('YouTube HTML demo loads its images and supports a keyboard menu and native search', async ({ page }) => {
  await page.goto('/demos/youtube-clone/index.html');
  await expect(page.getByRole('heading', { level: 1, name: 'Recommended', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.scripts.length)).toBe(0);
  await expect(page.locator('.video-grid article')).toHaveCount(6);
  await expect.poll(() => page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to videos' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const menu = page.getByRole('button', { name: 'Browse sections', exact: true });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('navigation', { name: 'Quick navigation' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('navigation', { name: 'Quick navigation' })).toBeHidden();

  await page.route('https://www.youtube.com/results?*', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Search destination</title><body><h1>Search destination</h1></body></html>' }));
  await page.getByRole('searchbox', { name: 'Search YouTube' }).fill('css grid layout');
  await page.keyboard.press('Enter');
  await page.waitForURL(url => url.hostname === 'www.youtube.com' && url.searchParams.get('search_query') === 'css grid layout');
});

test('YouTube demo adapts its video columns and text spacing without page overflow', async ({ page }) => {
  for (const [width, columns] of [[320, 1], [768, 2], [1440, 3]]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/demos/youtube-clone/index.html');
    const rowCount = await page.locator('.video-grid article').evaluateAll(cards => {
      const firstTop = cards[0].getBoundingClientRect().top;
      return cards.filter(card => Math.abs(card.getBoundingClientRect().top - firstTop) < 1).length;
    });
    expect(rowCount).toBe(columns);
    await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});
