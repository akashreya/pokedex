# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

**Development:**
- `npm run dev` - Start development server on port 5173
- `npm run build` - Production build
- `npm run build:prod` - Production build with NODE_ENV=production
- `npm run preview` - Preview production build locally

**Code Quality:**
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

**Deployment:**
- `npm run deploy` - Build and deploy to Vercel
- `npm run analyze` - Analyze bundle size

## Architecture Overview

This is a modern React Pokédex application built with Vite, TypeScript/JSX, and Tailwind CSS. The app fetches data from PokéAPI and includes a Pokemon Wordle game.

**Key Architecture Patterns:**

- **React Router** for navigation with routes: `/`, `/pokemon`, `/pokemon/:id`, `/pokeguess`
- **Context Providers** for state management (PokemonContext, UserPreferencesContext)
- **Service Layer** architecture with caching (`/src/services/`)
- **Custom Hooks** for data fetching and business logic (`/src/hooks/`)
- **Component Organization** by feature areas (`/src/components/`)

**Core Services:**
- `api.ts` - Base API service with error handling
- `pokedexapi.ts` - PokéAPI specific endpoints
- `cache.ts` - Request caching with localStorage
- `evolutionService.ts` - Complex evolution chain logic
- `pokemonWordleService.ts` - Wordle game logic

**Data Flow:**
- API calls → Service layer → Custom hooks → Components
- Caching layer intercepts API calls to improve performance
- Context providers manage global state (theme, user preferences, pokemon data)

**UI System:**
- Tailwind CSS with custom Pokemon type color system
- Dark mode support via ThemeProvider
- Component library in `/src/components/ui/`
- Custom Pokemon type gradients and styling
- Framer Motion for animations

**Testing:**
- Jest with jsdom environment
- React Testing Library
- Coverage reporting configured
- Tests located in `__tests__` directories and `.test.` files

**Key Directories:**
- `/src/components/` - React components organized by feature
- `/src/services/` - API and business logic services  
- `/src/hooks/` - Custom React hooks
- `/src/context/` - React context providers
- `/src/constants/` - Static data (types, regions, moves)
- `/src/utils/` - Helper functions
- `/src/types/` - TypeScript type definitions