import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { forwardRef, type ButtonHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#000020]/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#000020] text-white hover:bg-[#000020]/90",
        outline:
          "border border-[#E5E7EB] bg-white text-[#000020] hover:bg-[#F9FAFB]",
        ghost: "text-[#000020] hover:bg-[#F9FAFB]",
        destructive: "bg-[#DC2626] text-white hover:bg-[#DC2626]/90",
      },
      size: {
        sm: "h-8 px-3 text-xs [&_svg]:size-4",
        default: "h-10 px-4 py-2 text-sm [&_svg]:size-4",
        lg: "h-12 px-6 text-base [&_svg]:size-5",
        icon: "size-10 p-0 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, disabled, loading = false, size, variant, ...props },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ size, variant }), className)}
        {...props}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center gap-2",
            loading && "opacity-0",
          )}
        >
          {children}
        </span>

        {loading && (
          <Loader2
            aria-hidden="true"
            className="absolute size-4 animate-spin"
          />
        )}
      </button>
    )
  },
)

Button.displayName = "Button"
