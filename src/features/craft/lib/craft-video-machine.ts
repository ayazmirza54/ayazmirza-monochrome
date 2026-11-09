/**
 * What the <video> element is actually doing, as reported by its events.
 * This is separate from the user's intent (`auto` / `playing` / `paused` in
 * `CraftVideo`): the browser can refuse a play the user or autoplay asked for.
 *
 *   paused | blocked --play--> playing
 *   playing --pause--> paused
 *   paused --blocked--> blocked
 *
 * `blocked` means play() was rejected with NotAllowedError (e.g. iOS Low Power
 * Mode). It can only be left by a successful play, and a pause event does not
 * clear it because the video never started.
 */
export type CraftVideoMedia = "paused" | "playing" | "blocked"

export type CraftVideoMediaEvent = "play" | "pause" | "blocked"

export function craftVideoMediaTransition(
  media: CraftVideoMedia,
  event: CraftVideoMediaEvent
): CraftVideoMedia {
  switch (event) {
    case "play":
      return "playing"
    case "pause":
      return media === "playing" ? "paused" : media
    case "blocked":
      // A rejection cannot describe a video that is already playing.
      return media === "playing" ? media : "blocked"
  }
}
