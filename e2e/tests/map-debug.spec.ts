import { test, expect } from '@playwright/test';

test('debug map markers', async ({ page }) => {
    await page.goto('/map');
    await expect(page.getByText('My visits map')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 10000 });

    // Wait for any async rendering
    await page.waitForTimeout(3000);

    const html = await page.locator('.leaflet-container').innerHTML();
    console.log('Leaflet container HTML length:', html.length);

    // Check specific Leaflet panes
    const markerPane = await page.locator('.leaflet-marker-pane').innerHTML();
    console.log('Marker pane HTML:', markerPane);

    const overlayPane = await page.locator('.leaflet-overlay-pane').innerHTML();
    console.log('Overlay pane HTML length:', overlayPane.length);

    // Check for any divIcon elements
    const allDivs = await page.locator('.leaflet-container div[style*="background"]').count();
    console.log('Divs with background style:', allDivs);

    // Take screenshot
    await page.screenshot({ path: 'test-results/map-debug.png' });

    // Log visit count text
    const visitText = await page.locator('text=/\\d+ visits? loaded/').textContent();
    console.log('Visit text:', visitText);
});
