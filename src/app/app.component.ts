import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  /**
   *
   */
  constructor(private authService: AuthenticationService) {
    if (this.authService.token) {
      // this.authService.getUserData().subscribe();
      // this.authService.currentUser.next({
      //   userID: 2,
      //   username: 'tara@admin.fon.bg.ac.rs',
      //   role: Role.Admin
      // } as User)
    }
  }
}
