# Authentication Instructions

> **Audience:** LLM coding agents (Copilot, Cursor, Cline, etc.)
> This document defines the authentication rules and patterns that MUST be followed in this project.

---

## 1. Auth Provider

- **Clerk is the ONLY authentication provider.** No exceptions.
- Never install or use any other auth library (e.g., NextAuth, Auth.js, Supabase Auth, Firebase Auth, Lucia, Passport, iron-session).
- All auth-related imports must come from `@clerk/nextjs` or `@clerk/nextjs/server`.

---

## 2. Sign In & Sign Up — Modal Only

- Sign-in and sign-up **must use modal mode**. Never create dedicated `/sign-in` or `/sign-up` pages.
- Never redirect users to a separate page for authentication.
- Use Clerk's `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` components.

### Example

```tsx
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

<SignedOut>
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

### Rules

- Always wrap auth UI in `<SignedIn>` / `<SignedOut>` to conditionally render based on auth state.
- Use `<UserButton />` for the logged-in user's profile/avatar menu.
- Never build custom sign-in/sign-up forms — use Clerk's built-in components.

---

## 3. Route Protection

### Route Access Rules

| Route          | Auth Required | Behavior                                                  |
| -------------- | ------------- | --------------------------------------------------------- |
| `/` (homepage) | No            | Public. If user is logged in, redirect to `/dashboard`.   |
| `/dashboard`   | Yes           | Protected. Unauthenticated users are prompted to sign in. |
| `/dashboard/*` | Yes           | Protected. All sub-routes inherit dashboard protection.   |

### Rules

- `/dashboard` and all its sub-routes must require authentication.
- `/` (homepage) must be publicly accessible without authentication.
- **Logged-in users accessing `/` must be redirected to `/dashboard`.**
- Use Clerk's middleware (`clerkMiddleware`) in `proxy.ts` to enforce route protection.

### Middleware Implementation

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isHomepage = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect logged-in users from homepage to dashboard
  if (isHomepage(req) && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard routes — unauthenticated users are prompted to sign in
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## 4. Server-Side Auth

- Use Clerk's server-side helpers to get the current user in Server Components and API routes:
  ```ts
  import { auth, currentUser } from "@clerk/nextjs/server";
  ```
- Use `auth()` to get the `userId` for database queries and authorization checks.
- Never trust client-sent user IDs — always derive the user identity from `auth()` on the server.

---

## 5. Environment Variables

Required Clerk environment variables in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

- Prefix `NEXT_PUBLIC_` is required for the publishable key (client-exposed).
- `CLERK_SECRET_KEY` must never be exposed in client-side code.
- Never hardcode these values in source code.
- Never commit `.env.local` to version control.

---

## 6. Constraints

- **Never** use any auth library other than Clerk.
- **Never** create dedicated sign-in or sign-up pages — always use modal mode.
- **Never** leave `/dashboard` routes unprotected.
- **Never** allow logged-in users to remain on the homepage — always redirect to `/dashboard`.
- **Never** expose `CLERK_SECRET_KEY` in client-side code or browser responses.
