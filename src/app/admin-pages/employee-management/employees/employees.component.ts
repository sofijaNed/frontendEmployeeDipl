import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { EMPTY, Observable, catchError, switchMap, tap } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { ConfirmDialogData } from 'src/app/confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { NavigationRoutes } from 'src/app/constants/navigation-routes';
import { EmployeeApiService } from 'src/app/services/api/employee-api.service';
import { CreateEmployeeComponent } from '../create-employee/create-employee.component';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
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
  displayedColumns: string[] = ['name', 'lastName', 'address', 'email', 'contactNumber', 'birthday', 'tableActions'];
  filter!: string;

  employees: Array<Employee> = new Array<Employee>;

  data!: Array<Employee>;
  filteredData!: Array<Employee>;

  constructor(
    private dialog: MatDialog,
    private employeeApiService: EmployeeApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEmployees().subscribe();
  }

  onFilter(): void {
    this.filteredData = this.employees.filter(x => {
      return x.address.includes(this.filter)
        || x.contactNumber.includes(this.filter)
        || x.firstName.includes(this.filter)
        || x.lastName.includes(this.filter)
        || x.contactNumber.includes(this.filter)
        || x.email.includes(this.filter)
        || x.dateOfBirth.toString().includes(this.filter)
    })
    this._paginator?.page.emit({ pageIndex: 0, pageSize: this._paginator.pageSize, length: this.filteredData.length });
  }

  edit(employee: Employee): void {
    this.router.navigate([NavigationRoutes.Employees, employee.employeeID])
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateEmployeeComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.employeeApiService.insert(result).pipe(
          catchError(() => {
            this.spinnerVisible = false;
            return EMPTY;
          }),
          switchMap(() => this.getEmployees()))
          .subscribe();
      }
    });
  }

  delete(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { data: { title: 'Confirm Delete', message: `Are you sure you want to delete ${employee.firstName}` } as ConfirmDialogData })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.employeeApiService.deleteEmployee(employee.employeeID).pipe(
          catchError(() => {
            this.spinnerVisible = false;
            return EMPTY;
          }),
          switchMap(() => this.getEmployees()))
          .subscribe();
      }
    });
  }

  private getEmployees(): Observable<Array<Employee>> {
    return this.employeeApiService.getAll().pipe(tap((data) => {
      this.employees = data;
      this.filteredData = data;
      this.spinnerVisible = false;
    }));
  }
}
