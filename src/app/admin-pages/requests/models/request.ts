import { Employee } from "../../employee-management/models/employee"

export type Request = {
  requestID: number,
  startDate: Date,
  endDate: Date,
  reason: string,
  status: string,
  employeeDTO: Employee
}
