import { Button } from "@/components/ui/button"
import { CircleX, CloudUpload, FileSpreadsheet, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"

const acceptedFileTypes = {
  "application/zip": [".zip"],
  "application/x-zip-compressed": [".zip"],
}

export default function ManualDTRUpload() {
  const uploadDTRMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/sync/excel`,
        {
          method: "POST",
          body: formData,
        }
      )
      return response.json()
    },
    onError: (e) => {
      return toast.error(e.message)
    },
    onSuccess(data) {
      form.reset()
      return toast.success(data.message || "File uploaded successfully")
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
      if (!Object.keys(acceptedFileTypes).includes(file.type)) {
        toast.error(
          "Unsupported file type. Please upload an Excel or CSV file."
        )
      }
      return null
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        form.setFieldValue("file", acceptedFiles[0])
      }
    },
  })

  return (
    <div>
      <div className="flex h-20.5 justify-center bg-navy-blue">
        <img src="/app-logo.svg" className="h-28.5 w-29.75" />
      </div>

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
