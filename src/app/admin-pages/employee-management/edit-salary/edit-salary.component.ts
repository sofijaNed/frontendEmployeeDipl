import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeApiService } from 'src/app/services/api/employee-api.service';
import { EditRequestComponent } from '../../requests/edit-request/edit-request.component';
import { Salary } from '../models/salary';

@Component({
  selector: 'app-edit-salary',
  templateUrl: './edit-salary.component.html',
  styleUrls: ['./edit-salary.component.scss']
})
export class EditSalaryComponent implements OnInit {
  salaries?: Array<Salary>;
  newSalary: Salary = {} as Salary;
  spinnerVisible = true;

  constructor(
    public dialogRef: MatDialogRef<EditRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private employeeApiService: EmployeeApiService
  ) { }

  ngOnInit(): void {
    this.employeeApiService.getSalaries(this.data).subscribe(
      (response) => {
        this.salaries = response;
        this.spinnerVisible = false;
      }
    );
  }

  confirm(): void {
    this.dialogRef.close(this.newSalary)
  }
}
