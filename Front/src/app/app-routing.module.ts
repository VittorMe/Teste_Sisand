import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { UserListaComponent } from './components/user/user-lista/user-lista.component';
import { UserDetalheComponent } from './components/user/user-detalhe/user-detalhe.component';

const routes: Routes = [
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'listar', component: UserListaComponent },
      { path: 'detalhe', component: UserDetalheComponent },
      { path: 'detalhe/:id', component: UserDetalheComponent },
    ]
  },
  
  { path: '', redirectTo: 'user/login', pathMatch: 'full' },
  
  { path: '**', redirectTo: 'user/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
