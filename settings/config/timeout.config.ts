/**
 * Centralized wait configuration with environment variable support.
 * Use WAIT_* environment variables to override defaults (e.g., WAIT_SHORT=3000).
 */
export class WaitConfig {
    private static instance: WaitConfig;
    
    readonly QUICK_CHECK: number;
    readonly SHORT: number;
    readonly MEDIUM: number;
    readonly LONG: number;
    readonly EXTRA_LONG: number;
    readonly SLOW_TEST: number;
    readonly INTEGRATION: number;
    readonly NAVIGATION: number;
    readonly ACTION: number;
    readonly EXPECT: number;

    private constructor() {
        this.QUICK_CHECK = this.getEnvValue('WAIT_QUICK_CHECK', 2_000);
        this.SHORT = this.getEnvValue('WAIT_SHORT', 5_000);
        this.MEDIUM = this.getEnvValue('WAIT_MEDIUM', 15_000);
        this.LONG = this.getEnvValue('WAIT_LONG', 30_000);
        this.EXTRA_LONG = this.getEnvValue('WAIT_EXTRA_LONG', 60_000);
        this.SLOW_TEST = this.getEnvValue('WAIT_SLOW_TEST', 600_000);
        this.INTEGRATION = this.getEnvValue('WAIT_INTEGRATION', 120_000);
        this.NAVIGATION = this.getEnvValue('WAIT_NAVIGATION', 30_000);
        this.ACTION = this.getEnvValue('WAIT_ACTION', 15_000);
        this.EXPECT = this.getEnvValue('WAIT_EXPECT', 10_000);
    }

    static getInstance(): WaitConfig {
        return WaitConfig.instance ??= new WaitConfig();
    }

    private getEnvValue(envVar: string, defaultValue: number): number {
        const value = process.env[envVar];
        if (value) {
            const parsed = parseInt(value, 10);
            if (parsed > 0) return parsed;
            console.warn(`Invalid ${envVar}: ${value}. Using default: ${defaultValue}ms`);
        }
        return defaultValue;
    }
}

// Export singleton instance for convenient access
export const Wait = WaitConfig.getInstance();