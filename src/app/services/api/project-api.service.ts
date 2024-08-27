import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/admin-pages/employee-management/models/employee';
import { Project } from 'src/app/admin-pages/project-management/models/project';
import { Assignment } from 'src/app/user-pages/assignments/models/assignment';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectApiService extends HttpClient {

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public getAll(): Observable<Array<Project>> {
    return this.get<Array<Project>>(`${environment.apiBaseUrl}/projects`)
  }

  public getById(id: number): Observable<Project> {
    return this.get<Project>(`${environment.apiBaseUrl}/projects/${id}`);
  }

  public insert(project: Project): Observable<Project> {
    return this.post<Project>(`${environment.apiBaseUrl}/projects`, project);
  }

  public update(project: Project): Observable<Project> {
    return this.put<Project>(`${environment.apiBaseUrl}/projects`, project);
  }

  public deleteProject(id: number): Observable<string> {
    return this.delete(`${environment.apiBaseUrl}/projects/${id}`, {responseType: 'text'});
  }

  public getEmployees(id: number): Observable<Array<Employee>> {
    return this.get<Array<Employee>>(`${environment.apiBaseUrl}/projects/${id}/employees`);
  }

  public getAssignments(id: number): Observable<Assignment> {
    return this.get<Assignment>(`${environment.apiBaseUrl}/projects/${id}/assignments`);
  }

  public insertAssignment(assignment: Assignment): Observable<Assignment> {
    return this.post<Assignment>(`${environment.apiBaseUrl}/projects/assignments`, assignment);
  }

  public updateAssignment(assignment: Assignment): Observable<Assignment> {
    return this.put<Assignment>(`${environment.apiBaseUrl}/projects/assignments`, assignment);
  }
}
