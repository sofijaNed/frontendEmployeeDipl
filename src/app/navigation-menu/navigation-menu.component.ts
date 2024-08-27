import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationRoutes } from '../constants/navigation-routes';
import { AuthenticationService } from '../services/authentication.service';
import { AuthResponse } from '../services/models/auth-response';
import { Role } from '../services/models/role';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
})
export class NavigationMenuComponent {
  public routes = NavigationRoutes;
  public currentUser: Observable<AuthResponse | null> | null;
  public roles = Role;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.currentUser = authenticationService.currentUser.asObservable();
  }

  public logout(): void {
    this.authenticationService.logout$().subscribe(() => {
      this.router.navigate([NavigationRoutes.Login]);
    });
  }
}
