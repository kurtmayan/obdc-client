import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  return (
    <form className="grid w-105 gap-5 rounded-[12px] border p-10 shadow-lg">
      <div className="text-center">
        <p className="mx-auto mb-3 w-[50%] text-xl font-bold text-[#5A2E15]">
          Biometrics Data Consolidator
        </p>
        <p className="text-[#8A96A3]">Sign in to L-BDC Portal</p>
      </div>
      <div className="grid gap-6">
        <Field>
          <FieldLabel htmlFor="name">Email or Username</FieldLabel>
          <Input
            id="name"
            autoComplete="off"
            placeholder="User001"
            className="h-11"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="name">Password</FieldLabel>
          <Input
            id="name"
            autoComplete="off"
            placeholder="••••••••••••••"
            type="password"
            className="h-11"
          />
        </Field>
        <div className="flex items-center justify-between">
          <FieldGroup className="w-56">
            <Field orientation="horizontal">
              <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
              <FieldLabel
                htmlFor="terms-checkbox-basic"
                className="text-[13px] font-medium text-navy-blue"
              >
                Remember me
              </FieldLabel>
            </Field>
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
