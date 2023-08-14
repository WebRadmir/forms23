import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpClientsService } from 'src/app/services/httpClients/http-clients.service';
import { MyValidators } from 'src/app/my.validators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', {
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

  constructor(
    private httpClient: HttpClientsService,
    private router: Router,
    private authService: AuthService
  ) {}

  public submit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['table-page']),
        error: (err) => alert(err.message),
      });
    }
  }
}
