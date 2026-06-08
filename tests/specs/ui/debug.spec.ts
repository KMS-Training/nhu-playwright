// import { test } from 'src/fixtures/base.fixture';
import Env from "settings/env/env.global";
import { test } from "settings/fixtures/ui.fixture";

test("Check 'Sign In' page", async ({ signInPage }) => {
    await signInPage.login(Env.USERNAME, Env.PASSWORD);
});