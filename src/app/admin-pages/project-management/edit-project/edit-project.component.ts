import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamApiService } from 'src/app/services/api/team-api.service';
import { Employee } from '../../employee-management/models/employee';
import { Team } from '../../team-management/models/team';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { AssignmentStatus } from '../models/assignment-status';
import { Project } from '../models/project';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
  teams?: Array<Team>;
  project: Project;
  tableSpinner = false;
  employees?: Array<Employee>;
  assignmentStatus: string[] = Object.values(AssignmentStatus);

  displayedColumns: string[] = ['email', 'description', 'status'];

  constructor(
    public dialogRef: MatDialogRef<CreateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private teamApiService: TeamApiService
  ) {
    this.project = this.data;
  }

  ngOnInit(): void {
    this.tableSpinner = true;
    this.teamApiService.getEmployees(this.project.teamDTO.teamID).subscribe((response) => {
      this.employees = response;
      this.tableSpinner = false;
    });
  }

  confirm(): void {
    this.dialogRef.close(this.project);
  }

  compareTeams(team1: Team, team2: Team) {
    if (team1.teamID == team2.teamID)
      return true;
    else return false
  }
}
