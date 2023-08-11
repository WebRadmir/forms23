import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, take, tap, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HttpClientsService } from 'src/app/services/httpClients/http-clients.service';
import { IPost } from 'src/app/services/httpClients/http-clients.types';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-post-table',
  templateUrl: './post-table.component.html',
  styleUrls: ['./post-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostTableComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = [
    'id',
    'userId',
    'title',
    'body',
    'actions',
  ];
  public dataSource: IPost[] = [];
  public length: number | null = null;
  public pageIndex: number = 0;
  public pageSizeOptions: number[] = [10, 25, 50];
  public pageSize: number = this.pageSizeOptions[0];
  public showFirstLastButtons: boolean = true;
  public showForm: boolean = false;
  private destroy$ = new Subject<void>();

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    const isHeaderCell = clickedElement.classList.contains(
      'mat-mdc-header-cell'
    );
    console.log(!clickedElement.closest('.mat-elevation-z8'));
    if (
      !clickedElement.closest('.mat-elevation-z8') &&
      !clickedElement.closest('.edit-button')
    ) {
      this.cancelEditingForAll();
    } else if (isHeaderCell) {
      this.cancelEditingForAll();
    }
  }

  constructor(
    private httpClient: HttpClientsService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  public cancelEditingForAll(): void {
    this.dataSource.forEach((item) => {
      item.editing = false;
    });
  }

  ngOnInit(): void {
    this.loadPosts();

    interval(2 * 60 * 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (document.visibilityState === 'visible') {
          this.loadPosts();
        }
      });
  }

  public openDialog(
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

  public loadPosts(): void {
    this.httpClient
      .getPosts({
        page: this.pageIndex + 1,
        limit: this.pageSize,
      })
      .pipe(take(1))
      .pipe(
        tap((res) => {
          res.map((post) => (post.editing = false));
          this.dataSource = res;
          this.length = this.httpClient.getLength();
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }

  public addNewPost(newPost: IPost): void {
    this.dataSource = [newPost, ...this.dataSource];
    this.length !== null ? this.length++ : null;
    this.cdr.detectChanges();
  }

  public deletePost(id: number): void {
    this.httpClient
      .deletePost(id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Ошибка при удалении:', error);
          return [];
        })
      )
      .subscribe();

    this.length !== null ? this.length-- : null;
    this.dataSource = this.dataSource.filter((post) => post.id !== id);
    this.cdr.detectChanges();
  }

  public toggleEditing(element: IPost): void {
    element.editing = !element.editing;
  }

  public saveChanges(element: IPost): void {
    this.httpClient.saveChangeInPost(element).subscribe();
    element.editing = false;
  }

  public setActiveRow(row: IPost): void {
    row.active = true;
    this.dataSource.forEach((item) => {
      if (item !== row) {
        item.active = false;
        item.editing = false;
      }
    });
  }

  public handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
})
export class DialogDelete {
  constructor(public dialogRef: MatDialogRef<DialogDelete>) {}

  public onConfirmClick(): void {
    this.dialogRef.close('yes');
  }

  public onCancelClick(): void {
    this.dialogRef.close('no');
  }
}
