import { forwardRef } from "react"

import { Button, type ButtonProps } from "@/components/ui/Button"

export type LoadingButtonProps = ButtonProps

export const LoadingButton = forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(({ children, loading = false, ...props }, ref) => (
  <Button ref={ref} loading={loading} {...props}>
    {children}
  </Button>
))

LoadingButton.displayName = "LoadingButton"
