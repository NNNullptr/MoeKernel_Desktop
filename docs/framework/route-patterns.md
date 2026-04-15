# TanStack Router Patterns

## Basic Route

```tsx
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router"
import { AboutPage } from "@/client/views/about-page"

export const Route = createFileRoute("/about")({
  component: AboutPage,
})
```

Route files should be thin — import a view component and export the route.

## createFileRoute Options

```tsx
export const Route = createFileRoute("/posts/$id")({
  component: PostPage,
  loader: async ({ params }) => { /* SSR data loading */ },
  errorComponent: PostError,
  pendingComponent: PostLoading,
  beforeLoad: async ({ context }) => { /* auth guards, redirects */ },
})
```

| Option | Purpose |
|--------|---------|
| `component` | The React component to render |
| `loader` | Async data loading function (runs on server for SSR) |
| `errorComponent` | Component shown when loader or component throws |
| `pendingComponent` | Component shown while loader is pending |
| `beforeLoad` | Runs before loader — use for auth checks, redirects |

## Dynamic Routes (Params)

File: `src/routes/posts.$id.tsx` → URL: `/posts/:id`

```tsx
import { createFileRoute, useParams } from "@tanstack/react-router"

export const Route = createFileRoute("/posts/$id")({
  component: PostPage,
})

function PostPage() {
  const { id } = useParams({ from: "/posts/$id" })
  // id is typed as string
  return <div>Post {id}</div>
}
```

## Search Params

```tsx
import { createFileRoute, useSearch } from "@tanstack/react-router"
import z from "zod"

const searchSchema = z.object({
  page: z.number().optional().default(1),
  q: z.string().optional(),
})

export const Route = createFileRoute("/posts")({
  validateSearch: searchSchema,
  component: PostsPage,
})

function PostsPage() {
  const { page, q } = useSearch({ from: "/posts" })
  return <div>Page {page}, query: {q}</div>
}
```

## Route with Loader (SSR Data)

```tsx
import { createFileRoute } from "@tanstack/react-router"
import { serverLoader } from "@/server/loader"

export const Route = createFileRoute("/dashboard")({
  loader: async () => {
    return await serverLoader(async (caller) => {
      return { stats: await caller.dashboard.getStats() }
    })
  },
  component: DashboardPage,
})

function DashboardPage() {
  const data = Route.useLoaderData()
  return <div>{data?.stats.totalUsers} users</div>
}
```

## Route with Auth Guard (beforeLoad)

```tsx
export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" })
    }
  },
  component: AdminPage,
})
```

## Nested Routes & Outlet

**Core rule**: Any route that has child routes is a **parent/layout route** and MUST render `<Outlet />` to display the matched child. Without `<Outlet />`, the URL changes but the child component never renders.

### Parent + Index + Child Pattern

The most common pattern. The parent provides shared layout, the index renders at the exact parent path, and children render at sub-paths.

Flat files:
```
src/routes/
├── gallery.tsx           # Parent layout (MUST have <Outlet />)
├── gallery.index.tsx     # Renders at /gallery (exact)
├── gallery.$id.tsx       # Renders at /gallery/:id
```

Directory files (equivalent):
```
src/routes/
├── gallery/
│   ├── route.tsx         # Parent layout (MUST have <Outlet />)
│   ├── index.tsx         # Renders at /gallery (exact)
│   ├── $id.tsx           # Renders at /gallery/:id
```

Parent layout file:
```tsx
// src/routes/gallery.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/gallery")({
  component: GalleryLayout,
})

function GalleryLayout() {
  return (
    <div>
      <GalleryNav />
      <Outlet />
    </div>
  )
}
```

Index route file:
```tsx
// src/routes/gallery.index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { GalleryPage } from "@/client/views/gallery-page"

export const Route = createFileRoute("/gallery/")({
  component: GalleryPage,
})
```

Child route file:
```tsx
// src/routes/gallery.$id.tsx
import { createFileRoute } from "@tanstack/react-router"
import { GalleryDetailPage } from "@/client/views/gallery-detail-page"

export const Route = createFileRoute("/gallery/$id")({
  component: GalleryDetailPage,
})
```

If the parent needs NO shared layout (just pass-through), use a minimal wrapper:
```tsx
function GalleryLayout() {
  return <Outlet />
}
```

### Common Mistake: Missing Outlet

If a route file like `posts.tsx` renders a full page component directly AND also has child routes (`posts.$id.tsx`), the children will never render. The fix is either:
1. Move the page content to `posts.index.tsx` and make `posts.tsx` render only `<Outlet />`
2. Or remove the parent–child relationship by renaming (e.g. `posts_.detail.$id.tsx` to escape the nesting)

### Directory Routes Without Shared Layout

When two routes share a URL prefix but need NO shared layout, use a directory with only leaf files and NO `route.tsx`:

```
src/routes/
├── projects/
│   ├── index.tsx          # /projects (list page)
│   └── $id.tsx            # /projects/:id (detail page)
```

Because there is no `projects/route.tsx` or `projects.tsx`, the router does NOT create a parent–child relationship. Both files are independent routes under the root — no `<Outlet />` needed. Each page renders its own full layout.

```tsx
// src/routes/projects/index.tsx
import { createFileRoute } from "@tanstack/react-router"
import { ProjectsPage } from "@/client/views/projects-page"

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
})
```

```tsx
// src/routes/projects/$id.tsx
import { createFileRoute } from "@tanstack/react-router"
import { ProjectDetailPage } from "@/client/views/project-detail-page"

export const Route = createFileRoute("/projects/$id")({
  component: ProjectDetailPage,
})
```

Use this pattern when `/projects` and `/projects/:id` are completely separate pages with no shared chrome (nav, sidebar, etc.).

## Pathless Layout Routes

File: `src/routes/_dashboard.tsx` (underscore prefix = no URL segment)

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main><Outlet /></main>
    </div>
  )
}
```

Children: `src/routes/_dashboard/index.tsx`, `src/routes/_dashboard/settings.tsx`, etc.
The `_dashboard` prefix means the layout wraps its children without adding `/dashboard` to the URL.

## Escaping Nesting with `_` Suffix

Use trailing underscore to escape a parent route's nesting. This creates an independent route that shares the URL prefix but NOT the layout:

```
src/routes/
├── posts.tsx             # Layout parent (has <Outlet />)
├── posts.index.tsx       # Nested child: /posts (renders inside posts.tsx layout)
├── posts.$id.tsx         # Nested child: /posts/:id (renders inside posts.tsx layout)
├── posts_.$id.edit.tsx   # ESCAPED: /posts/:id/edit (does NOT render inside posts.tsx)
```

## Splat (Catch-All) Routes

File `$.tsx` captures all remaining path segments:

```tsx
// src/routes/files.$.tsx → matches /files/any/path/here
import { createFileRoute, useParams } from "@tanstack/react-router"

export const Route = createFileRoute("/files/$")({
  component: FileViewer,
})

function FileViewer() {
  const { _splat } = useParams({ from: "/files/$" })
  // _splat = "any/path/here"
  return <div>Viewing: {_splat}</div>
}
```

## Search Params with Zod Validation

```tsx
import { createFileRoute, useSearch } from "@tanstack/react-router"
import z from "zod"

const searchSchema = z.object({
  page: z.number().optional().default(1),
  q: z.string().optional(),
  sort: z.enum(["name", "date", "relevance"]).optional(),
})

export const Route = createFileRoute("/posts")({
  validateSearch: searchSchema,
  component: PostsPage,
})

function PostsPage() {
  const { page, q, sort } = Route.useSearch()
  return <div>Page {page}, query: {q}, sort: {sort}</div>
}
```

Update search params via `<Link>` or `useNavigate()`:
```tsx
<Link to="/posts" search={{ page: 2, q: "react" }}>Page 2</Link>

const navigate = useNavigate()
navigate({ to: "/posts", search: (prev) => ({ ...prev, page: prev.page + 1 }) })
```

## Data Loading: beforeLoad vs loader

Execution order:
1. `beforeLoad` runs **sequentially** from parent → child (serial chain)
2. `loader` runs **in parallel** after ALL `beforeLoad` complete

```tsx
export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    // Runs first. Return value merges into context for children.
    if (!context.user) throw redirect({ to: "/login" })
    return { permissions: await fetchPermissions(context.user.id) }
  },
  loader: async ({ context }) => {
    // Runs after ALL beforeLoad. context includes parent beforeLoad data.
    return { stats: await fetchStats(context.permissions) }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const data = Route.useLoaderData()        // { stats: ... }
  const ctx = Route.useRouteContext()        // { user, permissions, ... }
}
```

Key differences:
- `beforeLoad` return merges into context → flows to ALL child routes and loaders
- `loader` return is route-local → only accessible via `Route.useLoaderData()` in same route
- Use `beforeLoad` for auth guards and dependency injection
- Use `loader` for data fetching

## Route Error & Loading States

```tsx
export const Route = createFileRoute("/posts/$id")({
  component: PostPage,
  pendingComponent: () => <div>Loading post...</div>,
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
  notFoundComponent: () => <div>Post not found</div>,
})
```

Throw `notFound()` from loader to trigger `notFoundComponent`:
```tsx
import { notFound } from "@tanstack/react-router"

loader: async ({ params }) => {
  const post = await getPost(params.id)
  if (!post) throw notFound()
  return post
}
```

## Non-Route Files (Ignored by Router)

Prefix directories with `-` to co-locate helper files that the router should ignore:

```
src/routes/
├── posts/
│   ├── -components/     # Ignored by router
│   │   ├── PostCard.tsx
│   │   └── PostForm.tsx
│   ├── index.tsx
│   └── $id.tsx
```

## Server Handlers (Custom API Endpoints)

For non-tRPC HTTP endpoints (webhooks, OAuth callbacks, etc.):

```tsx
// src/routes/api/webhook.ts
import { createFileRoute } from "@tanstack/react-router"

function handler({ request }: { request: Request }) {
  const body = await request.json()
  // process webhook...
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  })
}

export const Route = createFileRoute("/api/webhook")({
  server: {
    handlers: {
      POST: handler,
    },
  },
})
```

## Navigation

```tsx
import { Link, useNavigate } from "@tanstack/react-router"

// Declarative
<Link to="/posts/$id" params={{ id: "123" }}>View Post</Link>
<Link to="/posts" search={{ page: 2, q: "react" }}>Page 2</Link>

// Imperative
const navigate = useNavigate()
navigate({ to: "/posts/$id", params: { id: "123" } })
```
