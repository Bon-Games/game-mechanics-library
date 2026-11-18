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
      "sourceId": "curated-starter",
      "url": "https://github.com/Bon-Games/game-mechanics-library",
      "creator": "Game Mechanics Library project",
      "license": "Original compilation; attribution preferred",
      "attribution": "Game Mechanics Library project. Curated list of common names. Category mapping is an original proposed taxonomy; names themselves are general terminology. Vision Cone specifics researched on 2026-11-19 from Dante's Lab, Game AI Pro, Obsidian Portal, UhiyamaLab, and Game Developer.",
      "licenseUrl": "",
      "accessedAt": "2026-11-19",
      "modified": true,
      "notes": "Definition, player experience, design/development/production rationale and store references researched on 2026-11-19. Sources consulted: Dante's Lab 'How to implement a vision cone in Unity', Game AI Pro 'How to Catch a Ninja', Obsidian Portal 'Sight Cones and Sound Spheres' (Shadow Tactics), UhiyamaLab 'Stealth Game FOV', Game Developer 'Dynamic detection in Shadow Tactics'. Store references verified via Steam and Epic Games Store listings. Video reference: 'Recreating Darkwood's Vision Effect in Unity' (Aarthificial, 4:00, YouTube). Description and category mapping preserved; no third-party text copied."
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
