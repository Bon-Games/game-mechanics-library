---
{
  "id": "vision-cone",
  "title": "Vision Cone",
  "summary": "A cone-shaped area of sight emitted from an NPC's or player's position and facing direction; anything inside the cone, within range, and with a clear line of sight is detected. Width, range and orientation define the agent's field of view, and the cone is the core detection primitive behind stealth, detection and related systems.",
  "categoryId": "stealth-detection",
  "subcategoryId": "stealth-detection-detection",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": ["vision cone", "field of view", "cone of vision", "sight cone", "viewcone", "FOV"],
  "examples": [
    "Darkwood (Steam) - top-down survival horror where the player sees only through a forward cone that shifts as they turn.",
    "Mark of the Ninja (Steam) - 2D stealth platformer whose guards display a visual cone of vision and a sound-ring for noise.",
    "Shadow Tactics: Blades of the Shogun (Steam / Epic Games Store) - the player can reveal enemy guards' viewcones on an isometric tactical map.",
    "Splinter Cell series (Steam / consoles) - guards use a vision cone plus peripheral vision boxes and a detection timer.",
    "Metal Gear Solid series (Steam / consoles) - guards switch to an Alert state when the player enters their radar viewcone.",
    "Thief / Dishonored / Hitman / Deus Ex: Mankind Divided (Steam) - guards react when the player enters their viewcone."
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "Recreating Darkwood's Vision Effect in Unity",
      "creator": "Aarthificial",
      "url": "https://www.youtube.com/watch?v=XWMPEE8O05c"
    }
  ],
  "sources": [
    {
      "sourceId": "web-research",
      "url": "https://www.dlab.ninja/2025/06/how-to-implement-vision-cone-in-unity.html",
      "creator": "Dante's Lab",
      "license": "Blog content; no licence claimed",
      "attribution": "Definition of the vision cone, its two defining parameters (range and half-angle), and a Unity implementation sketch. The original curated name and classification are preserved.",
      "licenseUrl": "",
      "accessedAt": "2026-11-19",
      "modified": true,
      "notes": "Definition, parameters and implementation of the vision cone."
    },
    {
      "sourceId": "web-research",
      "url": "http://www.gameaipro.com/GameAIPro/GameAIPro_Chapter32_How_to_Catch_a_Ninja_NPC_Awareness_in_a_2D_Stealth_Platformer.pdf",
      "creator": "Game AI Pro",
      "license": "Book chapter; no licence claimed",
      "attribution": "Definition of vision cone by offset, direction, angle and maximum distance, plus the sight/sound sense model.",
      "licenseUrl": "",
      "accessedAt": "2026-11-19",
      "modified": true,
      "notes": "Academic-game-design definition and use of vision cones."
    },
    {
      "sourceId": "web-research",
      "url": "https://blog.obsidianportal.com/sight-cones-and-sound-spheres/",
      "creator": "Obsidian Portal",
      "license": "Blog content; no licence claimed",
      "attribution": "Shadow Tactics: Blades of the Shogun sight cone example, including blocked vision and banded partial-cover line pattern.",
      "licenseUrl": "",
      "accessedAt": "2026-11-19",
      "modified": true,
      "notes": "Example of a vision cone with occlusion and partial-cover behaviour."
    },
    {
      "sourceId": "web-research",
      "url": "https://uhiyama-lab.com/en/notes/godot/stealth-fov-system",
      "creator": "UhiyamaLab",
      "license": "Blog content; no licence claimed",
      "attribution": "Stealth FOV system with three-stage check (range, angle, line of sight) and staged alert levels.",
      "licenseUrl": "",
      "accessedAt": "2026-11-19",
      "modified": true,
      "notes": "Implementation reference for stealth vision cone."
    },
    {
      "sourceId": "web-research",
      "url": "https://gamedeveloper.com/design/game-design-deep-dive-dynamic-detection-in-i-shadow-tactics-i-",
      "creator": "Game Developer",
      "license": "Article; no licence claimed",
      "attribution": "Shadow Tactics viewcone design: coloured zones, single visible cone, slow motion on detection, level-design impact.",
      "licenseUrl": "",
      "accessedAt": "2026-11-19",
      "modified": true,
      "notes": "Design rationale for the vision cone in a commercial stealth game."
    },
    {
      "sourceId": "web-research",
      "url": "https://youtube.com/watch?v=XWMPEE8O05c",
      "creator": "Aarthificial",
      "license": "YouTube (Standard YouTube licence)",
      "attribution": "YouTube video showing the Darkwood vision cone visual effect being recreated in Unity.",
      "licenseUrl": "https://www.youtube.com/t/standardlicense",
      "accessedAt": "2026-11-19",
      "modified": true,
      "notes": "Video reference for the vision cone visual effect (4:00). No third-party text copied."
    }
  ]
}
---
## Game genres

- **Stealth** - the direct and original home of the mechanic (guards that only see in a cone).
- **Survival horror / dark top-down exploration** - the player reads the world through a limited cone, so the map stays partly unreadable (for example Darkwood).
- **Tactical / real-time tactics** - the player can reveal enemy viewcones to plan routes and ambushes (Shadow Tactics).
- **Stealth action / 3D shooters** - the cone drives detection, search states and slow-mo on being spotted (Splinter Cell, Metal Gear Solid).
- **Stealth platformer** - a 2D cone of vision combined with a sound-ring, read at a glance (Mark of the Ninja).

## Why developers use it

**Design.** It makes the enemy's awareness legible without a dialogue box: the player can feel when a guard has seen them. That single tension drives the whole loop of approaching, hiding, distracting and running. A cone is also cheap to reason about for level design, and designers can tune range, width and reaction time to make a level easier or harder.

**Development.** A cone is a small amount of geometry (origin, forward direction, half-angle, range) plus a line-of-sight test, so it is fast to implement and cheap to run every frame. It can be layered with a detection timer, peripheral vision and an awareness meter to make the reaction feel fair instead of binary. Most engines already provide the raycast and angle math needed, and the same cone primitive is reused for sound radius and area effects.

**Production.** Stealth is a low-risk, high-polish genre, and the vision cone is the single most important feedback piece of any stealth system. It lets a team ship a detectable-but-forgiving loop early, test detection difficulty in build, and iterate on levels around the cone without maintaining a deep simulation. Because the cone can be drawn on screen for debugging, it also speeds up tuning of player and enemy feel.

## What the player sees and feels

The player sees a cone of sight drawn from a guard or the player's own viewpoint. In Darkwood the surroundings outside the cone fade into vague darkness; in Mark of the Ninja the player's own cone shows exactly where the lights are and a quickly expanding ring shows how far a sound travels. When the player steps into a guard's cone, a detection meter starts to fill, the cone may change colour or grow a vignette, and once it is full the guard notices and the game reacts: an alarm, a chase, a slow-motion warning, or a friendly alert. The player feels the constant unreadable tension of not knowing what the enemy can see, and the satisfaction of reading the cone to slip past, or of being caught out by a cone they misread.

## Store references

These titles use the vision cone as a core gameplay and detection mechanic.

**Steam**
- [Darkwood](https://store.steampowered.com/app/274520/) - top-down survival horror; the player sees only through a forward cone that shifts as they turn.
- [Mark of the Ninja](https://store.steampowered.com/app/214560/) - 2D stealth platformer with visual cones and a sound-ring.
- [Mark of the Ninja: Remastered](https://store.steampowered.com/app/860950/) - remastered 2D stealth platformer.

**Apple App Store (iOS)**
- No major core-title match found in the verified searches; the mechanic is predominantly a PC/console style.

**Google Play (Android)**
- No major core-title match found in the verified searches; the mechanic is predominantly a PC/console style.

**Epic Games Store**
- [Darkwood](https://store.epicgames.com/p/darkwood-fa73bd/) - top-down survival horror with a forward vision cone.

## References

[1] https://www.dlab.ninja/2025/06/how-to-implement-vision-cone-in-unity.html
[2] http://www.gameaipro.com/GameAIPro/GameAIPro_Chapter32_How_to_Catch_a_Ninja_NPC_Awareness_in_a_2D_Stealth_Platformer.pdf
[3] https://blog.obsidianportal.com/sight-cones-and-sound-spheres/
[4] https://uhiyama-lab.com/en/notes/godot/stealth-fov-system
[5] https://gamedeveloper.com/design/game-design-deep-dive-dynamic-detection-in-i-shadow-tactics-i-
[6] https://www.youtube.com/watch?v=XWMPEE8O05c
