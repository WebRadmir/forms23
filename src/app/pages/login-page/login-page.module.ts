import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page.component';
import { LoginFormModule } from 'src/app/components/login-form/login-form.module';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [LoginFormModule],
  exports: [LoginPageComponent],
})
export class LoginPageModule {}
