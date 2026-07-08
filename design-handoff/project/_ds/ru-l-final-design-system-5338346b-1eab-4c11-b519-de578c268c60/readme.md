# RU.L — Design System

> **RU.L** (placeholder name, subject to change) — an AI-native law firm in Mexico City serving venture-backed companies. AI produces ~80% of the work; partners who closed some of Mexico's most significant M&A transactions own the final 20%. The product's flagship is an **automated compliance audit** that sweeps live public registries (SAT, IMPI, Registro Público de Comercio) and returns a partner-signed report the same day.

This is a **from-scratch brand build**. No codebase, Figma file, or logo was supplied — the system is derived from the written brief and refined across several rounds of art direction with the user. Where a real asset would normally live (a logo), the brand name is set in type; see *Iconography* and the `Brand` foundation cards.

## The direction — "clean instrument"
The look is **surgical, high-tech, Apple-clean**: pure white grounds, ink-black type, one confident cobalt accent, and the audit **score drawn as a signature object** (the "Halo"). Playfulness lives in the *mechanism* — numbers that count, an arc that draws, a live scan that breathes, a stamp that settles — never in the tone, which stays sober: a partner signing a result.

## Design principles
1. **Precision is the brand.** Everything reads like a fine instrument.
2. **One grotesque, one cobalt, much white.** Restraint through a tiny palette, not through ornament.
3. **Show the mechanism working.** The audit is watchable; motion is meaningful, never decorative.
4. **The firm states; it never pitches.** No urgency, no superlatives, no exclamation marks.
5. **A partner signs the result.** Every output carries a name and a cédula.

## What this system explicitly rejects
- **Millennial beige / warm ivory** — grounds are cold white, never sepia.
- **Legaltech hype** — no circuit boards, holograms, rockets, stat-counters, "Book a call →" urgency.
- **Generic AI product** — no purple-blue gradients, glassmorphism, mesh blobs, sparkle icons, Inter, dark-mode-default.
- **Stuffy law firm** — no navy + gold, gavels, scales, columns, skyline photography, or serif letterhead clichés.

---

## CONTENT FUNDAMENTALS — how RU.L writes

**Voice:** the copy must read as a big-firm partner would write it — complete, verifiable sentences, never a SaaS landing. Bilingual by design; Spanish is set as beautifully as English and is usually primary for client-facing surfaces.

**The test for every line:** *would a lawyer sign it with their name?* If a sentence could sit on any SaaS site, cut it.

**Rules**
- Complete sentences with verifiable claims ("revisamos si sus proveedores aparecen en la lista 69-B del SAT").
- No punchy fragments ("Sin sorpresas. Sin letra chica."), no chained rhetorical questions, no dramatic triads, no aphorisms joined by an em dash.
- No exclamation marks, no superlatives, no urgency, no emoji, no stat-counters.
- Formal register: usted, not tú. First person plural for the firm ("Revisamos su borrador"), second person for the client ("Su documento…").
- Casing: sentence case in prose and headings; lowercase for wordmark and nav; tracked mono for meta and labels.

**Examples (a partner would sign it)**
- "La auditoría empieza hoy y el informe llega firmado."
- "Su documento está en revisión del socio. Entrega: hoy, 6 pm."
- "Si la auditoría encuentra problemas, cotizamos la corrección a precio fijo antes de empezar."

**Never**
- "Sin sorpresas. Sin letra chica."
- "La mejor IA legal. ¡520+ auditorías! 🚀"
- "¿Listo para dormir tranquilo? Agenda tu demo →"

Placeholders the partners fill in are written in-line as `[monto]`, `[firmas]`, `[número]`.

---

## VISUAL FOUNDATIONS

**Grounds.** Pure `--white` #FFFFFF for pages and cards; `--paper-50` #F5F5F7 (Apple grey) for sectioned grounds and wells; `--paper-100/200` for tracks and hover. Cold, never warm. Never dark-mode by default.

**Ink.** A neutral near-black `--ink-900` #0A0A0A down through a five-step grey ramp (#1D1D1F, #6E6E73, #86868B, #B0B0B6) for hierarchy — Apple-grey secondaries.

**The accent — cobalt.** One accent, `--accent` #2440CE, used with confidence: fills, dots, drawn arcs. A single **cobalt→cyan gradient** (`--accent-grad`, #2440CE→#4DA3FF) is reserved for the *signature object* (the audit score ring) and its `--accent-halo` glow. Semantic colors (green, amber, red) are calm and only appear as status.

**Type — one grotesque.**
- *Display + UI:* **Switzer** (Fontshare) — a precise, neutral grotesque, set large and tight (tracking down to −0.05em on the big number). Weights 400/500/600/700. No serif anywhere.
- *Mono / data:* **IBM Plex Mono** — every number, folio, timer, score and citation, in tabular figures.
- *Labels/meta:* mono at 11–12px, or a tracked uppercase 11px label used sparingly.

**The signature object.** `ScoreDial` — a circular gauge whose cobalt→cyan arc draws on mount, the score set large in mono at center. Used once per view as the hero of an audit result; a small `flat` cobalt version appears in-context (report sheets, dashboards).

**Corners.** Modest and restrained — sharper than typical "friendly" UI. `--radius-sm` 6px (buttons, inputs, chips), `--radius-md` 10px (cards, panels), `--radius-lg` 16px (large surfaces). `--radius-pill` is reserved for status capsules and the single hero CTA.

**Rules over boxes.** Hairlines in cool grey divide content: `--rule-thin` 1px default; one `--rule-heavy` 6px cobalt bar may crown a page. Tables have no zebra and no vertical lines.

**Spacing & grid.** 4px base with generous, Apple-scale air (section rhythm at 88px, page margins to 112px). A 12-column grid, `--content-max` 1240px, reading measure ~66ch.

**Elevation.** Restrained and warm-neutral (never blue) — most surfaces use a hairline, not a shadow. `--shadow-sm` for resting cards, `--shadow-md` on hover, `--shadow-lg` for popovers/toasts. The one blue shadow is `--shadow-halo`, exclusive to the score ring.

**Motion.** Precise; things *draw and settle*. House speed `--dur` 200ms with a standard ease; `--dur-slow` 400ms with an Apple deceleration curve for arcs and draws. The live audit uses meaningful motion — a counting figure, a feeding seismograph trace, a pulsing "en vivo" dot, a stamp that scales in once. Nothing loops decoratively; everything respects `prefers-reduced-motion`.

**Hover / press.** Buttons shift fill on hover (cobalt→lighter for primary; grey deepen for secondary) and darken on press; cards lift 1px with `--shadow-md`. No glow, no scale-up. Focus is a considered cobalt ring (`--focus-ring`).

**Transparency & blur.** Used sparingly — a frosted device panel is acceptable in a product shot, but the system is fundamentally opaque and flat.

**Imagery (if any).** Architectural detail, paper, ink, precise instruments — cool, quiet, never people pointing at screens. None ships with this system; use placeholders and request real material.

---

## ICONOGRAPHY

RU.L is **near-iconless by design** — it leans on type, hairlines, drawn arcs and small status dots rather than a glyph set. Icons read as "software"; the brand is precision counsel.

- **Status is a dot, not an icon.** `MatterStatus` and `Badge` use a small filled circle in the relevant tone plus a label. No checkmarks, no spinners.
- **The score is the iconography.** The `ScoreDial` arc, the seismograph trace, and the "en orden" stamp are the brand's signature graphic objects — drawn, not illustrated.
- **No icon font, no sprite, no emoji.** Emoji are prohibited (see Content Fundamentals). Unicode is used sparingly and typographically: middot `·`, `×` for dismiss, `←`/`→` for quiet navigation, `№` for folios, `*` for required fields.
- **If icons become necessary** (a future settings or file surface), the house choice is a **hairline / thin-stroke line set at ~1.5px** to match the rule weights — e.g. [Lucide](https://lucide.dev) or [Phosphor](https://phosphoricons.com) (Thin/Light) from CDN, monochrome in `--ink-500`, never filled, never multicolored. **This would be a substitution — flag it and confirm before adopting an icon set.**

---

## Components

Authored primitives (React, styled entirely with CSS custom properties). Import from the compiled bundle: `const { Button } = window.RULDesignSystem_533834`.

- **Button** (`components/forms/`) — clean grotesque action; primary (cobalt) / secondary (grey) / outline / ghost; sizes sm·md·lg; `pill` for the hero CTA.
- **Input** (`components/forms/`) — filled field, cobalt focus ring; optional `mono`.
- **Table** (`components/data/`) — clean table; grey header, hairline rows, mono tabular figures; per-column `render`.
- **MatterStatus** (`components/data/`) — lifecycle indicator: drafting → partner review → delivered (+ hold); bilingual.
- **DocumentCard** (`components/data/`) — a document as a clean white card; mono reference, grotesque title, optional cobalt accent rule.
- **Badge** (`components/feedback/`) — compact mono chip for classifications and audit findings; tones + tint/outline/solid.
- **EmptyState** (`components/feedback/`) — composed absence; eyebrow, line, one sentence, one action. No illustration.
- **Toast** (`components/feedback/`) — clean notice with a toned status dot; it states, never celebrates.
- **ScoreDial** (`components/instrument/`) — **the signature object**; the audit score as a drawn cobalt→cyan ring. Hero (`halo`) and small (`flat`) treatments.

### Intentional additions
- **Badge** — not named in the brief's original list; added because classifications and audit findings ("conforme", "3 observaciones", jurisdictions) recur across surfaces and needed a consistent chip distinct from `MatterStatus`.
- **ScoreDial** — added as the brand's signature object once the direction centered on the automated audit; it is what makes a screen unmistakably RU.L.

---

## UI kits

- **`ui_kits/audit/`** — **the flagship.** The Halo conversion landing (eight blocks, price visible, one CTA) → the live SAT/IMPI/RPC instrument → the partner-signed "en orden" result. See its `README.md`.
- **`ui_kits/matter-portal/`** — the client's private expediente: entry → dashboard (with the audit score as hero) → matter detail.

---

## Index — what's in this project

- **`styles.css`** — global entry point (consumers link this one file). `@import` lines only.
- **`tokens/`** — `fonts.css` (webfont `@import`), `colors.css`, `typography.css`, `spacing.css` (spacing, rules, radii, elevation, motion).
- **`components/`** — `forms/` (Button, Input), `data/` (Table, MatterStatus, DocumentCard), `feedback/` (Badge, EmptyState, Toast), `instrument/` (ScoreDial). Each has `.jsx` + `.d.ts` + `.prompt.md` and a `*.card.html` specimen.
- **`guidelines/`** — foundation specimen cards (Colors, Type, Spacing, Brand) shown on the Design System tab.
- **`ui_kits/`** — `audit/` (flagship) and `matter-portal/`.
- **`SKILL.md`** — Agent-Skills manifest for downloading this system into Claude Code.
- **`Explorations.html`, `Look and Feel.html`** — art-direction history (the six early explorations and the three Apple directions). Kept for reference; not part of the shipped system.

---

## ⚠️ Fonts — substitution flag
The display/UI face is **Switzer**, loaded from the Fontshare CDN via `@import` (no local binaries, so no `@font-face` files are bundled). Mono is **IBM Plex Mono** from Google Fonts. Switzer is an excellent, freely-licensed grotesque and is intended as the real face here — but if RU.L licenses a bespoke or commercial grotesque (e.g. a Söhne / Neue Haas Grotesk class family) for production, send the files and I'll wire self-hosted `@font-face` rules. Otherwise the system stands as-is on Switzer.
