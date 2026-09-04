# Mobile Optimization of New Sections Implementation Plan

## Repository Research

**"New sections" = the 3 recent sections added/rewritten in this session:**
1. **STUDIO SCORE · BUILD SOMETHING PEOPLE ACTUALLY REMEMBER** (Index 02) — 6 AnimatedStatValue KPIs in a grid + 4-pillar journey chips below
2. **OUR PROCESS · DVCP DIGITAL VALUE CREATION PLAN** (Index 02.5 between BRANDING/WEBSITE ↔ SOCIAL) — left rail (DVCP/00), 2-col split (title + DvcpProcessImagePanel 4:3 crossfade image), then 3-col DVCP steps bordered grid
3. **STRATEGY** (Index 07) — StrategyGrowthGraph SVG chart (3 solid lines + 1 baseline, area fills, traveling endpoints + callout pills, legend/channel/Q4-lift table), plus below-graph 2-col split (title + copy + AUDIT/POSITION/DEPLOY/MEASURE 2x2 grid)

**Existing mobile conventions (applied everywhere else):**
- `isMobile` is computed at app root via `window.matchMedia('(max-width: 700px)')` useEffect (App.jsx L1651-L1656) and threaded as a boolean prop to every component that needs responsive branches. **Not** Tailwind sm:/md: classes — all responsive branching is inline ternaries on `isMobile` in style objects.
- All existing sections use: `padding: 'var(--spacing-xxl) var(--spacing-md)'`, `h2 section-title fontSize: 'var(--fs-xl)'`, grid collapses `gridTemplateColumns: isMobile ? '1fr' : '…'`
- `AnimatedStatValue` (Studio Score) already takes `isMobile` prop: switches `minHeight` 150 vs 180, `gridColumn` auto vs span-2 (L810-L811)
- `DvcpProcessImagePanel` already takes `isMobile` prop: switches `aspectRatio` 16/10 vs 4/3 (L886)
- `StrategyGrowthGraph` already takes `isMobile` prop: legend header row `display: none` on mobile, legend row `gridColumn: '1/-1'` single row with `(1fr 86px)` 2-col layout, graph 2-col bottom split `1fr`

**Audit of currently KNOWN mobile issues in the 3 NEW sections (from code inspection / likely failures):**

### Studio Score Section (Index 02)
- `gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, …)'` — 6 stats stacked 1-wide. **Problem #1:** AnimatedStatValue already sets `gridColumn: auto` on isMobile (L810), so stacking is OK. But the **stat numerical font sizes** use `clamp(28px, 5vw, 64px)` and `clamp(36px, 6vw, 84px)` — on a 390px iPhone, this is `28 / 30` which is good, BUT `padding: clamp(18px, 3vw, 28px)` + `gap: 'var(--spacing-md)'` + `minHeight: 150` per card × 6 = 6×150+spacing = **~1100px of card scrolling** on mobile. Combined with 6-wide desktop grid border-accumulation of 6 borders per side on 1-col — very tall. **Fix**: reduce to `2-col on mobile` (3 rows of 2 stats) instead of 1-col to halve vertical height. That still uses existing isMobile prop but changes `gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, …)'` AND AnimatedStatValue `gridColumn` on isMobile should stay `'auto'` (default) for 2-wide flow.
- **4-pillar chips (STRATEGY → BRANDING → WEBSITE → SOCIAL)** at L2567-L2612: `display: inline-flex` wrapped pill chips with 10px gap, 10-12 padding, 999 radius. On 320px iPhone SE: 4 chips × ~90px + arrows = ~400px, breaks to 2 rows which is fine, BUT `gap: 10px` with `justifyContent: space-between` means if they wrap 3+1, the single last chip will stretch. Fix: mobile `justifyContent: 'flex-start'` and smaller padding (8px 10px).
- Section header title linebreak: already uses `<br className="md:block" style={{display: isMobile?'none':'block'}}>` so mobile is single line — good.

### OUR PROCESS Section (Index 02.5)
- **Top strip (L3007-L3055):** `gridTemplateColumns: isMobile ? '1fr' : (0.24fr 1fr)`. Good collapse. Inner split is `isMobile ? '1fr' : '1.1fr 0.9fr'` — so mobile stacks title THEN image. Good.
- **Problem #2 - title fontSize:** `fontSize: 'clamp(26px, 5vw, 68px)'` — on 320px wide: 5vw = 16px → clamp gives 26px. OK. But `maxWidth: '12ch'` with 5vw/26px = ~340px wide, which on 320px spills horizontally. Fix: mobile `maxWidth: '100%'`.
- **Problem #3 - Image:** DvcpProcessImagePanel mobile uses 16/10 aspectRatio (wider than 4/3) — good. But on 320px mobile, left rail `paddingTop: 4px` + `opacity: 0.72` "DVCP / 00" with label, then image at full 1-col width. Image width matches container — OK.
- **DVCP steps (L3057-L3127):** 3-col desktop collapses to `1fr` on mobile (L3061). Good. But each card `minHeight: 160` × 3 = 480px of steps. Padding `'var(--spacing-md)'` inside. On iPhone: OK vertical, BUT `h3 title fontSize: 'clamp(17px, 2.2vw, 26px)'` — on 320px, 2.2vw=7.04px → clamp lower bound 17px, fine. But the step `p description`: `fontSize: 'calc(var(--fs-sm) - 1px)'` `maxWidth: 340` — on mobile 320px inside card after md padding, 340 maxWidth is wider than container causing horizontal scroll. Fix: mobile `maxWidth: '100%'`.

### STRATEGY Section (Index 07) — BIGGEST MOBILE FAILURES LIKELY HERE
- **StrategyGrowthGraph SVG (`W=640, H=360` viewBox):** `svg style={{width:'100%', height:'auto'}}` so it scales width with container. **Problem #4 - cramped axes on mobile:** PL=48 (left padding for y-axis labels "330, 282, 234, 186, 138, 90") + PR=20 (right). On 320px iPhone, SVG width is ~288px (container minus spacing-md), so after PL 48 + PR 20, actual inner plotting area is `220px × ~115px`. Y-axis label "330" is 28px wide, X labels at bottom are "Q0 Q1 Q2 Q3 Q4" (5 quarter labels). With 220px inner width: quarter spacing = 55px, labels fit. But:
  - **Traveling endpoint callout pill (L1463-L1487):** rect `x=-42 y=-32 width=64 height=20`, text at x=-34 y=-18. If callout is at x=570 in 640-viewBox, it clips past the right edge of the viewBox (pill width 64 starting x=-42 from endpoint → rightmost pill would extend to 570-42+64=592, which is < 640, OK). But SVG scales down by ~0.45× on mobile so everything shrinks proportionally — OK.
  - **Endpoint r=4.5 ring, r=2.8 inner:** on ~220px inner width scaled SVG, 4.5 / 0.45 ≈ 10 dots visual size. OK.
  - **Problem #5: Axis fonts & ticks** y-axis labels font (L1243) `text anchor="end"` x=PL-10. fontSize via class small-text? Let me read L1242-1260 — actually I need to check those. Fix by: mobile override: reduce PL (48 → 36), PT (22 → 14), PB (48 → 34), H (360 → 320) OR isMobile responsive versions of PL/PT/PB/H so axes fit.
- **Graph legend row (L1495-L1603):** Already `gridTemplateColumns: isMobile ? 'minmax(0, 1fr) 86px' : 'repeat(3, 1fr)'`. But each row has `svg line (28x10) + small-text (series index) + channel name + lift`. With 2-col on mobile (1fr + 86px): col 1 = svg+index+label, col 2 = aligned-right lift 86px. On 320px: col1=320−spacing-md×2 (inner ~288) − 86 = 202px. Inside: 28 svg + 10 gap + small-text "01" + label "WEBSITE" = all fits 202px. OK.
- **Below-graph copy (L3204-L3267):** `gridTemplateColumns: isMobile ? '1fr' : '0.95fr 1.05fr'` — stacks title above copy. Good. But title `fontSize: 'clamp(34px, 5.6vw, 84px)'` on 320px: clamp 34 / 17.9vw → 34. Big but fine (3 rows on mobile). `AUDIT/POSITION/DEPLOY/MEASURE 2x2 grid (L3244)`: `gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'`. On 320px wide: 2 cols × ~140px each, description text "Brand, website, and stack scored..." ~90 chars. Breaks to many lines — OK vertical, just longer.
- **Problem #6: 2x2 cards (L3244) inside already single-col stacked layout** on mobile — every AUDIT card has `paddingTop: 14px + borderTop`. On narrow screens (< 375), the 2-col text wraps making the 4 cards very tall. Fix: isMobile → switch `gridTemplateColumns: '1fr'` (stack 4 rows of 1) so description text width doubles and height per-card halves, overall same or less vertical but more readable; OR keep 2x2 and only shrink descriptions. Choice: make it 1-wide stacked on mobile for readability (since the title already pushes the entire below-graph section onto 1 col anyway).

## Files and Modules
- **[App.jsx](file:///Users/forresttindall/Documents/Code%20Local/creationbase-new/src/App.jsx)** — All edits in one file (all 3 sections + 3 components inline in this file). Sub-blocks:
  - L754-L854: `AnimatedStatValue` — modify gridColumn/minHeight for 2-col mobile layout
  - L939-L1607: `StrategyGrowthGraph` — add isMobile branching for viewBox W/H/PL/PT/PB, SVG axis font-size, pill callout x-offset shift so rightmost pill doesn't clip on very narrow widths
  - L2510-L2614: STUDIO SCORE section body — grid `'repeat(2,minmax(0,1fr))'` on mobile; chip justify/flex
  - L2984-L3129: OUR PROCESS section body — title/description maxWidth, step description mobile overrides; (optionally) top strip label `DVCP / 00` grid on mobile stacks `label then title+image` keeping label visible instead of inline left rail
  - L3193-L3269: STRATEGY section body — AUDIT/POSITION/DEPLOY/MEASURE 2x2 → 1x4 on mobile

## Implementation Steps
1. **Studio Score grid 1→2 col on mobile + chips polish**
   - Score stats grid (L2522-L2540): `isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(6, minmax(0, 1fr))'`
   - AnimatedStatValue L810-L811: `minHeight: isMobile ? 130 : 180`; `padding: isMobile ? '16px 14px' : 'clamp(18px, 3vw, 28px)'`; label font smaller? keep existing.
   - Stat numeric L798-L800: mobile `len` clamp lower bounds reduced by 4px so 2-col 130-height cards fit 2 rows of big number + label per card (actually current clamp is fine, height is problem)
   - 4-pillar chip group L2551-L2612: `justifyContent: isMobile ? 'flex-start' : 'space-between'`; pill `padding: isMobile ? '8px 10px' : '10px 12px'`; chip arrow size 11px constant (keep)
2. **OUR PROCESS section fixes**
   - Title L3036-L3049: add `maxWidth: isMobile ? '100%' : '12ch'`
   - Step description p L3110-L3122: add `maxWidth: isMobile ? '100%' : '340px'`
   - Top row L3012 left rail: already `gridTemplateColumns: isMobile ? '1fr' : 'minmax(100px, 0.24fr) minmax(0, 1fr)'` — label+content stacked on mobile = OK; but L3017-L3025 `DVCP / 00` div: add `paddingBottom: isMobile ? '2px' : 0`; mobile `letterSpacing` keep
   - Image panel (DvcpProcessImagePanel L856): already aspectRatio 16/10 on mobile. Add: mobile border-radius 10 vs 14? Keep 14.
3. **Strategy Growth Graph mobile responsive inner layout**
   - Graph W/H/PL/PT/PB: compute via isMobile at top (L949-L956): `const VW = isMobile ? 480 : 640`, `const VH = isMobile ? 300 : 360`; PL=36/48, PR=16/20, PT=14/22, PB=34/48 → all smaller so 320px scaled iPhone has ~(300 wide container - 36-16) ~248px inner width for 4 quarters + headroom
   - Graph callout pill rect L1466-L1475: on mobile shift rect so it hangs LEFT of endpoint at right-edge positions (or reduce rect width): `const cw = isMobile ? 56 : 64; const cx = isMobile ? -52 : -42; ch = 18; cy = -30` — smaller pill
   - Pill text L1476-L1485: `fontSize: isMobile ? 9 : 10`
   - Axis ticks (L1236-L1280): y-axis label fontSize? Read first, set `fontSize: isMobile ? 11 : 13`. Same for x-axis Q labels.
4. **Strategy below-graph AUDIT 2x2 → 1x4 on mobile**
   - L3244 `gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))'`
   - Copy block paragraph: already lineHeight 1.55, maxWidth 620. Mobile: keep.
5. **Run `npm run build`** → fix any issues from above changes (hooks-in-render / jsx / style prop shapes)

## Dependencies and Considerations
- **Hook order rule:** StrategyGrowthGraph has a stable hooks-upfront block of 4 series. Never change the number of useTransforms/useState calls inside render conditionally based on `isMobile` (isMobile will flip later via resize, so hooks must always be equal count, which they are since W/H/PL/PT/PB are just consts at top). ✓
- **AnimatedStatValue hooks-in-render:** 6 STATS → 6 × AnimatedStatValue instance mounted count stays same whether desktop or mobile; isMobile is a prop so no conditional hooks inside AnimatedStatValue (and none exist currently). ✓
- **Strict-mode double invoke:** all useEffect cleanup with `clearTimeout` / `clearInterval` + startedRef already exists for graph; nothing new adds effects. ✓
- **Existing mobile breakpoint 700px:** everything uses `matchMedia('(max-width: 700px)')` at root — so all "isMobile" branches kick in below 700 (covers 320 SE to 690 iPad mini landscape). Good.
- **`--content-max-w`:** all 3 section headers are inside `<div style={{width:'100%', maxWidth:'var(--content-max-w)', margin:'0 auto'}}>` so outer horizontal padding stays correct on mobile via var(--spacing-md); won't overflow.

## Validation
1. `npm run build` exit 0.
2. Browser navigate + resize (DevTools-like) via mobile width 320 × 568 (iPhone SE) then 390 × 844 (iPhone 15):
   - Studio Score: 6 stats render as 2 columns × 3 rows; no card height overflow; chips wrap neatly.
   - OUR PROCESS: title text wraps inside 100% max-width; no horizontal scroll on 320px screen (step description always inside card); image shows full 16:10; 3 steps stacked vertical readable.
   - STRATEGY: SVG axes & ticks fit inside viewport without label clip at left edge; endpoint pill always visible even when endpoint at far Q4 rightmost position; AUDIT/POSITION/DEPLOY/MEASURE stacked 1×4 with full-width descriptions readable.
3. Quick horizontal scroll check: scrollWidth ≤ clientWidth on body at 320px for all 3 sections.
4. (No manual tests — project's test setup? Checked earlier: no test script in package.json.)

## Risks
- **Risk:** Reducing graph viewbox too aggressively makes lines thin and endpoint unseeable at 0.45× scale. → Mitigation: keep stroke widths at 2.6–3.2 (they scale proportionally with SVG, so they look fine).
- **Risk:** Making Studio Score 2-col on mobile reduces width per card so the "+147%" or "3.1×" value wraps. → Mitigation: keep current clamp font size; if 2-col is too narrow, fall back to `'repeat(1, minmax(0, 1fr))'` but reduce card min-height so 6 cards don't exceed ~900px vertical.
- **Risk:** Moving graph callout pill rect cx/cw values too far left causes overlap with line endpoint or counter — mid draw. → Mitigation: only shrink width by 8 and shift left 10; visually verify.
- **Risk:** Resize from desktop → mobile while graph section is in view. → Mitigation: all components accept isMobile prop at root; isMobile updates from the single matchMedia change listener at App root, which re-renders children with new isMobile branch values. Hooks count stable, so no error on resize — layout just reflows.
