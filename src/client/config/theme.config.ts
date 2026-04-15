/**
 * @file theme.config.ts
 * @description Windows XP 桌面全局主题配置。
 *
 * 如何自定义：
 * - 替换 WALLPAPER_URL：将你自己的壁纸图片路径填入。
 * 请将图片文件放入：public/assets/wallpapers/
 * 然后引用为：'/assets/wallpapers/your-file.jpg'
 *
 * - WINDOWS_LOGO_URL：开始按钮中的 Windows 小图标。
 * 请将文件放入：public/assets/icons/
 *
 * - SYSTEM_TRAY_ICONS：任务栏右下角系统托盘的三个小图标。
 */

/** 桌面壁纸图片 URL */
export const WALLPAPER_URL = 'public/assets/wallpapers/wallpaper.jpg';
// ↑ 若要使用本地文件：将其放入 public/assets/wallpapers/ 并修改为 '/assets/wallpapers/your-file.webp'

/** 开始按钮内显示的 Windows 图标 */
export const WINDOWS_LOGO_URL = 'https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico';
// ↑ 若要使用本地文件：将其放入 public/assets/icons/ 并修改为 '/assets/icons/windows-logo.ico'

/** 系统托盘图标 URL（任务栏右下角） */
export const SYSTEM_TRAY_ICONS: string[] = [
  'https://static.step1.dev/g9nbov/assets/f41de3abce9a.png',
  'https://static.step1.dev/g9nbov/assets/cff960cc7c15.png',
  'https://static.step1.dev/g9nbov/assets/a52bbbc23e20.png',
];
// ↑ 若要使用本地文件：将其放入 public/assets/icons/tray/ 并修改为 '/assets/icons/tray/icon1.png'