import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(
    
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.checkAuthentication();

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
  private checkAuthentication(): void {
    const token = this.authService.getToken();

    if (token) {
      const isTokenValid = !this.authService.isTokenExpired(token);
      this.isLoggedIn = isTokenValid;

      if (!isTokenValid) {
        this.authService.logout();
      }
    } else {
      this.isLoggedIn = false;
    }
  }
}
