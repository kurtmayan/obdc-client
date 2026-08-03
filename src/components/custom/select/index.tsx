import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

type SelectInputProps = {
  options: { label: string; value: string }[]
  placeholder?: string
  onChange: (value: string) => void
  defaultValue?: string
}

export default function SelectInput({
  options,
  placeholder = "Select item",
  onChange,
  defaultValue,
}: SelectInputProps) {
  const [selectedOption, setSelectedOption] = useState(defaultValue)

  useEffect(() => {
    setSelectedOption(defaultValue)
  }, [defaultValue])

  const handleChange = (value: string) => {
    setSelectedOption(value)
    onChange(value)
  }

  return (
    <Select value={selectedOption} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(({ value, label }) => (
            <SelectItem value={value} key={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
