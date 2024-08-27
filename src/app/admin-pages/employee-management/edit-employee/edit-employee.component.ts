import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, catchError, map, switchMap, tap } from 'rxjs';
import { NavigationRoutes } from 'src/app/constants/navigation-routes';
import { EmployeeApiService } from 'src/app/services/api/employee-api.service';
import { TeamApiService } from 'src/app/services/api/team-api.service';
import { User } from 'src/app/services/models/user';
import { Team } from '../../team-management/models/team';
import { EditSalaryComponent } from '../edit-salary/edit-salary.component';
import { Employee } from '../models/employee';
import { Salary } from '../models/salary';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  spinnerVisible = true;
  employee?: Employee;
  currentSalary?: Salary;
  teams?: Array<Team>

  constructor(

    private employeeApiService: EmployeeApiService,
    private teamApiService: TeamApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    this.teamApiService.getAll().subscribe((response) => {
      this.teams = response;
    });

    this.route.params.subscribe(params => {
      this.getEmployee(params['id']).subscribe()
    });
  }

  save(): void {
    this.spinnerVisible = true;
    this.employeeApiService.update(this.employee!).pipe(switchMap((response) =>
      this.getEmployee(response.employeeID)
    )).subscribe(() => this.spinnerVisible = false);
  }

  editSalary(): void {
    const dialogRef = this.dialog.open(EditSalaryComponent, {
      data: this.employee?.employeeID,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentSalary = result;
        this.employee!.salaries.push(result);
      }
    });
  }

  compareTeams(team1: Team, team2: Team) {
    if (team1.teamID == team2.teamID)
      return true;
    else return false
  }

  private getEmployee(id: number): Observable<Employee> {
    return this.employeeApiService.getById(id).pipe(tap(
      (response) => {
        this.employee = response;
        this.employee.userDTO = { userID: 1, } as User
        // this.employee.teamDTO = { teamID: 3 } as UserTeam
        this.getCurrentSalary();
        this.spinnerVisible = false;
      }
    ),
      switchMap(() => {
        return this.employeeApiService.getAll().pipe(map((response) => {
          this.employee!.teamDTO = response.find(x => x.employeeID == id)!.teamDTO;
          this.spinnerVisible = false;
          return this.employee!;
        }))
      }),
      catchError(() => {
        this.router.navigate([NavigationRoutes.Employees])
        throw EMPTY;
      })
    );
  }

  private getCurrentSalary(): void {
    // this.currentSalary = this.employee?.salaries.reduce((x, y) => x.salaryCPK.salaryID)
    this.currentSalary = this.employee!.salaries.reduce(
      (maxSalary, currentSalary) => {
        return currentSalary.salaryCPK.salaryID > maxSalary.salaryCPK.salaryID
          ? currentSalary
          : maxSalary;
      },
      this.employee!.salaries[0]
    );
  }
}
