// src/routes/index.tsx
import { trpcClient } from '@/client/trpc';
import { HomePage } from '@/client/views/home';
import { WelcomeGuard } from '@/client/views/welcome-guard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <WelcomeGuard>
      <HomePage />
    </WelcomeGuard>
  );
}
