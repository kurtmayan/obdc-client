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
import { validatePassword } from "@/lib/validatePasssword"

type LoginType = {
  email: string
  password: string
}

type LoginResponse = {
  message: string
  otpExpiresAt: string
  resendAvailableAt: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    "We couldn’t log you in. Please check your username or password and try again."
  )

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
      setShowErrorMessage(false)
      if (data.message === "OTP Sent to email") {
        navigate("/auth/2fa", {
          state: {
            email: variables.email,
            otpExpiresAt: data.otpExpiresAt,
            resendAvailableAt: data.resendAvailableAt,
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
      if (error.code === "ACCOUNT_LOCKED") {
        setErrorMessage(error.message)
      }
      setShowErrorMessage(true)
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

      {showErrorMessage && (
        <div className="grid w-full max-w-md items-start gap-4">
          <Alert variant={"destructive"} className="bg-[#FFE1E2]">
            <TriangleAlert />
            <AlertDescription className="text-[#A8000F]">
              {errorMessage}
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
        >
          {({ state, handleBlur, handleChange }) => (
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
              {state.meta.isTouched &&
                state.meta.errors.map((error) =>
                  error ? (
                    <p key={error} className="-mt-4 text-xs text-destructive">
                      {error}
                    </p>
                  ) : null
                )}
            </>
          )}
        </form.Field>
        <form.Field
          name="password"
          validators={{
            onBlur: ({ value }) => validatePassword(value),
            onSubmit: ({ value }) => validatePassword(value),
          }}
        >
          {({ state, handleBlur, handleChange }) => (
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
              {state.meta.isTouched &&
                state.meta.errors.map((error) =>
                  error ? (
                    <p key={error} className="-mt-4 text-xs text-destructive">
                      {error}
                    </p>
                  ) : null
                )}
            </>
          )}
        </form.Field>
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
