# Pokemon Fonts Setup

This directory contains the Pokemon Hollow and Solid fonts for the Pokedex project.

## Font Information

- **Source**: [Pokemon Hollow Font](https://font.download/font/pokemon-hollow)
- **License**: Free for personal use
- **Designer**: jacobs.lorenzo
- **Tags**: #Fancy, #Cartoon

## Font Variants

1. **Pokemon Hollow Normal** - Hollow/outline version
2. **Pokemon Solid Normal** - Solid/filled version

## Installation Steps

1. **Download the fonts** from [font.download](https://font.download/font/pokemon-hollow)
2. **Extract the font files** from the downloaded package
3. **Convert to WOFF2 format** (recommended for web use):
   - Use online converters like [CloudConvert](https://cloudconvert.com/) or [FontSquirrel](https://www.fontsquirrel.com/tools/webfont-generator)
   - Or use command-line tools like `woff2_compress`
4. **Replace the placeholder files**:
   - Replace `pokemon-hollow.woff2` with the actual Pokemon Hollow font
   - Replace `pokemon-solid.woff2` with the actual Pokemon Solid font

## Usage in CSS

The fonts are configured in the Tailwind config and can be used with:

```css
/* Pokemon Hollow */
font-family: "Pokemon Hollow", display;

/* Pokemon Solid */
font-family: "Pokemon Solid", display;
```

## Tailwind Classes

```html
<!-- Pokemon Hollow -->
<h1 class="font-pokemon-hollow">Pokemon Title</h1>

<!-- Pokemon Solid -->
<h2 class="font-pokemon-solid">Pokemon Subtitle</h2>
```

## Current Usage

The Pokemon Hollow font is currently used in the Hero component for the main title:

```jsx
<h1 className="font-pokemon-hollow">Discover the World of Pokémon</h1>
```

## Notes

- The fonts are set to `font-display: swap` for better performance
- Both fonts are configured as display fonts in the Tailwind config
- The fonts are loaded from the `/fonts/` directory in the public folder
