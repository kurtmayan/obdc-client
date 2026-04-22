import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import type { ErrorResponse } from "@/types"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"

type UpdatePasswordType = {
  email: string
  token: string
  newPassword: string
}

export default function UpdatePasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const location = useLocation()
  const navigation = useNavigate()
  const searchParams = new URLSearchParams(location.search)

  const userEmail = searchParams.get("email") ?? ""

  const [passwordEye, setPasswordEye] = useState({
    newPassword: false,
    confirmNewPassword: false,
  })

  const postUpdatePassword = useMutation<
    {
      message: string
    },
    ErrorResponse,
    UpdatePasswordType
  >({
    mutationFn: async (credentials) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const token = searchParams.get("token") ?? ""
        const email = searchParams.get("email") ?? ""
        await postUpdatePassword.mutateAsync({
          email: email,
          token: token,
          newPassword: value.newPassword,
        })
        form.reset()
        setIsSuccess(true)
        setTimeout(() => {
          navigation("/auth/login")
        }, 3000)
      } catch (err) {
        const error = err as ErrorResponse
        return toast.error(error.message ?? "Something went wrong")
      }
    },
  })

  return (
    <form
      className="flex h-screen items-center justify-center bg-yellow-500 bg-[url(/app-logo.svg)] bg-contain bg-center bg-no-repeat"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="absolute inset-0 bg-yellow-500/50" />

      <Card className="z-10 w-94.25 p-5 text-center">
        <CardHeader>
          <CardTitle className="text-[20px] font-bold text-[#5A2E15]">
            Hi {userEmail}! <br />
            Let’s update your password.
          </CardTitle>
          <CardDescription className="text-[#8A96A3]">
            <p className="text-xs text-[#8A96A3]">
              Update your password to continue using your account safely.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          {isSuccess && (
            <Alert className="mb-5 border-none bg-[#D4FDE7]">
              <AlertTitle className="text-center text-sm font-semibold text-[#00662D]">
                Your password has been successfully updated. Redirecting to
                Login...
              </AlertTitle>
            </Alert>
          )}
          <form.Field
            name="newPassword"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "New password is required"
                if (value.length < 6)
                  return "Password must be at least 6 characters"
                return undefined
              },
              onBlur: ({ value }) => {
                if (!value) return "New password is required"
                if (value.length < 6)
                  return "Password must be at least 6 characters"
                return undefined
              },
            }}
          >
            {(field) => (
              <>
                <FieldLabel
                  htmlFor={field.name}
                  className="self-start text-[13px] font-medium text-navy-blue"
                >
                  New Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type={passwordEye.newPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    className="h-11 text-sm font-normal text-navy-blue placeholder:text-sm"
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                  />
                  <InputGroupAddon align="inline-start">
                    <Lock />
                  </InputGroupAddon>
                  <InputGroupAddon
                    align="inline-end"
                    onClick={() =>
                      setPasswordEye((prev) => ({
                        ...prev,
                        newPassword: !prev.newPassword,
                      }))
                    }
                  >
                    {passwordEye.newPassword ? <EyeOff /> : <Eye />}
                  </InputGroupAddon>
                </InputGroup>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 self-start text-xs text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </>
            )}
          </form.Field>
          <form.Field
            name="confirmNewPassword"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "Confirm password is required"
                if (value !== form.state.values.newPassword)
                  return "Passwords do not match"
                return undefined
              },
              onBlur: ({ value }) => {
                if (!value) return "Confirm password is required"
                if (value !== form.state.values.newPassword)
                  return "Passwords do not match"
                return undefined
              },
            }}
          >
            {(field) => (
              <>
                <FieldLabel
                  htmlFor={field.name}
                  className="mt-3 self-start text-left text-[13px] font-medium text-navy-blue"
                >
                  Confirm New Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type={passwordEye.confirmNewPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    className="h-11 text-sm font-normal text-navy-blue"
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                  />
                  <InputGroupAddon align="inline-start">
                    <Lock />
                  </InputGroupAddon>
                  <InputGroupAddon
                    align="inline-end"
                    onClick={() =>
                      setPasswordEye((prev) => ({
                        ...prev,
                        confirmNewPassword: !prev.confirmNewPassword,
                      }))
                    }
                  >
                    {passwordEye.confirmNewPassword ? <EyeOff /> : <Eye />}
                  </InputGroupAddon>
                </InputGroup>
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 self-start text-xs text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </>
            )}
          </form.Field>
        </CardContent>
        <CardFooter className="flex flex-col border-none bg-transparent shadow-none outline-none">
          <Button
            className="h-11 w-full text-[15px] font-semibold"
            disabled={form.state.isSubmitting}
          >
            Update Password
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
