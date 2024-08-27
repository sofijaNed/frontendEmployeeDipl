import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeApiService } from 'src/app/services/api/employee-api.service';
import { Team } from '../models/team';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent {
  team: Team;

  constructor(
    public dialogRef: MatDialogRef<EditTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Team,
    private employeeApiService: EmployeeApiService
  ) {
    this.team = structuredClone(this.data);
  }

  confirm(): void {
    this.dialogRef.close(this.team);
  }


}
