import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/admin-pages/employee-management/models/employee';
import { Salary } from 'src/app/admin-pages/employee-management/models/salary';
import { Project } from 'src/app/admin-pages/project-management/models/project';
import { Request } from 'src/app/admin-pages/requests/models/request';
import { Assignment } from 'src/app/user-pages/assignments/models/assignment';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService extends HttpClient {

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public getAll(): Observable<Array<Employee>> {
    return this.get<Array<Employee>>(`${environment.apiBaseUrl}/employees`)
  }

  public getById(id: number): Observable<Employee> {
    return this.get<Employee>(`${environment.apiBaseUrl}/employees/${id}`);
  }

  public insert(employee: Employee): Observable<Employee> {
    return this.post<Employee>(`${environment.apiBaseUrl}/employees`, employee);
  }

  public update(employee: Employee): Observable<Employee> {
    employee.userDTO!.username = employee.email;
    return this.put<Employee>(`${environment.apiBaseUrl}/employees`, employee);
  }

  public deleteEmployee(id: number): Observable<string> {
    return this.delete<string>(`${environment.apiBaseUrl}/employees/${id}`);
  }

  public getSalaries(id: number): Observable<Array<Salary>> {
    return this.get<Array<Salary>>(`${environment.apiBaseUrl}/employees/${id}/salaries`);
  }

  public getRequests(id: number): Observable<Array<Request>> {
    return this.get<Array<Request>>(`${environment.apiBaseUrl}/employees/${id}/requests`);
  }

  public getAssignments(id: number): Observable<Array<Assignment>> {
    return this.get<Array<Assignment>>(`${environment.apiBaseUrl}/employees/${id}/assignments`);
  }

  public getProjects(id: number): Observable<Array<Project>> {
    return this.get<Array<Project>>(`${environment.apiBaseUrl}/employees/${id}/projects`);
  }

  public insertAssignment(assignment: Assignment): Observable<Assignment> {
    return this.post<Assignment>(`${environment.apiBaseUrl}/employees/${assignment.employeeDTO.employeeID}/assignments`, assignment);
  }

  public updateAssignment(assignment: Assignment): Observable<Assignment> {
    return this.put<Assignment>(`${environment.apiBaseUrl}/employees/${assignment.employeeDTO.employeeID}/assignments`, assignment);
  }
}

