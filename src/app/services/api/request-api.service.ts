import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from 'src/app/admin-pages/requests/models/request';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestApiService extends HttpClient {

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public getAll(): Observable<Array<Request>> {
    return this.get<Array<Request>>(`${environment.apiBaseUrl}/requests`)
  }

  public getById(id: number): Observable<Request> {
    return this.get<Request>(`${environment.apiBaseUrl}/requests/${id}`);
  }

  public insert(request: Request): Observable<Request> {
    return this.post<Request>(`${environment.apiBaseUrl}/requests`, request);
  }

  public update(request: Request): Observable<Request> {
    return this.put<Request>(`${environment.apiBaseUrl}/requests`, request);
  }

  public deleteRequest(id: number): Observable<string> {
    return this.delete(`${environment.apiBaseUrl}/requests/${id}`, { responseType: 'text' });
  }
}
