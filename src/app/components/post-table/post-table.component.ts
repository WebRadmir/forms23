import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { take, tap } from 'rxjs';
import { GetPostsService } from 'src/app/services/get-posts.service';
import { IPost } from 'src/app/models/post';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-post-table',
  templateUrl: './post-table.component.html',
  styleUrls: ['./post-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'userId', 'title', 'body', 'actions'];
  dataSource: IPost[] = [];
  length: number | null = null;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50];
  pageSize = this.pageSizeOptions[0];
  showFirstLastButtons = true;
  showForm = false;

  constructor(
    private getPosts: GetPostsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.loadPosts();
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    id: number
  ): void {
    const dialogRef = this.dialog.open(DialogDelete, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.deletePost(id);
      }
    });
  }

  loadPosts() {
    this.getPosts
      .getPosts({
        page: this.pageIndex + 1,
        limit: this.pageSize,
      })
      .pipe(take(1))
      .pipe(
        tap((res) => {
          res.map((post) => (post.editing = false));
          this.dataSource = res;
          this.length = this.getPosts.getLength();
          console.log(this.dataSource);
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }

  addNewPost(newPost: IPost) {
    this.dataSource = [newPost, ...this.dataSource];
    this.length !== null ? this.length++ : null;
    this.cdr.detectChanges();
  }

  openDeleteDialog(title: string): void {
    this.dialog.open;
  }

  deletePost(id: number) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    });
    this.length !== null ? this.length-- : null;

    this.dataSource = this.dataSource.filter((post) => post.id !== id);
    this.cdr.detectChanges();
  }

  editPost(element: IPost): void {
    element.editing = !element.editing;
  }

  saveChanges(element: IPost) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${element.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: element.title,
        userId: element.userId,
        body: element.body,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
    element.editing = false;
  }

  cancelEditing(element: IPost): void {
    element.editing = false;
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadPosts();

    console.log(event);
  }
}

@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
})
export class DialogDelete {
  constructor(public dialogRef: MatDialogRef<DialogDelete>) {}
  onConfirmClick(): void {
    this.dialogRef.close('yes');
  }

  onCancelClick(): void {
    this.dialogRef.close('no');
  }
}
