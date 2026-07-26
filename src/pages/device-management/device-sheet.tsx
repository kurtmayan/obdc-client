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
import { api } from "@/lib/api"
import { queryClient } from "@/queryClient"
import { deviceManagement } from "@/store/device-management-page"
import type { Device, DeviceStore } from "@/types/device"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Dialog as SheetPrimitive } from "radix-ui"
import { useEffect } from "react"
import { toast } from "sonner"
import { useCreateDevice } from "./actions"
import { StoreCombobox } from "./store-lookup"

type DeviceSheetProps = React.ComponentProps<typeof SheetPrimitive.Root>

export type DeviceInformation = Device

const DEFAULT_DEVICE_INFORMATION: DeviceInformation = {
  id: "",
  serialNumber: "",
  model: "",
  storesId: "",
  store: null,
  stores: null,
}

export type UpdateDeviceInfo = Partial<
  Omit<DeviceInformation, "id" | "createdAt" | "updatedAt" | "store" | "stores">
>
export type CreateDeviceInfo = Omit<
  DeviceInformation,
  "id" | "createdAt" | "updatedAt" | "store" | "stores"
>

function getConnectedStore(device?: DeviceInformation): DeviceStore | null {
  return device?.store ?? device?.stores ?? null
}

function toDevicePayload(value: DeviceInformation): CreateDeviceInfo {
  return {
    serialNumber: value.serialNumber,
    model: value.model,
    storesId: value.storesId,
  }
}

export default function DeviceSheet({ ...props }: DeviceSheetProps) {
  const openSheet = deviceManagement((s) => s.openSheet)
  const deviceId = deviceManagement((s) => s.deviceId)
  const { setOpenSheet } = deviceManagement()

  const { data: initialData } = useQuery<DeviceInformation>({
    queryKey: ["device-detail-information", deviceId],
    queryFn: async () => {
      const { data } = await api.get<DeviceInformation>(`/device/${deviceId}`)
      return data
    },
    enabled: !!deviceId,
  })

  const { mutateAsync: editDevice } = useMutation({
    mutationFn: async (data: UpdateDeviceInfo) => {
      const { data: res } = await api.patch<DeviceInformation>(
        `/device/${deviceId}`,
        data
      )
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-management"] })
      queryClient.invalidateQueries({
        queryKey: ["device-detail-information", deviceId],
      })
    },
  })

  const { mutateAsync: createDevice } = useCreateDevice()

  const form = useForm({
    defaultValues: DEFAULT_DEVICE_INFORMATION,
    onSubmit: async ({ value }) => {
      const payload = toDevicePayload(value)

      try {
        if (deviceId) {
          await toast.promise(editDevice(payload), {
            loading: "Saving device...",
            success: "Device updated successfully!",
            error: "Device cannot be updated!",
            position: "top-center",
          })
        } else {
          await toast.promise(createDevice(payload), {
            loading: "Creating device...",
            success: "Device created successfully!",
            error: "Device cannot be created!",
            position: "top-center",
          })
        }

        setOpenSheet(false)
      } catch (err) {
        console.error("Failed to save device:", err)
      }
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    } else if (!deviceId) {
      form.reset(DEFAULT_DEVICE_INFORMATION)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, deviceId])

  const connectedStore = getConnectedStore(initialData)

  return (
    <Sheet {...props} open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{deviceId ? "Edit Device" : "Enroll New Device"}</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <form
          className="grid gap-4 px-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          id="device-form"
        >
          <p>Basic Information</p>

          <form.Field
            name="serialNumber"
            children={(field) => (
              <Field>
                <FieldLabel>Serial Number</FieldLabel>
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
            name="model"
            children={(field) => (
              <Field>
                <FieldLabel>Model</FieldLabel>
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
            name="storesId"
            children={(field) => (
              <Field>
                <FieldLabel>Connected Store</FieldLabel>
                <StoreCombobox
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  selectedStore={connectedStore}
                />
              </Field>
            )}
          />
        </form>

        <SheetFooter className="grid grid-cols-2">
          <SheetClose asChild>
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </SheetClose>

          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button
                size="lg"
                type="submit"
                form="device-form"
                disabled={isSubmitting}
              >
                {deviceId ? "Save Changes" : "Create Device"}
              </Button>
            )}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
