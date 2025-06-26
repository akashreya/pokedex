# Tailwind CSS v4 Status

## Release Status

- ✅ Stable Release: Available
- Latest Version: v4.1.10 (as of current project)
- Release Date: Officially released (as indicated by "Holy shit it's actually done" blog post)

## Key Features

- New high-performance engine (5x faster builds, 100x faster incremental builds)
- CSS-first configuration
- First-party Vite plugin (@tailwindcss/vite v4.1.10)
- Automatic content detection
- Built-in import support
- CSS theme variables
- Modernized P3 color palette
- Container queries
- New 3D transform utilities
- Expanded gradient APIs
- @starting-style support
- not-\* variant

## Installation

For Vite projects:

```bash
npm i tailwindcss@4.1.10 @tailwindcss/vite@4.1.10
```

For PostCSS:

```bash
npm i tailwindcss@4.1.10 @tailwindcss/postcss@4.1.10
```

## Configuration

- Uses CSS-first configuration
- No need for tailwind.config.js (though still supported)
- Configure directly in CSS using @theme directive

## Browser Support

- Targets modern browsers:
  - Safari 16.4+
  - Chrome 111+
  - Firefox 128+

## Migration Notes

- @tailwind directives replaced with @import
- Configuration moved to CSS
- New CSS variables system
- Improved performance
- Better developer experience
