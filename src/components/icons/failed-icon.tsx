import type { SVGProps } from "react"

export default function FailedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width || "20"}
      height={props.height || "20"}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title></title>{" "}
        <g id="Complete">
          {" "}
          <g id="alert-circle">
            {" "}
            <g>
              {" "}
              <line
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.3679999999999999"
                x1="12"
                x2="12"
                y1="8"
                y2="12"
              ></line>{" "}
              <line
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.3679999999999999"
                x1="12"
                x2="12"
                y1="16"
                y2="16"
              ></line>{" "}
              <circle
                cx="12"
                cy="12"
                data-name="--Circle"
                fill="none"
                id="_--Circle"
                r="10"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.3679999999999999"
              ></circle>{" "}
            </g>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  )
}
