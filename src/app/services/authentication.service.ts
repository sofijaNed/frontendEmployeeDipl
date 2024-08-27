import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { AuthenticationApiService } from './api/authentication-api.service';
import { AuthResponse } from './models/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser = new BehaviorSubject<(AuthResponse) | null>(null);
  token!: string;
  refreshToken!: string;

  constructor(
    private authApiService: AuthenticationApiService,
  ) {
    this.token = localStorage.getItem('token') || '';
    this.refreshToken = localStorage.getItem('refreshToken') || '';
    let user = localStorage.getItem('user')
    if (user) {
      this.currentUser.next(JSON.parse(user));
    }
  }

  private setToken(authResponse: AuthResponse): void {
    this.token = authResponse.accessToken;
    this.refreshToken = authResponse.refreshToken;
  }

  private saveInfoToLocalStorage(authResponse: AuthResponse): void {
    localStorage.setItem('token', this.token);
    localStorage.setItem('refreshToken', this.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse));
  }

  private removeToken(): void {
    this.token = '';
    this.refreshToken = '';
  }

  private removeTokenFromLocalStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }


  // public getUserData(username: string, password: string): Observable<AuthResponse> {
  //   return this.authApiService.getUserData(username, password).pipe(tap((user) =>
  //     this.currentUser.next(user)))
  // }

  login$(username: string, password: string): Observable<AuthResponse> {
    return this.authApiService
      .login(username, password).pipe(
        tap((response) => {
          this.currentUser.next(response);
          this.setToken(response);
          this.saveInfoToLocalStorage(response);
          // return this.getUserData(username, password);
          //   return of({
          //     userID: 2,
          //     username: 'tara@admin.fon.bg.ac.rs',
          //     role: Role.Admin
          //   } as User).pipe(tap(x => this.currentUser.next(x))) as Observable<User>
          // })
        })
      )
  }

  logout$(): Observable<void> {
    // return this.authApiService
    //   .logout().pipe(
    //     tap(() => {
    //       this.removeToken();
    //       this.removeTokenFromLocalStorage();
    //       this.currentUser.next(null)
    //     })
    //   )
    return of(void 0).pipe(tap(() => {
      this.removeToken();
      this.removeTokenFromLocalStorage();
      this.currentUser.next(null);
    }
    ))
  }

  localLogout(): void {
    this.removeToken();
    this.removeTokenFromLocalStorage();
  }
}
