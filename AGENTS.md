# Agent Guidelines

After making changes, run `pnpm lint` and fix all errors.

## Design System & Styling Rules

This project enforces design system standards with `@shadcn/lint`:

- **No Restyling (`shadcn/no-restyle`)**: Do not override component appearance, colors, or internal spacing with ad-hoc classes. Use predefined component variants and size props (e.g. `variant="destructive"`, `size="sm"`).
- **Theme Colors Only (`shadcn/no-raw-colors`)**: Do not use raw palette colors (e.g. `text-red-500`, `text-indigo-600`). Use semantic theme tokens from `packages/ui/src/styles/globals.css` (e.g. `text-destructive`, `bg-success`, `bg-warning`, `text-primary`).
- **No Arbitrary Values (`shadcn/no-arbitrary-values`)**: Avoid arbitrary classes (e.g. `p-[13px]`). Use the design system spacing and layout scale.
- **No Inline Styles (`shadcn/no-inline-styles`)**: Use Tailwind classes instead of inline `style={{ ... }}` attributes.
- **Known Classes (`shadcn/no-unknown-classes`)**: Ensure all classes are valid Tailwind utilities or declared `@utility` classes.
