export const validatePassword = (value: string) => {
  if (!value) return "Password is required"
  const PASSWORD_REGEX =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{10,}$/
  if (!PASSWORD_REGEX.test(value)) {
    return "Password must be at least 10 characters and include an uppercase letter, lowercase letter, number, and special character"
  }
  return undefined
}
