type ApiSuccessResponse<T> = {
  success: true
  data: T
}

type ApiErrorResponse = {
  success: false
  error: {
    code: string
    message: string
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isApiSuccessResponse<T>(
  value: unknown,
): value is ApiSuccessResponse<T> {
  return isRecord(value) && value.success === true && "data" in value
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!isRecord(value) || value.success !== false || !isRecord(value.error)) {
    return false
  }

  return (
    typeof value.error.code === "string" &&
    typeof value.error.message === "string"
  )
}

async function parseResponse<T>(response: Response): Promise<T> {
  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new Error("Resposta inválida da API.")
  }

  if (isApiErrorResponse(payload)) {
    throw new Error(payload.error.message)
  }

  if (!isApiSuccessResponse<T>(payload)) {
    throw new Error("Resposta inválida da API.")
  }

  return payload.data
}

async function request<T>(
  url: string | URL,
  init: RequestInit,
): Promise<T> {
  const response = await fetch(url, init)

  return parseResponse<T>(response)
}

export const httpClient = {
  get<T>(url: string | URL, init?: RequestInit): Promise<T> {
    return request<T>(url, { ...init, method: "GET" })
  },

  post<T>(url: string | URL, init?: RequestInit): Promise<T> {
    return request<T>(url, { ...init, method: "POST" })
  },

  patch<T>(url: string | URL, init?: RequestInit): Promise<T> {
    return request<T>(url, { ...init, method: "PATCH" })
  },

  delete<T>(url: string | URL, init?: RequestInit): Promise<T> {
    return request<T>(url, { ...init, method: "DELETE" })
  },
}
