import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegistrationFormComponent } from './registration-form.component';

@NgModule({
  declarations: [RegistrationFormComponent],
  imports: [SharedModule],
  exports: [RegistrationFormComponent],
})
export class RegistrationFormModule {}
