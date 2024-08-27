import { Employee } from "src/app/admin-pages/employee-management/models/employee"
import { Project } from "src/app/admin-pages/project-management/models/project"
import { AssignmentCPK } from "./assignmentCPK"

export type Assignment = {
  description: string,
  status: string,
  projectDTO: Project,
  employeeDTO: Employee,
  assignmentCPK: AssignmentCPK
}
