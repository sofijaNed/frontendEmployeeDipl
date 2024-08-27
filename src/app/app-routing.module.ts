import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmployeeComponent } from './admin-pages/employee-management/edit-employee/edit-employee.component';
import { EmployeesComponent } from './admin-pages/employee-management/employees/employees.component';
import { ProjectsComponent } from './admin-pages/project-management/projects/projects.component';
import { RequestsComponent } from './admin-pages/requests/requests/requests.component';
import { TeamsComponent } from './admin-pages/team-management/teams/teams.component';
import { NavigationRoutes } from './constants/navigation-routes';
import { AdminGuard } from './guards/admin.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';
import { UserGuard } from './guards/user.guard';
import { LoginComponent } from './login/login.component';
import { AssignmentsComponent } from './user-pages/assignments/assignments.component';
import { UserRequestsComponent } from './user-pages/user-requests/user-requests.component';
import { UserComponent } from './user-pages/user/user.component';

const routes: Routes = [
  {
    path: NavigationRoutes.Employees,
    component: EmployeesComponent,
    canActivate: [LoggedInGuard, AdminGuard]
  },
  {
    path: `${NavigationRoutes.Employees}/:id`,
    component: EditEmployeeComponent,
    canActivate: [LoggedInGuard, AdminGuard]
  },
  {
    path: NavigationRoutes.Teams,
    component: TeamsComponent,
    canActivate: [LoggedInGuard, AdminGuard]
  },
  {
    path: NavigationRoutes.Projects,
    component: ProjectsComponent,
    canActivate: [LoggedInGuard, AdminGuard]
  },
  {
    path: NavigationRoutes.Requests,
    component: RequestsComponent,
    canActivate: [LoggedInGuard, AdminGuard]
  },
  {
    path: NavigationRoutes.Request,
    component: UserRequestsComponent,
    canActivate: [LoggedInGuard, UserGuard]
  },
  {
    path: NavigationRoutes.Employee,
    component: UserComponent,
    canActivate: [LoggedInGuard, UserGuard]
  },
  {
    path: NavigationRoutes.Assignments,
    component: AssignmentsComponent,
    canActivate: [LoggedInGuard, UserGuard]
  },
  {
    path: NavigationRoutes.Login,
    component: LoginComponent,
    canActivate: [LoggedOutGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
