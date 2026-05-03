// src/routes/index.tsx
import { trpcClient } from '@/client/trpc';
import { HomePage } from '@/client/views/home';
import { WelcomeGuard } from '@/client/views/welcome-guard';
import { useSiteSettings } from '@/client/hooks/use-site-config';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: Home,
});

/**
 * 客户端覆盖 <title> 与 <meta> 标签。
 *
 * __root.tsx 是 SSR 渲染的，useQuery 无法在服务端读取 DB 数据，
 * 因此 <title> 等标签在 SSR 骨架中保留静态默认值，
 * 客户端水合完成、DB 数据到达后在此处覆盖，适合个人主页场景。
 */
function SiteHead() {
  const settings = useSiteSettings();

  useEffect(() => {
    if (!settings.isLoaded) return;

    document.title = settings.siteTitle;

    const setMeta = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute('content', content);
    };

    setMeta('meta[name="description"]',          settings.siteDescription);
    setMeta('meta[name="author"]',               settings.siteAuthor);
    setMeta('meta[property="og:title"]',         settings.siteTitle);
    setMeta('meta[property="og:description"]',   settings.siteDescription);
    setMeta('meta[property="article:author"]',   settings.siteAuthor);
    setMeta('meta[name="twitter:title"]',        settings.siteTitle);
    setMeta('meta[name="twitter:description"]',  settings.siteDescription);
  }, [
    settings.isLoaded,
    settings.siteTitle,
    settings.siteDescription,
    settings.siteAuthor,
  ]);

  return null;
}

function Home() {
  return (
    <>
      <SiteHead />
      <WelcomeGuard>
        <HomePage />
      </WelcomeGuard>
    </>
  );
}
