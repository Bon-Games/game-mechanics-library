---
{
  "id": "status-cleansing",
  "title": "Status Cleansing",
  "summary": "Removing eligible negative status effects from a character before they expire, usually through an ability or consumable.",
  "categoryId": "abilities-status-effects",
  "subcategoryId": "abilities-status-effects-status-interactions",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": ["Cleanse", "Debuff removal"],
  "examples": [
    "FINAL FANTASY XIV Online (Steam)",
    "Dota 2 (Steam)",
    "Overwatch (Steam)"
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "What does Kiriko's Protection Suzu actually do? - Overwatch 2 Ability Breakdown (3:35; cleansing at 1:49)",
      "creator": "Clowner",
      "url": "https://www.youtube.com/watch?v=Kz-pNbifTfY"
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
      "notes": "Original definition and design commentary researched on 2026-11-16 using the official ability guides and live Steam listings linked below. Video duration (215 seconds), playability, and embedding verified through YouTube metadata; selected storyboard frames inspected, not the full video. Starter name, classification, and compilation provenance preserved; no third-party text copied."
    }
  ]
}
---

Status cleansing removes eligible harmful effects already affecting a character rather than waiting for their timers to end. A cleanse may remove one debuff or several; eligibility depends on the game's rules. It is distinct from restoring health or preventing future effects, although one ability can combine these functions. Removing an enemy's beneficial effects is a related dispel operation, not cleansing in this entry.[2][3][11]

## Where it is used

Used in RPG/MMORPG party combat, MOBAs, and team-based hero shooters, particularly in support kits. The examples here use cleansing within their central combat systems; none makes cleansing the entire game loop.[2][3][11]

## Example

A poisoned ally is taking repeated damage. The healer spends an action and resource to remove that poison, stopping its remaining ticks; damage already taken still needs healing. If the poison is not eligible for removal, the cleanse cannot solve it. This hypothetical illustrates the rule, not a specific game's balance.

## Why developers use it

The following are design and production considerations, not guaranteed outcomes:

- **Design:** Give players an answer to debuffs and a choice between immediate healing, attacking, and saving a limited cleanse for a worse threat.
- **Development:** Track removable-effect categories, removal order, and simultaneous applications; communicate what succeeded instead of silently failing.
- **Production:** Reuse status-effect rules across abilities and encounters, but budget QA for exceptions and combinations so cleansing does not trivialize intended challenges.

## What the player sees and feels

Useful feedback includes a disappearing debuff icon, a cleansing flash, and the harmful behavior stopping. A timely save can feel relieving and skillful; unclear immunity rules can instead make a spent action feel wasted. These are intended experiences, not universal player responses.

## Reference notes

- **Combat examples:** FFXIV's Esuna removes one detrimental effect; Oracle's Fortune's End dispels debuffs when aimed at an ally; Kiriko's Protection Suzu combines cleansing with brief invulnerability.[2][3][11]
- **Stores:** All three Steam listings were directly checked on 2026-11-16; FFXIV offered purchase options and the other two offered free play.[9][12][13]
- **Video:** See the negative-effect cleansing segment at **1:49–2:20**. Duration and embedding were checked, and sampled gameplay frames show effect changes around Suzu use; the full clip was not watched. This is historical Overwatch 2 footage, not a current balance guide: other properties and removal exceptions may have changed.[7]

## Sources

[2] [FFXIV: White Mage job guide](https://na.finalfantasyxiv.com/jobguide/whitemage)

[3] [Dota 2: Oracle abilities](https://www.dota2.com/hero/oracle)

[7] [Clowner: Protection Suzu breakdown](https://www.youtube.com/watch?v=Kz-pNbifTfY)

[9] [FFXIV Online on Steam](https://store.steampowered.com/app/39210/?cc=us&l=english)

[11] [Overwatch: Kiriko abilities](https://overwatch.blizzard.com/en-us/heroes/kiriko)

[12] [Overwatch on Steam](https://store.steampowered.com/app/2357570/Overwatch/?cc=us&l=english)

[13] [Dota 2 on Steam](https://store.steampowered.com/app/570/Dota_2/?cc=us&l=english)
