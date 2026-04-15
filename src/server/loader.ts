import { type ServerCaller } from '@/server/trpc/caller';

export async function getLoaderCaller() {
  if (typeof window !== 'undefined') return null;
  const { createCaller } = await import('@/server/trpc/caller');
  return createCaller();
}

export async function serverLoader<T>(
  run: (caller: ServerCaller) => Promise<T>
) {
  const caller = await getLoaderCaller();
  if (!caller) return null;
  return await run(caller);
}
