import { cn } from "@/lib/utils"

type FloralCornerOrnamentProps = {
  className?: string
}

export function FloralCornerOrnament({
  className,
}: FloralCornerOrnamentProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 150 125"
      fill="none"
      className={cn("absolute h-[125px] w-[150px]", className)}
    >
      <path
        d="M1 124C24 65 69 19 142 5"
        stroke="#9CCFE5"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M31 77C48 78 56 84 61 91C43 94 35 88 31 77Z"
        fill="#D9ECF5"
      />
      <path
        d="M46 57C58 51 68 51 76 55C66 68 55 68 46 57Z"
        fill="#CEE7F2"
      />
      <path
        d="M77 30C88 26 97 28 102 33C92 43 83 41 77 30Z"
        fill="#D9ECF5"
      />
      <path d="M59 51L52 71" stroke="#9CCFE5" strokeWidth="1.1" />
      <path d="M92 24L83 38" stroke="#9CCFE5" strokeWidth="1.1" />
      <g transform="translate(128 5)" fill="#A9D5E8">
        <ellipse cx="7" cy="1" rx="3" ry="7" />
        <ellipse cx="7" cy="1" rx="3" ry="7" transform="rotate(72 7 1)" />
        <ellipse cx="7" cy="1" rx="3" ry="7" transform="rotate(144 7 1)" />
        <ellipse cx="7" cy="1" rx="3" ry="7" transform="rotate(216 7 1)" />
        <ellipse cx="7" cy="1" rx="3" ry="7" transform="rotate(288 7 1)" />
        <circle cx="7" cy="1" r="2.2" fill="#7EBEDB" />
      </g>
    </svg>
  )
}

