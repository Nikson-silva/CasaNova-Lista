import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#000020]/20 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#000020] text-white",
        success: "bg-[#22C55E] text-white",
        warning: "bg-[#F59E0B] text-[#000020]",
        danger: "bg-[#DC2626] text-white",
        outline: "border border-[#E5E7EB] bg-white text-[#000020]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  ),
)

Badge.displayName = "Badge"
