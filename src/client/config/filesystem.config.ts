export type FsItemType = 'folder' | 'file';
export type FileType = 'image' | 'video' | 'audio' | 'other';

export interface FsItem {
  name: string;
  type: FsItemType;
  /*
   * 修改某个条目图标的步骤：
   * 1. 找到对应的 FsItem 对象
   * 2. 添加 icon: '/assets/icons/你的图标.png' 字段
   * 3. 保存文件，My Computer 和 Start 菜单会自动更新
   */
  icon?: string;
  children?: FsItem[];
}

export const DEFAULT_FILE_ICON = '/assets/icons/file.png';

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'ico', 'bmp', 'svg']);
const VIDEO_EXTS = new Set(['mp4', 'webm', 'mov', 'avi']);
const AUDIO_EXTS = new Set(['mp3', 'ogg', 'wav', 'flac', 'aac']);

export function inferFileType(name: string): FileType {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (IMAGE_EXTS.has(ext)) return 'image';
  if (VIDEO_EXTS.has(ext)) return 'video';
  if (AUDIO_EXTS.has(ext)) return 'audio';
  return 'other';
}

export function getPublicUrl(pathSegments: string[]): string {
  return '/assets/' + pathSegments.join('/');
}

export interface PendingViewFile {
  type: 'image' | 'video' | 'audio';
  url: string;
  title: string;
}

let _pendingViewFile: PendingViewFile | null = null;

export function setPendingViewFile(f: PendingViewFile): void {
  _pendingViewFile = f;
}

export function consumePendingViewFile(): PendingViewFile | null {
  const f = _pendingViewFile;
  _pendingViewFile = null;
  return f;
}

export const FILE_SYSTEM: FsItem[] = [
  {
    name: 'icons', type: 'folder',
    children: [
      { name: 'file.png', type: 'file' },
      { name: 'My Computer.png', type: 'file' },
      { name: 'Resume.png', type: 'file' },
      { name: 'About.png', type: 'file' },
      { name: 'Contact.png', type: 'file' },
      { name: 'Winamp.png', type: 'file' },
      { name: 'Paint.png', type: 'file' },
      { name: 'Games.png', type: 'file' },
      { name: 'MSN.png', type: 'file' },
      { name: 'Media.png', type: 'file' },
      { name: 'Portfolio.png', type: 'file' },
      { name: 'Blog.png', type: 'file' },
      { name: 'Recycle.png', type: 'file' },
      { name: 'github.png', type: 'file' },
      { name: 'twitter.png', type: 'file' },
      { name: 'blog2.png', type: 'file' },
      { name: 'tray', type: 'folder', children: [
        { name: 'icon1.png', type: 'file' },
        { name: 'icon2.png', type: 'file' },
      ]},
    ],
  },
  {
    name: 'wallpapers', type: 'folder',
    children: [
      { name: 'wallpaper.jpg', type: 'file' },
      { name: 'wallpaper1.jpg', type: 'file' },
      { name: 'wallpaper2.jpg', type: 'file' },
      { name: 'bg1.jpg', type: 'file' },
      { name: 'bg2.jpg', type: 'file' },
      { name: 'bg3.jpg', type: 'file' },
      { name: 'bg4.jpg', type: 'file' },
      { name: 'bg5.jpg', type: 'file' },
      { name: 'bg6.jpg', type: 'file' },
      { name: 'bg7.jpg', type: 'file' },
      { name: 'bg8.jpg', type: 'file' },
    ],
  },
  {
    name: 'video', type: 'folder',
    children: [
      { name: '1.mp4', type: 'file' },
      { name: '1.webp', type: 'file' },
    ],
  },
  {
    name: 'tracks', type: 'folder',
    children: [
      { name: 'Tatara.mp3', type: 'file' },
    ],
  },
  {
    name: 'covers', type: 'folder',
    children: [
      { name: 'cover1.jpg', type: 'file' },
      { name: 'cover2.jpg', type: 'file' },
    ],
  },
  {
    name: 'pets', type: 'folder',
    children: [
      { name: 'avatars', type: 'folder', children: [] },
      { name: 'sprites', type: 'folder', children: [] },
    ],
  },
  { name: 'portfolio', type: 'folder', children: [] },
];

let _pendingInitialPath: string[] = [];

export function setPendingInitialPath(path: string[]): void {
  _pendingInitialPath = path;
}

export function consumePendingInitialPath(): string[] {
  const path = _pendingInitialPath;
  _pendingInitialPath = [];
  return path;
}
