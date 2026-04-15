# Zod v4 Guide

This project uses Zod v4. Many Zod v3 APIs are deprecated or removed. Always use the Zod v4 patterns below.

## String Formats — Top-Level Functions

String format validators are now standalone top-level functions, not methods on `z.string()`:

| Zod v3 (deprecated) | Zod v4 (correct) |
|---------------------|------------------|
| `z.string().email()` | `z.email()` |
| `z.string().uuid()` | `z.uuid()` |
| `z.string().url()` | `z.url()` |
| `z.string().emoji()` | `z.emoji()` |
| `z.string().base64()` | `z.base64()` |
| `z.string().nanoid()` | `z.nanoid()` |
| `z.string().cuid()` | `z.cuid()` |
| `z.string().cuid2()` | `z.cuid2()` |
| `z.string().ulid()` | `z.ulid()` |
| `z.string().ip()` | `z.ipv4()` or `z.ipv6()` |

The method forms still work but are deprecated. Always use the top-level form.

## Error Customization

| Zod v3 (removed/deprecated) | Zod v4 (correct) |
|-----------------------------|------------------|
| `z.string({ message: "Required" })` | `z.string({ error: "Required" })` |
| `z.string({ invalid_type_error: "..." })` | `z.string({ error: (iss) => iss.input === undefined ? "Required" : "Not a string" })` |
| `z.string({ required_error: "..." })` | Same as above — use `error` function |

## Records

```ts
// v3 (removed)
z.record(z.string())

// v4 (correct — two arguments required)
z.record(z.string(), z.string())
```

## Enums

```ts
// v3 (deprecated)
z.nativeEnum(MyEnum)

// v4 (correct)
z.enum(MyEnum)
```

Accessing values:
```ts
const ColorSchema = z.enum(Color)
ColorSchema.enum.Red  // correct
// ColorSchema.Enum.Red  — removed
// ColorSchema.Values.Red — removed
```

## Object Methods

| Zod v3 (deprecated) | Zod v4 (correct) |
|---------------------|------------------|
| `schema.merge(other)` | `schema.extend(other.shape)` or `z.object({ ...a.shape, ...b.shape })` |
| `schema.strict()` | `z.strictObject({ ... })` |
| `schema.passthrough()` | `z.looseObject({ ... })` |
| `schema.deepPartial()` | Removed — no direct replacement |

## Default Values

In v4, `.default()` expects the **output type** (not input type) and short-circuits parsing:

```ts
// v4: default value must match output type
z.string().transform((val) => val.length).default(0) // default is number (output)

// For pre-parse defaults (v3 behavior), use .prefault():
z.string().transform((val) => val.length).prefault("tuna") // "tuna" → 4
```

## Array nonempty

```ts
// v3: inferred as [string, ...string[]]
// v4: inferred as string[] (same runtime behavior, different type)
z.array(z.string()).nonempty()

// For tuple type [T, ...T[]], use:
z.tuple([z.string()], z.string())
```

## Common Patterns

### Defining a schema for tRPC input
```ts
import z from "zod"

const createTodoSchema = z.object({
  title: z.string().min(1, { error: "Title is required" }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  email: z.email({ error: "Invalid email" }).optional(),
})

type CreateTodoInput = z.infer<typeof createTodoSchema>
```

### Using with react-hook-form
```ts
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const form = useForm<z.infer<typeof createTodoSchema>>({
  resolver: zodResolver(createTodoSchema),
  defaultValues: { title: "", priority: "medium" },
})
```
