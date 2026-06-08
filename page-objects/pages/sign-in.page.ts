import { Page } from "@playwright/test";
import { Wait } from "settings/config/timeout.config";
import Env from "settings/env/env.global";

export class SignInPage {
    constructor(protected page: Page) {}

    elements = {
        usernameInput: () => this.page.getByRole("textbox", { name: "Username" }),
        passwordInput: () => this.page.getByRole("textbox", { name: "Password" }),
        loginButton: () => this.page.getByRole("button", { name: "Login" }),
    };

    async login(username: string, password: string) {
        await this.page.goto(Env.WEB_URL);
        await this.page.waitForLoadState('load', { timeout: Wait.LONG });
        
        await this.elements.usernameInput().fill(username);
        await this.elements.passwordInput().fill(password);
        await this.elements.loginButton().click();
    }
}