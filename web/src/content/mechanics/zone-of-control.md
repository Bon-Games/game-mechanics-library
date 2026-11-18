---
id: zone-of-control
title: Zone of Control
summary: The area directly adjacent to a combat unit that restricts how enemy units may move and act. In hex-based games it is usually the six surrounding tiles; moving directly through an enemy's zone of control forces the unit to stop.
categoryId: strategy-tactics-territory
subcategoryId: strategy-tactics-territory-positioning
status: published
maturity: reviewed
language: en
tags: []
genres: []
aliases: ["ZOC", "zone of control"]
examples:
  - "Civilization V (Steam) - units stop when they move directly within an enemy's zone of control."
  - "Europa Universalis IV (Steam) - adjacent enemy units exert a zone that limits movement."
  - "Total War: Warhammer III (Steam) - friendly zones on the campaign map slow and stop enemy armies."
  - "RISK: Global Domination (Steam) - held territories create zones that restrict movement into adjacent enemy zones."
relatedIds: []
videos:
  - title: "2 Ways to Stop Enemies Running Away"
    creator: "MercytheMad"
    url: "https://www.youtube.com/watch?v=kBY_MJbdcz4"
sources:
  - sourceId: curated-starter
    url: "https://github.com/Bon-Games/game-mechanics-library"
    creator: "Game Mechanics Library project"
    license: "Original compilation; attribution preferred"
    attribution: "Game Mechanics Library project. Zone of Control researched on 2026-11-19 from Wikipedia, WargameHQ (Mechanics Monday), gdp3, CivFanatics, Steam/SteamRegistry listings and the game store pages listed in the references."
    licenseUrl: ""
    accessedAt: "2026-11-19"
    modified: true
    notes: "Definition, genres, design/development/production rationale, player experience, store references and a gameplay video reference researched on 2026-11-19. Sources consulted: Wikipedia 'Zone of control', WargameHQ 'Mechanics Monday - Zone of Control Basics', gdp3 'Zone of Control', Civilization V (CivFanatics), Total War: Warhammer III '2 Ways to Stop Enemies Running Away' (YouTube), and Steam store listings. No third-party text copied."
---

## Game genres

- **Strategy / tactical / 4X** - the core home of zone of control (Civilization, Europa Universalis).
- **Wargames (board and digital)** - hex-and-board and tactical squad games use it to constrain movement and force contact.
- **Grand strategy / nation-level conflict** - used as a spatial rule that shapes campaign-map planning.

## Why developers use it

**Design.** It turns empty space into a tactical resource: the front line, a chokepoint or a defended ridge becomes meaningful because enemy zones bleed into it. It gives ranged units something to defend (they force opponents into a zone where melee is unavoidable) and makes every movement decision legible - a player sees an enemy's zone and chooses to flank, stop, or fight.

**Development.** A zone of control is cheap to compute: it is just a small set of adjacent tiles (or a distance check on a grid), so it adds almost no cost to pathfinding, movement and combat. Because it is deterministic and grid-local, it is easy to tune and verify, and it can be implemented in the same grid system that drives movement, so a single data structure drives both.

**Production.** It is a low-risk, high-polish rule: it can be sketched on a hex grid and tested in a build without a deep simulation. It gives the player an immediate, readable tactical feel early, which is the kind of satisfying feedback a strategy game needs to feel "tactical". It is also easy to balance by adjusting the zone's range, whether it stops or slows movement, and whether it requires an attack.

## What the player sees and feels

The player sees a marked zone around each combat unit - in Civilization the zone is drawn as a coloured border around the affected tiles, and in Total War armies are highlighted or stopped by the front edge of a foe's zone. Moving directly through an enemy's zone still forces the unit to stop, even with movement points left; these "stop in your tracks" moments feel like hitting an invisible wall. A city that is surrounded by enemy zones is put under siege and stops healing, which turns zone of control into a concrete chain of consequences. The player feels the tension of being boxed in, the skill of reading a zone to flank, and the frustration of being slowed when there is nowhere left to go.

## Store references

Steam
- [Sid Meier's Civilization V](https://store.steampowered.com/app/8930/) - movement zones around combat units; a city under complete enemy siege stops healing.
- [Europa Universalis IV](https://store.steampowered.com/app/236850/) - zones of control on unit movement across the campaign map.
- [Total War: Warhammer III](https://store.steampowered.com/app/1142710/) - zones of control on the campaign map slow and stop enemy armies.
- [RISK: Global Domination](https://store.steampowered.com/app/1128810/) - board-game style area control with zones around held territories.

Apple App Store (iOS)
- No major core-title match found; zone of control is predominantly a PC/console strategy rule.

Google Play (Android)
- No major core-title match found; zone of control is predominantly a PC/console strategy rule.

Epic Games Store
- No major core-title match found; zone of control is predominantly a PC/console strategy rule.

## References

[1] https://en.wikipedia.org/wiki/Zone_of_control
[2] https://web.archive.org/web/20200713214444/https://wargamehq.com/mechanics-monday-zone-of-control-basics/
[3] https://gdp.cse.chalmers.se/index.php?title=Zone_of_Control
[4] https://forums.civfanatics.com/resources/understanding-the-zone-of-control-vanilla.25582
[5] https://store.steampowered.com/app/8930/
[6] https://store.steampowered.com/app/236850/
[7] https://store.steampowered.com/app/1142710/
[8] https://store.steampowered.com/app/1128810/
[9] https://www.youtube.com/watch?v=kBY_MJbdcz4
