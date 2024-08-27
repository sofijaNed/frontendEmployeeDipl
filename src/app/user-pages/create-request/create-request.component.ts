import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateEmployeeComponent } from 'src/app/admin-pages/employee-management/create-employee/create-employee.component';
import { Employee } from 'src/app/admin-pages/employee-management/models/employee';
import { Request } from 'src/app/admin-pages/requests/models/request';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent {
  request = { employeeDTO: {} as Employee } as Request;

  constructor(
    public dialogRef: MatDialogRef<CreateEmployeeComponent>,
  ) { }

  confirm(): void {
    this.dialogRef.close(this.request);
  }
}
