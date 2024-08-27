import { Assignment } from "src/app/user-pages/assignments/models/assignment"
import { Team } from "../../team-management/models/team"

export type Project = {
  projectID: number,
  projectName: string,
  description: string,
  startDate: Date,
  endDate: Date,
  teamDTO: Team
  assignments: Array<Assignment>
}
