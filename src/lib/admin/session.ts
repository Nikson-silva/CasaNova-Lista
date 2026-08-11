import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

export const ADMIN_SESSION_COOKIE = "casanova_admin_session"
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8

export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
}

export class AdminSessionUnauthorizedError extends Error {
  constructor() {
    super("Admin session is required")
  }
}

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD environment variable")
  }

  return password
}

function createSignature(value: string): string {
  return createHmac("sha256", getAdminPassword()).update(value).digest("base64url")
}

function areEqual(firstValue: string, secondValue: string): boolean {
  const firstBuffer = Buffer.from(firstValue)
  const secondBuffer = Buffer.from(secondValue)

  return (
    firstBuffer.length === secondBuffer.length &&
    timingSafeEqual(firstBuffer, secondBuffer)
  )
}

export function isValidAdminPassword(value: string): boolean {
  return areEqual(value, getAdminPassword())
}

export function createAdminSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000 }),
  ).toString("base64url")

  return `${payload}.${createSignature(payload)}`
}

export function isValidAdminSessionToken(token?: string): boolean {
  if (!token) {
    return false
  }

  const [payload, signature, ...rest] = token.split(".")

  if (!payload || !signature || rest.length > 0) {
    return false
  }

  if (!areEqual(signature, createSignature(payload))) {
    return false
  }

  try {
    const decodedPayload: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    )

    return (
      typeof decodedPayload === "object" &&
      decodedPayload !== null &&
      "expiresAt" in decodedPayload &&
      typeof decodedPayload.expiresAt === "number" &&
      decodedPayload.expiresAt > Date.now()
    )
  } catch {
    return false
  }
}

export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()

  return isValidAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function requireAdminSession(): Promise<void> {
  if (!(await hasAdminSession())) {
    throw new AdminSessionUnauthorizedError()
  }
}
