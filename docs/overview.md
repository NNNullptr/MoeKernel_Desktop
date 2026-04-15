# Project Overview

## What is this?

A personal portfolio website styled as a Windows XP / Y2K dreamcore desktop experience. Visitors interact with the site as if they are using a retro PC operating system — complete with draggable windows, a Start Menu, system tray clock, desktop pets, and fully interactive apps inside every window.

## Key Features

- **Windows XP Desktop**: Draggable desktop icons with free-drag + multi-column auto-layout, XP wallpaper, and viewport boundary clamping.
- **Start Menu**: Luna-style Start Menu popup with user header, two-column Programs/Places layout, Log Off / Turn Off footer, and a live system tray clock.
- **Window Management System**: Draggable, resizable (8-direction), layered XP windows per app — with minimize, maximize, and close controls. Maximize avoids the right sidebar.
- **App Plugin Architecture**: Micro-kernel + plugin design. Every app lives in `src/client/apps/` and self-registers via `APP_REGISTRY` in `registry.ts`.
- **Config-Driven Apps**: All apps expose a top-level config object (`ABOUT_CONFIG`, `WINAMP_CONFIG`, `VIDEO_CONFIG`, etc.) for easy content customization without touching component logic.
- **Desktop Pets (桌宠)**: Draggable GIF pets that float above all windows (z-index 9999), with viewport clamping and a dismiss button. Launched from the right sidebar.
- **Right Sidebar (XP Classic Theme)**: Solid light-gray gradient sidebar (XP Classic/Silver style) with bevel-style pet launcher buttons — replaces the earlier Frutiger Aero frosted-glass design.
- **Blog System**: Full XP Explorer–style blog folder with Markdown post viewer, category filter tab bar, and per-post window navigation via CustomEvent messaging.

## Installed Apps

| App | Window ID | Description |
|-----|-----------|-------------|
| My Computer | `myComputer` | Drive grid explorer |
| About Me | `aboutme` | Config-driven bio card with skills footer and background image |
| Contact Me | `contact` | XP Explorer–style contact links grid |
| Winamp | `webamp` | HTML5 Audio player with playlist and retro 2.x UI |
| MSN Messenger | `msn` | Live chat with bot auto-reply and emoji picker |
| Paint | `paint` | Canvas drawing app (pencil / eraser / fill + color palette) |
| Resume / README | `resume` | Generic Markdown doc viewer with background image layer |
| Windows Media Player | `video` | Dual-engine video player (Bilibili iframe + native mp4) |
| My Portfolio | `portfolio` | Explorer-style portfolio with category tabs + lightbox |
| Games Folder | `gamesFolder` | Configurable HTML5 game launcher with iframe sandbox view |
| My Blog | `blog` | XP Explorer blog with Markdown viewer + category filter tabs |

## Target Users

Designers and developers who want to explore a personal portfolio in a nostalgic, interactive retro-OS format. Content and apps are fully configurable via dedicated config files — no deep code knowledge required to personalize.
