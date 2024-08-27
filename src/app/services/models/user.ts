import { Role } from "./role";

export type User = {
  userID: number,
  username: string,
  password: string,
  role: Role,
}
