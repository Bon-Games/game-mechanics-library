---
id: charged-attack
title: Charged Attack
summary: A special attack that requires the player to build up charge energy by holding a button or repeating an action, then releasing to unleash a more powerful version with increased damage or effect.
categoryId: combat-damage
subcategoryId: combat-damage-attacks
status: published
maturity: reviewed
language: en
tags: []
genres: []
aliases: ["charge attack", "charged move", "charged special"]
examples:
  - "Monster Hunter (Steam, mobile) - Great Sword charge slashes and True Charged Slash"
  - "The Legend of Zelda: Breath of the Wild (Nintendo Switch, Steam) - Spin Attack, Great Spin, Iaijutsu, spear thrust"
  - "Genshin Impact (Epic Games Store, Steam, mobile) - stamina-cost charged attacks with unique animations"
  - "Final Fantasy XVI (Steam, PlayStation) - Burning Blade, Charged Magic guard breaks"
  - "Street Fighter IV (Steam, PlayStation, Xbox) - Focus Attack"
  - "Half-Life 1 (Steam, GOG) - Tau Cannon charged secondary"
  - "Fable II (Xbox Live Arcade, PC) - long-held ranged attack with zoom and damage scaling"
  - "Fallout 3 (PC, console) - melee attacks that can be charged for a larger swing"
relatedIds: []
videos:
  - title: "Genshin Impact - Charged Attacks Showcase (MP05 Battle Pass)"
    creator: "Paimon's Palace"
    url: "https://www.youtube.com/watch?v=lqkx7LmHpdw"
sources:
  - sourceId: curated-starter
    url: https://github.com/Bon-Games/game-mechanics-library
    creator: "Game Mechanics Library project"
    license: "Original compilation; attribution preferred"
    attribution: "Game Mechanics Library project. Curated list of common names. Category mapping is an original proposed taxonomy; names themselves are general terminology."
    licenseUrl: ""
    accessedAt: "2026-11-07"
    modified: false
    notes: "Definition, game examples, design rationale, player experience, video and store references researched on 2026-11-20 from TV Tropes Charged Attack, G2A What Is a Charge Attack in Gaming, Zelda Fandom Charged Attack, KnowGamePlay blog, Twinfinite Travis Strikes Again, IGN Crimson Desert, Punished Backlog Final Fantasy XVI, YouTube Monster Hunter great sword footage, and Genshin Impact store pages. No third-party text copied."
---

Charged attacks are a family of special attacks in which the player must first build up energy before unleashing a stronger version of a normally available attack. Instead of pressing the attack button and instantly releasing, the player holds a button or repeats a motion to accumulate charge energy, then releases to perform the enhanced attack. The longer or more completely the player charges, the greater the damage, effect, visual impact or duration of the attack.

## Where it is used

- **Action / action-adventure** - the core home of the hold-type charged attack: melee characters charge a strike, spell or finisher by holding a button.
- **Action RPG / hack-and-slash** - charging is tied to weapon types and stamina, e.g. Genshin Impact's weapon-based charged moves or Monster Hunter's weapon-specific charge slashes.
- **Fighting games** - hold-based charge moves such as Street Fighter IV's Focus Attack or Devil May Cry's charged specials.
- **Rescue / survival horror** - games like Half-Life's Tau Cannon or Fallout's melee charges turn a basic attack into a burst tool.

## Why developers use it

**Design.** The charge turn a simple button press into a decision. The player must weigh the time required to charge against the damage or effect they will get: do I spam light attacks, or do I commit to a heavy one? That tension creates a risk/reward skill loop. Charging also allows designers to give every weapon a range of options - fast attack, steady attack, and a charged finisher - without duplicating hitboxes or animation code. Charging is also the classic engine behind the "guard break": a move that stuns, shatters shields, or breaks through armour, which gives players a reliable way to interrupt a well-defended enemy.

**Development.** A single charge state machine or charge meter can be reused across every weapon and every character, which keeps content production faster and keeps tuning consistent. Because the charge phase is a distinct, timed state, it is easy to tune (charge speed, maximum charge, overshoot behaviour) and easy to test in builds.

**Production.** The setup is low-cost: the game already has the attack button and the animation system, so the charged version is a held input plus one extra animation state and one damage multiplier. It is slow to add, but its strategic payoff is high, so it is one of the cheapest ways to make a combat system feel deep.

## What the player sees and feels

The player sees a charge indicator - a meter filling, the character's silhouette or weapon glowing brighter, or the screen tinting/reddening as charge nears its ceiling. The character enters a wind-up animation, often slower or held mid-animation, during which the character becomes vulnerable to hits, knockback or staggering. When the player releases, there is a distinct impact: amplified damage numbers, screen shake, particle bursts, a different (often bigger) hit animation and audio. The relief and satisfaction of a perfectly timed full charge - followed by the tension of being exposed while charging - is the core loop the mechanic delivers.

## References

- [TV Tropes - Charged Attack](https://tvtropes.org/pmwiki/pmwiki.php/Main/ChargedAttack): overview of hold-type and collect-type charges, with game examples.
- [G2A - What Is a Charge Attack in Gaming](https://g2a.com/news/glossary/what-is-a-charge-attack-in-gaming): stamina cost, risk of vulnerability and when to use charged attacks.
- [Zelda Fandom - Charged Attack](https://zelda.fandom.com/wiki/Charged_Attack): BOTW spin attack, great spin, Iaijutsu and spear charge examples.
- [KnowGamePlay - What is a Charged Attack in Genshin Impact](https://knowgameplay.blog/what-is-charged-attack-genshin-impact): stamina consumption, knockback, animation lock and timing in Genshin.
- [Twinfinite - Travis Strikes Again: How to Charge Attack](https://twinfinite.net/guides/travis-strikes-again-charge-attack-how/): battery-powered charge mechanic and how to use it.
- [IGN - Crimson Desert gameplay](https://www.ign.com/articles/crimson-desert-gameplay-ign-first): magically-charged heavy attacks in a recent action game.
- [Punished Backlog - Final Fantasy XVI Combat Guide](https://punishedbacklog.com/final-fantasy-xvi-combat-guide): Burning Blade and Charged Magic guard breaks.
- [YouTube - Monster Hunter Rise | Great Sword impressions](https://www.youtube.com/watch?v=_Es9tCu4pX0): charge mechanics on the Great Sword.
- [YouTube - Great Sword In Depth Guide : Monster Hunter World](https://www.youtube.com/watch?v=VDGLkuh2bes): charge slash tiers and true charged slash.
- [YouTube - In-Depth Great Sword Switch Skills Guide | MH Rise](https://www.youtube.com/watch?v=ETTt51cUbVo): True Charged Slash and charge depth.
- [Genshin Impact on the Epic Games Store](https://store.epicgames.com/en-US/p/genshin-impact): elemental combat system and charged attacks.
- [Genshin Impact on Steam](https://store.steampowered.com/app/845550/Genshin_Impact/): same mechanics ported to PC.
