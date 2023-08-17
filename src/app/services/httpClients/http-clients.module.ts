import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientsService } from './http-clients.service';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [HttpClientsService],
})
export class HttpClientsModule {}
