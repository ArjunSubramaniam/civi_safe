export const getUserRole = (): "user" | "admin" | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userRole") as "user" | "admin" | null
}

export const getUserEmail = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userEmail")
}

export const isAuthenticated = (): boolean => {
  return getUserRole() !== null
}
