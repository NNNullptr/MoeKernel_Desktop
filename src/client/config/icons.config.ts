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
  { id: 'myComputer', label: 'My Computer', src: 'public/assets/icons/My Computer.png' },
  { id: 'resume', label: 'Resume', src: 'public/assets/icons/Resume.png' },
  { id: 'aboutme', label: 'About Me', src: 'public/assets/icons/About.png' },
  { id: 'contact', label: 'Contact Me', src: 'public/assets/icons/Contact.png' },
  { id: 'webamp', label: 'Winamp', src: 'public/assets/icons/Winamp.png' },
  { id: 'paint', label: 'Paint', src: 'public/assets/icons/Paint.png' },
  { id: 'gamesFolder', label: 'Games', src: 'public/assets/icons/Games.png' },
  { id: 'msn', label: 'MSN Messenger', src: 'public/assets/icons/MSN.png' },
  { id: 'video', label: 'Media Player', src: 'public/assets/icons/Media.png' },
  { id: 'portfolio', label: 'My Portfolio', src: 'public/assets/icons/Portfolio.png' },
  { id: 'blog', label: 'My Blog', src: 'public/assets/icons/Blog.png' },
  { id: 'recycleBin', label: 'Recycle Bin', src: 'public/assets/icons/Recycle.png' },
];
