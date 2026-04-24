import { Button } from "@/components/ui/button"
import { CircleX, CloudUpload, FileSpreadsheet, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useState } from "react"

export default function ManualDTRUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    },
  })

  const handleDeleteFile = (indexToDelete: number) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToDelete)
    )
  }

  return (
    <div>
      <div className="flex h-20.5 justify-center bg-navy-blue">
        <img src="/app-logo.svg" className="h-28.5 w-29.75" />
      </div>

      <div className="px-5">
        <h1 className="mt-20 text-[20px] font-bold text-[#1F1F1F]">
          Manual DTR Upload
        </h1>
        <p className="text-xs text-[#8A96A3]">
          Upload your DTR file to sync attendance data to O-DBC
        </p>

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
              {uploadedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="mt-1 flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="rounded-2xl bg-[#F6F7F9]">
                      <FileSpreadsheet color="#03A9F4" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-navy-blue">
                        {file.name}
                      </p>
                      <p className="text-xs text-[#8A96A3]">Selected file</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="cursor-pointer hover:opacity-70"
                  >
                    <CircleX strokeWidth={1} />
                  </button>
                </div>
              ))}
            </aside>
          </section>

          <Button className="mt-5 h-12 w-67.5 text-[15px] font-semibold text-[#1F1F1F]">
            <Upload /> Upload DTR
          </Button>
        </div>
      </div>
    </div>
  )
}
