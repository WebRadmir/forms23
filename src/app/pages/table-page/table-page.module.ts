import { NgModule } from '@angular/core';
import { TablePageComponent } from './table-page.component';
import { PostTableModule } from 'src/app/components/post-table/post-table.module';

@NgModule({
  declarations: [TablePageComponent],
  imports: [PostTableModule],
  exports: [TablePageComponent],
})
export class TablePageModule {}
