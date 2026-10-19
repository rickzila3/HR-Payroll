
import { describe, it, expect } from "vitest";
import { envSchema } from "../src/config/env.js";

describe("Environment configuration schema", () => {
  it("uses defaults when environment values are missing", () => {
    const result = envSchema.parse({});

    expect(result.NODE_ENV).toBe("development");
    expect(result.PORT).toBe(4000);
    expect(result.LOG_LEVEL).toBe("info");
    expect(result.CORS_ORIGINS).toEqual(["http://localhost:3000"]);
  });

  it("accepts valid environment values", () => {
    const result = envSchema.parse({
      NODE_ENV: "test",
      PORT: "5000",
      LOG_LEVEL: "debug",
      CORS_ORIGINS: "http://localhost:3000, https://example.com",
    });

    expect(result.NODE_ENV).toBe("test");
    expect(result.PORT).toBe(5000);
    expect(result.LOG_LEVEL).toBe("debug");
    expect(result.CORS_ORIGINS).toEqual([
      "http://localhost:3000",
      "https://example.com",
    ]);
  });

  it("rejects an invalid NODE_ENV", () => {
    const result = envSchema.safeParse({ NODE_ENV: "invalid" });

    expect(result.success).toBe(false);
  });

  it("rejects a port outside the valid range", () => {
    const result = envSchema.safeParse({ PORT: "70000" });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid log level", () => {
    const result = envSchema.safeParse({ LOG_LEVEL: "verbose" });

    expect(result.success).toBe(false);
  });
});
