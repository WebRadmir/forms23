import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MyValidators } from 'src/app/my.validators';
import { catchError, tap } from 'rxjs';
import { UsersAuthDBService } from 'src/app/services/users-auth-db.service';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface Person {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
  id?: number;
}

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RegistrationFormComponent implements OnInit {
  form!: FormGroup;
  error = '';
  success = false;
  maxDate: Date;

  constructor(
    private http: HttpClient,
    private usersDB: UsersAuthDBService,
    private dateAdapter: DateAdapter<Date>
  ) {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(
      currentYear - 18,
      new Date().getMonth(),
      new Date().getDate()
    );
    this.dateAdapter.setLocale('ru-RU');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('Radmir', [
        Validators.maxLength(23),
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я-]+$/),
        MyValidators.noSpaces,
      ]),
      surname: new FormControl('Yarmukhametov', [
        Validators.maxLength(23),
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я-]+$/),
        MyValidators.noSpaces,
      ]),
      email: new FormControl('web@radmir.ru', {
        validators: [Validators.email, Validators.required],
        asyncValidators: [MyValidators.verifyUserInDB(this.usersDB, true)],
        updateOn: 'blur',
      }),
      password: new FormControl('Aa12!@34', [
        Validators.minLength(8),
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]+$/
        ),
        MyValidators.noSpaces,
      ]),
      confirmPassword: new FormControl('Aa12!@34', [
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
      const formattedDate = new Date(
        this.form.value.birthday
      ).toLocaleDateString('ru-RU');

      const formData: Person = {
        ...this.form.value,
        birthday: formattedDate,
      };
      console.log(formData);
      this.http
        .post('https://jsonplaceholder.typicode.com/users', formData)
        .pipe(
          tap(() => (this.success = true)),
          catchError((error: HttpErrorResponse) => {
            console.log('Ошибка отправки:', error);
            this.error = error.name;
            return [];
          })
        )
        .subscribe();
    }
  }
}
