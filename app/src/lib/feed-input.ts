import { validMatchId } from "./checkin-input";
export const FEED_ACTIVITY_TEXT = "Sjekket inn på kamp";
export function validCheckInId(value: unknown): value is string {
  return validMatchId(value);
}
export function duplicateFeedPost(code: unknown) { return code === "23505"; }
