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
import { Switch } from "@/components/ui/switch"
import type { Device } from "@/types/device"
import { Badge } from "@/components/ui/badge"

type StoreCreateSheetProps = React.ComponentProps<typeof SheetPrimitive.Root>

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
  devices: Device[]
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
  devices: [],
}

export type UpdateStoreInfo = Partial<StoreInformation>
export type CreateStoreInfo = Omit<
  StoreInformation,
  "id" | "createdAt" | "updatedAt"
>

function toStorePayload(value: StoreInformation): CreateStoreInfo {
  return {
    code: value.code,
    name: value.name,
    division: value.division,
    location: value.location,
    cluster: value.cluster,
    contactPerson: value.contactPerson,
    contactNumber: value.contactNumber,
    status: value.status,
    devices: value.devices,
  }
}

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
      const payload = toStorePayload(value)

      try {
        if (storeId) {
          await editStore(payload)
        } else {
          await createStore(payload)
        }
        setOpenSheet?.(false)
      } catch (err) {
        // TODO: surface this to the user via toast/inline error
        console.error("Failed to save store:", err)
      }
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    } else if (!storeId) {
      form.reset(DEFAULT_STORE_INFORMATION)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, storeId])

  // Used to force SelectInput (an uncontrolled component keyed off
  // `defaultValue`) to remount once real data has loaded, otherwise it
  // keeps showing its initial blank value even after form.reset() runs.
  const selectResetKey = initialData?.id ?? storeId ?? "new"

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

          <div className="grid grid-cols-2 gap-5">
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
          </div>

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
                  key={`cluster-${selectResetKey}`}
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
                  key={`division-${selectResetKey}`}
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
          <form.Field
            name="status"
            children={(field) => {
              const status = field.state.value === "active"
              return (
                <div className="flex flex-row gap-3">
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={status}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked ? "active" : "inactive")
                    }
                    onBlur={field.handleBlur}
                  />
                  <p className={status ? "text-green-500" : "text-red-500"}>
                    {status ? "Active" : "Inactive"}
                  </p>
                </div>
              )
            }}
          />

          {storeId && (
            <form.Field
              name="devices"
              children={(field) => {
                const devices = field.state.value ?? []
                return (
                  <div>
                    <p>Connected Device:</p>
                    {devices.length > 0 ? (
                      <div className="mt-2 flex flex-row gap-1">
                        {devices.map((device) => (
                          <Badge
                            key={device.id}
                            className="text-xs"
                            variant={"outline"}
                          >
                            {device.serialNumber}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No device connected.
                      </p>
                    )}
                  </div>
                )
              }}
            />
          )}
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
