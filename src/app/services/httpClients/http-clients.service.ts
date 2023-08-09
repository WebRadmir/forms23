import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { IPerson, IPost, IUser } from './http-clients.types';

@Injectable({
  providedIn: 'root',
})
export class HttpClientsService {
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private usersUrl = 'https://jsonplaceholder.typicode.com/users';

  private totalCountHeader: string | null = null;
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8',
  });

  private httpHeadersForGet: HttpHeaders = new HttpHeaders().append(
    'Accept',
    'application/json'
  );

  constructor(private http: HttpClient) {}

  public getLength(): number | null {
    const totalCount = parseInt(this.totalCountHeader || '', 10);
    return isNaN(totalCount) ? null : totalCount;
  }

  public getEmails(): Observable<string[]> {
    return this.http
      .get<IUser[]>(this.usersUrl, {
        headers: this.httpHeadersForGet,
      })
      .pipe(map((users) => users.map((user) => user.email.toLowerCase())));
  }

  public postPerson(user: IPerson): Observable<IPerson> {
    return this.http.post<IPerson>(this.usersUrl, user, {
      headers: this.httpHeaders,
    });
  }

  public getPosts(payload: {
    page: number;
    limit: number;
  }): Observable<IPost[]> {
    const params = new HttpParams()
      .set('_page', payload.page)
      .set('_limit', payload.limit);
    return this.http
      .get<IPost[]>(this.postsUrl, {
        headers: this.httpHeadersForGet,
        params: params,
        observe: 'response',
      })
      .pipe(
        tap((response: HttpResponse<IPost[]>) => {
          this.totalCountHeader = response.headers.get('X-Total-Count');
        }),
        map((response: HttpResponse<IPost[]>) => {
          return response.body || [];
        })
      );
  }

  public createPost(postObj: IPost): Observable<IPost> {
    return this.http.post<IPost>(this.postsUrl, postObj, {
      headers: this.httpHeaders,
    });
  }

  public deletePost(id: number): Observable<void> {
    return this.http.delete<void>(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
  }

  public saveChangeInPost(element: IPost): Observable<IPost> {
    return this.http.patch<IPost>(
      `https://jsonplaceholder.typicode.com/posts/${element.id}`,
      {
        title: element.title,
        userId: element.userId,
        body: element.body,
      },
      {
        headers: this.httpHeaders,
      }
    );
  }
}
