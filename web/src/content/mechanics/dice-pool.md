---
{
  "id": "dice-pool",
  "title": "Dice Pool",
  "summary": "Rolling a set of dice at once (the pool) and resolving the result by counting how many dice beat a target number, instead of adding a bonus to a single die.",
  "categoryId": "cards-dice-board-mechanics",
  "subcategoryId": "cards-dice-board-mechanics-dice-resolution",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": [],
  "examples": [
    "Shadowrun (Steam)",
    "Vampire: The Masquerade 5th Edition (Google Play)",
    "Astrea: Six-Sided Oracles (Steam)",
    "Blades in the Dark (TTRPG)"
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "Ubiquity Die Pools (2:31)",
      "creator": "Runeslinger",
      "url": "https://www.youtube.com/watch?v=QnIPfXnWobc"
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
      "notes": "Definition and design commentary researched on 2026-11-17 via Wikipedia, the d20 Radio and RPG Stack Exchange articles on dice pools, the Shadowrun guide, and the free 2:31 Ubiquity Die Pools YouTube reference; starter name, classification and compilation provenance preserved; no third-party text copied."
    }
  ]
}
---
Dice pool is a resolution mechanic in which a player rolls a set of dice at once — the pool — rather than a single die, then judges the result from the set as a whole. The usual rule is that each die meeting or exceeding a target number counts as one success, and the roll succeeds when the number of successes reaches a threshold. Some systems instead add every die and compare the total to a target. The common thread is that the pool itself is the unit of chance, and the number or value of its dice drives the outcome.

## Where it is used
Dice pools are the standard resolution engine of many role-playing games, especially the Storyteller System (Vampire: The Masquerade, Werewolf: The Apocalypse, Mage: The Ascension), Shadowrun, Exalted, Legend of the Five Rings, and the Year Zero Engine games such as Forbidden Lands. They also appear in dice-pool roguelikes that trade cards for dice, including Astrea: Six-Sided Oracles. The mechanic is a true system only when the pool's size or a die's value changes the result; dice rolled for atmosphere alone do not count.

## Example
- Shadowrun: the pool is built from a skill plus its linked attribute (six-sided dice); a die of 5 or 6 is a hit, and hits are compared with the difficulty threshold. More dice widen the margin for success.
- Vampire: The Masquerade 5th Edition: a pool of d10s, each 6 or higher counts as a success; the number of successes must beat the difficulty set by the Storyteller.
- Astrea: Six-Sided Oracles: a dice-pool roguelike that replaces cards with a pool of dice; combining dice builds the damage and corruption pools that drive combat and resolution.
- Blades in the Dark: a competitive pool in which only the highest die matters, so every roll is a single decisive roll.

## Game genres
Role-playing games, roguelikes, deckbuilding games that use dice instead of cards, urban fantasy and cyberpunk, horror storytelling games, and strategy games that resolve actions through hit counts.

## Why developers use it
For designers, the pool turns a single roll into a tunable probability curve: a larger pool against a fixed target reads as reliable and predictable, while a small pool keeps outcomes in doubt, a compact way to shape how often players succeed. For developers, each die is an independent unit of computation, so a pool translates cleanly into code, parallelises well, and can represent any character without a table of modifiers. For production, the main costs are balancing hit thresholds across pool sizes, tuning how rerolls and failures interact, and keeping the rolling loop fast enough for matches; the component can be reused across many systems.

## What the player sees and feels
A player sees a handful of dice tumble at once, usually with hits highlighted or counted out loud, and reads the result as a number of successes. The feeling is immediate and concrete: a tall pool looks dependable, a short one looks risky, and the margin between barely succeeding and succeeding comfortably gives every attempt weight. Because the result is a count rather than a single number, hits and misses feel tangible, and the tension comes from knowing exactly how many dice you have to work with.

## References
- Wikipedia, "Dice pool": https://en.wikipedia.org/wiki/Dice_pool
- d20 Radio, "The Game Mechanic: D is for Dice Pool": https://www.d20radio.com/main/the-game-mechanic-d-is-for-dice-pool
- RPG Stack Exchange, "What is a dice pool mechanic?": https://rpg.stackexchange.com/questions/10827/what-is-a-dice-pool-mechanic/10830
- Dice Drop, "Understanding Dice Pools": https://dicedrop.co.uk/understanding-dice-pools
- Shadowrun Guide, "Dice pools — the heart of Shadowrun": https://rays-shadowrun.netlify.app/sr_mechanics
