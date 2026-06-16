// Smoke tests for the explainers site.
//
// These auto-discover every folder containing an index.html (the template and
// all explainers), so a newly added explainer is covered the moment it exists.
// For each page we assert: it loads with no console errors, has a heading, and
// exposes at least one interactive control (the demos).
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const ROOT = path.join(__dirname, '..');

// Folders that are not explainers.
const SKIP = new Set([
  'node_modules', 'tests', 'memory', 'playwright-report', 'test-results', '.github',
]);

// Every directory at the repo root that has an index.html → an explainer (or the template).
function discoverPages() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !SKIP.has(d.name))
    .filter((d) => fs.existsSync(path.join(ROOT, d.name, 'index.html')))
    .map((d) => d.name)
    .sort();
}

// Collect real JS/console errors, ignoring benign favicon 404s.
function trackErrors(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    const url = (msg.location() && msg.location().url) || '';
    if (/favicon/i.test(text) || /favicon/i.test(url)) return;
    errors.push(text);
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('landing page', () => {
  test('renders with a heading and shows cards or an empty state', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText(/explainers/i);

    const cards = await page.locator('.grid li').count();
    if (cards === 0) {
      await expect(page.locator('.empty')).toBeVisible(); // no explainers yet
    } else {
      expect(cards).toBeGreaterThan(0);
    }
    expect(errors, 'landing page logged console errors').toEqual([]);
  });
});

const pages = discoverPages();

test.describe('explainers + template', () => {
  for (const name of pages) {
    test(`${name}/ loads, has a heading, and is interactive`, async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto(`/${name}/`);

      await expect(page.locator('h1').first()).toBeVisible();

      const controls = await page.locator('input, button, select').count();
      expect(controls, `${name}/ should expose at least one interactive control`).toBeGreaterThan(0);

      expect(errors, `${name}/ logged console errors`).toEqual([]);
    });
  }
});
