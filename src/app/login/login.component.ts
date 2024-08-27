import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes } from '../constants/navigation-routes';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  spinnerVisible = false;

  userDto: UserDto = {
    username: '',
    password: ''
  }

  public showPassword = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) {
  }

  public login(): void {
    this.authService.login$(this.userDto.username, this.userDto.password).subscribe(()=>{
      this.router.navigate([NavigationRoutes.Employees])
    });
  }

}

export type UserDto = {
  username: string,
  password: string
}
