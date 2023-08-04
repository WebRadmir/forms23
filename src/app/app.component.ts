import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MyValidators } from './my.validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.maxLength(23),
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я]+$/),
        MyValidators.noSpaces,
      ]),
      surname: new FormControl('', [
        Validators.maxLength(23),
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я]+$/),
        MyValidators.noSpaces,
      ]),
      email: new FormControl('', [
        Validators.email,
        Validators.required,
        MyValidators.noSpaces,
      ]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]+$/
        ),
        MyValidators.noSpaces,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        MyValidators.confirmPassword('password'),
      ]),
      birthday: new FormControl('', [
        Validators.required,
        MyValidators.ageVerification,
      ]),
    });
  }

  submit() {
    if (this.form.valid) {
      console.log('Form', this.form);
      const formData = { ...this.form.value };
      console.log(formData);
    }
  }
}
