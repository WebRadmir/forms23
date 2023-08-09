import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { catchError, tap } from 'rxjs';

import { MyValidators } from 'src/app/my.validators';
import { HttpClientsService } from 'src/app/services/httpClients/http-clients.service';
import { IPerson } from 'src/app/services/httpClients/http-clients.types';

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
  public form: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.maxLength(23),
      Validators.required,
      Validators.pattern(/^[a-zA-Zа-яА-Я-]+$/),
      MyValidators.noSpaces,
    ]),
    surname: new FormControl('', [
      Validators.maxLength(23),
      Validators.required,
      Validators.pattern(/^[a-zA-Zа-яА-Я-]+$/),
      MyValidators.noSpaces,
    ]),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      asyncValidators: [MyValidators.verifyUserInDB(this.httpClient, true)],
      updateOn: 'blur',
    }),
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
  public error: string = '';
  public success: boolean = false;
  public maxDate: Date = new Date();

  constructor(
    private httpClient: HttpClientsService,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.minAgeDatapicker(18);
  }

  public minAgeDatapicker(age: number): void {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(
      currentYear - age,
      new Date().getMonth(),
      new Date().getDate()
    );
    this.dateAdapter.setLocale('ru-RU');
  }

  public submit(): void {
    if (this.form.valid) {
      const formattedDate = new Date(
        this.form.value.birthday
      ).toLocaleDateString('ru-RU');

      const formData: IPerson = {
        ...this.form.value,
        birthday: formattedDate,
      };
      this.httpClient
        .postPerson(formData)
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
