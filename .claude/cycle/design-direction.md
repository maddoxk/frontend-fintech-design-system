# Design direction (read this, not the full spec)

Full reference: docs/design/palantir-design.md. Read it only when an issue needs exact values.

The library should feel modern, easy to use, customizable and distinctive. Two lenses apply together:
- **Polish and ease (Apple / Google / Microsoft):** refined spacing, smooth purposeful motion, excellent defaults, accessibility, dark and light parity.
- **Operational rigor (Palantir / Blueprint):** dark analytical surfaces, page > section > widget hierarchy, compact low-radius controls (3-4px), crisp 1px borders before big shadows, medium-high density, intent colors with fixed meaning (blue primary #137CBD, green #0F9960, orange #D9822B, red #DB3737), mono for IDs and values, never color alone to convey state.

Guidance for the cycle (owner-set direction; the relative weighting of the two lenses is the cycle's call and can be changed by the owner):
- Assessor: prefer gaps that move the library toward this combination (density modes, intent/semantic tokens, surface hierarchy tokens, compact controls, themeable accents, table/widget quality for dense fintech data).
- Implementer: use existing tokens; add new tokens rather than hard-coded values; keep defaults polished and the API simple.
- Reviewer: fail changes that add decoration over function, hard-code colors outside tokens, break contrast in either theme, or convey state by color alone.
- Do not make large unscoped restyles. Each issue stays one component or one area.
