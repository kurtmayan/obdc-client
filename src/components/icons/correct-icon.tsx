import type { SVGProps } from "react"

export default function CorrectIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width || "20"}
      height={props.height || "20"}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_81_262)">
        <path
          d="M18.1675 8.33332C18.9517 12.1821 16.942 16.056 13.3438 17.6311C9.74557 19.2062 5.53598 18.0549 3.24023 14.8678C0.944472 11.6807 1.18591 7.32325 3.81971 4.4093C6.45351 1.49534 10.7645 0.816149 14.1667 2.77915"
          stroke="#2ECC71"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 9.16668L10 11.6667L18.3333 3.33334"
          stroke="#2ECC71"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_81_262">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
