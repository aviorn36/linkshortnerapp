# UI Components Standards

> **Audience:** LLM coding agents (Copilot, Cursor, Cline, etc.)
> This document defines how to use shadcn/ui components and the restrictions on custom UI components.

---

## 1. Component Source Rule

- **All UI components MUST come from the shadcn/ui library.**
- **DO NOT create custom UI components.** Ever.
- If a needed component doesn't exist in shadcn/ui, add it from the library using the CLI (see Section 3).
- Existing custom components in `components/ui/` should not be modified — they are auto-generated and maintained by shadcn.

---

## 2. shadcn/ui Configuration

This project is configured with the following shadcn/ui settings (defined in `components.json`):

| Setting           | Value           | Details                         |
| ----------------- | --------------- | ------------------------------- |
| **Style**         | `new-york`      | Modern, minimal aesthetic       |
| **RSC**           | `true`          | React Server Components enabled |
| **TSX**           | `true`          | TypeScript syntax               |
| **Icon Library**  | `lucide`        | Lucide React icons              |
| **CSS Framework** | Tailwind CSS v4 | Via `@tailwindcss/postcss`      |
| **Base Color**    | `neutral`       | Gray/neutral color palette      |
| **CSS Variables** | `true`          | Token-based theming             |

---

## 3. How to Add a shadcn/ui Component

### Step 1: Check if it exists

Browse [shadcn/ui components](https://ui.shadcn.com/docs/components) to confirm the component you need exists.

### Step 2: Run the CLI

```bash
npx shadcn@latest add <component-name>
```

**Examples:**

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add card
npx shadcn@latest add dropdown-menu
```

### Step 3: Import and use

Components are placed in `components/ui/<component-name>.tsx` and can be imported via the alias:

```tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function MyComponent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>{/* content */}</DialogContent>
    </Dialog>
  );
}
```

---

## 4. Component Composition

When you need custom logic or behavior:

1. **Wrap shadcn components** — Create a custom component in `components/` (NOT `components/ui/`) that composes shadcn primitives.
2. **Use composition** — Don't modify the shadcn component; wrap it in your own component with additional logic.

### Example

```tsx
// ❌ WRONG — Modifying shadcn component
import { Button } from "@/components/ui/button";
// Then modifying its internals

// ✅ CORRECT — Composing shadcn component
// filepath: components/primary-button.tsx
import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";

type PrimaryButtonProps = ComponentProps<typeof Button> & {
  loading?: boolean;
};

export function PrimaryButton({
  loading,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? "Loading..." : children}
    </Button>
  );
}
```

---

## 5. Styling Components

- All styling uses **Tailwind CSS utility classes**.
- Use the `cn()` utility from `@/lib/utils` to merge conditional classes:

  ```tsx
  import { cn } from "@/lib/utils";

  <Button className={cn("px-4 py-2", isActive && "bg-primary")} />;
  ```

- shadcn components expose a `className` prop for customization — use it to apply Tailwind utilities.
- Never add CSS files or inline `<style>` tags to modify shadcn components.

---

## 6. Available Components

Common shadcn/ui components (add as needed):

| Component       | Use For                            |
| --------------- | ---------------------------------- |
| `button`        | Action buttons                     |
| `input`         | Text, email, password fields       |
| `select`        | Dropdown selection                 |
| `dialog`        | Modals, dialogs                    |
| `dropdown-menu` | Context menus, action menus        |
| `form`          | Form handling with React Hook Form |
| `card`          | Content containers                 |
| `badge`         | Labels, tags                       |
| `toast`         | Notifications (via `sonner`)       |
| `tabs`          | Tab navigation                     |
| `checkbox`      | Boolean toggles                    |
| `radio-group`   | Radio button groups                |

See [shadcn/ui docs](https://ui.shadcn.com/docs/components) for the full list and examples.

---

## 7. Component Organization

```
components/
├── ui/                    # shadcn/ui auto-generated primitives (DO NOT EDIT)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── ...
├── link-card.tsx         # Custom component wrapping shadcn primitives
├── dashboard-layout.tsx  # Custom component wrapping shadcn primitives
└── ...
```

- **`components/ui/`** = shadcn library (untouched, auto-generated)
- **`components/`** = Your custom components that compose shadcn primitives

---

## 8. Constraints

- **Never** install alternative UI libraries (e.g., Material-UI, Chakra UI, Headless UI).
- **Never** create custom UI components from scratch.
- **Never** modify files in `components/ui/` — they are managed by shadcn CLI.
- **Never** add inline CSS or CSS files specifically to style UI components — use Tailwind utilities.
- **Never** commit `components.json` changes without ensuring they match the project configuration.

---

## 9. Troubleshooting

### Component not found

Run `npx shadcn@latest add <component>` to install it.

### Styling looks wrong

Check that Tailwind CSS v4 is running (`@tailwindcss/postcss` in `package.json`) and CSS variables are defined in `app/globals.css`.

### Component prop not working

Check the shadcn/ui docs for that specific component — props vary. Use TypeScript's autocomplete to see available props.
