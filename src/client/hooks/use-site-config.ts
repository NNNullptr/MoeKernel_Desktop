import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/client/trpc';
import {
  WALLPAPER_URL,
  WINDOWS_LOGO_URL,
  SYSTEM_TRAY_ICONS,
} from '@/client/config/theme.config';

export function useSiteSettings() {
  const { data } = useQuery({
    ...trpc.site.getSettings.queryOptions(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  console.log('[useSiteSettings] API Data:', data);

  const trayIconsRaw = data?.system_tray_icons;
  const trayIcons: string[] = trayIconsRaw
    ? (JSON.parse(trayIconsRaw) as string[])
    : SYSTEM_TRAY_ICONS;

  return {
    wallpaperUrl:    data?.wallpaper_url     ?? WALLPAPER_URL,
    logoUrl:         data?.windows_logo_url  ?? WINDOWS_LOGO_URL,
    systemTrayIcons: trayIcons,
  };
}
