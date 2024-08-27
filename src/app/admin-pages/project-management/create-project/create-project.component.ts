import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { TeamApiService } from 'src/app/services/api/team-api.service';
import { Assignment } from 'src/app/user-pages/assignments/models/assignment';
import { AssignmentCPK } from 'src/app/user-pages/assignments/models/assignmentCPK';
import { Employee } from '../../employee-management/models/employee';
import { Team } from '../../team-management/models/team';
import { AssignmentStatus } from '../models/assignment-status';
import { Project } from '../models/project';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  teams?: Array<Team>;
  spinnerVisible = true;
  project: Project = {} as Project;
  tableSpinner = false;
  employees?: Array<Employee>;
  assignments: Array<Assignment> = new Array<Assignment>();
  assignment: Assignment = {} as Assignment;
  assignmentStatus: string[] = Object.values(AssignmentStatus);

  displayedColumns: string[] = ['email', 'description', 'status', 'tableActions'];

  _assignmentTable?: MatTable<Assignment>;
  @ViewChild(MatTable) set assignmentTable(assignmentTable: MatTable<Assignment>) {
    if (assignmentTable) {
      this._assignmentTable = assignmentTable;
    }
  };

  constructor(
    public dialogRef: MatDialogRef<CreateProjectComponent>,
    private teamApiService: TeamApiService
  ) { 
    
  }

  ngOnInit(): void {
    this.teamApiService.getAll().subscribe((response) => {
      this.teams = response;
      this.spinnerVisible = false;
    });
  }

  getEmployees(team: Team) {
    this.tableSpinner = true;
    this.teamApiService.getEmployees(team.teamID).subscribe((response) => {
      this.employees = response;
      this.assignment = { assignmentCPK: {} as AssignmentCPK } as Assignment;
      this.project.assignments = [this.assignment];
      // this.employees.forEach(x => {
      //   const assignment = { description: '', status: AssignmentStatus.New, employeeDTO: x } as Assignment
      //   this.project.assignments.push(assignment);
      // })
      this.tableSpinner = false;
    });
  }

  confirm(): void {
    this.project.assignments.splice(0, 1);
    this.dialogRef.close(this.project);
  }

  addRow(): void {
    this.assignment.assignmentCPK.employeeID = this.assignment.employeeDTO.employeeID;
    this.project.assignments.push(this.assignment);
    this.assignment = { assignmentCPK: {} as AssignmentCPK } as Assignment;
    this._assignmentTable!.renderRows();
  }

  removeRow(assignment: Assignment): void {
    let index = this.project.assignments.findIndex(x => x = assignment)
    this.project.assignments.splice(index, 1);
    this._assignmentTable!.renderRows();
  }
}
