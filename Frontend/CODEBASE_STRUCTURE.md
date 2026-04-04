# Motiongrind Codebase Structure

This document explains what is happening in the app at runtime and how the code is organized.

## 1) Runtime Flow (What happens when app starts)

1. `src/main.tsx` bootstraps React and wraps the app with:
   - `BrowserRouter` for routing
   - `SidebarCollapseProvider` for sidebar open/collapse state
   - `ThemeProvider` for light/dark/system theme
   - `LanguageProvider` for i18n (`en`, `zh`)
   - `Toaster` for toast notifications
2. `src/App.tsx` wraps routes with:
   - `AuthProvider` from `src/routes/RouteContext.ts`
   - `Layout` from `src/templates/Layout.tsx`
3. `src/routes/RootRoute.tsx` checks `useAuth().state.hasSession`:
   - `true` -> protected app routes (`/new-dashboard`, `/users`, `/dealerships`, etc.)
   - `false` -> session routes (`/login`, `/forgot-password`, `/reset-password/:resetHash`, `/invite/:inviteToken`)

## 2) Authentication and Session

- Auth gate:
  - `src/routes/RouteContext.ts` sets `hasSession` from `localStorage.access_token`.
  - `LOGOUT` clears local storage and redirects to `/login`.
- Login and session actions:
  - `src/pages/sessions/sessionContext.ts` handles login/forgot/reset/create flows.
  - Login writes `access_token`, `refresh_token`, `user`, `userId` into local storage, then redirects to `/new-dashboard`.

## 3) Routing and Layout Layers

- Top-level route split:
  - `src/routes/RootRoute.tsx`
- Protected shell:
  - `src/templates/ProtectedLayout.tsx`
  - Renders sidebar + top bar + `children`.
  - Computes role/dealer details and writes role/dealer data into local storage.
- Navigation:
  - `src/components/sidebar.tsx` uses role-aware links from `src/data/sidelinks.tsx`.
  - `src/components/nav.tsx` handles expanded/collapsed desktop and mobile navigation patterns.
- Page shell:
  - Most pages use `src/templates/PageLayout.tsx` for title, subtitle, right actions.

## 4) Folder-by-Folder Structure

- `src/pages`
  - Domain features (dashboard, dealers, dealerships, users, roles, profile, booking, etc.).
  - Typical pattern per domain:
    - `*Layout.tsx` -> route container
    - `*Context.ts(x)` -> data/state/actions
    - list/detail/forms -> UI for the domain
- `src/components`
  - Reusable UI and app shell components (sidebar, nav, theme/language switch, loaders, table wrappers).
  - `src/components/ui` includes primitives and wrappers used across modules.
- `src/templates`
  - Cross-cutting page/app layouts and structural wrappers.
- `src/services`
  - Infrastructure:
    - `APIService` (`src/services/api/request.ts`)
    - response/error handling (`src/services/api/response.ts`)
    - storage helpers (`localstorage.storage.ts`, `session.storage.ts`, `cookie.storage.ts`)
    - generic context factory (`context.container.tsx`)
- `src/hooks`
  - Shared hooks (`useSearchQuery`, `useDebounce`, `use-check-active-nav`, etc.).
- `src/data`
  - Static/domain config like sidebar link definitions.
- `src/types`
  - TypeScript interfaces for API/domain models.
- `src/translations`
  - i18n message bundles (`en.json`, `zh.json`) + export map.
- `src/utils`
  - Generic helpers (date formatting, URL/download helpers, permissions, etc.).
- `src/assets`
  - Images, icons, and CSS assets.

## 5) State Management Pattern

The project uses React Context + `useReducer` (not Redux).

- Shared helper:
  - `ContextContainer` from `src/services/context.container.tsx`
- Domain contexts:
  - Example: `src/pages/users/usersContext.ts`
  - Structure:
    - local reducer state
    - async action methods (`getAll`, `createOne`, `updateOne`, etc.)
    - toast-based success/error UX
    - exposed via `Provider` and `useContext` hook

This same pattern appears across dealers, dealerships, roles, dashboard, profile, booking, etc.

## 6) API and Data Fetching Pattern

- Primary API wrapper:
  - `APIService` in `src/services/api/request.ts`
  - Adds `Authorization: Bearer <access_token>` automatically when available.
  - Exposes `get/post/put/patch/delete/upload`.
- Error handling:
  - `src/services/api/response.ts`
  - Handles 401 by clearing storage and forcing `/login`.
  - Maps server errors to toast-friendly messages.
- Query string handling:
  - `src/hooks/useSearchQuery.tsx` keeps URL query and in-page filter state synchronized.
  - `src/hooks/useDebounce.tsx` delays search updates to reduce API calls.

## 7) UI/UX Stack

- Core framework: React 18 + TypeScript + Vite
- Routing: `react-router-dom`
- Styling: Tailwind CSS + Chakra UI (mixed usage)
- Forms/validation: `react-hook-form` + `zod`
- Data tables: AG Grid wrapper (`src/components/ui/DataTable.tsx`)
- i18n: `use-intl` via `LanguageProvider`
- Notifications: custom toaster (`src/components/ui/use-toast`)

## 8) Environment Variables Used in Code

Commonly referenced:

- `VITE_API_ENDPOINT` (primary backend base URL)
- `VITE_STATIC_ENDPOINT` (asset/static file base URL)
- `VITE_CUSTOMER_ID` (role filter for customer routes/queries)

## 9) Request-to-Render Example (Users page)

1. Route `/users/*` enters `src/pages/users/UsersLayout.tsx`.
2. `UserProvider` is mounted from `src/pages/users/usersContext.ts`.
3. `UserList.tsx` reads URL query via `useSearchQuery`.
4. Search/filter changes update URL query.
5. Query change triggers `getAll(query)` from context.
6. Context calls `APIService.get('/users?...')`.
7. Reducer stores result in `state.list`.
8. `UserList.tsx` renders rows through `DataTable`.

## 10) Conventions to Follow When Adding a New Feature

1. Add domain folder in `src/pages/<feature>`.
2. Create:
   - `<Feature>Context.ts(x)` for API/state/actions
   - `<Feature>Layout.tsx` for route container
   - page components for list/form/detail
3. Add route in `src/routes/RootRoute.tsx`.
4. Add sidebar link in `src/data/sidelinks.tsx` if needed.
5. Use `APIService` for backend calls and `use-toast` for feedback.
6. Keep filters/search in URL with `useSearchQuery`.
7. Add/update interfaces in `src/types`.

## 11) Important Notes

- There is mixed direct `fetch/axios` usage in some components, while contexts mostly use `APIService`. For consistency, centralizing calls via contexts + `APIService` is better.
- Some role/dealer fetch logic is duplicated between `src/components/sidebar.tsx` and `src/templates/ProtectedLayout.tsx`.
- `src/pages` contains many domains; each is mostly self-contained, so onboarding is easiest by following one domain end-to-end (for example `users`).

