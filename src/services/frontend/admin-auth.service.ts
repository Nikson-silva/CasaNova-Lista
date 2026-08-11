import { httpClient } from "@/lib/api/client"

type AdminLoginRequest = {
  password: string
}

export const adminAuthService = {
  login(data: AdminLoginRequest): Promise<null> {
    return httpClient.post<null>("/api/admin/login", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  },

  logout(): Promise<null> {
    return httpClient.post<null>("/api/admin/logout")
  },
}
