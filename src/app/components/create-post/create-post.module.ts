import { NgModule } from '@angular/core';
import { CreatePostComponent } from './create-post.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CreatePostComponent],
  imports: [SharedModule],
  exports: [CreatePostComponent],
})
export class CreatePostModule {}
