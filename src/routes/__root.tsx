/// <reference types="vite/client" />
import { Outlet, createRootRoute, Scripts } from '@tanstack/react-router';

import globalCss from '@/styles/global.css?url';
import { TrpcProvider } from '@/client/trpc/provider';

export const Route = createRootRoute({
  component: RootDocument,
});

function RootDocument() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="NNNullptr" />
        <meta name="author" content="NNNullptr" />
        <meta property="og:type" content="website" />
        <meta property="article:author" content="NNNullptr" />
        <meta property="og:title" content="NNNullptr" />
        <meta property="og:description" content="NNNullptr" />
        <meta property="og:image" content="/og-card.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NNNullptr" />
        <meta name="twitter:description" content="NNNullptr" />
        <meta name="twitter:image" content="/og-card.png" />
        <meta name="referrer" content="no-referrer" />
        <link
          rel="icon"
          href="https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico"
          type="image/x-icon"
        />
        <link rel="stylesheet" href="/home/styles/style_3b43319be51c.css" />
        <link rel="stylesheet" href="/home/styles/style_44662de83434.css" />
        <link rel="stylesheet" href="/home/styles/style_568d4a59d1ae.css" />
        <link rel="stylesheet" href="/home/styles/merged_styles.css" />
        <title>moekernel</title>
        <link rel="stylesheet" href={globalCss} />
        <link rel="icon" href="favicon.png" />
      </head>
      <body>
        <TrpcProvider>
          <Outlet />
        </TrpcProvider>
        <Scripts />
      </body>
    </html>
  );
}
