import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs';

import { PostTableComponent } from '../post-table/post-table.component';
import { HttpClientsService } from 'src/app/services/httpClients/http-clients.service';
import { IPost } from 'src/app/services/httpClients/http-clients.types';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    userID: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
  });

  public error = '';
  public options: number[] = [];

  constructor(
    private postTable: PostTableComponent,
    private cdr: ChangeDetectorRef,
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
      const postObj: IPost = {
        title: this.form.value.title,
        body: this.form.value.body,
        userId: this.form.value.userID,
        editing: false,
      };
      this.httpClient
        .createPost(postObj)
        .pipe(
          tap((newPost) => {
            this.postTable.addNewPost(newPost);
          }),
          catchError((error: HttpErrorResponse) => {
            console.log('Ошибка отправки:', error);
            this.error = error.name;
            this.cdr.detectChanges();
            return [];
          })
        )
        .subscribe();
    }
  }
}
