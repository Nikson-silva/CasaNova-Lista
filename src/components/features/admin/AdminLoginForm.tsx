"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { adminAuthService } from "@/services/frontend/admin-auth.service"

type AdminLoginFormValues = {
  password: string
}

export function AdminLoginForm() {
  const router = useRouter()
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<AdminLoginFormValues>({
    defaultValues: { password: "" },
  })

  async function submit(values: AdminLoginFormValues) {
    setSubmissionError(null)

    try {
      await adminAuthService.login(values)
      router.replace("/casanova-2405-admin")
      router.refresh()
    } catch {
      setSubmissionError("Senha inválida. Tente novamente.")
    }
  }

  return (
    <Card className="w-full max-w-md p-6 shadow-[0_8px_24px_rgba(38,55,72,0.08)] sm:p-8">
      <h1 className="font-serif text-3xl font-semibold text-[#263748]">
        Área Administrativa
      </h1>
      <p className="mt-2 text-sm leading-6 text-[#627489]">
        Informe a senha para acessar o painel.
      </p>

      <form className="mt-6" noValidate onSubmit={handleSubmit(submit)}>
        <label
          htmlFor="admin-password"
          className="text-sm font-medium text-[#263748]"
        >
          Senha
        </label>
        <Input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "admin-password-error" : undefined}
          className="mt-2 h-11 border-[#B9D7E7] bg-[#F8FBFD]"
          {...register("password", {
            required: "Informe a senha.",
          })}
        />
        {errors.password ? (
          <p id="admin-password-error" role="alert" className="mt-2 text-sm text-[#B91C1C]">
            {errors.password.message}
          </p>
        ) : null}
        {submissionError ? (
          <p role="alert" className="mt-3 text-sm text-[#B91C1C]">
            {submissionError}
          </p>
        ) : null}

        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="mt-6 h-11 w-full bg-[#88CDF6] text-[#263748] hover:bg-[#72C1F0]"
        >
          Entrar
        </Button>
      </form>
    </Card>
  )
}
