import { test, expect } from "settings/fixtures/ui.fixture";
import { Page } from "@playwright/test";

const SAUCEDEMO_URL = "https://www.saucedemo.com";
const USERNAME = "standard_user";
const PASSWORD = "secret_sauce";

// ─── Helper ──────────────────────────────────────────────────────────────────

async function loginToSauceDemo(page: Page) {
    await page.goto(SAUCEDEMO_URL);
    await page.fill("#user-name", USERNAME);
    await page.fill("#password", PASSWORD);
    await page.click("#login-button");
    await page.waitForURL("**/inventory.html");
}

// ─── Locators (Score: 10) ────────────────────────────────────────────────────

test.describe("Locators - CSS & XPath", () => {

    test.beforeEach(async ({ page }) => {
        await loginToSauceDemo(page);
    });

    // 1. Shopping cart icon
    test("1. Shopping cart link is visible", async ({ page, inventoryPage }) => {
        await expect(inventoryPage.css.cartLink()).toBeVisible();
        await expect(inventoryPage.xpath.cartLink()).toBeVisible();
    });

    // 2. All "Add to cart" buttons
    test("2. All 'Add to cart' buttons are present (6 items)", async ({ inventoryPage }) => {
        await expect(inventoryPage.css.allAddToCartButtons()).toHaveCount(6);
        await expect(inventoryPage.xpath.allAddToCartButtons()).toHaveCount(6);
    });

    // 3. Sort dropdown
    test("3. Sort dropdown is visible", async ({ inventoryPage }) => {
        await expect(inventoryPage.css.sortDropdown()).toBeVisible();
        await expect(inventoryPage.xpath.sortDropdown()).toBeVisible();
    });

    // 4. All product images
    test("4. All product images are present (6 items)", async ({ inventoryPage }) => {
        await expect(inventoryPage.css.allProductImages()).toHaveCount(6);
        await expect(inventoryPage.xpath.allProductImages()).toHaveCount(6);
    });

    // 5. Items whose price contains "$15.99"
    test("5. Item priced at $15.99 is visible", async ({ inventoryPage }) => {
        // 2 products are priced at $15.99 — use toHaveCount to avoid strict mode error
        await expect(inventoryPage.css.priceAt1599()).toHaveCount(2);
        await expect(inventoryPage.xpath.priceAt1599()).toHaveCount(2);
    });

    // 6. "Add to cart" button for Sauce Labs Backpack
    test("6. 'Add to cart' for Sauce Labs Backpack is visible", async ({ inventoryPage }) => {
        await expect(inventoryPage.css.addBackpackButton()).toBeVisible();
        await expect(inventoryPage.xpath.addBackpackButton()).toBeVisible();
    });

    // 7. "Remove" button for Sauce Labs Onesie (after adding to cart)
    test("7. 'Remove' button appears after adding Sauce Labs Onesie to cart", async ({ inventoryPage }) => {
        await inventoryPage.addToCart("sauce-labs-onesie");
        await expect(inventoryPage.css.removeOnesieButton()).toBeVisible();
        await expect(inventoryPage.xpath.removeOnesieButton()).toBeVisible();
    });

    // 8. All buttons with data-test starting with "add-to-cart"
    test("8. All buttons with data-test starting 'add-to-cart' (6 buttons)", async ({ inventoryPage }) => {
        await expect(inventoryPage.css.allAddToCartByDataTest()).toHaveCount(6);
        await expect(inventoryPage.xpath.allAddToCartByDataTest()).toHaveCount(6);
    });

    // 9. Product names that do NOT contain "Sauce Labs"
    test("9. Product names NOT containing 'Sauce Labs'", async ({ inventoryPage }) => {
        const items = inventoryPage.css.productNamesNotSauceLabs();
        const count = await items.count();
        expect(count).toBeGreaterThan(0);

        const names = await items.allTextContents();
        names.forEach(name => expect(name).not.toContain("Sauce Labs"));

        // XPath version
        const xpathItems = inventoryPage.xpath.productNamesNotSauceLabs();
        const xpathNames = await xpathItems.allTextContents();
        xpathNames.forEach(name => expect(name).not.toContain("Sauce Labs"));
    });

    // 10. Product image by partial alt text
    test("10. Product image found by partial alt text", async ({ inventoryPage }) => {
        // CSS: img[alt*='Backpack']
        await expect(inventoryPage.css.productImageByPartialAlt("Backpack")).toBeVisible();
        // XPath: //img[contains(@alt,'Backpack')]
        await expect(inventoryPage.xpath.productImageByPartialAlt("Backpack")).toBeVisible();
    });
});

// ─── Test Cases (Score: 3) ───────────────────────────────────────────────────

test.describe("Test Cases", () => {

    /**
     * Scenario 1: Default sort state after login
     */
    test("Scenario 1: Default sort is 'Name (A to Z)' and products are in alphabetical order", async ({
        page,
        inventoryPage,
    }) => {
        // Given / When: login
        await loginToSauceDemo(page);

        // Then: inventory page is displayed
        await expect(inventoryPage.css.sortDropdown()).toBeVisible();

        // Sort dropdown shows "Name (A to Z)"
        const sortValue = await inventoryPage.getSortValue();
        expect(sortValue).toBe("az");

        await expect(inventoryPage.css.sortDropdown()).toHaveValue("az");

        // Products are listed in alphabetical order
        const expectedOrder = [
            "Sauce Labs Backpack",
            "Sauce Labs Bike Light",
            "Sauce Labs Bolt T-Shirt",
            "Sauce Labs Fleece Jacket",
            "Sauce Labs Onesie",
            "Test.allTheThings() T-Shirt (Red)",
        ];

        const actualNames = await inventoryPage.getAllProductNames();
        expect(actualNames).toEqual(expectedOrder);
    });

    /**
     * Scenario 2: Sort resets after logout and re-login
     */
    test("Scenario 2: Sort resets to 'Name (A to Z)' after logout and re-login", async ({
        page,
        inventoryPage,
    }) => {
        const expectedAscOrder = [
            "Sauce Labs Backpack",
            "Sauce Labs Bike Light",
            "Sauce Labs Bolt T-Shirt",
            "Sauce Labs Fleece Jacket",
            "Sauce Labs Onesie",
            "Test.allTheThings() T-Shirt (Red)",
        ];

        // Given: logged in on inventory page
        await loginToSauceDemo(page);
        await expect(inventoryPage.css.sortDropdown()).toBeVisible();

        // When: select "Name (Z to A)"
        await inventoryPage.css.sortDropdown().selectOption("za");
        await expect(inventoryPage.css.sortDropdown()).toHaveValue("za");

        // And: open hamburger menu and click Logout
        await page.locator("#react-burger-menu-btn").click();
        await page.locator("#logout_sidebar_link").click();

        // Then: login page is displayed
        await expect(page).toHaveURL(`${SAUCEDEMO_URL}/`);
        await expect(page.locator("#login-button")).toBeVisible();

        // When: re-login
        await loginToSauceDemo(page);

        // Then: inventory page is displayed
        await expect(inventoryPage.css.sortDropdown()).toBeVisible();

        // And: sort dropdown resets to "Name (A to Z)"
        await expect(inventoryPage.css.sortDropdown()).toHaveValue("az");

        // And: products are in alphabetical ascending order
        const actualNames = await inventoryPage.getAllProductNames();
        expect(actualNames).toEqual(expectedAscOrder);
    });

    /**
     * Scenario 3: Sort works correctly with items in cart and equal-price products maintain stable order
     */
    test("Scenario 3: Sort with items in cart and stable order for equal-price products", async ({
        page,
        inventoryPage,
    }) => {
        // Given: logged in on inventory page
        await loginToSauceDemo(page);

        // When: add Sauce Labs Backpack and Sauce Labs Onesie to cart
        await inventoryPage.addToCart("sauce-labs-backpack");
        await inventoryPage.addToCart("sauce-labs-onesie");

        // Then: cart badge shows "2"
        await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

        // When: select "Price (high to low)"
        await inventoryPage.css.sortDropdown().selectOption("hilo");
        await expect(inventoryPage.css.sortDropdown()).toHaveValue("hilo");

        // Then: products are re-ordered by descending price
        const prices = await page.locator(".inventory_item_price").allTextContents();
        const numericPrices = prices.map(p => parseFloat(p.replace("$", "")));
        for (let i = 0; i < numericPrices.length - 1; i++) {
            expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i + 1]);
        }

        // And: cart badge still shows "2"
        await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

        // And: Sauce Labs Backpack button shows "Remove"
        await expect(page.locator("[data-test='remove-sauce-labs-backpack']")).toBeVisible();

        // And: Sauce Labs Onesie button shows "Remove"
        await expect(page.locator("[data-test='remove-sauce-labs-onesie']")).toBeVisible();

        // And: other products still show "Add to cart"
        await expect(page.locator("[data-test='add-to-cart-sauce-labs-bike-light']")).toBeVisible();
        await expect(page.locator("[data-test='add-to-cart-sauce-labs-bolt-t-shirt']")).toBeVisible();
        await expect(page.locator("[data-test='add-to-cart-sauce-labs-fleece-jacket']")).toBeVisible();
        await expect(page.locator("[data-test='add-to-cart-test.allthethings()-t-shirt-(red)']")).toBeVisible();

        // When: select "Price (low to high)"
        await inventoryPage.css.sortDropdown().selectOption("lohi");

        // Then: Sauce Labs Bolt T-Shirt ($15.99) appears before Test.allTheThings() T-Shirt (Red) ($15.99)
        const namesLoHi = await inventoryPage.getAllProductNames();
        const boltIndexLoHi = namesLoHi.indexOf("Sauce Labs Bolt T-Shirt");
        const redShirtIndexLoHi = namesLoHi.indexOf("Test.allTheThings() T-Shirt (Red)");
        expect(boltIndexLoHi).toBeLessThan(redShirtIndexLoHi);

        // When: select "Price (high to low)"
        await inventoryPage.css.sortDropdown().selectOption("hilo");

        // Then: stable sort — Sauce Labs Bolt T-Shirt still appears before Test.allTheThings() T-Shirt (Red)
        const namesHiLo = await inventoryPage.getAllProductNames();
        const boltIndexHiLo = namesHiLo.indexOf("Sauce Labs Bolt T-Shirt");
        const redShirtIndexHiLo = namesHiLo.indexOf("Test.allTheThings() T-Shirt (Red)");
        expect(boltIndexHiLo).toBeLessThan(redShirtIndexHiLo);
    });
});
