# Coding Standards & Agent Instructions

> **Audience:** LLM coding agents (Copilot, Cursor, Cline, etc.)
> This document defines the conventions, patterns, and rules that MUST be followed when generating or modifying code in this project.

---

## 1. Project Overview

**LinkShortner** — a URL shortening web application.

| Concern           | Technology                                                     |
| ----------------- | -------------------------------------------------------------- |
| Framework         | Next.js 16 (App Router, React 19)                              |
| Language          | TypeScript 5 (strict mode)                                     |
| Styling           | Tailwind CSS v4 via `@tailwindcss/postcss`                     |
| Component Library | shadcn/ui (new-york style) + Radix UI primitives               |
| Icons             | Lucide React (`lucide-react`)                                  |
| Database          | PostgreSQL — Neon serverless (`@neondatabase/serverless`)      |
| ORM               | Drizzle ORM (`drizzle-orm` / `drizzle-kit`)                    |
| Authentication    | Clerk (`@clerk/nextjs`)                                        |
| Animations        | `tw-animate-css`                                               |
| Fonts             | Geist Sans & Geist Mono (via `next/font/google`)               |
| Linting           | ESLint 9 — `eslint-config-next` (core-web-vitals + typescript) |

---

## 2. Directory Structure

```
linkshortnerapp/
├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   ├── globals.css       # Global styles, Tailwind imports, CSS variables
│   ├── layout.tsx        # Root layout (ClerkProvider, fonts, header)
│   └── page.tsx          # Home page
├── components/           # Reusable React components
│   └── ui/               # shadcn/ui primitives (auto-generated)
├── db/                   # Database layer
│   ├── index.ts          # Drizzle client instance
│   └── schema.ts         # Drizzle table schemas
├── docs/                 # Documentation & agent instructions
├── drizzle/              # Generated Drizzle migrations (do NOT edit manually)
├── hooks/                # Custom React hooks
├── lib/                  # Shared utilities and helpers
│   └── utils.ts          # `cn()` helper (clsx + tailwind-merge)
├── public/               # Static assets
├── drizzle.config.ts     # Drizzle Kit configuration
├── proxy.ts              # Clerk middleware
├── next.config.ts        # Next.js configuration
├── components.json       # shadcn/ui configuration
├── tsconfig.json         # TypeScript configuration
└── package.json
```

### Rules

- **Route files** (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`) live inside `app/` using file-system routing.
- **API routes** go in `app/api/<name>/route.ts` and export named HTTP method handlers (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- **Server Actions** should be defined in dedicated files with the `"use server"` directive at the top, placed alongside the feature they serve or in a shared `actions/` directory.
- **Components** go in `components/`. Never place custom components inside `components/ui/` — that directory is reserved for shadcn/ui generated components.
- **Hooks** go in `hooks/`.
- **Utility functions** go in `lib/`.
- **Database schemas** go in `db/schema.ts`. The Drizzle client is instantiated in `db/index.ts`.

---

## 3. TypeScript Conventions

### General

- **Always use TypeScript** (`.ts` / `.tsx`). Never use plain JavaScript files.
- **Strict mode is enabled.** All code must pass `strict: true` without `@ts-ignore` or `@ts-expect-error` unless absolutely necessary (and commented why).
- Prefer `type` over `interface` for object shapes unless extending is needed.
- Use explicit return types on exported functions and public APIs.
- Use `const` by default; use `let` only when reassignment is required. Never use `var`.
- Destructure props and function parameters where it improves readability.

### Naming

| Entity                   | Convention                      | Example                            |
| ------------------------ | ------------------------------- | ---------------------------------- |
| Files (components)       | kebab-case or PascalCase `.tsx` | `link-card.tsx` or `LinkCard.tsx`  |
| Files (utilities, hooks) | camelCase `.ts`                 | `useLinks.ts`, `utils.ts`          |
| React components         | PascalCase                      | `LinkCard`, `DashboardLayout`      |
| Functions / variables    | camelCase                       | `createShortLink`, `isExpired`     |
| Constants                | UPPER_SNAKE_CASE                | `MAX_URL_LENGTH`                   |
| Types / Interfaces       | PascalCase                      | `LinkRecord`, `CreateLinkInput`    |
| Database tables          | snake_case (plural)             | `links`, `click_events`            |
| Database columns         | snake_case                      | `short_code`, `created_at`         |
| Environment variables    | UPPER_SNAKE_CASE                | `DATABASE_URL`, `CLERK_SECRET_KEY` |

### Imports

- Use the `@/*` path alias for all internal imports (mapped to project root).
  ```ts
  import { db } from "@/db";
  import { cn } from "@/lib/utils";
  import { Button } from "@/components/ui/button";
  ```
- Group imports in this order, separated by blank lines:
  1. React / Next.js built-ins
  2. Third-party libraries
  3. Internal aliases (`@/...`)
  4. Relative imports (avoid when possible — prefer aliases)
- Do not use default exports except where required by Next.js conventions (`page.tsx`, `layout.tsx`, `route.ts`, config files).

---

## 4. React & Next.js Patterns

### Server vs Client Components

- **Default to Server Components.** Only add `"use client"` when the component requires browser APIs, event handlers, hooks (`useState`, `useEffect`, etc.), or interactivity.
- Keep client components as small and leaf-level as possible. Extract interactive pieces into their own `"use client"` components and import them into server components.
- Never import server-only code (database queries, secrets) into client components.

### Data Fetching

- Fetch data in Server Components using `async` component functions or Server Actions.
- Use Server Actions (`"use server"`) for mutations (form submissions, data writes).
- For client-side data fetching (when necessary), prefer React 19 patterns (`use()`, `Suspense`).
- Always validate and sanitize user input on the server side.

### Components

- Use function declarations for components (not arrow functions assigned to const):

  ```tsx
  // Preferred
  export default function LinkCard({ link }: LinkCardProps) { ... }

  // Avoid
  const LinkCard = ({ link }: LinkCardProps) => { ... };
  ```

- Co-locate component types at the top of the file:
  ```tsx
  type LinkCardProps = {
    link: LinkRecord;
    onDelete?: (id: string) => void;
  };
  ```
- Use the `cn()` utility from `@/lib/utils` to conditionally merge Tailwind classes.

### Error Handling

- Use `error.tsx` boundary files for route-level error handling.
- Use `loading.tsx` or React `<Suspense>` for loading states.
- In Server Actions and API routes, return structured error responses — never throw unhandled errors.
- Validate environment variables at startup (see existing pattern in `db/index.ts` and `drizzle.config.ts`).

---

## 5. Styling

### Tailwind CSS v4

- This project uses **Tailwind CSS v4** with `@tailwindcss/postcss`. There is no `tailwind.config.js` file — configuration is done via CSS (`globals.css`) using `@theme` and CSS custom properties.
- **Do NOT create a `tailwind.config.js` or `tailwind.config.ts`** file. All theme customizations go in `app/globals.css`.
- Utility classes are applied directly in JSX via `className`.
- Use the `cn()` helper for conditional/dynamic classes:
  ```tsx
  <div
    className={cn(
      "px-4 py-2",
      isActive && "bg-primary text-primary-foreground",
    )}
  />
  ```

### Dark Mode

- Dark mode uses the **class strategy** (`.dark` class on ancestor).
- Use Tailwind's `dark:` variant for dark-mode styles.
- Reference semantic design tokens (e.g. `bg-background`, `text-foreground`, `bg-card`) instead of raw colors whenever possible.

### shadcn/ui

- Use the **new-york** style variant (configured in `components.json`).
- Add new shadcn/ui components via the CLI: `npx shadcn@latest add <component>`.
- Never manually edit files in `components/ui/`. If customization is needed, wrap or compose in a new component in `components/`.
- shadcn/ui component aliases:
  - Components: `@/components`
  - UI primitives: `@/components/ui`
  - Utils: `@/lib/utils`
  - Hooks: `@/hooks`

### CSS Variables

- The design system uses oklch color values defined as CSS custom properties in `globals.css`.
- When adding new design tokens, follow the existing pattern of defining them in `:root` and `.dark` blocks using oklch values, then mapping them in `@theme inline`.

---

## 6. Database (Drizzle ORM)

### Schema

- All table definitions go in `db/schema.ts` using Drizzle's `pgTable()` helper.
- Use snake_case for table and column names.
- Always include `created_at` and `updated_at` timestamp columns on data tables.
- Define relations using Drizzle's `relations()` helper when tables reference each other.
- Export inferred types for insert and select operations:

  ```ts
  import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
  import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

  export const links = pgTable("links", {
    id: serial("id").primaryKey(),
    originalUrl: text("original_url").notNull(),
    shortCode: text("short_code").notNull().unique(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });

  export type Link = InferSelectModel<typeof links>;
  export type NewLink = InferInsertModel<typeof links>;
  ```

### Queries

- Import the `db` instance from `@/db`:
  ```ts
  import { db } from "@/db";
  import { links } from "@/db/schema";
  ```
- Use Drizzle's query builder for type-safe queries. Prefer the relational query API (`db.query.*`) for reads and the core API (`db.insert()`, `db.update()`, `db.delete()`) for writes.
- Always parameterize queries — never concatenate user input into SQL.

### Migrations

- Generate migrations: `npx drizzle-kit generate`
- Apply migrations: `npx drizzle-kit migrate`
- Push schema (dev): `npx drizzle-kit push`
- Never manually edit files in the `drizzle/` migrations directory.

---

## 7. Authentication (Clerk)

- The root layout wraps the app in `<ClerkProvider>`.
- Middleware is configured in `proxy.ts` using `clerkMiddleware()` to protect routes.
- Use Clerk's server-side helpers to get the current user in Server Components and API routes:
  ```ts
  import { auth, currentUser } from "@clerk/nextjs/server";
  ```
- Use Clerk's React components (`<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>`) for auth UI.
- Never expose Clerk secret keys in client-side code.
- User-specific data should reference `userId` from Clerk's `auth()` helper.

---

## 8. Environment Variables

- All environment variables must be defined in `.env.local` (not committed to git).
- Required variables:
  - `DATABASE_URL` — Neon PostgreSQL connection string
  - Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
- Validate required env vars at the point of use with a descriptive error message (see `db/index.ts` pattern).
- Prefix client-exposed env vars with `NEXT_PUBLIC_`.
- Never log or expose secret environment variables in responses or client code.

---

## 9. Error Handling & Validation

- Validate all user inputs using a schema validation library (e.g., Zod) or manual checks before database operations.
- Return user-friendly error messages; never expose internal error details or stack traces.
- Use try/catch in Server Actions and API routes; return structured `{ success, data, error }` responses.
- Use HTTP status codes correctly in API routes (200, 201, 400, 401, 404, 500).

---

## 10. Performance & Best Practices

- Use `next/image` for all images (automatic optimization).
- Use `next/link` for internal navigation (client-side transitions).
- Use `next/font` for fonts (already configured with Geist).
- Leverage React Server Components to minimize client-side JavaScript.
- Use `loading.tsx` files or `<Suspense>` boundaries for streaming.
- Avoid `useEffect` for data fetching — use server components or Server Actions instead.
- Keep bundle size in mind: import only what you need from libraries.

---

## 11. Code Quality

- Run `npm run lint` before committing. All code must pass ESLint with zero warnings.
- Follow the configured ESLint rules: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.
- Write self-documenting code. Use comments only to explain **why**, not **what**.
- Keep functions small and focused — single responsibility principle.
- Avoid `any` type. Use `unknown` and narrow with type guards when the type is truly unknown.

---

## 12. Git & Commits

- Write concise, descriptive commit messages in imperative mood: `Add link creation form`, `Fix redirect bug`.
- Keep commits atomic — one logical change per commit.
- Never commit `.env.local`, `node_modules/`, `.next/`, or other generated/secret files.

---

## 13. Adding New Features — Checklist

When implementing a new feature, follow this order:

1. **Schema** — Define or update tables in `db/schema.ts`
2. **Migrations** — Generate and apply with `drizzle-kit`
3. **Server logic** — Server Actions or API routes in `app/api/`
4. **Components** — Build UI components in `components/`
5. **Page** — Wire components into `app/` route pages
6. **Validation** — Add input validation (Zod or manual)
7. **Auth** — Protect routes/actions with Clerk's `auth()`
8. **Styling** — Use Tailwind utilities + shadcn/ui components
9. **Error handling** — Add error boundaries and loading states
10. **Lint** — Run `npm run lint` and fix any issues
