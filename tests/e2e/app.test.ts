import { test, expect } from "@playwright/test";

test.describe("Algorithm Pattern Index", () => {
  test("should redirect root to /en", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*\/en/);
  });

  test("should load the index page in English and display patterns", async ({ page }) => {
    await page.goto("/en/patterns");
    await expect(page.locator("h2").first()).toContainText("All Patterns");
    const cards = page.locator("a[href*='/en/patterns/']");
    await expect(cards).toHaveCount(25);
  });

  test("should filter patterns by search query", async ({ page }) => {
    await page.goto("/en/patterns");
    await page.waitForLoadState("networkidle");
    await page.fill("input[type='search']", "sliding");
    await page.keyboard.press("Enter");
    const cards = page.locator("a[href*='/en/patterns/']");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Sliding Window");
  });

  test("should display empty state for non-matching search", async ({ page }) => {
    await page.goto("/en/patterns");
    await page.fill("input[type='search']", "foobarbaz");
    await page.keyboard.press("Enter");
    const cards = page.locator("a[href*='/en/patterns/']");
    await expect(cards).toHaveCount(0);
    await expect(page.getByText("No patterns match your search criteria")).toBeVisible();
  });

  test("should switch language and retain UI structure", async ({ page }) => {
    await page.goto("/en/patterns");
    await page.click("text=FR");
    await expect(page).toHaveURL(/.*\/fr\/patterns/);
    await expect(page.locator("h2").first()).toContainText("Tous les patrons");
  });

  test("should navigate to detail page and show breadcrumbs", async ({ page }) => {
    await page.goto("/en/patterns");
    // Click on the card for Binary Search
    await page.click("h3:has-text('Binary Search')");
    await expect(page).toHaveURL(/.*\/en\/patterns\/binary-search/);
    await expect(page.locator("h1").first()).toContainText("Binary Search");
    
    // Test the related patterns link (Binary search is related to divide-and-conquer)
    await page.click("text=Divide & Conquer");
    await expect(page).toHaveURL(/.*\/en\/patterns\/divide-and-conquer/);

    // Go back using breadcrumb
    await page.click("text=Back to all patterns");
    await expect(page).toHaveURL(/.*\/en/);
  });

  test("should display a 404 page for unknown patterns", async ({ page }) => {
    const response = await page.goto("/en/patterns/unknown-pattern");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1").first()).toContainText("404");
  });
});
