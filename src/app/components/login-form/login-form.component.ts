import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpClientsService } from 'src/app/services/httpClients/http-clients.service';
import { MyValidators } from 'src/app/my.validators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  public form: FormGroup = new FormGroup({
    email: new FormControl('Shanna@melissa.tv', {
      validators: [
        Validators.email,
        Validators.required,
        MyValidators.noSpaces,
      ],
      asyncValidators: [MyValidators.verifyUserInDB(this.httpClient)],
      updateOn: 'change',
    }),
    password: new FormControl('', [Validators.required]),
  });
  public success: boolean = false;

  constructor(private httpClient: HttpClientsService) {}

  public submit(): void {
    if (this.form.valid) {
      this.success = true;
    }
  }
}
