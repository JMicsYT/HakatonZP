import "next-auth"
import type { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string
    role: UserRole
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
  }
}
