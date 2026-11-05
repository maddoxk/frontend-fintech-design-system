# Design direction (read this, not the full spec)

Full reference: docs/design/palantir-design.md. Read it when an issue needs exact values.

**Owner decision (2026-11-05): the library follows the Palantir / Blueprint aesthetic. Make large changes to all components and atoms to match it.** The earlier "bland, boring" look is explicitly unwanted. Palantir now LEADS; Apple / Google / Microsoft inform only polish (smooth motion, great defaults, accessibility, API ease).

## The look (summary)
- Dark analytical surfaces by default; equivalent light theme. Dark: page #182026, section #202B33, widget #293742, borders #30404D, secondary text #5C7080, text on dark #BFCCD6/#F5F8FA. Light: page #F5F8FA, panel #EBF1F5, borders #D8E1E8, text #182026.
- Intent colors with fixed meaning: primary blue #137CBD (hover #106BA3 / #2B95D6), success #0F9960, warning #D9822B, danger #DB3737.
- Compact, crisp: controls 32px high, radius 3px (widgets 4px, sections 6px), 1px borders before shadows, spacing scale 4/8/12/16/20/24, body 14px, small/labels 12px (labels weight 600), page title 32/700, section 24/600, widget title 18/600, monospace for IDs and numbers.
- Page > Section > Widget hierarchy; medium-high density; shadows: widget 0 2px 6px rgba(0,0,0,.18), overlay 0 10px 24px rgba(0,0,0,.28).
- Utility over ornament. No gradients, no large radii, no decorative flourish. Never convey state by color alone (add label or icon).

## Rules for the cycle
- Assessor: prefer gaps that move the library toward this look and toward dense, high-quality fintech data UI. Large restyles are allowed, but each issue is still one area with a `Files:` list and a diff near 300 lines; sequence big work as dependent issues (`cycle:blocked` until the blocker merges).
- Implementer: use tokens (add new ones, no hard-coded colors in components); keep public APIs backward compatible unless the issue says otherwise; update tests and stories.
- Reviewer: fail changes that add decoration over function, hard-code colors outside tokens, break contrast (4.5:1 text, 3:1 UI) in either theme, convey state by color alone, or drift from the values above.
