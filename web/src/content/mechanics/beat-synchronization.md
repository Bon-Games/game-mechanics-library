---
{
  "id": "beat-synchronization",
  "title": "Beat Synchronization",
  "summary": "Timing player actions or world events to a musical beat, with on-beat inputs enabling actions or earning stronger effects and rewards.",
  "categoryId": "time-turns-action-systems",
  "subcategoryId": "time-turns-action-systems-real-time-systems",
  "status": "published",
  "maturity": "reviewed",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": [],
  "examples": [
    "Crypt of the NecroDancer (Steam)",
    "BPM: BULLETS PER MINUTE (Steam)",
    "Metal: Hellsinger (Steam)"
  ],
  "relatedIds": [],
  "videos": [
    {
      "title": "Crypt of the NecroDancer -- Launch Trailer (1:14)",
      "creator": "Brace Yourself Games",
      "url": "https://www.youtube.com/watch?v=-HiQUw5Np8o"
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
      "notes": "Original definition and design commentary researched on 2026-11-12 using the developer press kit, Steam descriptions, Unity audio timing documentation, and the Metal: Hellsinger modding guide linked below. Official trailer metadata confirms 74 seconds. Starter name, classification, and compilation provenance preserved; no third-party text copied."
    }
  ]
}
---

Beat synchronization makes a musical pulse part of the rules, not just the soundtrack. Inputs are judged against beat timings: a game may require on-beat movement or attacks, or allow off-beat actions but reward accurate timing with more damage or score. World events, such as enemy movement, can share that pulse.

## Where it is used

Common in rhythm games and rhythm-action hybrids, including dungeon-crawling roguelikes and first-person shooters. The defining feature is that timing changes gameplay outcomes; scenery merely flashing to music is not enough.

## Why developers use it

For designers, the beat creates a readable action cadence and a timing skill to combine with aiming or positioning. For developers, a shared audio clock keeps input judgments and feedback aligned. Production must budget for music rights, beat-map authoring, timing-window tuning, and latency testing; reusable beat data can reduce per-song setup.

## What the player sees and feels

Players hear a steady pulse and see beat markers, rhythmic movement, or on-beat hit feedback. Maintaining the rhythm can feel like performing with the soundtrack; missing it creates pressure to recover. Unclear cues or uncorrected latency can make judgments feel unfair, so visual beat cues and calibration deserve attention.

## References

- [Developer press kit](https://braceyourselfgames.com/press/crypt-of-the-necrodancer/): on-beat navigation and combat, plus the official gameplay trailer above (1:14).
- Steam examples: [Crypt of the NecroDancer](https://store.steampowered.com/app/247080/Crypt_of_the_NecroDancer/) (move and fight to the beat), [BPM: BULLETS PER MINUTE](https://store.steampowered.com/app/1286350/BPM_BULLETS_PER_MINUTE/) (rhythmic shooting and dodging), and [Metal: Hellsinger](https://store.steampowered.com/app/1061910/Metal_Hellsinger/) (on-beat attacks increase damage and musical intensity).
- [Unity audio-clock documentation](https://docs.unity.com/en-us/engine/6000.5/script-reference/unityengine/audiosettings/dsptime) and [Metal: Hellsinger modding guide](https://cdn.metalhellsinger.com/modding/MetalHellsinger_Modding_Guide_v2.pdf): precise timing and reusable beat tracks. Design and production trade-offs above are editorial synthesis.
