import { Button } from "@/components/ui/button"
import {
  CircleX,
  CloudUpload,
  FileSpreadsheet,
  LogOut,
  Menu,
  Upload,
  X,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { ValidateTypeResponse } from "@/components/protected-route"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNavigate } from "react-router"

const acceptedFileTypes = {
  "application/octet-stream": [".enc"],
  "application/x-msdownload": [".enc"],
}

export default function ManualDTRUpload() {
  const navigate = useNavigate()
  const { data: authData } = useQuery<ValidateTypeResponse>({
    queryKey: ["auth"],
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

  const fullName =
    [authData?.firstName, authData?.lastName].filter(Boolean).join(" ") ||
    "Account"
  const initials =
    `${authData?.firstName?.[0] ?? ""}${authData?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "A"
  const userRole = authData?.role || "Role unavailable"

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/auth/login")
  }

  const uploadDTRMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/sync/excel`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      return response.json()
    },
    onError: (e) => {
      return toast.error(e.message)
    },
    onSuccess(data) {
      form.reset()
      if (data.message === "Sync queued") {
        return toast.success("DTR uploaded successfully")
      }

      return toast.error(data.message || "Upload failed")
    },
  })

  const form = useForm({
    defaultValues: {
      file: null as File | null,
    },
    onSubmit: async ({ value }) => {
      if (value.file) {
        return await uploadDTRMutation.mutateAsync(value.file)
      }
      return toast.error("No file selected. Please choose a file to upload.")
    },
  })

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: acceptedFileTypes,

    validator: (file) => {
      const fileName = file.name.toLowerCase()

      const allowedExtensions = Object.values(acceptedFileTypes).flat()

      const validExtension = allowedExtensions.some((extension) =>
        fileName.endsWith(extension)
      )

      if (!validExtension) {
        return {
          code: "invalid-file-type",
          message: `Unsupported file type. Please upload a ${allowedExtensions.join(", ")} file.`,
        }
      }

      return null
    },
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        toast.error(
          fileRejections[0]?.errors[0]?.message ?? "Unsupported file type."
        )
        return
      }

      if (acceptedFiles.length > 0) {
        form.setFieldValue("file", acceptedFiles[0])
      }
    },
  })

  return (
    <div className="flex flex-col gap-5">
      {authData?.role === "MP" && (
        <div className="relative flex h-20.5 justify-center bg-navy-blue">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-6 left-5 text-white hover:bg-white/10 hover:text-white"
                aria-label="Open account menu"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="w-80 max-w-[86vw] gap-0 overflow-hidden p-0"
            >
              <div className="relative bg-navy-blue px-5 pt-12 pb-6 text-white">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-3 right-3 text-white hover:bg-white/10 hover:text-white"
                    aria-label="Close account menu"
                  >
                    <X className="size-4" />
                  </Button>
                </SheetClose>
                <SheetHeader className="p-0 text-left">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-14 border border-white/20 bg-white/10">
                      <AvatarFallback className="bg-[#FFC000] text-base font-semibold text-navy-blue">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <SheetTitle className="truncate text-lg font-semibold text-white">
                        {fullName}
                      </SheetTitle>
                      <SheetDescription className="mt-1 text-xs font-medium tracking-wide text-white/65 uppercase">
                        {userRole}
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
              </div>

              <div className="flex flex-1 flex-col px-5 py-5">
                <Button
                  variant="destructive"
                  className="mt-auto h-11 w-full gap-2 text-[15px] font-semibold"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <img src="/app-logo.svg" className="h-28.5 w-29.75" />
        </div>
      )}

      <div className="flex flex-col items-center px-5">
        <div>
          <h1 className="mt-20 text-left text-[20px] font-bold text-[#1F1F1F]">
            Manual DTR Upload
          </h1>
          <p className="text-xs text-[#8A96A3]">
            Upload your DTR file to sync attendance data to O-DBC
          </p>
        </div>

        <div className="mt-5 flex flex-col items-center justify-center">
          <section className="w-74.5 rounded-2xl border border-dashed border-black/10 p-5">
            <div
              {...getRootProps({ className: "dropzone" })}
              className="flex flex-col items-center justify-center"
            >
              <input {...getInputProps()} />
              <div className="rounded-full bg-[#F6F7F9] p-2">
                <CloudUpload color="#FFC107" />
              </div>
              <p className="text-center text-[15px] font-bold text-navy-blue">
                Choose file or drag and drop
              </p>
              <p className="text-center text-[13px] font-normal text-[#8A96A3]">
                Touch-friendly uploader for store managers on smaller screens.
              </p>
            </div>
            <aside className="mt-5">
              <form.Field
                name="file"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Please select a file"
                    }
                  },
                }}
                children={(field) => (
                  <>
                    {field.state.value && (
                      <div className="mt-1 flex items-center justify-between rounded-lg border p-2">
                        <div className="flex items-center gap-2">
                          <div className="rounded-2xl bg-[#F6F7F9]">
                            <FileSpreadsheet color="#03A9F4" />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-navy-blue">
                              {field.state.value.name}
                            </p>
                            <p className="text-xs text-[#8A96A3]">
                              Selected file
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => field.setValue(null)}
                          className="cursor-pointer hover:opacity-70"
                        >
                          <CircleX strokeWidth={1} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              />
            </aside>
          </section>

          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              !!state.values.file,
            ]}
            children={([canSubmit, isSubmitting, hasFile]) => (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
                disabled={!canSubmit || isSubmitting || !hasFile}
                className="mt-5 h-12 w-67.5 text-[15px] font-semibold text-[#1F1F1F]"
              >
                <Upload /> {isSubmitting ? "Uploading..." : "Upload DTR"}
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  )
}
