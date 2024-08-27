import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../employee-management/models/employee';
import { Team } from '../models/team';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent  {
  team: Team = { employees: new Array<Employee> } as Team;

  constructor(
    public dialogRef: MatDialogRef<CreateTeamComponent>,
  ) { }



  confirm(): void {
    this.dialogRef.close(this.team);
  }
}
