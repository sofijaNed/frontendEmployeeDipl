import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TeamApiService } from 'src/app/services/api/team-api.service';
import { User } from 'src/app/services/models/user';
import { Team } from '../../team-management/models/team';
import { Employee } from '../models/employee';
import { Salary } from './../models/salary';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  teams?: Array<Team>;
  employee: Employee = { userDTO: {} as User, salaries: [{}] as Array<Salary> } as Employee;
  spinnerVisible = true;

  constructor(
    public dialogRef: MatDialogRef<CreateEmployeeComponent>,
    private teamApiService: TeamApiService
  ) { }

  ngOnInit(): void {
    this.teamApiService.getAll().subscribe((response) => {
      this.teams = response;
      this.spinnerVisible = false;
    });
  }

  confirm(): void {
    this.employee.userDTO.username = this.employee.email;
    this.dialogRef.close(this.employee);
  }
}
