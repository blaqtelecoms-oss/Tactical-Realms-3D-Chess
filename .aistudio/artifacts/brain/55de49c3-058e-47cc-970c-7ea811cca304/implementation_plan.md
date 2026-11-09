# Implementation Plan: Mobile Optimization & Automatic Screen Rotation

Customize Tactical Realms: 3D Chess for small mobile screens with automatic landscape orientation management and compact, touch-optimized layouts.

## User Decisions
- **Orientation Strategy**: Fullscreen landscape request with an animated rotate-device hint overlay in portrait mode, automatically locking to landscape when allowed by the browser.
- **Mobile Card Layout**: Streamlined compact cards with horizontal swipeable carousel snapping and large 44px+ touch targets on smaller screens.

---

## 1. Screen Orientation & Fullscreen Manager
- **Orientation Detection & Auto-Lock**:
  - Implement a mobile orientation manager (`useMobileOrientation` hook or helper) that triggers `screen.orientation?.lock?.('landscape')` or `screen.orientation?.lock?.('landscape-primary')` both on launch and upon user interaction (such as tapping "New Game", "Continue", or "Rotate to Landscape").
  - Provide a "Rotate to Landscape" interactive button for iOS Safari / browsers requiring explicit user action for fullscreen / orientation lock.
- **Animated Portrait Hint Overlay**:
  - Show a sleek, non-intrusive animated device rotation prompt (`.orientation-guard-overlay`) whenever a phone is detected in portrait mode (`window.innerHeight > window.innerWidth` and width < 768px).
  - Includes a golden rotating device icon animation, a one-tap "Rotate & Go Fullscreen" action button, and an option to "Dismiss & Play in Portrait" if the user insists.

---

## 2. Small-Screen (< 480px) Layout Adaptations
- **Horizontal Swipeable Snap Carousel**:
  - Style `.home-realms-grid` and `.home-pillars-grid` on small mobile screens to use CSS scroll snap (`scroll-snap-type: x mandatory; overflow-x: auto; -webkit-overflow-scrolling: touch; display: flex;`).
  - Provide pagination dots or scroll indicators so mobile players can seamlessly swipe between Imperial Rome, Gothic Cathedral, and Cyberpunk Sanctum cards.
- **Touch Targets & Typography Scaling**:
  - Ensure all interactive buttons (CTA buttons, header icon buttons, realm selectors) maintain a minimum 44px height and padding.
  - Scale down hero headline clamping (`clamp(1.8rem, 6.5vw, 3rem)`) to prevent awkward word wraps on narrow screens.
  - Compact header padding on small viewports so the board and content occupy maximum screen estate.

---

## 3. In-Game 3D Viewport & Mobile Controls
- **Dynamic Camera Aspect & FOV**:
  - Ensure Three.js camera projection adjusts cleanly when switching between portrait and landscape without clipping outer board squares.
- **Mobile Controls Sheet & Quick Actions**:
  - Ensure the mobile bottom controls sheet (`#hud-right.mobile-sheet-open`) has smooth swipe-to-dismiss handles and compact icon rows.
  - Keep `btn-side-toggle`, `btn-ai-move`, `btn-cam-player`, `btn-cam-top`, `btn-cam-side`, `btn-cam-wide`, `btn-hide-ui`, and `btn-reset` fully accessible to maintain 100% test passing against `test/applet.test.mjs`.

---

## Verification Plan
1. **Automated Testing**:
   - Run `node --test test/applet.test.mjs` to ensure HUD control invariants remain satisfied.
   - Run `compile_applet` and `lint_applet` together to verify 0 TypeScript and linter errors.
2. **Mobile Simulation & Responsiveness**:
   - Verify layout in mobile portrait (375x667, 390x844, 412x915) and mobile landscape (667x375, 844x390, 915x412).
   - Verify animated rotation overlay appears in portrait and smoothly dismisses in landscape.
