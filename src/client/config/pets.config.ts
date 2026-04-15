/**
 * @file pets.config.ts
 * @description Desktop pet (桌宠) definitions for the right sidebar and desktop.
 *
 * HOW TO ADD A NEW PET:
 * 1. Put the sidebar icon image in:  public/assets/pets/avatars/  (small static image or emoji)
 * 2. Put the desktop sprite image in: public/assets/pets/sprites/  (GIF recommended for animation)
 * 3. Add a new object to the PET_DEFS array below.
 *
 * FIELD GUIDE:
 * - id:       Unique string key (no spaces). Used internally to track which pets are active.
 * - label:    Display name shown in the sidebar tooltip and under the pet on the desktop.
 * - iconSrc:  What shows in the right sidebar button.
 *             • Use an emoji string (e.g. '🐱') for quick setup.
 *             • Use '/assets/pets/avatars/my-icon.png' for a proper image.
 * - petSrc:   What actually appears on the desktop as the draggable pet.
 *             • Use '/assets/pets/sprites/my-pet.gif' for an animated GIF (best result!).
 *             • Use '/assets/pets/sprites/my-pet.png' for a static image.
 *             • Use an emoji string for instant no-image setup.
 * - size:     Width and height in pixels for the desktop pet (default: 80).
 *             Increase this for larger pets (e.g. 100-150 for GIFs with more detail).
 *
 * TIP: You can add as many pets as you want — the sidebar will scroll if they overflow.
 *
 * EXAMPLE with local files:
 * {
 *   id: 'dancing_bear',
 *   label: '跳舞小熊',
 *   iconSrc: '/assets/pets/avatars/bear-avatar.png',
 *   petSrc:  '/assets/pets/sprites/bear-dance.gif',
 *   size: 120,
 * }
 */

import type { PetDef } from '@/client/views/desktop-pet';

export const PET_DEFS: PetDef[] = [
  {
    id: 'cat',
    label: 'Neko',
    iconSrc: '🐱',
    petSrc: '🐱',
    size: 72,
  },
  {
    id: 'dog',
    label: 'Doggo',
    iconSrc: '🐶',
    petSrc: '🐶',
    size: 72,
  },
  {
    id: 'star',
    label: 'Kirby',
    iconSrc: '⭐',
    petSrc: '⭐',
    size: 72,
  },
  // ──────────────────────────────────────────────────────────────────
  // ADD NEW PETS BELOW THIS LINE
  // Copy the template above and fill in your own id, label, and image paths.
  // ──────────────────────────────────────────────────────────────────
];
