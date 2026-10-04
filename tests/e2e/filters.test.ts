import { test, expect } from "@playwright/test";

const LOCALES = ["en", "fr"];

test.describe("Pattern Filtering & Search", () => {
  for (const locale of LOCALES) {
    test.describe(`Locale: /${locale}`, () => {
      test.beforeEach(async ({ page }) => {
        // Go directly to patterns browser
        await page.goto(`/${locale}/patterns`);
        await page.waitForLoadState("networkidle");
      });

      test("should display all 25 patterns initially", async ({ page }) => {
        const cards = page.locator(`a[href*='/${locale}/patterns/']`);
        await expect(cards).toHaveCount(25);
      });

      test("should filter by category and difficulty", async ({ page }) => {
        await page.waitForSelector('div[data-hydrated="true"]');
        
        await expect(async () => {
          await page.locator("select#category-select").selectOption("sequences");
          const count = await page.locator(`a[href*='/${locale}/patterns/']`).count();
          expect(count).toBe(6);
        }).toPass({ timeout: 10000 });

        // Add difficulty filter 'intermediate'
        await expect(async () => {
          await page.locator("select#difficulty-select").selectOption("intermediate");
          const count = await page.locator(`a[href*='/${locale}/patterns/']`).count();
          expect(count).toBe(4);
        }).toPass({ timeout: 10000 });

        // Add text search
        const searchQuery = locale === "en" ? "window" : "fenêtre";
        await page.fill("input[type='search']", searchQuery);
        await page.keyboard.press("Enter");
        let cards = page.locator(`a[href*='/${locale}/patterns/']`);
        await expect(cards).toHaveCount(1); // sliding window

        // Clear filters
        await page.click("[data-testid='clear-search']");
        cards = page.locator(`a[href*='/${locale}/patterns/']`);
        await expect(cards).toHaveCount(25);
        
        // Ensure dropdowns are reset
        await expect(page.locator("select#category-select")).toHaveValue("all");
        await expect(page.locator("select#difficulty-select")).toHaveValue("all");
      });
      
      test("empty state clear filters button works", async ({ page }) => {
        await page.goto(`/${locale}/patterns`);
        await page.waitForSelector('div[data-hydrated="true"]');
        await page.fill("input[type='search']", "thiswillnevermatchanything");
        await page.keyboard.press("Enter");
        const cards = page.locator(`a[href*='/${locale}/patterns/']`);
        await expect(cards).toHaveCount(0);
        
        await page.click("[data-testid='clear-filters']");
        await expect(cards).toHaveCount(25);
      });
    });
  }
});

test.describe("404 Error Pages", () => {
  const notFoundPaths = ["/en/patterns/unknown", "/fr/patterns/unknown", "/de", "/xyz"];
  
  for (const path of notFoundPaths) {
    test(`should display 404 for ${path}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.locator("h1").first()).toContainText("404");
    });
  }
});
