import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationApiService extends HttpClient {

  constructor(handler: HttpHandler) {
    super(handler);
  }

  // public login(username: string, password: string): Observable<string> {
  //   return this.post(`${environment.apiBaseUrl}/auth/login`, { username, password }, {responseType: 'text'})
  // }

  public login(username: string, password: string): Observable<AuthResponse> {
    return this.post<AuthResponse>(`${environment.apiBaseUrl}/auth/authenticate`, { username, password })
  }

  public logout(): Observable<any> {
    return this.get(`${environment.apiBaseUrl}/api/logout`);
  }

}
