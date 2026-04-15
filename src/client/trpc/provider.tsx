import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '.';

export function TrpcProvider(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
