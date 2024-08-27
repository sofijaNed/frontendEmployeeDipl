import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { Employee } from 'src/app/admin-pages/employee-management/models/employee';
import { Salary } from 'src/app/admin-pages/employee-management/models/salary';
import { Team } from 'src/app/admin-pages/team-management/models/team';
import { EmployeeApiService } from '../../services/api/employee-api.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  spinnerVisible = true;
  employee?: Employee;
  currentSalary?: Salary;
  team?: Team

  constructor(
    private employeeApiService: EmployeeApiService,
    private authService: AuthenticationService,
  ) {  }

  ngOnInit(): void {
    this.employeeApiService.getById(this.authService!.currentUser!.value!.id).pipe(tap((response) => {
      this.employee = response;
      this.getCurrentSalary();
      this.spinnerVisible = false;
    })).subscribe();
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
