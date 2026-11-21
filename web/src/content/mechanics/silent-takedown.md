---
{
  "id": "silent-takedown",
  "title": "Silent Takedown",
  "summary": "Quietly neutralizing an enemy, usually through a close-range contextual action, to remove a threat without starting open combat.",
  "categoryId": "stealth-detection",
  "subcategoryId": "stealth-detection-infiltration-evasion",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": [],
  "examples": [
    "Tom Clancy's Splinter Cell Blacklist (Steam; stealth takedowns)",
    "Dishonored (Steam; stealth assassinations and nonlethal chokes)",
    "Batman: Arkham Knight (Steam; Predator encounters)"
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "Splinter Cell Blacklist - Non-Lethal Variety [UK] (2:53)",
      "creator": "Ubisoft",
      "url": "https://www.youtube.com/watch?v=YihY-CXsZGs"
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
      "notes": "Original definition and design commentary researched on 2026-11-15 using publisher manuals and Ubisoft's developer demonstration linked below. Video duration and embedding checked through metadata; selected storyboard gameplay frames inspected, not full playback. Starter name, classification, and compilation provenance preserved; no third-party text copied."
    }
  ]
}
---

A silent takedown neutralizes an enemy while minimizing the noise that would attract others. It commonly requires approaching an unaware target, then triggering a contextual close-range attack from behind or cover. Depending on the game, the result is a knockout or a kill; quiet does not mean nonlethal or invisible. Witnesses and discovered bodies can still compromise stealth. Some games also use the term for quiet ranged eliminations.

## Where it is used

Common in stealth-action adventures, tactical infiltration games, and immersive sims. It is a central tool in their stealth encounter loop, not necessarily mandatory across the whole game. Unlike an ordinary melee attack, its purpose is to remove a threat without escalating to open combat.

## Example scenario

In a hypothetical infiltration encounter, two guards patrol a corridor. The player waits for one to turn away, approaches the other from behind, and performs a quiet knockout. The route opens, but leaving the body in the corridor risks discovery when the patrol returns. Hiding it costs extra time; bypassing both guards avoids that risk entirely.

## Why developers use it

- **Design:** Reward observation, positioning, and timing with a decisive removal. Balance it against bypassing guards so every encounter does not become compulsory cleanup.
- **Development:** Coordinate range and awareness checks, paired animations, noise events, and incapacitated AI states. Clear eligibility feedback helps prevent accidental loud attacks.
- **Production:** Reusable contextual actions support many encounters, but animation variants, body placement, and edge-case testing need budget. More takedown types increase polish and QA costs.

## What the player sees and feels

Typically, a contextual prompt appears near an eligible target, followed by a short grab or strike and an incapacitated enemy. The intended rhythm is tension during approach, then relief and competence on success. Remaining patrols and exposed bodies preserve uncertainty; inconsistent prompts or detection rules can instead feel unfair. These design goals and production tradeoffs are editorial synthesis, not guaranteed player reactions.

## References

- [Warner Bros.' Batman: Arkham Knight manual, pp. 11–12 (Japanese)](https://wwws.warnerbros.co.jp/batmanarkham/arkhamknight/img/pdf/PLJM84016_emanual.pdf): quietly incapacitating unaware enemies; the faster Knockout Smash attracts others through noise.
- [Dishonored PC manual, Stealth and Weapons sections](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/205100/manuals/dishonored-gfw-manual-v15.pdf): unaware-target chokes, stealth assassinations, body discovery, and the broader ranged use of the term.
- [Ubisoft's nonlethal developer demonstration](https://www.youtube.com/watch?v=YihY-CXsZGs): the embedded 2:53 clip illustrates approaches from cover and close-range knockouts. Duration and embedding verified from watch-page metadata; selected gameplay storyboard frames inspected, not continuous playback or audio.
- Steam examples: [Splinter Cell Blacklist](https://store.steampowered.com/app/235600/Tom_Clancys_Splinter_Cell_Blacklist/), [Dishonored](https://store.steampowered.com/app/205100/Dishonored/), and [Batman: Arkham Knight](https://store.steampowered.com/app/208650/Batman_Arkham_Knight/). Direct Steam fetching was unavailable; indexed official listings showed purchase options. These establish store examples, not a live checkout or region-specific availability guarantee.
