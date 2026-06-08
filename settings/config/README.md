# WaitConfig Usage Guide

## Overview
Clean, environment-configurable wait time management for Playwright tests.

## Wait Values
- `QUICK_CHECK`: 2s - Fast visibility checks, element existence
- `SHORT`: 5s - Cookie consent, quick UI updates
- `MEDIUM`: 15s - Standard UI interactions, form fills
- `LONG`: 30s - Heavy operations, modals, page loads
- `EXTRA_LONG`: 60s - API calls, complex workflows
- `SLOW_TEST`: 10m - For @SLOW tagged tests
- `INTEGRATION`: 2m - Full E2E workflows, slow environments
- `NAVIGATION`: 30s - Page navigation timeouts
- `ACTION`: 15s - Playwright action timeouts
- `EXPECT`: 10s - Assertions and expect operations

## Environment Overrides
```bash
# Override wait times (milliseconds)
export WAIT_SHORT=3000  
export WAIT_EXPECT=8000
export WAIT_MEDIUM=10000
export WAIT_ACTION=12000
export WAIT_LONG=20000
export WAIT_NAVIGATION=25000

# Run tests
npx playwright test
```

## Usage
```typescript
import { Wait } from 'settings/config/timeout.config';

// Page objects - explicit waits
await element.waitFor({ state: 'visible', timeout: Wait.MEDIUM });

// API calls  
const response = await apiClient.send('GET', true, Wait.EXTRA_LONG);

// Playwright configuration alignment
export default defineConfig({
    timeout: Wait.EXTRA_LONG,        // 60s
    expect: { timeout: Wait.EXPECT }, // 10s
    use: {
        actionTimeout: Wait.ACTION,      // 15s
        navigationTimeout: Wait.NAVIGATION, // 30s
    }
});
```

## Benefits
- ✅ **Clean & Simple** - Minimal, focused code without bloat
- ✅ **Environment Configurable** - Runtime adjustment via WAIT_* variables
- ✅ **Type Safe** - Full TypeScript support with singleton pattern
- ✅ **Semantic** - Wait.SHORT vs redundant Timeouts.SHORT_TIMEOUT
- ✅ **Validated** - Automatic hierarchy validation with warnings