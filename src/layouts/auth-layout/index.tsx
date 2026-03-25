import { Outlet } from "@tanstack/react-router"

export default function AuthLayout() {
  return (
    <div className="grid h-screen grid-cols-2">
      <div className="grid place-items-center bg-yellow-500">
        <img
          src="/app-logo.svg"
          alt="Photo"
          className="rounded-lg object-cover"
        />
      </div>
      <div className="grid place-items-center">
        <Outlet />
      </div>
    </div>
  )
}
