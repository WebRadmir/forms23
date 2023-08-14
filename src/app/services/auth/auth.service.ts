import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, of, throwError } from 'rxjs';
import { HttpClientsService } from '../httpClients/http-clients.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClientsService) {}

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  public checkEmailInDB(email: string): Observable<boolean> {
    return this.httpClient.getEmails().pipe(
      map((emails: string[]) => {
        return emails.some((respEmail: string) => respEmail === email);
      })
    );
  }

  public login(userInfo: {
    email: string;
    password: string;
  }): Observable<string | boolean> {
    if (this.checkEmailInDB(userInfo.email) && userInfo.password === '123') {
      this.setToken('sdfsdfsretjlk');
      return of(true);
    }
    return throwError(() => new Error('Неверный пароль (введите 123)'));
  }
}
