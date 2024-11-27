import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void { }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      {
        next:(response) => {
          this.spinner.show();
          this.authService.saveToken(response.token);
          this.router.navigate(['user/listar']);
          this.toastr.success('Logado')
        },
        error:(error) => {
          this.spinner.hide(),
          this.toastr.error('Falha ao fazer login. Verifique suas credenciais.')
          this.errorMessage = 'Falha ao fazer login. Verifique suas credenciais.';
        },
        complete: () => this.spinner.hide()
      });
  }
}
