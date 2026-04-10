import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import type { ErrorResponse } from "@/types"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"

type TwoFAType = {
  otp: string
  email: string
}

type OTPResponse = {
  accessToken: string
}

export default function TwoFactorAuthenticationPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const postVerifyOtp = useMutation<OTPResponse, ErrorResponse, TwoFAType>({
    mutationFn: async (credentials) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/verify-otp`,
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
      otp: "",
    },
    onSubmit: async ({ value }) => {
      try {
        console.log({
          otp: value.otp,
          email: location.state?.email,
        })
        const data = await postVerifyOtp.mutateAsync({
          otp: value.otp,
          email: location.state?.email,
        })
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken)
          return navigate("/")
        }
        return toast.error("Something went wrong")
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
            Two-factor Authentication
          </CardTitle>
          <CardDescription className="text-[#8A96A3]">
            <p className="text-xs text-[#8A96A3]">
              We’ve sent a verification code to your registered email. Please
              enter it to continue.
            </p>
            <p className="text-sm text-[#8A96A3]">
              This code will be valid for 5 minutes.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <form.Field name="otp">
            {(field) => (
              <InputOTP
                maxLength={6}
                defaultValue=""
                pattern={REGEXP_ONLY_DIGITS}
                onChange={(e) => field.handleChange(e)}
                value={field.state.value}
                disabled={form.state.isSubmitting}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="h-14 w-11.25 text-[28px] font-semibold"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-14 w-11.25 text-[28px] font-semibold"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-14 w-11.25 text-[28px] font-semibold"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-14 w-11.25 text-[28px] font-semibold"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-14 w-11.25 text-[28px] font-semibold"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-14 w-11.25 text-[28px] font-semibold"
                  />
                </InputOTPGroup>
              </InputOTP>
            )}
          </form.Field>
        </CardContent>
        <CardFooter className="border-none bg-none shadow-none outline-none">
          <Button
            className="h-11 w-full text-[15px] font-semibold"
            disabled={form.state.isSubmitting}
          >
            Submit code
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
