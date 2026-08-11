import { NextResponse } from "next/server"

import { API_ERROR_CODES } from "@/lib/api/errors"
import type { ApiErrorCode } from "@/lib/api/errors"

function successResponse<T>(data: T, status: number) {
  return NextResponse.json({ success: true as const, data }, { status })
}

function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
) {
  return NextResponse.json(
    { success: false as const, error: { code, message } },
    { status },
  )
}

export function ok<T>(data: T) {
  return successResponse(data, 200)
}

export function created<T>(data: T) {
  return successResponse(data, 201)
}

export function badRequest(message: string) {
  return errorResponse(API_ERROR_CODES.BAD_REQUEST, message, 400)
}

export function unauthorized(message: string) {
  return errorResponse(API_ERROR_CODES.UNAUTHORIZED, message, 401)
}

export function forbidden(message: string) {
  return errorResponse(API_ERROR_CODES.FORBIDDEN, message, 403)
}

export function notFound(message: string) {
  return errorResponse(API_ERROR_CODES.NOT_FOUND, message, 404)
}

export function conflict(message: string) {
  return errorResponse(API_ERROR_CODES.CONFLICT, message, 409)
}

export function internalError(message: string) {
  return errorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, message, 500)
}
