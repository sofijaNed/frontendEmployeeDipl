import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, debounceTime, forkJoin, startWith, switchMap, tap } from 'rxjs';
import { Employee } from 'src/app/admin-pages/employee-management/models/employee';
import { RequestStatus } from 'src/app/admin-pages/requests/models/request-status.enum';
import { EmployeeApiService } from 'src/app/services/api/employee-api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CreateAssignmentComponent } from '../create-assignment/create-assignment.component';
import { EditAssignmentComponent } from '../edit-assignment/edit-assignment.component';
import { Assignment } from './models/assignment';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit {
  _paginator?: MatPaginator;
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this._paginator = paginator;
      this._paginator.page.pipe(
        startWith({ pageIndex: 0, pageSize: this._paginator.pageSize, length: this.filteredData.length }),
        debounceTime(0))
        .subscribe((pageEvent: PageEvent) => {
          if (pageEvent.previousPageIndex != pageEvent.pageIndex) {
            const startIndex = pageEvent.pageIndex * pageEvent.pageSize
            this.data = [...this.filteredData].splice(startIndex, pageEvent.pageSize)
            return;
          }
          this.data = [...this.filteredData].splice(0, pageEvent.pageSize)
        })
    }
  };

  spinnerVisible = true;
  displayedColumns: string[] = ['project', 'description', 'status', 'tableActions'];
  filter!: string;

  assignments?: Array<Assignment>;
  employee?: Employee;

  data!: Array<Assignment>;
  filteredData!: Array<Assignment>;

  constructor(
    private dialog: MatDialog,
    private employeeApiService: EmployeeApiService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    forkJoin([this.getAssignments(), this.getEmployee()]).subscribe(() => {
      this.spinnerVisible = false;
    });
  }

  onFilter(): void {
    this.filteredData = this.assignments!.filter(x => {
      return x.description.includes(this.filter)
        || x.status.includes(this.filter)
        || x.projectDTO.projectName.includes(this.filter)
    })
    this._paginator?.page.emit({ pageIndex: 0, pageSize: this._paginator.pageSize, length: this.filteredData.length });
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateAssignmentComponent);

    dialogRef.afterClosed().subscribe((assignment: Assignment) => {
      if (assignment) {
        this.spinnerVisible = true;
        assignment.employeeDTO = this.employee!;
        assignment.assignmentCPK.projectID = assignment.projectDTO.projectID;
        assignment.assignmentCPK.employeeID = assignment.employeeDTO.employeeID;
        assignment.status = RequestStatus.InProcess;
        this.employeeApiService.insertAssignment(assignment).pipe(switchMap(() => this.getAssignments())).subscribe(() => {
          this.spinnerVisible = false;
        });
      }
    });
  }

  edit(assignment: Assignment): void {
    const dialogRef = this.dialog.open(EditAssignmentComponent,
      { data: assignment });

    dialogRef.afterClosed().subscribe((assignment: Assignment) => {
      if (assignment) {
        this.spinnerVisible = true;
        this.employeeApiService.updateAssignment(assignment).pipe(switchMap(() => this.getAssignments())).subscribe(() => {
          this.spinnerVisible = false;
        });
      }
    });
  }

  private getAssignments(): Observable<Array<Assignment>> {
    return this.employeeApiService.getAssignments(this.authService!.currentUser!.value!.id).pipe(tap((data) => {
      this.assignments = data;
      this.filteredData = data;
    }));
  }

  private getEmployee(): Observable<Employee> {
    return this.employeeApiService.getById(this.authService!.currentUser!.value!.id).pipe(tap((response) => {
      this.employee = response;
    }))
  }
}
