import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environment';
import { ConfirmDialogData } from '../confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) { }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.apiBaseUrl)) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.localLogout();
          // this.snackbarService.open(this.translateService.instant('interceptors.tokenExpired'), "Error");

          this.dialog.open(ConfirmDialogComponent,
            { data: { title: 'Error', message: error.error?.message?.error || 'Unkown Error' } as ConfirmDialogData });
          return throwError(() => error);
        }

        const errorMessages: string = error.error.errorMessages?.flat().join(', ');

        // this.snackbarService.open(error.error.errorMessage || errorMessages || error.message, "Error")
        this.dialog.open(ConfirmDialogComponent,
          { data: { title: 'Error', message: error.error?.message?.error || 'Unkown Error' } as ConfirmDialogData });

        return throwError(() => error);
      }),
    );
  }
}
