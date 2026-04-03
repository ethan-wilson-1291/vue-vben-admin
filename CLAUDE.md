# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is a **pnpm monorepo** using Turbo. Requires Node >=20.12.0 and pnpm >=10.0.0.

### Primary app (web-np)

```bash
pnpm dev:np          # Start web-np dev server
pnpm build:np        # Production build
pnpm build:np:uat    # UAT build
```

### Other apps

```bash
pnpm dev:np-admin    # Admin app
pnpm dev:antd        # Ant Design variant
pnpm dev:play        # Component playground
```

### Quality checks

```bash
pnpm lint            # Lint all files
pnpm format          # Format code
pnpm check:type      # TypeScript type-check all packages (via Turbo)
pnpm test:unit       # Vitest unit tests (run with --dom flag)
pnpm test:e2e        # Playwright E2E tests
```

### Workspace maintenance

```bash
pnpm install         # Install all workspace deps (runs stub postinstall)
pnpm clean           # Clean build artifacts
pnpm reinstall       # Clean lock file + reinstall
```

To run a command scoped to a single package: `pnpm -F @vben/web-np-app run <script>`

## Architecture

### Monorepo layout

The active product lives in `apps/web-np` (`@vben/web-np-app`). The other `apps/web-*` variants (antd, ele, naive, tdesign) are upstream Vben framework demos and are not actively developed. `apps/web-np-admin` is the internal admin dashboard. `apps/backend-mock` is a Nitro mock API server used in development.

Shared code lives under `packages/`:

- `packages/@core/` — Base UI components, composables, layout, form, preferences system
- `packages/stores/` — Shared Pinia stores (auth, access, user)
- `packages/constants/`, `packages/types/`, `packages/utils/` — Cross-app utilities
- `internal/` — Build tool configs (Vite, TypeScript, Tailwind, ESLint/Stylelint)

### web-np application

`apps/web-np` is a **Shopify-embedded** profit analytics dashboard built on Vue Vben Admin 5.0.

**Bootstrap flow:** `main.ts` → `initApplication()` (sets namespace preferences) → `bootstrap.ts` (registers i18n, Pinia, router, directives) → `app.vue`

**API layer** (`src/api/`): All requests go through `requestClient` defined in `src/api/request.ts`. It attaches `Authorization: Bearer <token>` and `Accept-Language` headers, handles token refresh, and unwraps the `{ code, data }` envelope (success when `code === 0`). Domain modules (`shop.ts`, `order.ts`, `product.ts`, `ads.ts`, etc.) use `requestClient` directly and are re-exported from `src/api/index.ts`.

**Router** (`src/router/`): Hash-based routing by default. Two guards in `guard.ts`:

1. `setupCommonGuard` — progress bar lifecycle
2. `setupAccessGuard` — checks `accessToken`, redirects to login if missing; on first authenticated visit generates dynamic routes via `generateAccess()` based on user roles; redirects to `/onboard` if `shopStore.isOnboarding` is true

**Stores** (`src/store/`):

- `useShopStore` (`np-shop`) — Core shop data, sync states, Pusher WebSocket connection. Initializes a `private-shop_id-{id}` Pusher channel on `setStates()`. The `isFreeSubscription` getter controls paywall behavior across the UI.
- `useShopSettingStore` — Shop configuration (COGS source, fee settings)
- `useCurrencyStore` — Exchange rates, `getRate(from, to)` helper
- `useSystemStatisticStore` — Order calculation state machine

**Real-time notifications:** `useShopStore.initPusher()` subscribes to `private-shop_id-{shopId}` and listens for `broadcast_notification_event`. Payloads of type `OrderCalculatedNotification` update `systemStatisticStore`; payloads with `showAlert: true` render Ant Design Vue `notification` components.

**Subscription gating:** `shopStore.isFreeSubscription` returns `true` when the shop is on the free plan AND the 14-day trial has expired. Components use this to apply blur overlays and disable interactions. `SubscriptionPlans` enum has `FREE` and `PRO` values; `DefaultRoutes` enum has `HOME = '/dashboard'`, `ONBOARD = '/onboard'`, `PRICING = '/pricing'`.

**Shopify integration:** `redirectToPricing()` and `redirectToAdmin()` on `useShopStore` navigate to Shopify Admin URLs using `VITE_GLOB_SHOPIFY_APP_HANDLE` env var. External navigation uses `redirectToExternal()` from `src/shared/utils` to work inside the Shopify App Bridge iframe.

**Path alias:** `#/` maps to `src/` (configured in `tsconfig.json`).
