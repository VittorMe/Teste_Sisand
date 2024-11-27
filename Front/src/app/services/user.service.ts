import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Usuario } from '../Models/Usuarios';

@Injectable()
export class UserService {
  private apiUrl = 'https://localhost:44384/Usuarios';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getUsuarios(): Observable<Usuario[]> {
    // Agora o token é recuperado dos cookies
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    // Define o header de autorização com o token recuperado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Define o header de autorização
    });

    // Faz a requisição GET passando o cabeçalho com o token
    return this.http.get<Usuario[]>(this.apiUrl, { headers });
  }
  
  public getUsuarioById(id: string): Observable<Usuario> {
    // Agora o token é recuperado dos cookies
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    // Define o header de autorização com o token recuperado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Define o header de autorização
    });

    // Faz a requisição GET passando o cabeçalho com o token
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { headers });
  }


  public deleteUsuario(id: string): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers, observe: 'response' });
  }


  public post(usuario: Usuario): Observable<Usuario> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<Usuario>(this.apiUrl, usuario, { headers }).pipe();
}

public put(usuario: Usuario): Observable<Usuario> {
  const token = this.authService.getToken();

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario,{ headers }).pipe();;
}



}
