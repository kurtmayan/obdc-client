import { Button } from "@/components/ui/button"
import { Link } from "react-router"

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-yellow-500 bg-[url(/app-logo.svg)] bg-contain bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-yellow-500/50 backdrop-blur-sm" />
      <div className="z-10 flex flex-col items-center justify-center gap-4 rounded-2xl py-10 text-center text-white">
        <h1 className="text-5xl font-bold">404 - Whoops!</h1>
        <div className="mx-auto w-3/4">
          <p className="text-2xl font-bold">Something went wrong</p>
          <p className="text-sm">
            The page you're looking for isn't found, we suggest you back to home
          </p>
        </div>
        <Link to={"/"}>
          <Button className="cursor-pointer" size={"lg"}>
            Back to home page
          </Button>
        </Link>
      </div>
    </div>
  )
}
