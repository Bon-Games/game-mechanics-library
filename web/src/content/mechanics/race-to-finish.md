---
{
  "id": "race-to-finish",
  "title": "Race to Finish",
  "summary": "A victory condition where the first player to complete the required course or bring all required pieces to the finish wins.",
  "categoryId": "objectives-rewards-meta",
  "subcategoryId": "objectives-rewards-meta-victory-failure",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": [],
  "examples": [
    "Sonic & All-Stars Racing Transformed Collection (Steam)",
    "HOT WHEELS UNLEASHED 2 - Turbocharged (Steam; Quick Race)",
    "Beach Buggy Racing (Google Play; standard races)"
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "Sonic & All Stars Racing Transformed: Ocean View [1080 HD] (2:41 gameplay)",
      "creator": "SonicJGB",
      "url": "https://www.youtube.com/watch?v=--361e_8Upc"
    }
  ],
  "sources": [
    {
      "sourceId": "curated-starter",
      "url": "https://github.com/Bon-Games/game-mechanics-library",
      "creator": "Game Mechanics Library project",
      "license": "Original compilation; attribution preferred",
      "attribution": "Game Mechanics Library project. Curated list of common names. Category mapping is an original proposed taxonomy; names themselves are general terminology.",
      "licenseUrl": "",
      "accessedAt": "2026-11-07",
      "modified": false,
      "notes": "Original definition and design commentary researched on 2026-11-21 using the linked mechanic compendium, publisher pages, store listings, and gameplay. Steam listings checked through indexed official pages because direct access failed; Google Play listing fetched live. Video metadata confirms 161 seconds and embedding enabled; sampled gameplay storyboards inspected, not the whole clip. Starter name, classification, and compilation provenance preserved."
    }
  ]
}
---

Race to finish makes arrival order the win condition: complete the required route, laps, or movement of pieces before opponents. Driving, dice rolls, and movement abilities determine how players advance; they are separate from the victory rule. Merely reaching an exit, surviving longest, or posting a solo time is not the same condition.[6]

## Where it is used

Common in kart and vehicle racers, and track-based board games. It works in real time or turns; the shared requirement is a finish that competitors race to reach. Individual race wins need not decide a whole championship.[6]

## Example

Two drivers enter the final lap with one boost remaining. The trailing driver risks a tighter corner, overtakes, and crosses the finish first to win. Leading an earlier lap was not enough: only completing the required race determines the result.

## Why developers use it

- **Design:** Give movement decisions a clear purpose: gain ground, protect a lead, or risk a shortcut. Keep a hopelessly distant leader from making the remaining race feel pointless.
- **Development:** Validate route/checkpoint order and lap completion before recording a finish. Define tie handling and keep online finish adjudication consistent with the displayed result.
- **Production:** Reuse a legible objective across courses, but budget for track balancing, AI pacing, shortcuts, and finish-line edge-case QA; a simple win rule does not make courses cheap to produce.

## What the player sees and feels

Position and lap indicators, nearby rivals, and a visible finish communicate progress. The reference clip shows Tails advancing through the field, finishing lap three, and receiving first place.[7] Closing a gap can create urgency and a last-corner pass can feel triumphant; these experience goals and the development/production advice above are editorial synthesis, not guaranteed outcomes.

## References

[6] [Game Mechanic Compendium: Race to the Finish](https://compendium.tallmove.com/mechanics/race-to-the-finish) — definition and distinction from the movement system; original wording used here.

[2] [Steam: Sonic & All-Stars Racing Transformed Collection](https://store.steampowered.com/app/212480/) — core racing and distribution.

[3] [Milestone: HOT WHEELS UNLEASHED 2](https://hotwheelsunleashed.com/) — finish-line racing and Quick Race, distinct from its other modes.

[4] [Steam: HOT WHEELS UNLEASHED 2](https://store.steampowered.com/app/2051120/) — store listing.

[8] [Vector Unit: Beach Buggy Racing](https://www.vectorunit.com/beach-buggy-racing) — competing with rival drivers to reach the finish.

[5] [Google Play: Beach Buggy Racing](https://play.google.com/store/apps/details?hl=en_US&id=com.vectorunit.purple.googleplay) — live install listing and developer gameplay description.

[7] [SonicJGB: Ocean View single-race gameplay](https://www.youtube.com/watch?v=--361e_8Upc) — 2:41; duration and embedding checked in watch-page metadata, with sampled start, overtaking, finish, and results frames inspected rather than full playback.

Store checks: November 21, 2026. Steam evidence came from indexed official listings, not live checkout; the Google Play page was fetched directly.
