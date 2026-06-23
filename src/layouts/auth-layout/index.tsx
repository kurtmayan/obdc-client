import { Outlet } from "react-router"

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-yellow-500 lg:grid-cols-2 lg:bg-[#F4F6F8]">
      <div className="hidden place-items-center bg-yellow-500 lg:grid">
        <img
          src="/app-logo.svg"
          alt="Photo"
          className="max-h-80 rounded-lg object-contain"
        />
      </div>
      <div className="grid min-h-screen place-items-center bg-yellow-500 px-4 py-8 sm:px-6 lg:min-h-0 lg:bg-white">
        <Outlet />
      </div>
    </div>
  )
}
