import dotenv from "dotenv";

dotenv.config({
  path: process.env.ENV ? `settings/env/.env.${process.env.ENV}` : "settings/env/.env.local",
});

/**
 * Type-safe environment configuration with validation
 */
export default class Env {
  private static getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value || defaultValue!;
  }

  private static getOptionalEnvVar(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  static get USERNAME(): string {
    return this.getEnvVar('USERNAME');
  }

  static get PASSWORD(): string {
    return this.getEnvVar('PASSWORD');
  }

  static get WEB_URL(): string {
    return this.getEnvVar('WEB_URL');
  }
}