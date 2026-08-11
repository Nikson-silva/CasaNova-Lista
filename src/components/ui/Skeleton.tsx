import { forwardRef } from "react"

import { cn } from "@/lib/utils"

export type SkeletonProps = {
  className?: string
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-[#F8F8FA]", className)}
    />
  ),
)

Skeleton.displayName = "Skeleton"
