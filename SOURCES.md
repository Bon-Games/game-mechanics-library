# Sources, attribution and reuse policy

The project maintains a source registry in [`data/sources.json`](data/sources.json). **Listing a website here does not mean its content has been imported.**

## Sources consulted

| Source | Creator / attribution | Data licence (as checked 2026-11-07) | Current usage |
|---|---|---|---|
| [Curated starter index](https://github.com/Bon-Games/game-mechanics-library) | Game Mechanics Library project | Original compilation of general mechanic names; no third-party text copied | Starter data |
| [SteamMaho Mechanics](https://steammaho.com/mechanics) | SteamMaho, CC BY 4.0 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Research reference only; **not** imported yet |
| [Game Mechanic Compendium](https://compendium.tallmove.com/) | Game Mechanic Compendium, James West Jr., CC BY 4.0 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) for catalog content and exports | Research reference only; **not** imported yet |
| [Gameplay Atlas](https://gameplayatlas.loopyhop.com/) | Gameplay Atlas | Not verified | Reference only |
| [MeepleRules mechanics](https://meeplerules.com/en/mechanics) | MeepleRules | Not verified | Reference only |
| [Meta gameplay mechanics](https://developers.meta.com/vr/resources/publish-gameplay-mechanics/) | Meta Developers | Not verified | Reference only |

## Record-level attribution

Every imported or researched mechanic should keep **provenance**, not just a global bibliography. Suggested metadata:

```json
{
  "name": "Perfect Parry",
  "sources": [
    {
      "source_id": "tallmove",
      "url": "https://compendium.tallmove.com/",
      "creator": "James West Jr. / Game Mechanic Compendium",
      "license": "CC BY 4.0",
      "accessed_at": "2026-11-07",
      "modified": true,
      "notes": "Adapted and reclassified in this project's taxonomy."
    }
  ]
}
```

This is an **example of the schema**, not a claim that Perfect Parry was copied from this source.

## Attribution rules

1. **Preserve names, source links, credits, licences and access dates** in the original imported rows. Never lose provenance when deduplicating.
2. For CC BY 4.0 sources: credit the creator, link the license and source, and clearly indicate if the material was adapted/translated/reclassified.
3. **Do not automatically assume permission** to bulk import from sites where data reuse rights have not been verified. Link to their websites as references until checked.
4. A mechanic's name alone is commonplace terminology, but external definitions, explanations, descriptions and datasets may carry attribution obligations. Write original definitions unless reusing licensed material with attribution.
5. If two sources describe the same mechanic, the merged entry must keep **both source references**.
6. Users' private research notes are saved in the browser. Do not put private notes into a public repository without reviewing the export.

## Keeping credits visible

The website should expose a **Sources & credits** page and clickable citations on mechanic detail cards. CSV/JSON import should capture its origin (name, URL, license and access date). JSON export must preserve this metadata.

**License status warning:** Licence statements are based on the linked publishers' descriptions checked on 2026-11-07, and could change. Review original conditions for every subsequent dataset download.
