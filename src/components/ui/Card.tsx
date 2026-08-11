import { forwardRef, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-[#E5E7EB] bg-white text-[#000020] shadow-sm",
        className,
      )}
      {...props}
    />
  ),
)

Card.displayName = "Card"
