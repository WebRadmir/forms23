import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { IPost } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class GetPostsService {
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private totalCountHeader: string | null = null;

  constructor(private http: HttpClient) {}

  public getPosts(payload: {
    page: number;
    limit: number;
  }): Observable<IPost[]> {
    const httpHeaders = new HttpHeaders().append(
      'Content-type',
      'application/json'
    );
    const params = new HttpParams()
      .set('_page', payload.page)
      .set('_limit', payload.limit);
    return this.http
      .get<IPost[]>(this.postsUrl, {
        headers: httpHeaders,
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

  public getLength(): number | null {
    const totalCount = parseInt(this.totalCountHeader || '', 10);
    return isNaN(totalCount) ? null : totalCount;
  }
}
