import { Role } from "./role"

export type AuthResponse = {
  id: number,
  accessToken: string,
  refreshToken: string,
  message: string,
  firstname: string,
  lastname: string,
  email: string,
  role: Role
}
