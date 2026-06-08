# Automation Framework

A Playwright-based UI test automation framework built with TypeScript, featuring the Page Object Model pattern, custom fixtures, and centralized wait configuration.

## Tech Stack

- **[Playwright](https://playwright.dev/)** `^1.57.0` — Browser automation & test runner
- **TypeScript** `^5.9.3` — Type-safe test authoring
- **dotenv** `^17.3.1` — Environment variable management
- **Node.js** with CommonJS modules

## Project Structure

```
├── page-objects/
│   └── pages/                  # Page Object classes
│       └── sign-in.page.ts
├── settings/
│   ├── config/
│   │   └── timeout.config.ts   # Centralized wait/timeout configuration
│   ├── env/
│   │   ├── .env.local          # Local environment variables
│   │   └── env.global.ts       # Type-safe env accessor
│   └── fixtures/
│       └── ui.fixture.ts       # Custom Playwright fixtures
├── tests/
│   └── specs/
│       └── ui/                 # UI test specs
│           └── debug.spec.ts
├── utils/                      # Shared utilities
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
npm install
npx playwright install
```

### Environment Setup

Create a `settings/env/.env.local` file with your test credentials:

```env
USERNAME=your_username
PASSWORD=your_password
WEB_URL=https://your-app-url.com
BASE_URL=https://your-app-url.com
```

You can also create environment-specific files (e.g., `.env.staging`) and switch using the `ENV` variable:

```bash
ENV=staging npx playwright test
```

## Running Tests

```bash
# Run all tests
npm test

# Run with Playwright CLI options
npx playwright test --headed
npx playwright test --project=chromium
npx playwright test --grep "Sign In"

# Open HTML report
npm run report
```

## Configuration

### Playwright Config

| Setting             | Default (local) | CI        |
| ------------------- | ---------------- | --------- |
| Browser             | Chromium         | Chromium  |
| Parallel execution  | Yes              | Yes       |
| Retries             | 0                | 1         |
| Workers             | Auto             | 1         |
| Headless            | No               | —         |
| Trace               | On               | On        |
| Screenshots         | On failure       | On failure|
| Video               | On failure       | On failure|

### Wait Timeouts

Centralized via `WaitConfig` singleton in [settings/config/timeout.config.ts](settings/config/timeout.config.ts):

| Name           | Default  | Purpose                                    |
| -------------- | -------- | ------------------------------------------ |
| `QUICK_CHECK`  | 2s       | Fast visibility checks, element existence  |
| `SHORT`        | 5s       | Cookie consent, quick UI updates           |
| `MEDIUM`       | 15s      | Standard UI interactions, form fills       |
| `LONG`         | 30s      | Heavy operations, modals, page loads       |
| `EXTRA_LONG`   | 60s      | Test timeout, complex workflows            |
| `SLOW_TEST`    | 10min    | `@SLOW` tagged tests                      |
| `INTEGRATION`  | 2min     | Full E2E workflows                         |
| `NAVIGATION`   | 30s      | Page navigation                            |
| `ACTION`       | 15s      | Playwright action timeout                  |
| `EXPECT`       | 10s      | Assertions                                 |

Override any value at runtime via `WAIT_*` environment variables:

```bash
WAIT_SHORT=3000 WAIT_MEDIUM=10000 npx playwright test
```

## Architecture

### Page Object Model

Page objects live in `page-objects/pages/` and encapsulate page-specific locators and actions:

```typescript
import { Wait } from "settings/config/timeout.config";

export class SignInPage {
    constructor(protected page: Page) {}

    elements = {
        usernameInput: () => this.page.getByRole("textbox", { name: "Username" }),
        passwordInput: () => this.page.getByRole("textbox", { name: "Password" }),
        loginButton: () => this.page.getByRole("button", { name: "Login" }),
    };

    async login(username: string, password: string) { /* ... */ }
}
```

### Custom Fixtures

Page objects are injected into tests via Playwright fixtures defined in [settings/fixtures/ui.fixture.ts](settings/fixtures/ui.fixture.ts):

```typescript
import { test } from "settings/fixtures/ui.fixture";

test("Check 'Sign In' page", async ({ signInPage }) => {
    await signInPage.login(Env.USERNAME, Env.PASSWORD);
});
```

### Environment Configuration

Type-safe environment access via `Env` class in [settings/env/env.global.ts](settings/env/env.global.ts) with required/optional variable validation.

## Code Style

Formatting is managed via Prettier (`.prettierrc`):

- Print width: 100
- Tab width: 4 (spaces)
- Semicolons: yes
- Quotes: double
- Trailing commas: all
