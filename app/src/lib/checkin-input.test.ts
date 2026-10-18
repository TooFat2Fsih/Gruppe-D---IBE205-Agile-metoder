import { describe, expect, it } from "vitest";
import { isDuplicateCheckIn, validMatchId } from "./checkin-input";

describe("check-in validation", () => {
  it("accepts a valid match UUID", () => expect(validMatchId("550e8400-e29b-41d4-a716-446655440000")).toBe(true));
  it("rejects invalid match identifiers", () => {
    expect(validMatchId("not-an-id")).toBe(false);
    expect(validMatchId(null)).toBe(false);
    expect(validMatchId("550e8400-e29b-41d4-a716-446655440000&user_id=eq.other")).toBe(false);
  });
  it("recognizes duplicate check-ins", () => {
    expect(isDuplicateCheckIn("23505")).toBe(true);
    expect(isDuplicateCheckIn("42501")).toBe(false);
  });
});
