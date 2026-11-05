# Palantir Design System (reference)

Operational software design with rigorous structure and dark analytical clarity, derived from Palantir's Foundry application styling guidance and Blueprint UI patterns. Mission-critical, customizable, functional. Provided by the repo owner as design direction; see `.claude/cycle/design-direction.md` for how the improvement cycle uses it.

## 1. Visual theme and atmosphere
- Moods: operational, structured, customizable, professional, accessible (Blueprint colors/intents chosen with WCAG in mind).
- Density: medium-high. Widgets, tables, actions and status information must stay clear, aligned and themeable.
- Character: dark analytical surfaces balanced by clean intent colors; Blueprint blues, reds, greens, oranges, grays; compact controls with low radii and crisp boundaries; section and page backgrounds used to segment workflows; utility over ornament.

## 2. Color palette and roles
Blueprint core: `--blue-5 #137CBD` primary interactive; `--blue-4 #2B95D6` hover/active; `--green-5 #0F9960` success; `--orange-5 #D9822B` warning; `--red-5 #DB3737` error/destructive.
Dark neutrals: `--dark-gray-1 #182026` primary dark background; `--dark-gray-2 #202B33` secondary surface; `--dark-gray-3 #293742` card/widget background; `--dark-gray-4 #30404D` borders and separators; `--gray-1 #5C7080` secondary text; `--gray-5 #BFCCD6` light text on dark.
Light neutrals: `--light-gray-5 #F5F8FA` background; `--light-gray-4 #EBF1F5` subtle panel; `--light-gray-2 #D8E1E8` border/divider; `--dark-text #182026` primary text on light.
Rules: use intent colors consistently with meaning; let background shades segment pages, sections and widgets; avoid arbitrary custom colors unless saved and reused across a module; support light and dark with equivalent semantic clarity.

## 3. Typography
Fonts: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`; mono `'SF Mono', 'Roboto Mono', Menlo, Consolas, monospace`.
Scale (size / weight / line-height / letter-spacing): Page title 32/700/1.15/-0.02em; Section title 24/600/1.2/-0.01em; Widget title 18/600/1.3/0; Body 14/400/1.5/0; Small body 12/400/1.45/0; Label 12/600/1.3/0.01em; Code 12/400/1.45/0.
Philosophy: pragmatic and dense; structure and semantic color over type drama; short literal widget titles; monospace for IDs and technical values.

## 4. Components
- Primary button: bg `#137CBD`, white text, min-height 32px, padding 0 12px, 1px transparent border, radius 3px, font 600 12px; hover `#106BA3`.
- Default button: bg `#293742`, text `#F5F8FA`, 1px `#30404D` border, radius 3px, weight 600; hover `#30404D`.
- Intent buttons: success `#0F9960`, warning `#D9822B`, danger `#DB3737`, white text.
- Text input: full width, min-height 32px, padding 0 10px, bg `#202B33`, text `#F5F8FA`, 1px `#30404D` border, radius 3px, 12px; focus border `#137CBD` plus `0 0 0 2px rgba(19,124,189,0.16)` ring, no outline.
- Widget card: bg `#293742`, text `#F5F8FA`, 1px `#30404D` border, radius 4px, padding 16px.
- Section: bg `#202B33`, radius 6px, padding 20px.

## 5. Layout
Pages, sections and widgets are the structural units; section headers distinguish groups; keep widgets aligned and consistently spaced; reuse shared classes/saved colors for consistency.
Spacing: 4 / 8 / 12 / 16 (widget padding) / 20 (section padding) / 24px.

## 6. Depth and elevation
Hierarchy: page background, section, widget (bordered panel), intent callout. Borders and contrast before large shadows; overlays clearly elevated.
Shadows: widget `0 2px 6px rgba(0,0,0,0.18)`; overlay `0 10px 24px rgba(0,0,0,0.28)`.

## 7. Do and don't
Do: use intent colors with semantic discipline; keep widgets compact, aligned and operationally clear; strong contrast in light and dark; reuse shared styling; let headers and backgrounds segment workflows.
Don't: decorate mission-critical tools with flourish; use custom colors randomly; blur page/section/widget distinctions; oversize controls; depend on color alone where labels or icons are needed.

## 8. Responsive
Collapse dense widget grids to a single column before content becomes unreadable; keep compact controls while preserving touch usability; keep section headers visible; simplify background variation if it hurts mobile readability; keep intent colors discernible in both modes. Mobile must still show clear widget boundaries, intent-driven actions and strong contrast.

## 9. Prompt snippet
"Design this interface in the style of Palantir's application styling guidance and Blueprint-based UI. Use dark analytical surfaces, compact low-radius controls, clear page/section/widget hierarchy, and intent colors like Blueprint blue, green, orange and red for semantic meaning. The result should feel mission-critical, customizable and operationally rigorous rather than decorative or consumer-friendly."
