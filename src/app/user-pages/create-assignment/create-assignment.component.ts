import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { AssignmentStatus } from 'src/app/admin-pages/project-management/models/assignment-status';
import { Project } from 'src/app/admin-pages/project-management/models/project';
import { EmployeeApiService } from 'src/app/services/api/employee-api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Assignment } from '../assignments/models/assignment';
import { EditAssignmentComponent } from '../edit-assignment/edit-assignment.component';

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.scss']
})
export class CreateAssignmentComponent implements OnInit {
  assignment: Assignment = {} as Assignment;
  assignmentStatus: string[] = Object.values(AssignmentStatus);
  projects?: Array<Project>;

  spinnerVisible = true;

  constructor(
    public dialogRef: MatDialogRef<EditAssignmentComponent>,
    private employeeApiService: EmployeeApiService,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.employeeApiService.getProjects(this.authService.currentUser.value!.id).pipe(tap(x =>{
      this.projects = x;
      this.spinnerVisible = false;
    })).subscribe();
  }

  confirm(): void {
    this.dialogRef.close(this.assignment);
  }
}
