import { NgModule } from '@angular/core';
import { RegistrationPageComponent } from './registration-page.component';
import { RegistrationFormModule } from 'src/app/components/registration-form/registration-form.module';

@NgModule({
  declarations: [RegistrationPageComponent],
  imports: [RegistrationFormModule],
  exports: [RegistrationPageComponent],
})
export class RegistrationPageModule {}
