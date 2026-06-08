# Static Assets Directory

This folder organizes first-party static images and media used by the XP desktop portfolio.

Third-party vendored frontend bundles should not be placed here. Keep them under `public/vendor/` so app-owned assets and upstream snapshots stay clearly separated.

## Directory Structure

```
public/assets/
├── wallpapers/          # Desktop background images
│   └── (put .jpg / .webp / .png wallpaper files here)
│
├── icons/               # App icons used on the desktop and in windows
│   ├── (desktop shortcut icons — .png / .ico / .webp)
│   └── tray/            # System tray icons (bottom-right taskbar area)
│       └── (small 16×16 or 20×20 tray icons)
│
└── pets/                # Desktop pet (桌宠) assets
    ├── avatars/         # Small sidebar launcher icons (22×22 recommended)
    │   └── (static .png images or small .gif)
    └── sprites/         # Full desktop pet graphics (supports animated .gif!)
        └── (transparent background .gif or .png, any size)
```

## How to Reference These Files

In your config files (`src/client/config/`), use paths starting with `/assets/`:

```ts
// wallpaper
export const WALLPAPER_URL = '/assets/wallpapers/bliss.webp';

// desktop icon
{ id: 'myApp', src: '/assets/icons/my-app.png' }

// pet
{
  iconSrc: '/assets/pets/avatars/cat.png',
  petSrc:  '/assets/pets/sprites/cat-walking.gif',
}
```

## Tips

- **Wallpapers**: 1920×1080 or larger recommended. `.webp` format keeps file size small.
- **Icons**: 48×48px or 64×64px. `.png` with transparent background looks best.
- **Pet sprites**: Use transparent-background `.gif` files for the best animated effect.
  Sizes between 80px–150px work well on the desktop.
