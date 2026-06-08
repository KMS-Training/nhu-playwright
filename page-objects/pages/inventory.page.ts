import { Page } from "@playwright/test";

export class InventoryPage {
    constructor(protected page: Page) {}

    // ─── CSS Locators ────────────────────────────────────────────────────────────

    css = {
        // 1. Shopping cart icon
        cartLink: () => this.page.locator(".shopping_cart_link"),

        // 2. All "Add to cart" buttons
        allAddToCartButtons: () => this.page.locator("button[data-test^='add-to-cart']"),

        // 3. Sort dropdown
        sortDropdown: () => this.page.locator("select.product_sort_container"),

        // 4. All product images
        allProductImages: () => this.page.locator(".inventory_item_img img"),

        // 5. Items whose price contains "$15.99"
        priceAt1599: () => this.page.locator(".inventory_item_price").filter({ hasText: "$15.99" }),

        // 6. "Add to cart" button for Sauce Labs Backpack
        addBackpackButton: () => this.page.locator("[data-test='add-to-cart-sauce-labs-backpack']"),

        // 7. "Remove" button for Sauce Labs Onesie
        removeOnesieButton: () => this.page.locator("[data-test='remove-sauce-labs-onesie']"),

        // 8. All buttons with data-test starting with "add-to-cart"
        allAddToCartByDataTest: () => this.page.locator("button[data-test^='add-to-cart']"),

        // 9. Product names that do NOT contain "Sauce Labs"
        //    CSS has no :not-contains, so we use a broad selector and filter via has-not-text
        productNamesNotSauceLabs: () =>
            this.page.locator(".inventory_item_name").filter({ hasNotText: "Sauce Labs" }),

        // 10. Product image by partial alt text (e.g. "Backpack")
        productImageByPartialAlt: (partialAlt: string) =>
            this.page.locator(`img[alt*='${partialAlt}']`),
    };

    // ─── XPath Locators ──────────────────────────────────────────────────────────

    xpath = {
        // 1. Shopping cart icon
        cartLink: () => this.page.locator("//a[@class='shopping_cart_link']"),

        // 2. All "Add to cart" buttons
        allAddToCartButtons: () =>
            this.page.locator("//button[starts-with(@data-test,'add-to-cart')]"),

        // 3. Sort dropdown
        sortDropdown: () => this.page.locator("//select[@class='product_sort_container']"),

        // 4. All product images
        allProductImages: () =>
            this.page.locator("//div[@class='inventory_item_img']//img"),

        // 5. Items whose price contains "$15.99"
        priceAt1599: () =>
            this.page.locator("//*[contains(@class,'inventory_item_price')][contains(.,'15.99')]"),

        // 6. "Add to cart" button for Sauce Labs Backpack
        addBackpackButton: () =>
            this.page.locator("//button[@data-test='add-to-cart-sauce-labs-backpack']"),

        // 7. "Remove" button for Sauce Labs Onesie
        removeOnesieButton: () =>
            this.page.locator("//button[@data-test='remove-sauce-labs-onesie']"),

        // 8. All buttons with data-test starting with "add-to-cart"
        allAddToCartByDataTest: () =>
            this.page.locator("//button[starts-with(@data-test,'add-to-cart')]"),

        // 9. Product names that do NOT contain "Sauce Labs"
        productNamesNotSauceLabs: () =>
            this.page.locator(
                "//div[@class='inventory_item_name'][not(contains(text(),'Sauce Labs'))]"
            ),

        // 10. Product image by partial alt text
        productImageByPartialAlt: (partialAlt: string) =>
            this.page.locator(`//img[contains(@alt,'${partialAlt}')]`),
    };

    // ─── Actions ─────────────────────────────────────────────────────────────────

    async getSortValue(): Promise<string> {
        return this.css.sortDropdown().inputValue();
    }

    async getAllProductNames(): Promise<string[]> {
        return this.page.locator(".inventory_item_name").allTextContents();
    }

    async addToCart(productDataTest: string) {
        await this.page.locator(`[data-test='add-to-cart-${productDataTest}']`).click();
    }
}
