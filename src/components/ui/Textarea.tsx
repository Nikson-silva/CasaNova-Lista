import { forwardRef, type TextareaHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-24 w-full resize-y rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#000020] outline-none transition-colors placeholder:text-gray-400 focus-visible:border-[#000020] focus-visible:ring-2 focus-visible:ring-[#000020]/20 disabled:cursor-not-allowed disabled:bg-[#F8F8FA] disabled:opacity-50 aria-invalid:border-[#DC2626] aria-invalid:ring-2 aria-invalid:ring-[#DC2626]/20",
        className,
      )}
      {...props}
    />
  ),
)

Textarea.displayName = "Textarea"
