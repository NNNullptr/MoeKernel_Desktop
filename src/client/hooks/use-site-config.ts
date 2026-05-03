import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/client/trpc';
import {
  WALLPAPER_URL,
  WINDOWS_LOGO_URL,
  SYSTEM_TRAY_ICONS,
} from '@/client/config/theme.config';

// ─── 共享类型 ──────────────────────────────────────────────────────────────────

export type ContactItem = {
  id:      string;
  name:    string;
  url:     string;
  iconSrc: string;
  emoji:   string;
};

// bgImageSrc / bgOpacity 已迁移为独立 site_settings 键，不再存于 JSON 对象中
export type AboutConfig = {
  name:            string;
  title:           string;
  location:        string;
  avatarSrc:       string;
  markdownContent: string;
};

// ─── 静态 Fallback（DB 未配置或加载失败时使用）────────────────────────────────

const DEFAULT_CONTACT: ContactItem[] = [
  { id: 'github',  name: 'GitHub',  url: 'https://github.com/NNNullptr', iconSrc: '/assets/icons/github.png',  emoji: '' },
  { id: 'twitter', name: 'Twitter', url: 'https://x.com/NNNullptr',      iconSrc: '/assets/icons/twitter.png', emoji: '' },
];

const DEFAULT_ABOUT: AboutConfig = {
  name:            'NNNullptr',
  title:           '简介一段',
  location:        'null',
  avatarSrc:       '/assets/avatarSrc.jpg',
  markdownContent: '## 标题\n\n欢迎访问，随便写几句\n',
};

function safeParse<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

// ─── 主 Hook ──────────────────────────────────────────────────────────────────

export function useSiteSettings() {
  const { data } = useQuery({
    ...trpc.site.getSettings.queryOptions(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const trayIconsRaw = data?.system_tray_icons;
  const trayIcons: string[] = trayIconsRaw
    ? (JSON.parse(trayIconsRaw) as string[])
    : SYSTEM_TRAY_ICONS;

  const rawChatboxOpacity   = data?.chatbox_bg_opacity;
  const rawPortfolioOpacity = data?.portfolio_bg_opacity;
  const rawWinampOpacity    = data?.winamp_bg_opacity;
  const rawAboutOpacity     = data?.about_bg_opacity;
  const rawContactOpacity   = data?.contact_bg_opacity;

  return {
    isLoaded:           !!data,
    wallpaperUrl:       data?.wallpaper_url      ?? WALLPAPER_URL,
    logoUrl:            data?.windows_logo_url   ?? WINDOWS_LOGO_URL,
    systemTrayIcons:    trayIcons,
    chatboxBgUrl:       data?.chatbox_bg_url     ?? '',
    chatboxBgOpacity:   rawChatboxOpacity   ? parseFloat(rawChatboxOpacity)   : 0.15,
    portfolioBgUrl:     data?.portfolio_bg_url   ?? '',
    portfolioBgOpacity: rawPortfolioOpacity ? parseFloat(rawPortfolioOpacity) : 0.2,
    winampBgUrl:        data?.winamp_bg_url      ?? '',
    winampBgOpacity:    rawWinampOpacity    ? parseFloat(rawWinampOpacity)    : 0.3,
    aboutBgUrl:         data?.about_bg_url       ?? '/assets/wallpapers/bg2.jpg',
    aboutBgOpacity:     rawAboutOpacity     ? parseFloat(rawAboutOpacity)     : 0.5,
    contactBgUrl:       data?.contact_bg_url     ?? '',
    contactBgOpacity:   rawContactOpacity   ? parseFloat(rawContactOpacity)   : 0.15,
    contactLinks:       safeParse<ContactItem[]>(data?.contact_content, DEFAULT_CONTACT),
    aboutConfig:        safeParse<AboutConfig>(data?.about_content, DEFAULT_ABOUT),
    // ── Phase 7：站点身份信息 ──────────────────────────────────────────────────
    siteTitle:          data?.site_title        ?? 'NNNullptr',
    siteDescription:    data?.site_description  ?? 'NNNullptr',
    siteAuthor:         data?.site_author       ?? 'NNNullptr',
    siteUsername:       data?.site_username     ?? 'NNNullptr',
    siteAvatarUrl:      data?.site_avatar_url   ?? '/assets/avatarSrc.jpg',
    siteRole:           data?.site_role         ?? 'Software Developer',
    siteBrand:          data?.site_brand        ?? 'MoeKernel',
    bootSubtitle:       data?.boot_subtitle     ?? 'Welcome',
  };
}
