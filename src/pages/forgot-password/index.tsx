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
import { MoveLeft, User } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const postSendPasswordLink = useMutation<
    {
      message: string
    },
    ErrorResponse,
    {
      email: string
    }
  >({
    mutationFn: async (credentials) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/forgot-password`,
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
      email: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await postSendPasswordLink.mutateAsync({
          email: value.email,
        })
        setIsSuccess(true)
        form.reset()
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
            Forgot Password
          </CardTitle>
          <CardDescription className="text-[#8A96A3]">
            <p className="text-xs text-[#8A96A3]">
              Don't worry we will send you a password reset link .
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          {isSuccess && (
            <Alert className="mb-5 border-none bg-[#D4FDE7]">
              <AlertTitle className="text-center text-sm font-semibold text-[#00662D]">
                A password reset link has been sent to your email.
              </AlertTitle>
            </Alert>
          )}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "Email is required"
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                  return "Invalid email address"
                return undefined
              },
              onBlur: ({ value }) => {
                if (!value) return "Email is required"
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                  return "Invalid email address"
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
                  Email
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    placeholder="admin@mrdiy.com"
                    className="text-sm font-normal text-navy-blue"
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                  />
                  <InputGroupAddon align="inline-start">
                    <User />
                  </InputGroupAddon>
                </InputGroup>
              </>
            )}
          </form.Field>
        </CardContent>
        <CardFooter className="flex flex-col border-none bg-transparent shadow-none outline-none">
          <Button
            className="h-11 w-full text-[15px] font-semibold"
            disabled={form.state.isSubmitting}
          >
            Send password reset link
          </Button>
          <div className="mt-7 flex w-full justify-between">
            <Button
              variant={"link"}
              className="text-[13px] font-medium text-navy-blue"
              onClick={() => navigate("/auth/login")}
              type="button"
            >
              <MoveLeft /> Back to login
            </Button>
            <Button variant={"link"} className="text-navy-blue" type="button">
              Resend link
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
