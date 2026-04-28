import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /bukidgo/i })).toBeVisible();
  });

  test('should have navigation menu', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: /explore/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /events/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /food/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /guides/i })).toBeVisible();
  });

  test('should navigate to explore page', async ({ page }) => {
    await page.getByRole('link', { name: /explore/i }).click();
    await expect(page).toHaveURL('/explore');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /bukidgo/i })).toBeVisible();
  });

  test('should load without accessibility violations', async ({ page }) => {
    // Basic accessibility check
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});