import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/admin-pages/employee-management/models/employee';
import { Project } from 'src/app/admin-pages/project-management/models/project';
import { Team } from 'src/app/admin-pages/team-management/models/team';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamApiService extends HttpClient {

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public getAll(): Observable<Array<Team>> {
    return this.get<Array<Team>>(`${environment.apiBaseUrl}/teams`)
  }

  public getById(id: number): Observable<Team> {
    return this.get<Team>(`${environment.apiBaseUrl}/teams/${id}`);
  }

  public insert(team: Team): Observable<Team> {
    return this.post<Team>(`${environment.apiBaseUrl}/teams`, team);
  }

  public update(team: Team): Observable<Team> {
    return this.put<Team>(`${environment.apiBaseUrl}/teams`, team);
  }

  public deleteTeam(id: number): Observable<string> {
    return this.delete<string>(`${environment.apiBaseUrl}/teams/${id}`);
  }

  public getEmployees(id: number): Observable<Array<Employee>> {
    return this.get<Array<Employee>>(`${environment.apiBaseUrl}/teams/${id}/employees`);
  }

  public getProjects(id: number): Observable<Project> {
    return this.get<Project>(`${environment.apiBaseUrl}/teams/${id}/projects`);
  }
}
