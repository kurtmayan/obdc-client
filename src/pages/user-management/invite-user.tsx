import { Button } from "@/components/ui/button"
import { Mail, Phone, UserPlus } from "lucide-react"
import { FieldLabel } from "@/components/ui/field"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useForm } from "@tanstack/react-form"
import { validateEmail } from "@/lib/validateEmail"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useMutation } from "@tanstack/react-query"
import type { ErrorResponse } from "@/types"
import { toast } from "sonner"

type InviteUserType = {
  firstName: string
  lastName: string
  role: "SUPERADMIN" | "HR" | "MP"
  email: string
  contactNumber: string
}

type InviteUserResponse = {
  message: string
}

export default function InviteUser() {
  const postInviteUser = useMutation<
    InviteUserResponse,
    ErrorResponse,
    InviteUserType
  >({
    mutationFn: async (credentials) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/users/invite-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(credentials),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw data
      }
      return data
    },
  })

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "MP",
      email: "",
      contactNumber: "",
    },
    onSubmit: async ({ value }: { value: InviteUserType }) => {
      try {
        const response = await postInviteUser.mutateAsync(value)
        if (response.message === "User invited successfully") {
          return toast.success(response.message)
        }
        return toast.error("Something went wrong")
      } catch (err) {
        const error = err as ErrorResponse
        return toast.error(error.message ?? "Something went wrong")
      }
    },
  })
  return (
    <Sheet>
      <SheetTrigger className="flex h-10 w-[138.5px] items-center justify-center gap-2 rounded-[6px] bg-yellow-500 p-2 px-4">
        <UserPlus />
        <p className="text-sm font-semibold text-navy-blue"> Invite User</p>
      </SheetTrigger>
      <SheetContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <SheetHeader>
            <SheetTitle className="text-[18px] font-semibold">
              Invite New Users
            </SheetTitle>
            <Separator className="my-5" />
            <div>
              <h1 className="text-base font-medium text-navy-blue">
                User Details
              </h1>
              <p className="text-xs font-normal text-navy-blue">
                Enter the contact information for the new users. They will
                receive an email with login instructions
              </p>
            </div>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-2 px-4">
            <form.Field
              name="firstName"
              children={({ state, handleBlur, handleChange }) => (
                <div className="mt-5">
                  <FieldLabel htmlFor="firstName" className="text-navy-blue">
                    First Name
                  </FieldLabel>
                  <Input
                    id="firstName"
                    autoComplete="off"
                    className="h-11 text-navy-blue"
                    value={state.value}
                    onBlur={handleBlur}
                    placeholder="e.g., Juan"
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={form.state.isSubmitting}
                  />
                </div>
              )}
            />
            <form.Field
              name="lastName"
              children={({ state, handleBlur, handleChange }) => (
                <div className="mt-5">
                  <FieldLabel htmlFor="lastName" className="text-navy-blue">
                    Last Name
                  </FieldLabel>
                  <Input
                    id="lastName"
                    autoComplete="off"
                    className="h-11 text-navy-blue"
                    placeholder="e.g., Dela Cruz"
                    value={state.value}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={form.state.isSubmitting}
                  />
                </div>
              )}
            />
            <form.Field
              name="role"
              children={() => (
                <div className="mt-5">
                  <FieldLabel htmlFor="role" className="text-navy-blue">
                    Role
                  </FieldLabel>
                  <Select>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                        <SelectItem value="HR">HR (Human Resources)</SelectItem>
                        <SelectItem value="MP">MP (Main Person)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }) => validateEmail(value),
                onSubmit: ({ value }) => validateEmail(value),
              }}
              children={({ state, handleBlur, handleChange }) => (
                <div className="mt-5">
                  <FieldLabel htmlFor="email" className="text-navy-blue">
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      autoComplete="off"
                      placeholder="admin@example.com"
                      className="h-11 pl-10 text-navy-blue"
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(e) => handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                    />
                  </div>
                </div>
              )}
            />

            <form.Field
              name="contactNumber"
              validators={{
                onBlur: ({ value }) => {
                  if (!/^9\d{9}$/.test(value)) {
                    return "Enter a valid PH number (9XXXXXXXXX)"
                  }
                  return undefined
                },
                onSubmit: ({ value }) => {
                  if (!/^9\d{9}$/.test(value)) {
                    return "Enter a valid PH number (9XXXXXXXXX)"
                  }
                  return undefined
                },
              }}
              children={({ state, handleBlur, handleChange }) => (
                <div className="mt-5">
                  <FieldLabel
                    htmlFor="contactNumber"
                    className="text-navy-blue"
                  >
                    Contact Number
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 h-4 w-4 text-gray-400" />
                    <span className="absolute left-10 text-sm text-gray-500">
                      +63
                    </span>
                    <Input
                      id="contactNumber"
                      autoComplete="off"
                      placeholder="9XXXXXXXXX"
                      className="h-11 pl-[70px] text-navy-blue"
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const cleaned = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                        handleChange(cleaned)
                      }}
                      disabled={form.state.isSubmitting}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </form>

        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild className="grow text-sm">
              <Button variant="outline" className="h-10 bg-[#F6F7F9]">
                Cancel
              </Button>
            </SheetClose>
            <Button className="h-10 grow text-sm" onClick={form.handleSubmit}>
              Invite User
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
