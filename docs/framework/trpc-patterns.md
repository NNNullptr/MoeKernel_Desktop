# tRPC v11 Patterns

## Architecture

This project uses tRPC v11 with the **Options Proxy** pattern (via `createTRPCOptionsProxy`), NOT `createTRPCReact`.

Two objects are exported from `@/client/trpc`:
- `trpc` — Options Proxy: provides `.queryOptions()`, `.mutationOptions()`, `.queryKey()`, `.pathKey()` for use with TanStack Query hooks
- `trpcClient` — Vanilla client: provides `.query()`, `.mutate()` for direct calls (rarely needed in components)
- `queryClient` — Shared `QueryClient` instance

The provider in `__root.tsx` is just `QueryClientProvider` — no `trpc.Provider` needed.

## Client-Side: Queries

```tsx
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/client/trpc"

export function TodoList() {
  const todosQuery = useQuery(trpc.todo.list.queryOptions())

  if (todosQuery.isLoading) return <div>Loading...</div>
  if (todosQuery.isError) return <div>Error: {todosQuery.error.message}</div>

  return (
    <ul>
      {todosQuery.data?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

With input:
```tsx
const todoQuery = useQuery(trpc.todo.getById.queryOptions({ id: "123" }))
```

Disable with `skipToken`:
```tsx
import { skipToken } from "@tanstack/react-query"
const query = useQuery(trpc.todo.getById.queryOptions(id ? { id } : skipToken))
```

## Client-Side: Mutations

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/client/trpc"
import { toast } from "sonner"

export function CreateTodo() {
  const queryClient = useQueryClient()

  const createMutation = useMutation(trpc.todo.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.todo.list.queryKey() })
      toast.success("Created!")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  }))

  const handleSubmit = (data: CreateTodoInput) => {
    createMutation.mutate(data)
  }

  return (
    <button onClick={() => handleSubmit({ title: "New" })} disabled={createMutation.isPending}>
      {createMutation.isPending ? "Creating..." : "Create"}
    </button>
  )
}
```

## Cache Invalidation

```tsx
const queryClient = useQueryClient()

// Invalidate a specific query
queryClient.invalidateQueries({ queryKey: trpc.todo.list.queryKey() })

// Invalidate all queries under a router
queryClient.invalidateQueries({ queryKey: trpc.todo.pathKey() })

// Invalidate ALL tRPC queries
queryClient.invalidateQueries({ queryKey: trpc.pathKey() })
```

## Server-Side: Defining Procedures

Procedures are defined as **plain objects** in `src/server/trpc/routes/`:

```ts
// src/server/trpc/routes/todo.ts
import z from "zod"
import { publicProcedure } from "../procedure"

const todos: { id: string; title: string; done: boolean }[] = []

export const todoRouter = {
  list: publicProcedure.query(() => {
    return todos
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const todo = todos.find((t) => t.id === input.id)
      if (!todo) throw new Error("Not found")
      return todo
    }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(({ input }) => {
      const todo = { id: crypto.randomUUID(), title: input.title, done: false }
      todos.push(todo)
      return todo
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), title: z.string().optional(), done: z.boolean().optional() }))
    .mutation(({ input }) => {
      const idx = todos.findIndex((t) => t.id === input.id)
      const existing = todos[idx]
      if (!existing) throw new Error("Not found")
      const updated = { ...existing, ...input }
      todos[idx] = updated
      return updated
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const idx = todos.findIndex((t) => t.id === input.id)
      if (idx === -1) throw new Error("Not found")
      todos.splice(idx, 1)
      return { success: true }
    }),
}
```

## Server-Side: Registering Routers

```ts
// src/server/trpc/router.ts
import { createTRPCRouter } from "./procedure"
import { todoRouter } from "./routes/todo"

export const appRouter = createTRPCRouter({
  todo: todoRouter,
})

export type AppRouter = typeof appRouter
```

## Server-Side: SSR Data Loading with serverLoader

Use `serverLoader` in route loaders for SSR data fetching (bypasses HTTP):

```ts
// src/routes/todos.tsx
import { createFileRoute } from "@tanstack/react-router"
import { serverLoader } from "@/server/loader"
import { TodosPage } from "@/client/views/todos-page"

export const Route = createFileRoute("/todos")({
  loader: async () => {
    return await serverLoader(async (caller) => {
      return caller.todo.list()
    })
  },
  component: TodosPage,
})
```

## Server-Side: Direct Caller

For server-to-server calls outside of route loaders:

```ts
import { createCaller } from "@/server/trpc/caller"

const caller = createCaller()
const todos = await caller.todo.list()
```
