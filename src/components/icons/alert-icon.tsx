import type { SVGProps } from "react"

export default function AlertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width || "20"}
      height={props.height || "20"}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.1083 15L11.4417 3.33335C11.1457 2.81116 10.5919 2.48843 9.99167 2.48843C9.39146 2.48843 8.8376 2.81116 8.54167 3.33335L1.875 15C1.57591 15.518 1.57732 16.1565 1.87871 16.6732C2.18009 17.1899 2.73522 17.5054 3.33334 17.5H16.6667C17.2618 17.4994 17.8115 17.1815 18.1088 16.6659C18.4061 16.1504 18.4059 15.5154 18.1083 15M10 7.50001V10.8333M10 14.1667H10.0083"
        stroke="#E74C3C"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
