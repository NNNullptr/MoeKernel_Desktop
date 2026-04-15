/**
 * @file icons.config.ts
 * @description Desktop shortcut icon definitions for the Windows XP desktop.
 *
 * This file ONLY controls the visual appearance of desktop shortcut icons:
 * the label shown under the icon and the image used for the shortcut.
 *
 * Window metadata (title, icon, default size) has been moved to:
 *   → src/client/apps/registry.ts  (APP_REGISTRY)
 *
 * HOW TO ADD A NEW DESKTOP ICON:
 * 1. Register the app in `src/client/apps/registry.ts` with a unique id.
 * 2. Drop your icon image in: public/assets/icons/
 * 3. Add an entry here with the same id, pointing to your icon image.
 */

import type { DesktopIconDef } from '@/hooks/use-desktop-icons';

/**
 * Ordered list of desktop shortcut icons.
 * The order here determines the auto-arrange column layout.
 *
 * - `id`  : Must match the key in APP_REGISTRY (for openable windows)
 *           or be a non-window item like 'clippy' / 'recycleBin'.
 * - `label`: Text shown beneath the icon on the desktop.
 * - `src`  : URL or path to the desktop shortcut image.
 */
export const DESKTOP_ICON_DEFS: DesktopIconDef[] = [
  { id: 'myComputer',  label: 'My Computer',    src: 'https://static.step1.dev/g9nbov/assets/c27a5c3a1797.png' },
  { id: 'resume',      label: 'Resume',         src: 'https://static.step1.dev/g9nbov/assets/bb426464f8be.ico' },
  { id: 'aboutme',     label: 'About Me',       src: 'https://static.step1.dev/g9nbov/assets/58721f37b0c0.png' },
  { id: 'contact',     label: 'Contact Me',     src: 'https://static.step1.dev/g9nbov/assets/e225895b1c27.png' },
  { id: 'webamp',      label: 'Winamp',         src: 'https://static.step1.dev/g9nbov/assets/da0d359368d3.png' },
  { id: 'paint',       label: 'Paint',          src: 'https://static.step1.dev/g9nbov/assets/035b30cba825.png' },
  { id: 'gamesFolder', label: 'Games',          src: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png' },
  { id: 'msn',         label: 'MSN Messenger',  src: 'https://static.step1.dev/g9nbov/assets/ba1bb3f668bb.png' },
  { id: 'video',       label: 'Media Player',   src: 'https://static.step1.dev/g9nbov/assets/da0d359368d3.png' },
  { id: 'portfolio',   label: 'My Portfolio',   src: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png' },
  { id: 'blog',        label: 'My Blog',        src: 'https://static.step1.dev/g9nbov/assets/bb426464f8be.ico' },
  { id: 'recycleBin',  label: 'Recycle Bin',    src: 'https://static.step1.dev/g9nbov/assets/d51e6ce243c1.png' },
];
