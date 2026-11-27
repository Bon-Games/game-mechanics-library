---
{
  "id": "speed-buff",
  "title": "Speed Buff",
  "summary": "A beneficial effect that increases a character's movement speed while active, creating opportunities to chase, escape, or reposition.",
  "categoryId": "abilities-status-effects",
  "subcategoryId": "abilities-status-effects-buffs-debuffs",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": ["Movement speed buff", "Speed boost"],
  "examples": [
    "Overwatch (Steam; core to Lucio's support kit through Crossfade and Amp It Up)",
    "Dota 2 (Steam; core to Dark Seer's ally-mobility kit through Surge)",
    "Guild Wars 2 (Steam; Swiftness within the shared boon system)"
  ],
  "relatedIds": ["slow", "sprinting", "toggle-ability"],
  "videos": [
    {
      "title": "mupiel - Overwatch - How To Lucio - Speed Boost (0:27)",
      "creator": "Nerd What",
      "url": "https://www.youtube.com/watch?v=c0nZq_Xp9A0"
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

A **speed buff** is a beneficial status effect that makes a character move faster than they otherwise would. An ability, item, or allied aura applies it; the benefit ends when its timer expires, it is removed, or its sustaining condition stops. Here, speed means movement, not attack rate or faster world time. Lucio's song and Dark Seer's Surge illustrate aura-based and timed versions. [1][2]

## Where it is used

Common applications include team shooters, MOBAs, and RPGs/MMORPGs: coordinating an advance, chasing a target, or retreating. The examples are central to particular hero kits or a shared buff system, not mandatory actions for every player. Swiftness illustrates the latter: Guild Wars 2's in-game tooltip describes increased movement speed with duration stacking. [1][2][3]

## Example

A support character switches from healing to a speed aura so nearby teammates can cross an exposed lane together. Once they reach cover, the support switches back to healing. The choice trades immediate recovery for a better position, rather than teleporting anyone or granting invulnerability. This hypothetical scenario follows Crossfade's mutually exclusive songs. [1]

## Why developers use it

These are design considerations, not promises of a particular outcome:

- **Design:** Give mobility a support role and make timing, positioning, and the choice between pursuit and escape matter.
- **Development:** Define duration, aura eligibility, stacking, speed caps, and interaction with slows explicitly; test application and removal so bonuses cannot linger accidentally.
- **Production:** Reuse a status-effect system across abilities and items, but budget for readable feedback and traversal, animation, and multiplayer QA at boosted speeds.

## What the player sees and feels

The character covers ground faster while normal steering remains available. A buff icon, aura, sound, or movement trail can communicate the active state and its end. The intended feeling is a brief tactical advantage or a well-timed rescue; unclear expiry or stacking can instead make movement feel inconsistent.

## Video reference

The 27-second clip shows original Overwatch gameplay: Lucio switches songs and travels with an ally. It illustrates the movement-buff interaction, not current balance values. Duration and embed permission were checked in YouTube metadata; sampled gameplay frames were inspected, not continuous playback. [7]

## References

[1] [Blizzard: Lucio's Crossfade and Amp It Up](https://overwatch.blizzard.com/en-us/heroes/lucio).

[2] [Valve: Dark Seer's Surge](https://www.dota2.com/hero/darkseer) — ability text verified through the official page's live hero data.

[3] [Guild Wars 2 Wiki: Swiftness](https://wiki.guildwars2.com/wiki/Swiftness) — community-maintained official wiki, including the in-game tooltip.

[4] [Overwatch on Steam](https://store.steampowered.com/app/2357570/Overwatch).

[5] [Dota 2 on Steam](https://store.steampowered.com/app/570/Dota_2).

[6] [Guild Wars 2 on Steam](https://store.steampowered.com/app/1284210/Guild_Wars_2).

[7] [Nerd What: Lucio speed-boost gameplay](https://www.youtube.com/watch?v=c0nZq_Xp9A0).

All three Steam listings displayed a free-to-play Play Game option when checked on November 28, 2026. [4][5][6]
