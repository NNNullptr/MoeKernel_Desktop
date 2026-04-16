/**
 * @file games-folder/index.tsx
 * @description Games Folder App — Windows XP 资源管理器风格的游戏启动器。
 *
 * ═══════════════════════════════════════════════════════════
 *  🎮 如何添加新游戏（只需修改下方 GAMES_LIST 数组）：
 * ═══════════════════════════════════════════════════════════
 *
 *  步骤一：准备游戏文件（任选其一）
 *    A. 本地游戏：把单页游戏文件夹放到 /public/games/<游戏名>/ 下
 *       例如：public/games/mario/index.html
 *       然后 url 填写 "/games/mario/index.html"
 *
 *    B. 在线游戏：直接把游戏网址填到 url 字段
 *       注意：部分网站会拒绝被 iframe 嵌入（X-Frame-Options 限制）
 *       推荐寻找 itch.io / GitHub Pages 上的开源游戏
 *
 *  步骤二：在 GAMES_LIST 数组中新增一项配置：
 *    {
 *      id: 'unique-id',          // 唯一 ID，用于 React key，随意取名
 *      title: '显示的游戏名称',
 *      icon: '🎮',               // Emoji 图标，也可以改成 iconSrc 路径（见下方说明）
 *      description: '简短描述',   // 悬浮时展示
 *      url: '/games/xxx/index.html' 或 'https://...',
 *    }
 *
 *  步骤三：（可选）替换为自定义图标图片
 *    把图片放到 public/assets/icons/games/ 下，然后把 icon 字段改为：
 *    iconSrc: '/assets/icons/games/minesweeper.ico'
 *    并在 FolderTile 中读取 game.iconSrc 替代 emoji
 *
 * ═══════════════════════════════════════════════════════════
 *
 * 架构说明：
 *  - playingGame 为 null  → 显示"文件夹视图"（游戏图标网格）
 *  - playingGame 有值     → 显示"游戏视图"（全屏 iframe 沙盒）
 *  - 后退按钮将 playingGame 重置为 null，返回文件夹
 *  - 地址栏随当前视图自动联动更新
 */

import { useState } from 'react';

// ─────────────────────────────────────────────
// ★ 游戏列表配置区 — 在这里添加/删除/修改游戏 ★
// ─────────────────────────────────────────────
interface GameDef {
  /** React key，必须唯一 */
  id: string;
  /** 显示在图标下方的游戏名称 */
  title: string;
  /** Emoji 图标（若要使用图片，可扩展为 iconSrc 字段） */
  icon: string;
  /** 鼠标悬浮时显示的简短描述 */
  description: string;
  /**
   * 游戏地址：
   *   - 本地游戏："/games/minesweeper/index.html"  ← public/ 下的路径
   *   - 在线游戏："https://example.com/game"        ← 需确认该网站允许 iframe 嵌入
   */
  url: string;
}

const GAMES_LIST: GameDef[] = [
  // ── 示范游戏 1：扫雷（在线，itch.io 开源版）──────────────────────────────
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: '💣',
    description: '经典扫雷，左键揭格，右键插旗',
    // itch.io 上的开源扫雷，允许 iframe 嵌入
    url: 'https://kayernyc.itch.io/minesweeper',
  },
  // ── 示范游戏 2：2048（在线）──────────────────────────────────────────────
  {
    id: '2048',
    title: '2048',
    icon: '🔢',
    description: '滑动方块，合并数字到 2048',
    url: 'https://play2048.co/',
  },
  // ── 示范游戏 3：贪吃蛇（在线）───────────────────────────────────────────
  {
    id: 'snake',
    title: 'Snake',
    icon: '🐍',
    description: '经典贪吃蛇，用方向键控制',
    url: 'https://www.google.com/fbx?fbx=snake_arcade',
  },
  // ── 示范游戏 4：Tetris（在线，GitHub Pages）──────────────────────────────
  {
    id: 'tetris',
    title: 'Tetris',
    icon: '🟦',
    description: '开源俄罗斯方块',
    url: 'https://chvin.github.io/react-tetris/',
  },
  // ── 示范游戏 5：Pacman（在线）────────────────────────────────────────────
  {
    id: 'pacman',
    title: 'Pac-Man',
    icon: '👾',
    description: '经典吃豆人，用方向键操控',
    url: 'https://freepacman.org/',
  },
  // ── 示范游戏 6：Chess（在线）─────────────────────────────────────────────
  {
    id: 'chess',
    title: 'Chess',
    icon: '♟️',
    description: '国际象棋，人机对战',
    url: 'https://www.chess.com/play/computer',
  },
  // ──────────────────────────────────────────────────────────────────────────
  // 💡 在此处继续添加游戏，参考文件顶部的使用步骤说明
  // ──────────────────────────────────────────────────────────────────────────
];

// ─────────────────────────────────────────────
// 样式常量
// ─────────────────────────────────────────────
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ─────────────────────────────────────────────
// 子组件：资源管理器工具栏
// ─────────────────────────────────────────────
/**
 * @description XP 资源管理器风格工具栏。
 * - 菜单行：File / Edit / View / Favorites / Tools / Help
 * - 工具行：后退按钮（可高亮/禁用）+ 地址栏
 * @param address 地址栏显示内容，随视图联动
 * @param canGoBack 是否显示可用的后退按钮
 * @param onBack 点击后退按钮的回调
 */
function ExplorerToolbar({
  address,
  canGoBack,
  onBack,
}: {
  address: string;
  canGoBack: boolean;
  onBack: () => void;
}) {
  return (
    <div
      style={{
        background: '#ece9d8',
        borderBottom: '1px solid #aca899',
        fontFamily: FONT,
        fontSize: '12px',
        flexShrink: 0,
      }}
    >
      {/* 菜单行 */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          padding: '2px 4px',
          borderBottom: '1px solid #aca899',
        }}
      >
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
          <button
            key={m}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 6px',
              cursor: 'pointer',
              fontFamily: FONT,
              fontSize: '12px',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* 工具行：后退按钮 + 地址栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 6px',
        }}
      >
        {/* 后退按钮 */}
        <button
          onClick={onBack}
          disabled={!canGoBack}
          title="Back"
          style={{
            background: canGoBack
              ? 'linear-gradient(to bottom, #f0f0f0, #d0d0d0)'
              : '#e8e8e0',
            border: canGoBack ? '1px solid #888' : '1px solid #bbb',
            borderRadius: '3px',
            padding: '1px 8px',
            cursor: canGoBack ? 'pointer' : 'default',
            fontFamily: FONT,
            fontSize: '12px',
            color: canGoBack ? '#000' : '#aaa',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            flexShrink: 0,
          }}
        >
          ◀ Back
        </button>

        {/* 地址栏标签 */}
        <span style={{ color: '#555', fontSize: '11px', flexShrink: 0 }}>
          Address
        </span>

        {/* 地址栏输入框（只读展示） */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            border: '1px solid #999',
            padding: '1px 6px',
            fontSize: '12px',
            borderRadius: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {address}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 子组件：单个游戏图标磁贴
// ─────────────────────────────────────────────
/**
 * @description 渲染一个可悬浮高亮的游戏图标。
 * - 悬浮时背景变为 XP 蓝（#5a5a5a），文字变白
 * - 展示 emoji 图标 + 游戏名称
 * @param game 游戏配置对象
 * @param onClick 双击启动游戏的回调
 */
function FolderTile({
  game,
  onClick,
}: {
  game: GameDef;
  onClick: (game: GameDef) => void;
}) {
  const [hov, setHov] = useState(false);

  return (
    <div
      title={game.description}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onDoubleClick={() => onClick(game)}
      onClick={() => onClick(game)} // 单击也可以启动，符合 XP 单击打开习惯
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        width: '80px',
        cursor: 'pointer',
        background: hov ? '#5a5a5a' : 'transparent',
        borderRadius: '4px',
        padding: '8px 4px',
        userSelect: 'none',
      }}
    >
      {/* Emoji 图标 */}
      <span
        style={{
          fontSize: '36px',
          lineHeight: 1,
          filter: hov ? 'brightness(1.2)' : 'none',
        }}
      >
        {game.icon}
      </span>

      {/* 游戏名称 */}
      <span
        style={{
          fontSize: '11px',
          fontFamily: FONT,
          color: hov ? '#fff' : '#000',
          textAlign: 'center',
          wordBreak: 'break-word',
          lineHeight: 1.3,
        }}
      >
        {game.title}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// 主组件：游戏文件夹 App
// ─────────────────────────────────────────────
/**
 * @description 游戏文件夹主组件。
 *
 * 状态机：
 *  ┌─────────────────────────────────────────────────┐
 *  │  playingGame === null                           │
 *  │  → 显示游戏图标网格（文件夹视图）                 │
 *  │    地址栏：C:\Games                              │
 *  ├─────────────────────────────────────────────────┤
 *  │  playingGame !== null                           │
 *  │  → 全屏 iframe 沙盒运行游戏（游戏视图）           │
 *  │    地址栏：C:\Games\{游戏名}.exe                 │
 *  │    后退按钮：点击返回文件夹视图                   │
 *  └─────────────────────────────────────────────────┘
 */
export function GamesFolderApp() {
  // 当前正在运行的游戏，null 表示停留在文件夹列表视图
  const [playingGame, setPlayingGame] = useState<GameDef | null>(null);

  /** 启动游戏：切换到 iframe 游戏视图 */
  const handleLaunch = (game: GameDef) => {
    setPlayingGame(game);
  };

  /** 返回文件夹：关闭 iframe，回到图标网格 */
  const handleBack = () => {
    setPlayingGame(null);
  };

  // 地址栏内容随状态联动
  const address =
    playingGame
      ? `C:\\Games\\${playingGame.title}.exe`
      : 'C:\\Games';

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* 工具栏：后退按钮 + 地址栏 */}
      <ExplorerToolbar
        address={address}
        canGoBack={playingGame !== null}
        onBack={handleBack}
      />

      {/* 内容区：根据状态切换"文件夹视图"或"游戏视图" */}
      {playingGame === null ? (
        // ── 文件夹视图：游戏图标网格 ────────────────────────────────────────
        <div
          style={{
            flex: 1,
            padding: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: '12px',
            background: '#fff',
            overflowY: 'auto',
          }}
        >
          {GAMES_LIST.map((game) => (
            <FolderTile key={game.id} game={game} onClick={handleLaunch} />
          ))}

          {/* 底部提示：引导用户了解如何添加游戏 */}
          <div
            style={{
              width: '100%',
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid #e0e0e0',
              fontSize: '10px',
              color: '#999',
              fontFamily: FONT,
            }}
          >
            💡 点击游戏图标即可启动 · 将本地游戏放入 /public/games/ 文件夹并在 GAMES_LIST 中添加记录即可上架新游戏
          </div>
        </div>
      ) : (
        // ── 游戏视图：全屏 iframe 沙盒 ──────────────────────────────────────
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* 加载占位提示（iframe 背景可见） */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1a1a2e',
              color: '#888',
              fontFamily: FONT,
              fontSize: '13px',
              zIndex: 0,
            }}
          >
            ⏳ Loading {playingGame.title}...
          </div>

          {/* 游戏 iframe，沙盒模式隔离，覆盖占位层 */}
          <iframe
            key={playingGame.id} // key 变化时强制重新加载 iframe
            src={playingGame.url}
            title={playingGame.title}
            allow="fullscreen"
            // sandbox 属性确保游戏无法访问父页面的 DOM/cookie
            // allow-scripts 允许 JS 运行，allow-same-origin 允许本地游戏读取相对路径资源
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              zIndex: 1,
            }}
          />
        </div>
      )}
    </div>
  );
}
