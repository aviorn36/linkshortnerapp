# AGENTS.md

> Instructions for LLM-based coding agents working on this project.

---

> ## ⚠️ CRITICAL — MANDATORY FIRST STEP
>
> **BEFORE making ANY code suggestion, change, or recommendation — you MUST read the relevant instruction file(s) in the `/docs` directory.**
>
> This is NON-NEGOTIABLE. Skipping this step will result in incorrect, inconsistent, or broken code.
>
> - Touching UI? → Read [`docs/UI_COMPONENTS.md`](docs/UI_COMPONENTS.md) **first**.
> - Touching auth / routes? → Read [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md) **first**.
> - Touching anything else? → Read [`docs/CODING_STANDARDS.md`](docs/CODING_STANDARDS.md) **first**.
>
> **No exceptions. No shortcuts. Read the docs first.**

---

## Quick Reference

| Item             | Detail                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| **App**          | LinkShortner — URL shortening service                                                                             |
| **Stack**        | Next.js 16 (App Router) · TypeScript 5 · Tailwind CSS v4 · shadcn/ui · Drizzle ORM · Neon PostgreSQL · Clerk Auth |
| **Node scripts** | `npm run dev` · `npm run build` · `npm run lint`                                                                  |
| **DB commands**  | `npx drizzle-kit generate` · `npx drizzle-kit push` · `npx drizzle-kit migrate`                                   |

## Instruction Files

> **🚨 YOU MUST READ THE RELEVANT FILE BELOW BEFORE EVERY CODE CHANGE — NO EXCEPTIONS.**

All coding conventions, architecture decisions, and rules are documented in the `/docs` directory.

| File                                                 | Covers                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) | Full coding conventions, project structure, and patterns     |
| [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)     | Clerk auth, modal sign-in/sign-up, route protection          |
| [docs/UI_COMPONENTS.md](docs/UI_COMPONENTS.md)       | shadcn/ui usage, how to add components, no custom UI allowed |

**You MUST read and FOLLOW the relevant document before writing, modifying, or suggesting any code in that area. This applies to ALL agents at ALL times.**

## Key Rules (TL;DR)

1. **TypeScript only** — strict mode, no `any`, use `@/*` path aliases.
2. **Server Components by default** — only add `"use client"` when required.
3. **Tailwind CSS v4** — no `tailwind.config.js`; theme is in `globals.css`.
4. **shadcn/ui (new-york)** — all UI from shadcn; no custom UI components; add via CLI (see [docs/UI_COMPONENTS.md](docs/UI_COMPONENTS.md)).
5. **Drizzle ORM** — schemas in `db/schema.ts`, snake_case tables/columns.
6. **Clerk** — sole auth provider, modal sign-in/sign-up only, middleware in `proxy.ts`.
7. **Route protection** — `/dashboard` requires auth; logged-in users on `/` redirect to `/dashboard`.
8. **Lint clean** — `npm run lint` must pass with zero warnings.
