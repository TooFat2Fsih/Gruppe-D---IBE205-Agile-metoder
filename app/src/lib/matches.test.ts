import { describe, expect, it } from "vitest";
import { formatMatchTitle } from "./matches";

describe("formatMatchTitle", () => {
  it("shows both clubs in the match heading", () => {
    expect(formatMatchTitle({ homeClub: "Molde", awayClub: "Træff" })).toBe("Molde – Træff");
  });
});
