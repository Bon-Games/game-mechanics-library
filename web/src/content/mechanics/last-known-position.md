---
{
  "id": "last-known-position",
  "title": "Last Known Position",
  "summary": "Enemies pursue or search the last place they saw the player after losing sight, allowing the player to escape, flank, or set an ambush.",
  "categoryId": "stealth-detection",
  "subcategoryId": "stealth-detection-detection",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": ["LKP"],
  "examples": [
    "Tom Clancy's Splinter Cell Conviction (Steam)",
    "Metal Gear Solid V: Ground Zeroes (Steam)",
    "Metal Gear Solid V: The Phantom Pain (Steam)"
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "Tom Clancy's Splinter Cell Conviction - Using the Last Known Position",
      "creator": "RealSamFisher",
      "url": "https://www.youtube.com/watch?v=SPabtqVETxw"
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
      "notes": "Definition, examples, and video reference researched on 2026-11-13 and authored for this library; the starter name and classification are preserved unchanged. Research references appear in the body separately from compilation provenance."
    }
  ]
}
---

**Last known position** is an enemy's remembered location of the player, retained when visual contact breaks. Instead of tracking the unseen player's live coordinates, enemies investigate or attack that location, then search nearby. Seeing the player again updates the location; a visible marker is optional, not the mechanic itself.

## Where it is used

Stealth games, stealth-action adventures, and tactical shooters use it to connect detection, pursuit, and evasion. It is a core encounter system rather than a standalone genre.

## Example

A guard spots the player at a doorway. The player ducks behind cover and takes a side passage; the guard approaches the doorway while the player slips past or attacks from another angle.

## Why developers use it

- **Design:** Makes detection recoverable and rewards breaking sight, relocating, and misleading pursuers rather than immediately reloading.
- **Development:** Separates enemy knowledge from actual player position. Reacquisition, shared sightings, and transitions into searching need consistent rules.
- **Production:** Lets the same encounter space support chases and ambushes; budget for alternate routes, navigation, and testing enemies that investigate an empty location. These are implementation considerations, not guarantees of lower cost.

## What the player sees and feels

Enemies converge on an outdated location while the player moves elsewhere. Some games expose that belief with a ghost silhouette, as in the video below; others communicate it through movement and dialogue. The intended feeling is tension followed by agency: being spotted is dangerous, but outsmarting the search can turn panic into control.

## References

- [Ubisoft's Conviction manual, mirrored by MogelPower](https://www.mogelpower.de/manuals/Splinter_Cell_Conviction_English_Manual.pdf) — last-known-position behavior and search transition.
- Konami's official manuals: [Ground Zeroes](https://www.konami.com/mg/mgs5/gz/webmanual/steam/en/p0060.html) and [The Phantom Pain](https://mgstpp-app.konamionline.com/manual/ps4/na/en/ps4_10.html), “What to Do When Spotted.”
- Steam listings: [Conviction](https://store.steampowered.com/app/33220/), [Ground Zeroes](https://store.steampowered.com/app/311340/), and [The Phantom Pain](https://store.steampowered.com/app/287700/). Each uses remembered sightings in its central stealth/evasion loop.
- [Video reference by RealSamFisher](https://www.youtube.com/watch?v=SPabtqVETxw) — 1:20; illustrates the visible position ghost in Conviction.

Research checked 2026-11-13. Definition and design/production analysis are original editorial synthesis; store listings were verified through indexed results because direct Steam access was unavailable.
