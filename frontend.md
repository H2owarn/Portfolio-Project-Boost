# Front-End Guide

Current screens run against static data so you can showcase or iterate on the UI before backend integration.

## Prerequisites
- Bun ≥ 1.1 (installs workspace deps)
- Expo CLI tooling (installed via `bun install`)
- An emulator or the Expo Go app on a physical device

## Install & Launch
1. From the repo root run `bun install` once.
2. Start the Expo dev server:
   ```sh
   cd apps/boost
   bun start
   ```
3. Scan the QR code with Expo Go or press `i`, `a`, or `w` for iOS, Android, or web preview.

The bundle ships only mocked views—no network requests or Supabase auth are required.

## Navigation Map
- **Welcome → Auth**: `Get Started` opens the login screen; the `Sign up` link steps through the multi-screen onboarding flow (name, birthday, height, weight). Buttons continue to the next mock screen and eventually drop into the tab navigator.
- **Tabs**: `Challenge`, `Daily`, `Activity`, and `Profile` correspond to the designs in `demo_design/`. Each tab is self-contained and safe to explore without credentials.
- **Profile & Settings**: The profile tab links to the public profile view and the `Settings` stack screen; both reuse the shared button/input components.
- **Workout Flow**: From the `Challenge` tab tap `Start Workout` to walk through the workout overview, in-progress counter, and completion trophy screens.

## Customizing the Look
- Palette, spacing, and radii live in `apps/boost/constants/theme.ts`. Adjust `primary`, `background`, or spacing tokens to reskin the full demo quickly.
- Shared primitives (`BoostButton`, `BoostInput`, `Screen`) sit under `apps/boost/components/` and should be reused for any additional mock screens.
- The original HTML mockups remain in `demo_design/` if you need to compare or hand off to design stakeholders.

## Tips While API Work Is Pending
- Stick with dark mode for parity with the mockups; the app adapts automatically to the system scheme but is tuned for dark backgrounds.
- If you change copy or imagery, restart Expo (or press `r`) to ensure assets reload.
- All flows are static right now—no validation or API calls—so you can tap through freely during reviews.
