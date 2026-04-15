# Form & Toast Patterns

## Form: react-hook-form + Zod v4 + shadcn + tRPC

Complete example of a create/edit form integrated with tRPC mutation:

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/client/trpc"
import { toast } from "sonner"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// 1. Define schema with Zod v4
const createItemSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z.email({ error: "Invalid email" }),
  amount: z.number().positive({ error: "Must be positive" }),
})

type CreateItemInput = z.infer<typeof createItemSchema>

// 2. Component
export function CreateItemForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  // 3. Setup form with Zod resolver
  const form = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: 0,
    },
  })

  // 4. Setup tRPC mutation
  const createMutation = useMutation(
    trpc.item.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.item.list.queryKey() })
        toast.success("Item created!")
        form.reset()
        onSuccess?.()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  )

  // 5. Handle submit
  const onSubmit = (data: CreateItemInput) => {
    createMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  )
}
```

## Edit Form Pattern

For edit forms, pass initial values and use an update mutation:

```tsx
export function EditItemForm({ item }: { item: Item }) {
  const queryClient = useQueryClient()
  const form = useForm<UpdateItemInput>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: {
      name: item.name,
      email: item.email,
      amount: item.amount,
    },
  })

  const updateMutation = useMutation(
    trpc.item.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.item.list.queryKey() })
        toast.success("Updated!")
      },
      onError: (error) => toast.error(error.message),
    })
  )

  const onSubmit = (data: UpdateItemInput) => {
    updateMutation.mutate({ id: item.id, ...data })
  }

  // Same form JSX as create, but with updateMutation
}
```

## Delete Pattern

```tsx
const queryClient = useQueryClient()
const deleteMutation = useMutation(
  trpc.item.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.item.list.queryKey() })
      toast.success("Deleted")
    },
    onError: (error) => toast.error(error.message),
  })
)

// Usage
<Button
  variant="destructive"
  onClick={() => deleteMutation.mutate({ id: item.id })}
  disabled={deleteMutation.isPending}
>
  Delete
</Button>
```

## Toast (sonner)

Toast is available via `sonner`. The `<Toaster />` component is already in `__root.tsx`.

```tsx
import { toast } from "sonner"

// Basic
toast("Something happened")

// Variants
toast.success("Saved successfully!")
toast.error("Something went wrong")
toast.info("FYI...")
toast.warning("Be careful")

// With description
toast.success("Item created", { description: "You can now view it in the list" })

// Promise-based (for async operations)
toast.promise(asyncFn(), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed to save",
})
```

## Form Inside Dialog/Sheet

When using forms inside `Dialog` or `Sheet`, reset the form when closing:

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function CreateItemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const form = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: { name: "", email: "", amount: 0 },
  })

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) form.reset()
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Item</DialogTitle>
        </DialogHeader>
        {/* Form JSX here */}
      </DialogContent>
    </Dialog>
  )
}
```
