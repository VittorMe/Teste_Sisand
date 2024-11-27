import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode }from 'jwt-decode'; // Adicione essa biblioteca ao projeto: npm install jwt-decode
import { Usuario } from '@app/Models/Usuarios';

interface LoginResponse {
  token: string;
}

@Injectable()
export class AuthService {
  // private baseUrl = `http://localhost:5226/login`;
  private baseUrl = `https://localhost:44384`;

  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        catchError((error) => {
          console.error('Login falhou', error);
          throw error;
        })
      );
  }

  public register(userName:string, nome:string,sobrenome:string,email:string,password:string): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.baseUrl}/register`, { userName,nome,sobrenome,email,password})
      .pipe(
        catchError((error) => {
          console.error('Login falhou', error);
          throw error;
        })
      );
  }


  public saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  public isTokenExpired(token: string): boolean {
    
    if (!token) {
      return true; // Considera como expirado se não houver token
    }

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); 
      return decodedToken.exp < currentTime; 
    } catch (error) {
      console.error('Erro ao decodificar o token', error);
      return true; 
    }
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.isTokenExpired(token); 
  }

  public logout(): void {
    localStorage.removeItem('jwt_token');
  }
}
