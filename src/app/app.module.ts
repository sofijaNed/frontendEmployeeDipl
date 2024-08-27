import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

import { LoginComponent } from './login/login.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';

import { CreateEmployeeComponent } from './admin-pages/employee-management/create-employee/create-employee.component';
import { EditEmployeeComponent } from './admin-pages/employee-management/edit-employee/edit-employee.component';
import { EditSalaryComponent } from './admin-pages/employee-management/edit-salary/edit-salary.component';
import { EmployeesComponent } from './admin-pages/employee-management/employees/employees.component';
import { CreateProjectComponent } from './admin-pages/project-management/create-project/create-project.component';
import { EditProjectComponent } from './admin-pages/project-management/edit-project/edit-project.component';
import { ProjectsComponent } from './admin-pages/project-management/projects/projects.component';
import { EditRequestComponent } from './admin-pages/requests/edit-request/edit-request.component';
import { RequestsComponent } from './admin-pages/requests/requests/requests.component';
import { CreateTeamComponent } from './admin-pages/team-management/create-team/create-team.component';
import { EditTeamComponent } from './admin-pages/team-management/edit-team/edit-team.component';
import { TeamsComponent } from './admin-pages/team-management/teams/teams.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { ErrorInterceptor } from './services/error.interceptor';
import { CreateRequestComponent } from './user-pages/create-request/create-request.component';
import { UserRequestsComponent } from './user-pages/user-requests/user-requests.component';
import { UserComponent } from './user-pages/user/user.component';
import { AssignmentsComponent } from './user-pages/assignments/assignments.component';
import { CreateAssignmentComponent } from './user-pages/create-assignment/create-assignment.component';
import { EditAssignmentComponent } from './user-pages/edit-assignment/edit-assignment.component';


@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    EditEmployeeComponent,
    CreateEmployeeComponent,
    ConfirmDialogComponent,
    SearchInputComponent,
    NavigationMenuComponent,
    TeamsComponent,
    EditTeamComponent,
    CreateTeamComponent,
    ProjectsComponent,
    EditProjectComponent,
    CreateProjectComponent,
    RequestsComponent,
    EditRequestComponent,
    CreateRequestComponent,
    LoginComponent,
    EditSalaryComponent,
    UserComponent,
    UserRequestsComponent,
    AssignmentsComponent,
    CreateAssignmentComponent,
    EditAssignmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatCardModule,
    MatDividerModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      deps: [AuthenticationService],
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      deps: [MatDialog, AuthenticationService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}

