import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { validateEmail } from "@/lib/validateEmail"
import { useForm } from "@tanstack/react-form"

export default function LoginPage() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

  return (
    <form
      className="grid w-105 gap-5 rounded-[12px] border p-10 shadow-lg"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="text-center">
        <p className="mx-auto mb-3 w-[50%] text-xl font-bold text-[#5A2E15]">
          Biometrics Data Consolidator
        </p>
        <p className="text-[#8A96A3]">Sign in to O-BDC Portal</p>
      </div>
      <div className="grid gap-6">
        <form.Field
          name="email"
          validators={{
            onBlur: ({ value }) => validateEmail(value),
            onSubmit: ({ value }) => validateEmail(value),
          }}
          children={({ state, handleBlur, handleChange }) => (
            <>
              <FieldLabel htmlFor="email">Email or Username</FieldLabel>
              <Input
                id="email"
                autoComplete="off"
                placeholder="User001"
                className="h-11"
                value={state.value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
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
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                autoComplete="off"
                placeholder="••••••••••••••"
                type="password"
                className="h-11"
                value={state.value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
              />
            </>
          )}
        />
        <div className="flex items-center justify-between">
          <FieldGroup className="w-56">
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
                  />
                  <FieldLabel
                    htmlFor="terms-checkbox-basic"
                    className="text-[13px] font-medium text-navy-blue"
                  >
                    Remember me
                  </FieldLabel>
                </Field>
              )}
            />
          </FieldGroup>
          <Button
            variant={"link"}
            className="text-[13px] font-medium text-navy-blue underline"
          >
            Forgot password?
          </Button>
        </div>
        <Button size={"lg"} className="text-[16px] font-semibold">
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
