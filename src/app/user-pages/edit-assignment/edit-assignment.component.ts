import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignmentStatus } from 'src/app/admin-pages/project-management/models/assignment-status';
import { Assignment } from '../assignments/models/assignment';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss']
})
export class EditAssignmentComponent {
  assignment: Assignment;
  assignmentStatus: string[] = Object.values(AssignmentStatus);

  constructor(
    public dialogRef: MatDialogRef<EditAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Assignment
  ) {
    this.assignment = structuredClone(this.data);
  }

  confirm(): void {
    this.dialogRef.close(this.assignment);
  }
}
