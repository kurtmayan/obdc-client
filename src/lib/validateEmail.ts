export const validateEmail = (value: string) => {
  if (!value) return "Email is required"

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return "Please enter a valid email"
  }

  return undefined
}
