import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useDebouncedValue } from "@/hooks/useDebounce"
import usePushParams from "@/hooks/usePushParams"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"

type SearchInput = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

export default function SearchInput({ className, ...props }: SearchInput) {
  const pushParams = usePushParams()
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""

  const [inputValue, setInputValue] = useState(query)
  const debouncedInput = useDebouncedValue(inputValue, 400)

  useEffect(() => {
    if (debouncedInput === query) return
    pushParams({ q: debouncedInput })
  }, [debouncedInput, pushParams])

  return (
    <InputGroup className={cn("w-[288px]", className)} {...props}>
      <InputGroupInput
        placeholder="Search..."
        onChange={(e) => setInputValue(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  )
}
