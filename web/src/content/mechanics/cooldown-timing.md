---
{
  "id": "cooldown-timing",
  "title": "Cooldown Timing",
  "summary": "The delay after using an ability before it can be used again, and how long that delay is. Cooldown timing paces combat, forces players to rotate abilities, and prevents one powerful action from being spammed.",
  "categoryId": "time-turns-action-systems",
  "subcategoryId": "time-turns-action-systems-real-time-systems",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": [],
  "examples": [
    "Dota 2 (Steam)",
    "Apex Legends (Steam, Epic Games)",
    "Path of Exile 2 (Steam)",
    "Genshin Impact (App Store, Google Play)",
    "Mobile Legends: Bang Bang (App Store, Google Play)"
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "Diablo 4 Cooldowns Explained: Duration vs. Cooldown",
      "creator": "Dave The Gamer",
      "url": "https://www.youtube.com/watch?v=LFEKeB0MhU4"
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
      "notes": "Definition, examples, and video reference researched and authored for this library; the starter name and classification are preserved unchanged."
    }
  ]
}
---

Cooldown timing is the delay after using an ability before it can be used again, and how long that delay is. It can be a per-ability timer, a global cooldown that gates all actions, or a resource that refills over time; stronger abilities usually get longer cooldowns. Durations range from a fraction of a second in action games to several minutes in MOBAs and MMOs.

## Where it is used

Ability-driven games: MOBAs (Dota 2, League of Legends), hero shooters (Apex Legends, Overwatch), action RPGs and looter games (Diablo, Path of Exile), MMOs (World of Warcraft), and action or platforming games with limited-use moves.

## Why developers use it

Cooldowns stop one powerful ability from being spammed, force players to rotate through their toolkit, and create windows of vulnerability and anticipation. They are a simple, tunable balance lever, with stronger abilities given longer cooldowns, and in online games they also cap how many server requests a player can make.

## What the player sees and feels

Players see cooldown timers, radial sweeps, or dimmed ability icons, and sometimes a shared global-cooldown bar. They feel anticipation while waiting for a key ability, tension when it is unavailable at the wrong moment, and satisfaction when it returns just in time. Well-tuned cooldowns make combat feel deliberate; poorly tuned ones feel like waiting.
