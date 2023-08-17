import { NgModule } from '@angular/core';
import { PostTableComponent } from './post-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatePostModule } from '../create-post/create-post.module';

@NgModule({
  declarations: [PostTableComponent],
  imports: [SharedModule, CreatePostModule],
  exports: [PostTableComponent],
})
export class PostTableModule {}
