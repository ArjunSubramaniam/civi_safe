export interface User {
  email: string
  role: "user" | "admin"
}

export const DEMO_CREDENTIALS = {
  user: {
    email: "user@example.com",
    password: "user123",
    role: "user" as const,
  },
  admin: {
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
  },
}

export function validateCredentials(email: string, password: string): User | null {
  if (email === DEMO_CREDENTIALS.user.email && password === DEMO_CREDENTIALS.user.password) {
    return { email: DEMO_CREDENTIALS.user.email, role: DEMO_CREDENTIALS.user.role }
  }

  if (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) {
    return { email: DEMO_CREDENTIALS.admin.email, role: DEMO_CREDENTIALS.admin.role }
  }

  return null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("civisafe_user")
  if (!userData) return null

  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem("civisafe_user", JSON.stringify(user))
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("civisafe_user")
}
