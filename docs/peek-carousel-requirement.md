# Peek Carousel for Pokémon Detail Navigation

## Overview

Implement a "peek carousel" effect on the Pokémon detail page, where the current Pokémon is centered and the previous/next Pokémon detail cards are partially visible on the left and right sides. This enhances navigation and provides visual context for adjacent entries.

## Motivation

- Improve navigation between Pokémon by making it visually clear which entries are adjacent.
- Create a modern, engaging UI that mimics popular carousel and card-stack interfaces.
- Allow users to quickly preview and access previous/next Pokémon.

## User Experience

- The current Pokémon detail card is centered and fully visible.
- The previous and next Pokémon cards are partially visible ("peeking") on the left and right sides.
- Clicking a side card or navigation arrow transitions the carousel, centering the selected Pokémon.
- Smooth sliding animations enhance the transition between cards.
- Keyboard and swipe navigation should also update the carousel.

## Technical Approach

1. **Data Fetching**

   - Fetch data for the current, previous, and next Pokémon based on the current Pokémon ID.
   - Handle edge cases for the first and last Pokémon (hide or disable peeking card as needed).

2. **Component Structure**

   - Extract the Pokémon detail card into a reusable `PokemonCard` component.
   - Render three cards in a horizontal flex container: `[Prev] [Current] [Next]`.

3. **Layout & Styling**

   - Use a flexbox container with `overflow: hidden` and a fixed width.
   - Center card: larger, full opacity, z-index above side cards.
   - Side cards: smaller, partially visible, lower opacity, clickable.
   - Responsive design for desktop and mobile.

4. **Navigation Logic**
   - Clicking a side card or navigation arrow updates the current Pokémon ID and shifts the carousel.
   - Animate transitions using Framer Motion or CSS transitions.
   - Support keyboard (left/right arrows) and swipe navigation.

## UI/UX Guidelines

- Center card width: ~60% of container; side cards: ~20% each.
- Side cards should be visually de-emphasized (scale, opacity).
- Show navigation arrows overlayed or beside the carousel.
- Ensure accessibility: ARIA labels, keyboard navigation, focus management.
- Maintain performance by only rendering three cards at a time.

## Edge Cases

- First Pokémon: no previous card; left side is empty or disabled.
- Last Pokémon: no next card; right side is empty or disabled.
- Loading states for cards as data is fetched.
- Handle rapid navigation and animation interruptions gracefully.

## Example Layout

```
+-------------------+-------------------+-------------------+
|   [Prev Card]     |  [Current Card]   |   [Next Card]     |
|   (peeked)        |   (centered)      |   (peeked)        |
+-------------------+-------------------+-------------------+
```

## Future Enhancements

- Add touch/swipe support for mobile.
- Add lazy loading for card images.
- Show a preview (name, sprite) on hover for side cards.
