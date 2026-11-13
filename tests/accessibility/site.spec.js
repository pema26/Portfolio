import AxeBuilder from '@axe-core/playwright';
import { test, expect, routes, ratingChanges } from './fixtures';

for (const route of routes) {
  test(`scan ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    if (route === '/problems') await expect(page.getByRole('status').filter({ hasText: 'Codeforces profile loaded' })).toBeVisible();
    if (route === '/projects/wordle-assistant') await expect(page.getByLabel('Terminal command', { exact: true })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    if (results.violations.length) await testInfo.attach('axe-violations', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target), details: nodes.map(node => node.failureSummary) }))).toEqual([]);
  });
}

test('skip link and route changes put keyboard focus in the content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const contact = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact', exact: true });
  await contact.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeFocused();
  await expect(page).toHaveTitle(/Contact/);
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('search has a visible label, announces its result count, and keeps focus', async ({ page }) => {
  await page.goto('/problems');
  const input = page.getByRole('searchbox', { name: 'Search problems' });
  await input.fill('no-matching-solution-12345');
  await expect(page.getByRole('status').filter({ hasText: '0 worked solutions found.' })).toBeVisible();
  await expect(input).toBeFocused();
  await expect(page.getByText('No problems match your search.')).toBeVisible();
});

test('calendar keeps its pointer readout without a date selector or daily table', async ({ page }) => {
  await page.goto('/problems');
  const calendar = page.getByRole('img', { name: 'Calendar of daily problems solved over the last year.', exact: true });
  await expect(calendar).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Choose an activity date' })).toHaveCount(0);
  await expect(page.getByText('Show daily totals as a table', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: 'Point at or tap a square' })).toBeVisible();
  await calendar.locator('rect').last().hover();
  await expect(page.getByRole('status').filter({ hasText: /problems? solved on/ })).toBeVisible();
  await page.getByRole('heading', { level: 1 }).hover();
  await expect(page.getByRole('status').filter({ hasText: 'Point at or tap a square' })).toBeVisible();
});

test('rating chart details are keyboard accessible, hoverable and dismissible', async ({ page }) => {
  await page.goto('/problems');
  const point = page.locator('svg[role="group"] circle').first();
  await expect(point).toBeVisible();
  await point.focus();
  const tooltip = page.locator('div.absolute').filter({ hasText: ratingChanges[0].contestName });
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveCount(0);
  await point.hover();
  await expect(tooltip).toBeVisible();
  await tooltip.hover();
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveCount(0);
  await page.getByText('Show contests as a table', { exact: true }).click();
  await expect(page.getByRole('table', { name: 'Codeforces rated contest results' })).toBeVisible();
});

test('FASTA input errors and results are announced without moving focus', async ({ page }) => {
  await page.goto('/projects/fasta-analyzer');
  const input = page.getByRole('textbox', { name: 'Enter your FASTA sequence:' });
  await input.fill('not FASTA');
  const analyze = page.getByRole('button', { name: 'Analyze', exact: true });
  await analyze.focus();
  await page.keyboard.press('Enter');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('status')).toContainText('Please check');
  await expect(analyze).toBeFocused();
  await page.getByRole('button', { name: 'Load sample' }).click();
  await analyze.click();
  await expect(input).toHaveAttribute('aria-invalid', 'false');
  await expect(page.getByRole('status')).toContainText('Analysis complete');
  await expect(page.getByRole('region', { name: 'FASTA analysis results' })).toContainText('SUMMARY STATS');
});

test('Wordle commands and prompts have readable labels and preserve keyboard focus', async ({ page }) => {
  await page.goto('/projects/wordle-assistant');
  const command = page.getByRole('textbox', { name: 'Terminal command', exact: true });
  await expect(command).toBeVisible();
  await command.click();
  await expect(command).toHaveCSS('outline-style', 'none');
  await expect(page.locator('.terminal-window')).not.toHaveCSS('box-shadow', 'none');
  await command.fill('python -m wordle');
  await page.keyboard.press('Enter');
  const guess = page.getByRole('textbox', { name: 'Wordle guess', exact: true });
  await expect(guess).toBeFocused();
  await guess.fill('apple');
  await page.keyboard.press('Enter');
  const feedback = page.getByRole('textbox', { name: 'Wordle feedback', exact: true });
  await expect(feedback).toBeFocused();
  await feedback.fill('ggggg');
  await page.keyboard.press('Enter');
  await expect(command).toBeFocused();
  await expect(page.getByRole('log', { name: 'Wordle terminal output' })).toContainText('Solved!');
});

test('Codeforces failure is announced and leaves the profile link usable', async ({ page }) => {
  await page.route('https://codeforces.com/api/**', route => route.abort());
  await page.goto('/problems');
  await expect(page.getByRole('status').filter({ hasText: 'Live stats could not be loaded' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Codeforces profile' })).toBeVisible();
});

test('Wordle loading failures are announced and can be retried', async ({ page }) => {
  await page.route('**/wordle_words_texts/words.txt', route => route.abort());
  await page.goto('/projects/wordle-assistant');
  await expect(page.getByRole('status')).toContainText('The word list could not be loaded');
  await page.unroute('**/wordle_words_texts/words.txt');
  await page.getByRole('button', { name: 'Reload the word list' }).click();
  await expect(page.getByRole('textbox', { name: 'Terminal command', exact: true })).toBeVisible();
});

test('keyboard focus is visible in forced colours and below the sticky header', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/projects/fasta-analyzer');
  const input = page.getByRole('textbox', { name: 'Enter your FASTA sequence:' });
  await input.focus();
  const focus = await input.evaluate(element => {
    const style = getComputedStyle(element);
    return { outline: style.outlineStyle, width: parseFloat(style.outlineWidth), top: element.getBoundingClientRect().top, headerBottom: document.querySelector('header').getBoundingClientRect().bottom };
  });
  expect(focus.outline).toBe('solid');
  expect(focus.width).toBeGreaterThanOrEqual(3);
  expect(focus.top).toBeGreaterThanOrEqual(focus.headerBottom);
  await page.goto('/projects/wordle-assistant');
  const command = page.getByRole('textbox', { name: 'Terminal command', exact: true });
  await command.focus();
  await expect(command).toHaveCSS('outline-style', 'none');
  await expect(page.locator('.terminal-window')).toHaveCSS('outline-style', 'solid');
  await expect(page.locator('.terminal-window')).toHaveCSS('outline-width', '3px');
});

test('pages reflow at 320 CSS pixels and with increased text spacing', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const route of ['/', '/about', '/contact', '/projects', '/problems', '/research', '/research/site-directed-mutagenesis', '/projects/wordle-assistant', '/projects/fasta-analyzer']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
  }
});

test('Home gradient colours keep readable text contrast at every supplied stop', async ({ page }) => {
  await page.goto('/');
  const colours = await page.evaluate(() => {
    const gradient = getComputedStyle(document.getElementById('home-bg')).backgroundImage;
    const backgrounds = [...gradient.matchAll(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g)].map(match => match.slice(1).map(Number));
    const link = getComputedStyle(document.querySelector('main a.text-link')).color.match(/\d+/g).slice(0, 3).map(Number);
    return { backgrounds, link };
  });
  expect(colours.backgrounds).toHaveLength(4);
  const luminance = rgb => {
    const linear = rgb.map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const foreground = luminance(colours.link);
  for (const background of colours.backgrounds) {
    const value = luminance(background);
    expect((Math.max(foreground, value) + 0.05) / (Math.min(foreground, value) + 0.05)).toBeGreaterThanOrEqual(4.5);
  }
});

test.describe('motion controls', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('manual reduced motion stops CSS and canvas animations and persists', async ({ page }) => {
    await page.addInitScript(() => {
      window.canvasDraws = 0;
      const clear = CanvasRenderingContext2D.prototype.clearRect;
      CanvasRenderingContext2D.prototype.clearRect = function (...args) { window.canvasDraws++; return clear.apply(this, args); };
    });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Reduce motion', exact: true });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(await page.locator('#home-bg').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
    const count = await page.evaluate(() => window.canvasDraws);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => window.canvasDraws)).toBe(count);
    await page.reload();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect.poll(() => page.evaluate(() => window.canvasDraws)).toBeGreaterThan(count);
  });

  test('device reduced motion updates live, without a page reload', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const toggle = page.getByRole('button', { name: 'Reduce motion (enabled by your device)', exact: true });
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toBeDisabled();
    expect(await page.locator('#home-bg').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.getByRole('button', { name: 'Reduce motion', exact: true })).toHaveAttribute('aria-pressed', 'false');
  });
});
