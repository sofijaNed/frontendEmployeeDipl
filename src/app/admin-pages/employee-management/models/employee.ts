import { User } from "src/app/services/models/user";
import { Salary } from "./salary";
import { UserTeam } from "./user-team";

export type Employee = {
  employeeID: number,
  firstName: string,
  lastName: string,
  email: string,
  dateOfBirth: Date,
  contactNumber: string,
  address: string,
  teamDTO: UserTeam,
  userDTO: User,
  salaries: Array<Salary>
}
