import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyValidators } from 'src/app/my.validators';
import { UsersAuthDBService } from 'src/app/services/users-auth-db.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  form!: FormGroup;
  error = '';
  success = false;

  constructor(private usersDB: UsersAuthDBService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('Shanna@melissa.tv', {
        validators: [
          Validators.email,
          Validators.required,
          MyValidators.noSpaces,
        ],
        asyncValidators: [MyValidators.verifyUserInDB(this.usersDB)],
        updateOn: 'change',
      }),
      password: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    if (this.form.valid) {
      this.success = true;
    }
  }
}
