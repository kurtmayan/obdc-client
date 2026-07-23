import SelectInput from "@/components/custom/select"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cluster } from "@/constant/cluster"
import { division } from "@/constant/division"
import { api } from "@/lib/api"
import { queryClient } from "@/queryClient"
import { storeManagement } from "@/store/store-management-page"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Dialog as SheetPrimitive } from "radix-ui"
import { useEffect } from "react"
import { useCreateStore } from "./actions"

type StoreCreateSheetProps = React.ComponentProps<typeof SheetPrimitive.Root>

// {
//   "contactPerson": "string",
//   "contactNumber": "string",
//   "status": "active"
// }

export type StoreInformation = {
  id: string
  createdAt: string
  updatedAt: string

  code: string
  name: string
  division: string
  location: string
  cluster: string
  contactPerson: string
  contactNumber: string
  status: "active" | "inactive"
}

const DEFAULT_STORE_INFORMATION: StoreInformation = {
  id: "",
  createdAt: "",
  updatedAt: "",
  code: "",
  name: "",
  division: "",
  location: "",
  cluster: "",
  contactPerson: "",
  contactNumber: "",
  status: "active",
}

export type UpdateStoreInfo = Partial<StoreInformation>
export type CreateStoreInfo = Omit<
  StoreInformation,
  "id" | "createdAt" | "updatedAt"
>

export default function StoreCreateSheet({ ...props }: StoreCreateSheetProps) {
  const openSheet = storeManagement((s) => s.openSheet)
  const storeId = storeManagement((s) => s.storeId)
  const { setOpenSheet } = storeManagement()

  const { data: initialData } = useQuery<StoreInformation>({
    queryKey: ["store-detail-information", storeId],
    queryFn: async () => {
      const { data } = await api.get<StoreInformation>(`/store/${storeId}`)
      return data
    },
    enabled: !!storeId,
  })

  const { mutateAsync: editStore } = useMutation({
    mutationFn: async (data: UpdateStoreInfo) => {
      const { data: res } = await api.patch<StoreInformation>(
        `/store/${storeId}`,
        data
      )
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-management"] })
      queryClient.invalidateQueries({
        queryKey: ["store-detail-information", storeId],
      })
    },
  })

  const { mutateAsync: createStore } = useCreateStore()

  const form = useForm({
    defaultValues: DEFAULT_STORE_INFORMATION,

    onSubmit: async ({ value }) => {
      if (storeId) {
        await editStore(value)
      } else {
        const { id, createdAt, updatedAt, ...payload } = value
        await createStore(payload)
      }
      setOpenSheet?.(false)
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    } else if (!storeId) {
      form.reset(DEFAULT_STORE_INFORMATION)
    }
  }, [initialData, storeId])

  return (
    <Sheet {...props} open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{storeId ? "Edit Store" : "Enroll New Store"}</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <form
          className="grid gap-3 px-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          id="store-form"
        >
          <p>Basic Information</p>

          <form.Field
            name="name"
            children={(field) => (
              <Field>
                <FieldLabel>Store Name</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          />

          <form.Field
            name="code"
            children={(field) => (
              <Field>
                <FieldLabel>Store Code</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value.toUpperCase())
                  }
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          />

          <form.Field
            name="location"
            children={(field) => (
              <Field>
                <FieldLabel>Location</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          />

          <form.Field
            name="cluster"
            children={(field) => (
              <Field>
                <FieldLabel>Cluster</FieldLabel>
                <SelectInput
                  options={cluster}
                  onChange={field.handleChange}
                  defaultValue={field.state.value}
                />
              </Field>
            )}
          />
          <form.Field
            name="division"
            children={(field) => (
              <Field>
                <FieldLabel>Division</FieldLabel>
                <SelectInput
                  options={division}
                  onChange={field.handleChange}
                  defaultValue={field.state.value}
                />
              </Field>
            )}
          />
          <form.Field
            name="contactPerson"
            children={(field) => (
              <Field>
                <FieldLabel>Contact Person</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          />
          <form.Field
            name="contactNumber"
            children={(field) => (
              <Field>
                <FieldLabel>Contact Number</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          />

          {/* the form needs an actual submit trigger — see note below */}
        </form>
        <SheetFooter className="grid grid-cols-2">
          <SheetClose asChild>
            <Button variant={"outline"} size={"lg"}>
              Cancel
            </Button>
          </SheetClose>

          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button
                size={"lg"}
                type="submit"
                form="store-form"
                disabled={isSubmitting}
              >
                {storeId ? "Save Changes" : "Create Store"}
              </Button>
            )}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
