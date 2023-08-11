import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, catchError, takeUntil, tap } from 'rxjs';

import { PostTableComponent } from '../post-table/post-table.component';
import { HttpClientsService } from 'src/app/services/httpClients/http-clients.service';
import { IPost } from 'src/app/services/httpClients/http-clients.types';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit, OnDestroy {
  public form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    userID: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
  });

  private destroy$ = new Subject<void>();
  public error = '';
  public options: number[] = [];

  constructor(
    private postTable: PostTableComponent,
    private httpClient: HttpClientsService
  ) {}

  ngOnInit(): void {
    this.countUserID(10);
  }

  public countUserID(count: number): void {
    for (let i = 1; i <= count; i++) {
      this.options.push(i);
    }
  }

  public createPost(): void {
    if (this.form.valid) {
      const newPostData: IPost = {
        title: this.form.value.title,
        body: this.form.value.body,
        userId: this.form.value.userID,
        editing: false,
        active: false,
      };
      this.httpClient
        .createPost(newPostData)
        .pipe(
          tap((newPost) => {
            this.postTable.addNewPost(newPost);
          }),
          catchError((error: HttpErrorResponse) => {
            console.log('Ошибка отправки:', error);
            this.error = error.name;
            return [];
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
