import type { ValidateTypeResponse } from "@/components/protected-route"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { useMutation, useQuery } from "@tanstack/react-query"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { TriangleAlert } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"

type TwoFAType = {
  otp: string
  email: string
}

type OTPResponse = {
  accessToken: string
}

type ResendOTPType = {
  email: string
}

type ResendOTPResponse = {
  message: string
  otpExpiresAt: string
  resendAvailableAt: string
}

type OTPErrorResponse = ErrorResponse & {
  code?: string
  data?: {
    remainingAttempts?: number
    resendAvailableAt?: string
  }
}

type TwoFALocationState = {
  email: string
  otpExpiresAt: string
  resendAvailableAt: string
}

export default function TwoFactorAuthenticationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const otpState = location.state as TwoFALocationState | null
  const email = otpState?.email
  const [resendAvailableAt, setResendAvailableAt] = useState<string | null>(
    otpState?.resendAvailableAt ?? null
  )
  const [resendSeconds, setResendSeconds] = useState(0)
  const [isAccountLocked, setIsAccountLocked] = useState(false)
  const [accountLockedMessage, setAccountLockedMessage] = useState(
    "Your account is locked. Please contact your administrator for assistance."
  )

  const postVerifyOtp = useMutation<OTPResponse, OTPErrorResponse, TwoFAType>({
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
    retry: false,
  })

  const postResendOtp = useMutation<
    ResendOTPResponse,
    OTPErrorResponse,
    ResendOTPType
  >({
    mutationFn: async (credentials) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/resend-otp`,
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
    retry: false,
  })

  const { refetch: refetchAuthData } = useQuery<ValidateTypeResponse>({
    queryKey: ["auth"],
    enabled: false,
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/validate`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      const data = await res.json()
      if (!res.ok) {
        throw data
      }
      return data
    },
  })

  useEffect(() => {
    if (!email) {
      navigate("/auth/login", { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    const updateResendSeconds = () => {
      if (!resendAvailableAt) {
        setResendSeconds(0)
        return
      }

      const resendAvailableAtTime = new Date(resendAvailableAt).getTime()
      if (Number.isNaN(resendAvailableAtTime)) {
        setResendSeconds(0)
        return
      }

      const seconds = Math.max(
        0,
        Math.ceil((resendAvailableAtTime - Date.now()) / 1000)
      )
      setResendSeconds(seconds)
    }

    updateResendSeconds()
    const interval = setInterval(updateResendSeconds, 1000)

    return () => clearInterval(interval)
  }, [resendAvailableAt])

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    onSubmit: async ({ value }) => {
      if (!email) {
        return navigate("/auth/login", { replace: true })
      }

      try {
        const data = await postVerifyOtp.mutateAsync({
          otp: value.otp,
          email,
        })
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken)
          const { data: freshAuthData } = await refetchAuthData()
          return freshAuthData?.role === "MP"
            ? navigate("/manual-dtr-upload")
            : navigate("/")
        }
        return toast.error("Something went wrong")
      } catch (err) {
        const error = err as OTPErrorResponse
        if (error.code === "ACCOUNT_LOCKED") {
          setIsAccountLocked(true)
          setAccountLockedMessage(error.message)
        }
        return toast.error(error.message ?? "Something went wrong")
      }
    },
  })

  const handleResendOtp = async () => {
    if (!email) {
      return navigate("/auth/login", { replace: true })
    }

    try {
      const data = await postResendOtp.mutateAsync({ email })
      form.setFieldValue("otp", "")
      setResendAvailableAt(data.resendAvailableAt)
      return toast.success(data.message)
    } catch (err) {
      const error = err as OTPErrorResponse

      if (
        error.code === "OTP_RESEND_COOLDOWN" &&
        error.data?.resendAvailableAt
      ) {
        setResendAvailableAt(error.data.resendAvailableAt)
      }

      if (error.code === "ACCOUNT_LOCKED") {
        setIsAccountLocked(true)
        setAccountLockedMessage(error.message)
      }

      return toast.error(error.message ?? "Something went wrong")
    }
  }

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
        <CardContent className="flex flex-col items-center justify-center gap-5">
          {isAccountLocked && (
            <Alert variant={"destructive"} className="bg-[#FFE1E2] text-left">
              <TriangleAlert />
              <AlertDescription className="text-[#A8000F]">
                {accountLockedMessage}
              </AlertDescription>
            </Alert>
          )}
          <form.Field name="otp">
            {(field) => (
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                onChange={(e) => field.handleChange(e)}
                value={field.state.value}
                disabled={
                  form.state.isSubmitting ||
                  postResendOtp.isPending ||
                  isAccountLocked
                }
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
        <CardFooter className="flex flex-col border-none bg-none shadow-none outline-none">
          <form.Subscribe
            selector={(state) => ({
              isSubmitting: state.isSubmitting,
              otp: state.values.otp,
            })}
          >
            {({ isSubmitting, otp }) => (
              <Button
                className="h-11 w-full text-[15px] font-semibold"
                disabled={
                  isSubmitting ||
                  postResendOtp.isPending ||
                  isAccountLocked ||
                  otp.length !== 6
                }
                type="submit"
              >
                Submit code
              </Button>
            )}
          </form.Subscribe>
          <Button
            variant={"link"}
            type="button"
            onClick={handleResendOtp}
            disabled={
              resendSeconds > 0 ||
              postResendOtp.isPending ||
              isAccountLocked ||
              !email
            }
            className="mt-2 text-[13px] font-medium text-navy-blue"
          >
            {postResendOtp.isPending
              ? "Sending..."
              : resendSeconds > 0
                ? `Resend code in ${resendSeconds}s`
                : "Resend code"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
