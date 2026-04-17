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
    id: 'pet_1',
    label: ' ',
    iconSrc: '/assets/pets/avatars/1.png',
    petSrc: '/assets/pets/sprites/20.png',
    size: 140,
  },
  {
    id: 'pet_2',
    label: ' ',
    iconSrc: '/assets/pets/avatars/5.png',
    petSrc: '/assets/pets/sprites/21.png',
    size: 120,
  },
  {
    id: 'pet_3',
    label: ' ',
    iconSrc: '/assets/pets/avatars/3.png',
    petSrc: '/assets/pets/sprites/1.gif',
    size: 150,
  },
  {
    id: 'pet_4',
    label: ' ',
    iconSrc: '/assets/pets/avatars/4.png',
    petSrc: '/assets/pets/sprites/2.gif',
    size: 200,
  },
  {
    id: 'pet_5',
    label: ' ',
    iconSrc: '/assets/pets/avatars/6.png',
    petSrc: '/assets/pets/sprites/3.gif',
    size: 220,
  },
  {
    id: 'pet_6',
    label: ' ',
    iconSrc: '/assets/pets/avatars/7.png',
    petSrc: '/assets/pets/sprites/4.gif',
    size: 260,
  },
  {
    id: 'pet_7',
    label: ' ',
    iconSrc: '/assets/pets/avatars/8.png',
    petSrc: '/assets/pets/sprites/5.png',
    size: 150,
  },
  {
    id: 'pet_8',
    label: ' ',
    iconSrc: '/assets/pets/avatars/9.png',
    petSrc: '/assets/pets/sprites/6.gif',
    size: 220,
  },
  {
    id: 'pet_9',
    label: ' ',
    iconSrc: '/assets/pets/avatars/10.png',
    petSrc: '/assets/pets/sprites/7.gif',
    size: 150,
  },
  {
    id: 'pet_10',
    label: ' ',
    iconSrc: '/assets/pets/avatars/11.png',
    petSrc: '/assets/pets/sprites/8.gif',
    size: 200,
  },
  {
    id: 'pet_11',
    label: ' ',
    iconSrc: '/assets/pets/avatars/12.png',
    petSrc: '/assets/pets/sprites/9.gif',
    size: 250,
  },
  {
    id: 'pet_12',
    label: ' ',
    iconSrc: '/assets/pets/avatars/13.png',
    petSrc: '/assets/pets/sprites/10.png',
    size: 120,
  },
  {
    id: 'pet_13',
    label: ' ',
    iconSrc: '/assets/pets/avatars/14.png',
    petSrc: '/assets/pets/sprites/11.png',
    size: 180,
  },
  {
    id: 'pet_14',
    label: ' ',
    iconSrc: '/assets/pets/avatars/15.png',
    petSrc: '/assets/pets/sprites/12.gif',
    size: 180,
  },
  {
    id: 'pet_15',
    label: ' ',
    iconSrc: '/assets/pets/avatars/16.png',
    petSrc: '/assets/pets/sprites/13.gif',
    size: 190,
  },
  {
    id: 'pet_16',
    label: ' ',
    iconSrc: '/assets/pets/avatars/17.png',
    petSrc: '/assets/pets/sprites/14.gif',
    size: 230,
  },
  {
    id: 'pet_17',
    label: ' ',
    iconSrc: '/assets/pets/avatars/18.png',
    petSrc: '/assets/pets/sprites/15.png',
    size: 200,
  },
  {
    id: 'pet_18',
    label: ' ',
    iconSrc: '/assets/pets/avatars/19.png',
    petSrc: '/assets/pets/sprites/16.png',
    size: 200,
  },
  {
    id: 'pet_19',
    label: ' ',
    iconSrc: '/assets/pets/avatars/20.png',
    petSrc: '/assets/pets/sprites/17.gif',
    size: 210,
  },
  {
    id: 'pet_20',
    label: ' ',
    iconSrc: '/assets/pets/avatars/21.png',
    petSrc: '/assets/pets/sprites/18.png',
    size: 220,
  },
  {
    id: 'pet_21',
    label: ' ',
    iconSrc: '/assets/pets/avatars/22.png',
    petSrc: '/assets/pets/sprites/19.png',
    size: 210,
  },
  {
    id: 'pet_22',
    label: ' ',
    iconSrc: '/assets/pets/avatars/23.png',
    petSrc: '/assets/pets/sprites/22.png',
    size: 165,
  },
  {
    id: 'pet_23',
    label: ' ',
    iconSrc: '/assets/pets/avatars/24.png',
    petSrc: '/assets/pets/sprites/23.png',
    size: 150,
  },
  {
    id: 'pet_24',
    label: ' ',
    iconSrc: '/assets/pets/avatars/25.png',
    petSrc: '/assets/pets/sprites/24.png',
    size: 120,
  },
  {
    id: 'pet_25',
    label: ' ',
    iconSrc: '/assets/pets/avatars/26.png',
    petSrc: '/assets/pets/sprites/25.png',
    size: 200,
  },
  {
    id: 'pet_26',
    label: ' ',
    iconSrc: '/assets/pets/avatars/27.png',
    petSrc: '/assets/pets/sprites/26.png',
    size: 180,
  },
  {
    id: 'pet_27',
    label: ' ',
    iconSrc: '/assets/pets/avatars/28.png',
    petSrc: '/assets/pets/sprites/28.gif',
    size: 250,
  },
  {
    id: 'pet_28',
    label: ' ',
    iconSrc: '/assets/pets/avatars/2.png',
    petSrc: '/assets/pets/sprites/27.png',
    size: 180,
  },

  // ──────────────────────────────────────────────────────────────────
  // ADD NEW PETS BELOW THIS LINE
  // Copy the template above and fill in your own id, label, and image paths.
  // ──────────────────────────────────────────────────────────────────
];
