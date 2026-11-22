---
{
  "id": "counter-unit-systems",
  "title": "Counter-Unit Systems",
  "summary": "A combat system in which unit types have matchup-specific strengths and weaknesses, rewarding armies and target choices that counter the opponent's forces.",
  "categoryId": "strategy-tactics-territory",
  "subcategoryId": "strategy-tactics-territory-strategic-planning",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": [],
  "examples": [
    "Age of Empires II: Definitive Edition (Steam)",
    "Age of Empires IV: Anniversary Edition (Steam)",
    "Wargroove (Steam)"
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "AOE4 Who Wins? | 40 Spearmen vs 25 Horsemen (0:30 gameplay)",
      "creator": "Hatsimale",
      "url": "https://www.youtube.com/watch?v=7V7Rg39svPo"
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
      "notes": "Definition, examples, and gameplay reference researched and authored for this library; the starter name and classification are preserved unchanged. Research references and verification limits appear in the body."
    }
  ]
}
---

Counter-unit systems make a unit effective against particular opponents rather than simply better than every alternative. A familiar cycle is spearmen against cavalry, cavalry against archers, and archers against spearmen; scouting informs what to recruit and which targets to engage.[1][8] A counter is an advantage, not an automatic win: positioning, unit condition, and terrain can still change an engagement.[3]

## Where it is used

Especially real-time strategy and turn-based tactics, where choosing an army's composition is a central decision.[1][3] Counters may involve distinct roles rather than a perfect three-way cycle: Wargroove's Ballista threatens flying units but cannot move and fire in the same turn.[7]

## Example

In a hypothetical battle, you scout enemy horsemen and recruit spearmen to guard your archers. The opponent adds archers to attack your spearmen, so you must protect that front line or change your composition rather than keep producing one unit type.

## Why developers use it

Design implications and implementation tradeoffs:

- **Design:** Make scouting and adaptation valuable; give specialist units a purpose instead of one army composition answering everything.
- **Development:** Keep matchup rules consistent with targeting and tooltips; test equal-resource engagements as well as equal unit counts.
- **Production:** A reusable roster can support varied encounters, but every added unit or upgrade expands balancing, tutorial, AI, and regression-testing work.

## What the player sees and feels

Recognizable unit silhouettes, matchup information, and combat results help players understand why an engagement succeeds or fails. Wargroove also previews attack effectiveness before committing.[3] The intended experience is satisfaction from reading the opponent and tension when an exposed weakness forces a response; unclear rules risk making losses feel arbitrary.

## Gameplay reference

The embedded 30-second Age of Empires IV battle shows mounted horsemen engaging spearmen, with spearmen surviving.[9] Duration and embedding were checked through YouTube metadata; downloaded gameplay frames sampled every five seconds were inspected, not continuous playback. The creator describes equal resource costs; the clip illustrates one matchup, not every balance condition.[9]

The three example games have official Steam listings.[4][5][6] Listing and purchase-option evidence came from search-indexed store pages because live Steam access failed on November 23, 2026; live checkout availability was not verified.

## References

- [1] [Age of Empires II: official military guide](https://www.ageofempires.com/learn-to-play/military-and-economy-aoe2)
- [3] [Wargroove Wiki: recruitment and attack effectiveness](https://wargroovewiki.com/Guide:Getting_Started)
- [4] [Age of Empires II: Definitive Edition — Steam listing](https://store.steampowered.com/app/813780/Age_of_Empires_II_Definitive_Edition)
- [5] [Age of Empires IV: Anniversary Edition — Steam listing](https://store.steampowered.com/app/1466860/Age_of_Empires_IV_Anniversary_Edition)
- [6] [Wargroove — Steam listing](https://store.steampowered.com/app/607050/Wargroove)
- [7] [Chucklefish: Wargroove unit roles and Ballista limitations](https://wargroove.com/between-land-and-sky)
- [8] [Age of Empires IV: official guide to counters](https://www.ageofempires.com/news/age-of-empires-iv-tips-to-help-you-get-started)
- [9] [Hatsimale: 40 Spearmen vs 25 Horsemen](https://www.youtube.com/watch?v=7V7Rg39svPo)
