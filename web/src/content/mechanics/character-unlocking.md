---
{
  "id": "character-unlocking",
  "title": "Character Unlocking",
  "summary": "Make an initially unavailable character playable by meeting a requirement, such as completing a challenge, advancing the story, or spending currency.",
  "categoryId": "progression-customization",
  "subcategoryId": "progression-customization-unlock-systems",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": [],
  "examples": [
    "Vampire Survivors (Steam) — unlock survivors to expand the playable roster and starting builds.",
    "Risk of Rain 2 (Steam) — unlock survivors with distinct combat styles and skills.",
    "Brotato (Steam) — unlock characters whose traits change how a run is played."
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "How To Unlock Secret Character Leda - Vampire Survivors",
      "creator": "GameSteed",
      "url": "https://www.youtube.com/watch?v=wix7_fyujUA"
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
      "notes": "Definition and design guidance originally authored for this library after research on 2026-11-12; research links are in the body. Store examples and an 85-second character-unlock guide were checked. The starter name and classification are preserved; no third-party text or media files are copied."
    }
  ]
}
---

Character unlocking changes a character from unavailable to playable once an unlock condition is satisfied. The reward expands the roster rather than merely leveling an existing character or changing its appearance. It is a form of content progression: new characters can offer different abilities, starting equipment, or playstyles instead of simply greater power.[1][3]

## Where it is used

Common applications include roguelites and survivor-style action games, where roster expansion is a major between-run progression system.[2][3][4] It also fits fighting games, kart racers, and party RPGs that reveal playable characters gradually through challenges or story progress.

## Why developers use it

- **Design:** Give players concrete goals, introduce options gradually, and reward experimentation with new playstyles.[1]
- **Development:** Keep requirements and unlock flags explicit, persist them reliably, and test that rewards remain selectable after reloading.
- **Production:** Plan unlock pacing around the available roster to encourage replay without building a separate campaign for each reward. Budget character balancing and QA; excessive grind can turn anticipation into frustration.[1]

These implementation and production points are design guidance, not requirements of the mechanic.

## What the player sees and feels

Players may see locked portraits, requirement text, progress counters, and a reveal before a new portrait becomes selectable. Clear, attainable conditions can create anticipation and pride; opaque requirements or repetitive grinding can feel obstructive.[1] The reference video demonstrates a concrete case: discovering and defeating the secret character Leda to unlock that character for play (1:25).[6]

## Store references

The example games' Steam listings are linked below.[2][3][4] Brotato's developer also documents a challenge-based character unlock: winning Nightmare difficulty unlocks Wounded.[5]

## Sources

[1] https://www.universityxp.com/blog/2024/1/16/what-are-progression-systems-in-games
[2] https://store.steampowered.com/app/1794680/Vampire_Survivors
[3] https://store.steampowered.com/app/632360/Risk_of_Rain_2
[4] https://store.steampowered.com/app/1942280/Brotato
[5] https://store.steampowered.com/news/app/1942280/view/672867776636912252
[6] https://www.youtube.com/watch?v=wix7_fyujUA
