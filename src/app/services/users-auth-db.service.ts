import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IUser } from '../models/userDB';

@Injectable({
  providedIn: 'root',
})
export class UsersAuthDBService {
  private usersUrl = 'https://jsonplaceholder.typicode.com/users';
  constructor(private http: HttpClient) {}

  getEmails(): Observable<string[]> {
    return this.http
      .get<IUser[]>(this.usersUrl)
      .pipe(map((users) => users.map((user) => user.email.toLowerCase())));
  }
}
