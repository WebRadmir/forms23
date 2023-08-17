import { NgModule } from '@angular/core';
import { NotFoundPageComponent } from './not-found-page.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [SharedModule],
  exports: [NotFoundPageComponent],
})
export class NotFoundPageModule {}
