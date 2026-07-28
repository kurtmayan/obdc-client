import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { validateEmail } from "@/lib/validateEmail"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { TriangleAlert } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import type { ErrorResponse } from "@/types/error.type"

type LoginType = {
  email: string
  password: string
}

type LoginResponse = {
  message: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<boolean>(false)

  const postLogin = useMutation<
    LoginResponse,
    ErrorResponse & {
      code?: string
      data?: {
        token: string
      }
    },
    LoginType
  >({
    mutationFn: async (credentials) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
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
    onSuccess: (data, variables) => {
      setErrorMessage(false)
      if (data.message === "OTP Sent to email") {
        navigate("/auth/2fa", {
          state: {
            email: variables.email,
          },
        })
      }
    },
    onError: (error, variables) => {
      if (error.code === "PASSWORD_EXPIRED") {
        if (error.data?.token) {
          navigate(
            `/auth/update-password?type=expired&token=${encodeURIComponent(error.data?.token)}&email=${encodeURIComponent(
              variables.email
            )}`
          )
          return
        }
      }
      setErrorMessage(true)
    },
  })

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: ({ value }) => {
      postLogin.mutate({
        email: value.email,
        password: value.password,
      })
    },
  })

  return (
    <form
      className="grid w-full max-w-105 gap-5 rounded-[12px] border bg-white p-5 shadow-lg sm:p-8 lg:p-10"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <img
        src="/app-logo.svg"
        alt="Biometric Data Consolidator logo"
        className="mx-auto h-20 w-20 object-contain lg:hidden"
      />

      <div className="text-center">
        <p className="mx-auto mb-3 max-w-64 text-lg font-bold text-[#5A2E15] sm:text-xl">
          Biometric Data Consolidator
        </p>
        <p className="text-sm text-[#8A96A3] sm:text-base">
          Sign in to O-BDC Portal
        </p>
      </div>

      {errorMessage && (
        <div className="grid w-full max-w-md items-start gap-4">
          <Alert variant={"destructive"} className="bg-[#FFE1E2]">
            <TriangleAlert />
            <AlertDescription className="text-[#A8000F]">
              We couldn’t log you in. Please check your username or password and
              try again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="grid gap-6">
        <form.Field
          name="email"
          validators={{
            onBlur: ({ value }) => validateEmail(value),
            onSubmit: ({ value }) => validateEmail(value),
          }}
          children={({ state, handleBlur, handleChange }) => (
            <>
              <FieldLabel htmlFor="email" className="-mb-5">
                Email
              </FieldLabel>
              <Input
                id="email"
                autoComplete="off"
                placeholder="example@email.com"
                className="h-11"
                value={state.value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
                disabled={form.state.isSubmitting}
              />
            </>
          )}
        />
        <form.Field
          name="password"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return "Password is required"
              if (value.length < 6)
                return "Password must be at least 6 characters"
              return undefined
            },
          }}
          children={({ state, handleBlur, handleChange }) => (
            <>
              <FieldLabel htmlFor="password" className="-mb-5">
                Password
              </FieldLabel>
              <Input
                id="password"
                autoComplete="off"
                placeholder="••••••••••••••"
                type="password"
                className="h-11"
                value={state.value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
                disabled={form.state.isSubmitting}
              />
            </>
          )}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FieldGroup className="w-auto">
            <form.Field
              name="rememberMe"
              children={({ state, handleBlur, handleChange }) => (
                <Field orientation={"horizontal"}>
                  <Checkbox
                    id="terms-checkbox-basic"
                    name="terms-checkbox-basic"
                    onBlur={handleBlur}
                    checked={state.value}
                    onCheckedChange={(checked) =>
                      handleChange(checked === true)
                    }
                    disabled={form.state.isSubmitting}
                  />
                  <FieldLabel
                    htmlFor="terms-checkbox-basic"
                    className="text-[13px] font-medium whitespace-nowrap text-navy-blue"
                  >
                    Remember me
                  </FieldLabel>
                </Field>
              )}
            />
          </FieldGroup>
          <Link
            to={"/auth/forgot-password"}
            className="self-start text-[13px] font-medium text-navy-blue underline underline-offset-4 hover:underline sm:self-auto"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          size={"lg"}
          className="text-[16px] font-semibold"
          disabled={form.state.isSubmitting}
        >
          Sign In
        </Button>
      </div>
      <div>
        <Separator className="mb-5" />
        <p className="text-center text-sm text-[#8A96A3]">
          System Version 1.0.0 • Mayan Solutions Inc.
        </p>
      </div>
    </form>
  )
}
