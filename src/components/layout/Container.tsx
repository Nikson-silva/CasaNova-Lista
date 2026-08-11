import { forwardRef, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export type ContainerProps = HTMLAttributes<HTMLDivElement>

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-[1144px] px-5 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  ),
)

Container.displayName = "Container"
