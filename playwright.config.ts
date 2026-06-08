import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { Wait } from './settings/config/timeout.config';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 1 : undefined,

    reporter: [["list"], ["html", { open: "never" }]],
    timeout: Wait.EXTRA_LONG,
    expect: {
        timeout: Wait.EXPECT,
    },

    use: {
        baseURL: process.env.BASE_URL,
        headless: false,
        trace: "on",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        actionTimeout: Wait.ACTION,
        navigationTimeout: Wait.NAVIGATION,
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        }
    ],
});
