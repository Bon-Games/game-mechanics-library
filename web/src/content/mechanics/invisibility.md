---
{
  "id": "invisibility",
  "title": "Invisibility",
  "summary": "A concealment state that hides a character from enemy sight, enabling infiltration, repositioning, or escape while other detection rules may still apply.",
  "categoryId": "stealth-detection",
  "subcategoryId": "stealth-detection-concealment",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": ["Cloaking"],
  "examples": [
    "Team Fortress 2 (Steam; core to the Spy class)",
    "Styx: Master of Shadows (Steam; amber-powered stealth ability)",
    "Crysis Remastered (Steam; core Nanosuit mode)"
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "Crysis Remastered - Cloak Engaged (2:13 gameplay)",
      "creator": "Shishir Tandale",
      "url": "https://www.youtube.com/watch?v=fafERneCDzY"
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

Invisibility hides a character from enemy sight rather than merely placing them behind cover or disguising their identity. It enables infiltration, repositioning, and escape; duration, revealing actions, and remaining detection channels depend on the game. For example, a cloaked Spy cannot attack, can be exposed by contact or damage, and makes a sound when uncloaking: invisibility is not invulnerability.[1]

## Where it is used

Stealth-action adventures and tactical or class-based shooters use it to support bypasses and ambushes.[1][2][4] It can anchor a character's role or a core ability system without being mandatory for every player or encounter.

## Example

A Spy cloaks before crossing a watched doorway, avoids colliding with a defender, then hides around a corner to uncloak before attacking. The player trades immediate offense for a safer approach, but the uncloaking sound can still betray the plan.[1]

## Why developers use it

These are design considerations, not guaranteed outcomes:

- **Design:** Create a timing-and-positioning choice between remaining concealed and committing to an action. Clear reveal rules give opponents counterplay.
- **Development:** Keep enemy perception, targeting, collision, and visual effects consistent with the concealment state; test entry, expiry, and reveal transitions. Multiplayer also needs distinct ally and enemy views.
- **Production:** Add alternate routes through existing encounters, but budget for patrol placement, readable effects and sounds, and QA of objectives or scripted events that assume the character is visible.

## What the player sees and feels

A cloak can show the user a translucent body or weapon and a remaining-duration meter while withholding the character from enemies; allies may retain an outline.[1] The intended experience is temporary freedom mixed with tension about exposure. Opponents should have usable clues, rather than an apparently unanswerable threat.

## Gameplay reference

The embedded clip shows cloaked and uncloaked first-person movement and combat in Crysis Remastered. Its watch-page duration is 133 seconds and embedding is enabled; sampled gameplay frames were inspected, not continuous playback.[2][6]

## Example-game verification

The examples cover a class-defining tool and central stealth/suit abilities, not a requirement to stay invisible throughout each game.[1][2][4] Steam listings were verified through indexed official pages on November 24, 2026; direct store access failed, so live checkout availability was not confirmed.[3][4][5]

## References

[1] [Official TF2 Wiki: Cloak](https://wiki.teamfortress.com/wiki/Cloak)

[2] [Crytek: Crysis Remastered](https://store.crytek.com/games/crysis-remastered)

[3] [Steam: Team Fortress 2](https://store.steampowered.com/app/440)

[4] [Steam: Styx: Master of Shadows](https://store.steampowered.com/app/242640?l=english)

[5] [Steam: Crysis Remastered](https://store.steampowered.com/app/1715130/Crysis_Remastered)

[6] [Shishir Tandale: Crysis Remastered - Cloak Engaged](https://www.youtube.com/watch?v=fafERneCDzY)
