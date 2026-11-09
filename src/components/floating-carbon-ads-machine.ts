/**
 * Lifecycle of the floating Carbon ad on the home page.
 *
 *   idle --reveal--> loading --fill--> shown --dismiss--> dismissed
 *   loading --dismiss--> dismissed
 *
 * `idle`: not yet visible, nothing requested (a mid-page landing counts no
 * impression). `loading`: mounted, waiting for carbon.js, which may fill the
 * slot late or never. `shown`: the ad rendered at `shownAt`, so the close
 * button can appear. Once loaded, the ad stays mounted while hidden, because
 * a remount would request a new ad.
 */
export type FloatingCarbonAdsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "shown"; shownAt: number }
  | { status: "dismissed" }

export type FloatingCarbonAdsEvent =
  | { type: "reveal" }
  | { type: "fill"; at: number }
  | { type: "dismiss" }

export function floatingCarbonAdsTransition(
  state: FloatingCarbonAdsState,
  event: FloatingCarbonAdsEvent
): FloatingCarbonAdsState {
  switch (event.type) {
    case "reveal":
      return state.status === "idle" ? { status: "loading" } : state
    case "fill":
      return state.status === "loading"
        ? { status: "shown", shownAt: event.at }
        : state
    case "dismiss":
      return state.status === "dismissed" ? state : { status: "dismissed" }
  }
}
