export type ValidateTypeResponse = {
  sub: string
  email: string
  role: "SUPERADMIN" | "HR" | "MP"
  firstName: string
  lastName: string
  middleName: string
  iat: number
  exp: number
  lastPasswordUpdate: string
}
