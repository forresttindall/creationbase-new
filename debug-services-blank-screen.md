# DEBUG SESSION · services-blank-screen
- Status: **[OPEN]**
- Opened: 2026-09-08
- Symptom: `/services` route renders a blank screen; no content visible. Build passes.
- Reproduction: Navigate to Services from home or enter URL directly.
- Last code change set:
  - App.jsx — removed Our Process + Strategy homepage sections
  - Services.jsx — full rewrite: left vertical nav + DvcpProcessImagePanel + StrategyGrowthGraph migrated

## HYPOTHESES (Falsifiable)
| # | Hypothesis | Prediction | How to verify |
|---|-----------|------------|---------------|
| H1 | `StrategyGrowthGraph` calls React/Framer hooks (useMotionValue, useSpring, useEffect, useState) **inside `useMemo`** callbacks (`progressRefs`, `liftRefs`) → React 18 hard-crash `Rules of Hooks` or `cannot update an unmounted component`. | Browser console contains `Rendered more hooks than during the previous render` or `Invariant Violation` stack pointing at `progressRefs` or `liftRefs` useMemo bodies. | Dev server + browser console, or static code review. |
| H2 | `StrategyGrowthGraph` or `DvcpProcessImagePanel` references `UI_DARK` / `UI_LIGHT` constants imported only from App.jsx but undefined in Services scope → `ReferenceError: UI_DARK is not defined` crashes the tree. | Browser console shows `ReferenceError` with the const name; stack line matches Services.jsx SVG render. | Dev console. |
| H3 | CSS `writingMode: 'vertical-rl'` + `transform: rotate(180deg)` + backdrop-filter on fixed `ServicesVerticalNav` paints a 100% × 100% opaque overlay element that visually hides Services content behind it (z-index 40). | Element picker shows left-nav div fills full screen; setting opacity 0 reveals content. | Browser dev tools Elements panel + computed box model. |
| H4 | `activeCaseStudy === 'services'` route rendering fails because `AnimatePresence`/motion animation key mismatch in App.jsx (removed sections may have shifted the `isMobile` prop calculation). | Home page works fine; only /services path blank. Console mentions `AnimatePresence` children key warning. | Console + route comparison home vs /services. |
| H5 | SVG `id` names still collide with App.jsx legacy `StrategyGrowthGraph` when both are in the module bundle; clipPath / pattern reference cross-contamination → SVG paints nothing or browser throws CSS parse error. | SVG rendered in DOM but `getComputedStyle` shows width/height 0 or filter: url(undefined). | Elements tab → SVG pattern defs resolved URL. |

## LOG EVIDENCE
### Pre-fix (collected from dev server console at /services route)
1. `[error] Warning: Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks... at StrategyGrowthGraph (Services.jsx:247:32)`
2. `[error] Warning: React has detected a change in the order of Hooks called by StrategyGrowthGraph.`
   - Previous render hook #8: `useRef`
   - Next render hook #8: `useMemo`
3. `[error] TypeError: Cannot read properties of undefined (reading 'length')`
   - Source: `areHookInputsEqual` → `updateMemo` → `StrategyGrowthGraph Services.jsx:466:20`
4. Final: `[error] The above error occurred in the <StrategyGrowthGraph> component` → tree unmounted, blank screen.

### Post-fix
- Zero console errors at /services route.
- Full content renders: overview header, process section with DVCP steps, 4 core pillars, growth graph with 3 legend lines + AUDIT/POSITION/DEPLOY/MEASURE, next step CTA.
- Left vertical nav label: `OVERVIEW` → after scroll (900px) correctly changed to `OUR PROCESS`.
- Build: `npm run build` → exit 0 in 11.31s.

## ROOT CAUSE [CONFIRMED: H1]
`StrategyGrowthGraph` component (copied from App.jsx into Services.jsx) contained **Rules of Hooks violations**:
- `useMotionValue`, `useTransform`, `useSpring` (Framer hooks) + `useEffect` + `useRef` were called **inside `useMemo()` callbacks** at Services.jsx L346–458 (`progressRefs` and `liftRefs` useMemo bodies).
- Since these memos iterated over `series.map()`, the actual number of hooks varied per render, causing React's internal hook type map to shift (`useRef` → `useMemo`).
- Under React StrictMode (enabled in main.jsx L7–12), double-invocation of render triggered the hook-mismatch crash → `areHookInputsEqual` tried to read `.length` on undefined deps → FATAL TypeError → entire Services subtree unmounted → **blank screen**.

## FIX
Refactored into a child-per-series pattern:
1. **New `SeriesLine` component** at [Services.jsx L214–L290](file:///Users/forresttindall/Documents/Code%20Local/creationbase-new/src/components/Services.jsx#L214-L290):
   - Returns `null`; sole job is holding per-series hooks at component top level.
   - `useMotionValue`/`useTransform` for `dashOffset`/`endX`/`endY`/`gTransformString`/`endpointScale`/`calloutShow`/`calloutY` — all top-level.
   - `useRef` holds `wpDots` (plain mutable array, no hook inside .map).
   - `liftMv`/`liftSp` at top level, text updated via passed-in `liftRefsByKey` shared-mutable-object.
   - Calls `onReady(bundle)` once per mount to register refs bundle with parent.
2. **Parent `StrategyGrowthGraph` cleanup**:
   - `progressRefs` useMemo → `progressRefsRef` useRef + `handleReady(idx, bundle)`.
   - `liftRefs` useMemo → `liftRefsByKey` pre-populated useMemo (just plain objects, no hooks inside).
   - Renders `<SeriesLine>` × 4 (stable order) as first children inside outer `motion.div`, before any SVG, so hooks register in fixed order before SVG paint.
3. **Ref-read safety**: All 6 JSX call sites that previously dereferenced `progressRefs[idx]` now use `progressRefsRef.current[idx] || fallback` so first paint (before `onReady` runs) can't crash on undefined.

## POST-FIX EVIDENCE
- Browser console: 0 errors (was 4 pre-fix)
- Services page DOM nodes: 54 (was functionally 0 content + 54 header)
- Vertical nav label changes with scroll position: confirmed `OVERVIEW` → `OUR PROCESS` after +900px scroll.
- Build: exit 0 / 11.31s.

