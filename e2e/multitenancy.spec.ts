import { test, expect } from '@playwright/test';

test.describe('Multitenancy Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Clear storage before each test
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());

        // Navigate to dashboard
        await page.goto('/dashboard');
    });

    test('should load first website by default', async ({ page }) => {
        // Wait for websites to load
        await page.waitForSelector('[data-testid="website-selector"]', { timeout: 5000 });

        // Verify first website is selected
        const selectedWebsite = await page.locator('[data-testid="website-selector"]').textContent();
        expect(selectedWebsite).toBeTruthy();

        // Verify analytics loaded for first website
        await expect(page.locator('[data-testid="analytics-card"]')).toBeVisible();
    });

    test('should switch websites via dropdown', async ({ page }) => {
        // Wait for websites to load
        await page.waitForSelector('[data-testid="website-selector"]');

        // Open dropdown
        await page.click('[data-testid="website-selector"]');

        // Select second website
        await page.click('[data-testid="website-option-1"]');

        // Wait for loading indicator
        await expect(page.locator('text=Switching website...')).toBeVisible();

        // Wait for loading to complete
        await expect(page.locator('text=Switching website...')).not.toBeVisible({ timeout: 2000 });

        // Verify URL updated with new websiteId
        await expect(page).toHaveURL(/websiteId=/);

        // Verify analytics reloaded
        await expect(page.locator('[data-testid="analytics-card"]')).toBeVisible();
    });

    test('should persist website selection in localStorage', async ({ page }) => {
        // Wait for websites to load
        await page.waitForSelector('[data-testid="website-selector"]');

        // Switch website
        await page.click('[data-testid="website-selector"]');
        await page.click('[data-testid="website-option-1"]');

        // Wait for switch to complete
        await page.waitForTimeout(1000);

        // Check localStorage
        const storedWebsiteId = await page.evaluate(() =>
            localStorage.getItem('sbd-blog-website-id')
        );
        expect(storedWebsiteId).toBeTruthy();
    });

    test('should restore website from localStorage on refresh', async ({ page }) => {
        // Set a website in localStorage
        await page.evaluate(() => {
            localStorage.setItem('sbd-blog-website-id', 'test-website-2');
        });

        // Reload page
        await page.reload();

        // Wait for page to load
        await page.waitForSelector('[data-testid="website-selector"]');

        // Verify correct website is selected
        const url = page.url();
        expect(url).toContain('websiteId=test-website-2');
    });

    test('should show breadcrumb with current website', async ({ page }) => {
        // Wait for websites to load
        await page.waitForSelector('[data-testid="website-breadcrumb"]', { timeout: 5000 });

        // Verify breadcrumb is visible
        const breadcrumb = page.locator('[data-testid="website-breadcrumb"]');
        await expect(breadcrumb).toBeVisible();

        // Verify breadcrumb contains website name
        const breadcrumbText = await breadcrumb.textContent();
        expect(breadcrumbText).toBeTruthy();
    });

    test('should navigate between pages while maintaining tenant context', async ({ page }) => {
        // Wait for dashboard to load
        await page.waitForSelector('[data-testid="website-selector"]');

        // Get current websiteId from URL
        const url = new URL(page.url());
        const websiteId = url.searchParams.get('websiteId');

        // Navigate to posts page
        await page.click('a[href*="/posts"]');

        // Wait for posts page to load
        await page.waitForSelector('[data-testid="posts-list"]', { timeout: 5000 });

        // Verify websiteId is preserved in URL
        const postsUrl = new URL(page.url());
        expect(postsUrl.searchParams.get('websiteId')).toBe(websiteId);

        // Navigate to categories
        await page.click('a[href*="/categories"]');

        // Wait for categories page to load
        await page.waitForSelector('[data-testid="categories-list"]', { timeout: 5000 });

        // Verify websiteId is still preserved
        const categoriesUrl = new URL(page.url());
        expect(categoriesUrl.searchParams.get('websiteId')).toBe(websiteId);
    });

    test('should handle missing websiteId with middleware redirect', async ({ page }) => {
        // Navigate to dashboard without websiteId
        await page.goto('/dashboard');

        // Wait for redirect
        await page.waitForURL(/websiteId=/, { timeout: 5000 });

        // Verify URL now has websiteId
        const url = new URL(page.url());
        expect(url.searchParams.get('websiteId')).toBeTruthy();
    });

    test('should show loading indicator during tenant switch', async ({ page }) => {
        // Wait for websites to load
        await page.waitForSelector('[data-testid="website-selector"]');

        // Switch website
        await page.click('[data-testid="website-selector"]');
        await page.click('[data-testid="website-option-1"]');

        // Verify loading indicator appears
        await expect(page.locator('text=Switching website...')).toBeVisible({ timeout: 500 });

        // Verify it disappears
        await expect(page.locator('text=Switching website...')).not.toBeVisible({ timeout: 2000 });
    });
});

test.describe('Backward Compatibility', () => {
    test('should work with cookies when localStorage is disabled', async ({ page, context }) => {
        // Disable localStorage
        await page.addInitScript(() => {
            Object.defineProperty(window, 'localStorage', {
                value: {
                    getItem: () => { throw new Error('localStorage disabled'); },
                    setItem: () => { throw new Error('localStorage disabled'); },
                    removeItem: () => { throw new Error('localStorage disabled'); },
                    clear: () => { throw new Error('localStorage disabled'); },
                },
            });
        });

        // Navigate to dashboard
        await page.goto('/dashboard');

        // Wait for page to load
        await page.waitForSelector('[data-testid="website-selector"]', { timeout: 5000 });

        // Verify cookies are set
        const cookies = await context.cookies();
        const websiteCookie = cookies.find(c => c.name === 'sbd-blog-website-id');
        expect(websiteCookie).toBeTruthy();
    });

    test('should prioritize URL param over localStorage', async ({ page }) => {
        // Set different website in localStorage
        await page.evaluate(() => {
            localStorage.setItem('sbd-blog-website-id', 'website-1');
        });

        // Navigate with explicit websiteId in URL
        await page.goto('/dashboard?websiteId=website-2');

        // Wait for page to load
        await page.waitForSelector('[data-testid="website-selector"]');

        // Verify URL param takes precedence
        const url = new URL(page.url());
        expect(url.searchParams.get('websiteId')).toBe('website-2');
    });
});
