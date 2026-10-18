import { describe, expect, it } from "vitest";
import { safeDisplayName, validateCredentials } from "./auth-input";
describe("auth input", () => {
  it("rejects invalid email", () => expect(validateCredentials("invalid", "123456")).toBeTruthy());
  it("rejects short passwords", () => expect(validateCredentials("a@example.com", "123")).toBeTruthy());
  it("accepts valid credentials", () => expect(validateCredentials("a@example.com", "abcdef")).toBeNull());
  it("limits display names", () => expect(safeDisplayName("x".repeat(100), "a@example.com")).toHaveLength(80));
  it("falls back to email prefix", () => expect(safeDisplayName("", "user@example.com")).toBe("user"));
});
