# Tailwind v4+ Dynamic Utility Classes with Custom Colors

## Problem

When using dynamic class names in JSX (e.g., `bg-type-solid-${type}`) with custom colors defined via `@theme` in Tailwind v4+, Tailwind may not generate the required CSS classes unless it can statically detect them in your source files.

## Why?

- Tailwind scans your code for class names as plain text.
- Dynamic class names (using template literals or string concatenation) are not detected.
- The old `safelist` config option is now best replaced by `@source inline()` in your CSS for v4+.

## Solution

### 1. Define Custom Colors in `@theme`

```css
@import "tailwindcss";
@theme {
  --color-type-solid-grass: #78c850;
  --color-type-solid-fire: #f08030;
  /* ...all your type colors... */
}
```

### 2. Use Dynamic Class Names in JSX

```jsx
<span className={`bg-type-solid-${type}`}>...</span>
```

### 3. Force Class Generation with `@source inline()`

Add this to your main CSS file (e.g., `src/styles/index.css`):

```css
@source inline("bg-type-solid-normal bg-type-solid-fire bg-type-solid-water bg-type-solid-electric bg-type-solid-grass bg-type-solid-ice bg-type-solid-fighting bg-type-solid-poison bg-type-solid-ground bg-type-solid-flying bg-type-solid-psychic bg-type-solid-bug bg-type-solid-rock bg-type-solid-ghost bg-type-solid-dragon bg-type-solid-dark bg-type-solid-steel bg-type-solid-fairy");
```

- This guarantees Tailwind generates all the listed classes, regardless of dynamic usage.
- You can also add variants, e.g., `{hover:,dark:,}bg-type-solid-fire` for hover/dark support.

## References

- [Tailwind v4.1 Blog: Safelist specific utilities with @source inline()](https://tailwindcss.com/blog/tailwindcss-v4-1)
- [Tailwind Docs: Safelisting specific utilities](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Tailwind Docs: Customizing your colors](https://tailwindcss.com/docs/colors)

## TL;DR

- **Always use `@theme` for custom colors.**
- **Use `@source inline()` in your CSS to force Tailwind to generate dynamic utility classes.**
- **No need to use the old `safelist` config for this in v4+.**
