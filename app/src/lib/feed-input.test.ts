import { describe, expect, it } from "vitest";
import { duplicateFeedPost, FEED_ACTIVITY_TEXT, validCheckInId } from "./feed-input";
describe("social feed input", () => {
  it("accepts UUID and rejects injection strings", () => {
    expect(validCheckInId("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(validCheckInId("a&user_id=other")).toBe(false);
  });
  it("uses a fixed activity text", () => expect(FEED_ACTIVITY_TEXT).toBe("Sjekket inn på kamp"));
  it("detects duplicate posts", () => expect(duplicateFeedPost("23505")).toBe(true));
});
