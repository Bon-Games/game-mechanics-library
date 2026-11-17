---
{
  "id": "match-3",
  "title": "Match-3",
  "summary": "Swapping two adjacent tiles on a grid to create a match of three or more identical tiles; a match clears the tiles, tiles above fall down under gravity, new tiles drop in from the top, and consecutive clears chain into cascades and combos.",
  "categoryId": "puzzle-problem-solving",
  "subcategoryId": "puzzle-problem-solving-pattern-matching",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": ["match three", "match-3", "tile matching", "match-three"],
  "examples": [
    "Bejeweled (Steam) - swap adjacent gems to form runs of three or more of the same colour.",
    "Candy Crush Saga (Steam, Apple App Store, Google Play) - swap candies on a board to complete level goals.",
    "Royal Match (Steam, Apple App Store, Google Play) - classic match-3 puzzles with boosters and events.",
    "Gardenscapes (Steam, Apple App Store, Google Play) - match-3 puzzles wrapped in a home-renovation story.",
    "Cookie Jam (Apple App Store, Google Play) - match cookies and candies in timed levels.",
    "Bejeweled Stars (Google Play) - match-3 across an archipelago of levels.",
    "Match Masters (Apple App Store, Google Play) - real-time PvP match-3 battles against friends."
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "Match 3",
      "creator": "FUN4FOUR Gametable",
      "url": "https://www.youtube.com/watch?v=KH2Cmt0QyPw"
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
      "accessedAt": "2026-11-18",
      "modified": true,
      "notes": "Definition, genres, examples and design/dev/production rationale researched on 2026-11-18 from the tile-matching Wikipedia article, Grant Drew games 'Match-3 Subgenres', Game Developer '45 Match-3 Mechanics', the CS50 match-3 lecture, and Steam/App Store/Google Play/Epic Store listings. Starter name and classification preserved; no third-party text copied."
    },
  ],
}
---

- **Puzzle** - the direct home of the mechanic (grid, matches, cascades).
- **Casual / hyper-casual mobile** - the most common home, using levels, progress and short sessions.
- **Adventure and RPG hybrids** - match-3 is blended with story, combat or collection (for example, matching to summon or damage in a dungeon crawler).

## Why developers use it

**Design.** The rules are a few lines and instantly readable: swap two tiles, form a line of three, watch it disappear. That low barrier to entry gets players playing within seconds, while cascade and combo layers add depth and a lasting sense of satisfaction. The grid is also easy to design at scale: levels are boards with goals, power-ups and obstacles, so content can be generated and iterated quickly without a deep narrative or simulation to model.

**Development.** The algorithm is well-understood and heavily documented: scan the board for matches (usually three in a row, horizontally or vertically), remove them, apply gravity, refill from the top, then repeat until no more matches remain. Most engines have matching, tiling and animation helpers, and many engine samples and tutorials implement a baseline match-3 in a few hundred lines. The same grid and gap-fill model can be adapted for non-matching games, which lowers technical risk and speeds up prototyping.

**Production.** Match-3 is a proven, low-risk casual title format that fits short mobile sessions. It supports clear engagement and monetization KPIs - session length, level retries, star ratings, retention and lifetime value - and the loop is easy to tune (match thresholds, cascade depth, board size, special pieces, level goals). Production can budget for level design, special-piece balancing and the animation feedback that sells the cascade, while reusing the matching engine across screens.

## What the player sees and feels

Players see a colourful grid of tiles, gems or candies. Tapping or swapping adjacent tiles animates the pieces to new positions. When a match forms, the tiles pop or clear with a visual burst, and tiles above them fall down with a soft impact while new tiles tween in from the top. Chain reactions cascade across the board, score pop-ups stack up, and special pieces (four- or five-in-a-row) deliver bigger clear effects. In timed variants, a countdown raises the pace and the pressure; when a move makes no match, the tiles swap back so the player can try again. The consistent, rewarding feedback loop is what makes match-3 easy to pick up and hard to put down.

## Store references

These titles use match-3 as their core gameplay.

**Steam**
- [Bejeweled 3](https://store.steampowered.com/app/78000/Bejeweled_3/) - swap adjacent gems to match three or more of the same colour.
- [Cosmantic Cluster](https://store.steampowered.com/app/2373550/) - match 3 or more orbs to queue abilities in a strategy/fighting hybrid.
- [Azkend 2: The World Beneath](https://store.steampowered.com/app/550440/Azkend_2_The_World_Beneath/) - polished match-3 with power-ups and story.

**Apple App Store (iOS)**
- [Candy Crush Soda Saga](https://apps.apple.com/app/id850417475) - match candies to complete board goals.
- [Royal Match](https://apps.apple.com/app/id1482155847) - match-3 with a renovation story and events.
- [Gardenscapes](https://apps.apple.com/app/id1105855019) - match-3 in a home-renovation narrative.
- [Cookie Jam](https://apps.apple.com/app/id727296976) - match cookies and candies in timed levels.

**Google Play (Android)**
- [Royal Match](https://play.google.com/store/apps/details?id=com.dreamgames.royalmatch) - classic match-3 with boosters.
- [Gardenscapes](https://play.google.com/store/apps/details?id=com.playrix.gardenscapes) - match-3 in a home-renovation story.
- [Bejeweled Stars](https://play.google.com/store/apps/details?id=com.ea.gp.bejeweledskies) - match-3 across an archipelago of levels.
- [Royal Kingdom](https://play.google.com/store/apps/details?id=com.dreamgames.royalkingdom) - match-3 with kingdom-renovation goals.

**Epic Games Store**
- [Tile Match Rush](https://store.epicgames.com/p/tile-match-rush-a8ca83) - fast-paced match-3 with power-ups.
- [Match 3 Game: The world is going to](https://store.epicgames.com/p/match-3-game-the-world-is-going-to-9a5c08) - match-3 with a story and magic enemies.

## References

[1] https://en.wikipedia.org/wiki/tile-matching_video_game
[2] https://grantsgames.com/2014/08/25/match-3-subgenres
[3] https://www.gamedeveloper.com/design/45-match-3-mechanics
[4] https://cs50.harvard.edu/games/notes/3
[5] https://store.steampowered.com/app/78000/Bejeweled_3/
[6] https://store.steampowered.com/app/2373550/
[7] https://store.steampowered.com/app/550440/Azkend_2_The_World_Beneath/
[8] https://apps.apple.com/app/id850417475
[9] https://apps.apple.com/app/id1482155847
[10] https://apps.apple.com/app/id1105855019
[11] https://apps.apple.com/app/id727296976
[12] https://play.google.com/store/apps/details?id=com.dreamgames.royalmatch
[13] https://play.google.com/store/apps/details?id=com.playrix.gardenscapes
[14] https://play.google.com/store/apps/details?id=com.ea.gp.bejeweledskies
[15] https://play.google.com/store/apps/details?id=com.dreamgames.royalkingdom
[16] https://store.epicgames.com/p/tile-match-rush-a8ca83
[17] https://store.epicgames.com/p/match-3-game-the-world-is-going-to-9a5c08
[18] https://www.youtube.com/watch?v=KH2Cmt0QyPw
