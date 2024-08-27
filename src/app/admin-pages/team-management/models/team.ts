import { Employee } from "../../employee-management/models/employee"

export type Team = {
  teamID: number,
  teamName: string,
  maxNumber: number,
  employees: Array<Employee>
}
