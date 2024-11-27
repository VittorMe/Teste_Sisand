import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isCollapsed = true;
  constructor(private router:Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }
  showMenu(): boolean {
    return this.router.url !== "/user/login" && this.router.url !== "/user/registration";
  }
  


  logout(): void {
    this.authService.logout(); // Chame o método de logout no seu serviço de autenticação
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
}
