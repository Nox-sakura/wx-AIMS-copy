# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**wxAIMS** — a WeChat Mini Program built with TypeScript and SASS, using the Skyline rendering engine and glass-easel component framework.

- App ID: `wx567ad526bc918474`
- WeChat Library Version: `2.32.3`
- Renderer: Skyline (modern rendering engine)
- Component Framework: glass-easel

## Development Environment

This project is developed and run entirely within **WeChat Developer Tools** (微信开发者工具). There are no npm build scripts. The IDE handles:
- TypeScript compilation
- SASS compilation
- Code minification (WXSS, WXML)
- Hot reload (enabled in `project.private.config.json`)

To develop: open the project root in WeChat Developer Tools.

## Project Structure

```
miniprogram/          # Main application code
  app.ts              # App entry: wx.login(), logs launch timestamps to storage
  app.json            # Global config: pages list, window config, Skyline settings
  app.scss            # Global base styles (flexbox container defaults)
  pages/
    index/            # Home page: avatar/nickname profile management
    logs/             # Launch logs page: reads timestamps from wx storage
  components/
    navigation-bar/   # Custom nav bar (replaces default WeChat nav)
  utils/
    util.ts           # formatTime(), formatNumber() helpers
typings/              # WeChat API TypeScript type definitions
```

## Architecture Notes

### Pages
Each page has 4 files: `.ts` (logic), `.wxml` (template), `.json` (config), `.scss` (styles). Pages must be registered in `miniprogram/app.json` under `"pages"`.

### Custom Navigation Bar
All pages use the `navigation-bar` component instead of the default WeChat navigation bar. The component accepts: `title`, `back`, `homeButton`, `loading`, `animated`, `show`, `delta`, `color`, `background`. It handles iOS/Android differences, safe area insets, and menu button positioning via `wx.getMenuButtonBoundingClientRect()`.

### State and Storage
- Local storage via `wx.getStorageSync` / `wx.setStorageSync` (used for launch logs)
- No global state management library; state lives in each page's `data` object
- `app.ts` stores launch timestamps under key `"logs"` on each launch

### Authentication
`app.ts` calls `wx.login()` on launch to obtain a code. The backend exchange (code → openId/sessionKey) is **not yet implemented** — marked as TODO in comments.

### Styling Conventions
- Use RPX units (responsive pixels) for dimensions
- CSS custom properties (`--var`) used for theming in navigation-bar
- Style isolation mode: `apply-shared` (component styles + global styles both apply)
- SASS is available; use `.scss` files

### TypeScript Config
Strict mode is fully enabled: `noImplicitAny`, `strictNullChecks`, `noImplicitReturns`, `strictPropertyInitialization`. Target: ES2020. All WeChat API types come from `./typings/`.

### Skyline Renderer Settings
Configured in `app.json`:
- `"defaultDisplayBlock": true`
- `"defaultContentBox": true`
- `"legacyTagNameStyleIsolation": true`
- SDK version range: `3.0.0` – `15.255.255`
